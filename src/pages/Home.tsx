import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Github, Star, GitFork, Eye, Package, RefreshCw, Moon, Sun, AlertTriangle, Download } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

type EntityKey = "openspec" | "speckit";

type ComparisonConfig = {
  openspec: { name: string; githubRepo?: string; npmPkg?: string };
  speckit: { name: string; githubRepo?: string; npmPkg?: string };
};

type CommunityMetrics = {
  stars: number;
  forks: number;
  watchers: number;
  releases: number;
  commits4w: number[];
  issuesOpen: number;
  npmDownloads: number;
  npmVersion?: string;
  maintainers?: number;
  createdAt?: string;
  pushedAt?: string;
  updatedAt?: string;
};

const defaultConfig: ComparisonConfig = {
  openspec: { name: "OpenSpec", githubRepo: "", npmPkg: "" },
  speckit: { name: "SpecKit", githubRepo: "", npmPkg: "" },
};

const emptyMetrics: CommunityMetrics = {
  stars: 0,
  forks: 0,
  watchers: 0,
  releases: 0,
  commits4w: [],
  issuesOpen: 0,
  npmDownloads: 0,
};

function normalizeRepo(val?: string) {
  if (!val) return "";
  let s = val.trim();
  try {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      const u = new URL(s);
      const parts = u.pathname.replace(/^\/+/, "").split("/");
      const owner = parts[0];
      const repo = (parts[1] || "").replace(/\.git$/, "");
      if (owner && repo) return `${owner}/${repo}`;
    }
  } catch {}
  if (s.includes("github.com/")) {
    const idx = s.indexOf("github.com/");
    const rest = s.slice(idx + "github.com/".length).replace(/^\/+/, "");
    const parts = rest.split("/");
    const owner = parts[0];
    const repo = (parts[1] || "").replace(/\.git$/, "");
    if (owner && repo) return `${owner}/${repo}`;
  }
  s = s.replace(/^\/+|\/+$/g, "").replace(/\.git$/, "");
  if (/^[^\s/]+\/[^^\s/]+$/.test(s)) return s;
  return "";
}

function useCached<T>(key: string, ttlMs: number) {
  const get = () => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { t, v } = JSON.parse(raw);
      if (Date.now() - t > ttlMs) return null;
      return v as T;
    } catch {
      return null;
    }
  };
  const set = (v: T) => {
    try {
      localStorage.setItem(key, JSON.stringify({ t: Date.now(), v }));
    } catch {}
  };
  const del = () => {
    try {
      localStorage.removeItem(key);
    } catch {}
  };
  return { get, set, del };
}

async function fetchGithub(repo: string) {
  if (!repo) return {} as Partial<CommunityMetrics>;
  const base = `https://api.github.com/repos/${repo}`;
  let r: any = {};
  try {
    const repoRes = await fetch(base, { headers: { Accept: "application/vnd.github+json" } });
    if (!repoRes.ok) return {} as Partial<CommunityMetrics>;
    r = await repoRes.json();
  } catch {
    return {} as Partial<CommunityMetrics>;
  }
  let releases = 0;
  try {
    const rel = await fetch(`${base}/releases?per_page=1`);
    if (rel.ok) {
      const link = rel.headers.get("link");
      if (link && /&page=(\d+)>; rel="last"/.test(link)) {
        releases = parseInt(RegExp.$1, 10);
      } else {
        const arr = await rel.json();
        releases = Array.isArray(arr) ? arr.length : 0;
      }
    }
  } catch {}
  let commits4w: number[] = [];
  try {
    const stats = await fetch(`${base}/stats/commit_activity`);
    if (stats.ok) {
      const arr = await stats.json();
      if (Array.isArray(arr)) {
        const last4 = arr.slice(-4);
        commits4w = last4.map((w: any) => w.total ?? 0);
      }
    }
  } catch {}
  return {
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    watchers: r.subscribers_count ?? r.watchers_count ?? 0,
    releases,
    commits4w,
    issuesOpen: r.open_issues_count ?? 0,
    createdAt: r.created_at,
    pushedAt: r.pushed_at,
    updatedAt: r.updated_at,
  } as Partial<CommunityMetrics>;
}

async function fetchNpm(pkg: string) {
  if (!pkg) return {} as Partial<CommunityMetrics>;
  let downloads = 0;
  try {
    const d = await fetch(`https://api.npmjs.org/downloads/point/last-week/${pkg}`);
    if (d.ok) {
      const j = await d.json();
      downloads = j.downloads ?? 0;
    }
  } catch {}
  let npmVersion: string | undefined;
  let maintainers: number | undefined;
  try {
    const m = await fetch(`https://registry.npmjs.org/${pkg}`);
    if (m.ok) {
      const j = await m.json();
      npmVersion = j["dist-tags"]?.latest;
      maintainers = Array.isArray(j.maintainers) ? j.maintainers.length : undefined;
    }
  } catch {}
  return { npmDownloads: downloads, npmVersion, maintainers } as Partial<CommunityMetrics>;
}

export default function Home() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [tab, setTab] = useState<"compare" | "ecosystem" | "examples" | "config">("compare");
  const [cfg, setCfg] = useState<ComparisonConfig>(() => {
    const saved = localStorage.getItem("compare:cfg");
    return saved ? JSON.parse(saved) : defaultConfig;
  });
  const [metrics, setMetrics] = useState<Record<EntityKey, CommunityMetrics>>({
    openspec: emptyMetrics,
    speckit: emptyMetrics,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("compare:cfg", JSON.stringify(cfg));
  }, [cfg]);

  const cacheOpen = useCached<CommunityMetrics>(`community:${cfg.openspec.githubRepo}|${cfg.openspec.npmPkg}`, 60 * 60 * 1000);
  const cacheSpec = useCached<CommunityMetrics>(`community:${cfg.speckit.githubRepo}|${cfg.speckit.npmPkg}`, 60 * 60 * 1000);

  const loadCommunity = async () => {
    setLoading(true);
    setError(null);
    try {
      const [m1Cached, m2Cached] = [cacheOpen.get(), cacheSpec.get()];
      let m1 = m1Cached ?? emptyMetrics;
      let m2 = m2Cached ?? emptyMetrics;
      if (!m1Cached) {
        const r1 = normalizeRepo(cfg.openspec.githubRepo || "");
        const gh = r1 ? await fetchGithub(r1) : {};
        const np = cfg.openspec.npmPkg ? await fetchNpm(cfg.openspec.npmPkg) : {};
        m1 = { ...emptyMetrics, ...gh, ...np } as CommunityMetrics;
        cacheOpen.set(m1);
      }
      if (!m2Cached) {
        const r2 = normalizeRepo(cfg.speckit.githubRepo || "");
        const gh = r2 ? await fetchGithub(r2) : {};
        const np = cfg.speckit.npmPkg ? await fetchNpm(cfg.speckit.npmPkg) : {};
        m2 = { ...emptyMetrics, ...gh, ...np } as CommunityMetrics;
        cacheSpec.set(m2);
      }
      setMetrics({ openspec: m1, speckit: m2 });
    } catch {
      setError("数据加载失败");
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    cacheOpen.del();
    cacheSpec.del();
    setMetrics({ openspec: emptyMetrics, speckit: emptyMetrics });
  };

  const bars = useMemo(() => {
    return [
      { name: "Stars", openspec: metrics.openspec.stars, speckit: metrics.speckit.stars },
      { name: "Forks", openspec: metrics.openspec.forks, speckit: metrics.speckit.forks },
      { name: "Watchers", openspec: metrics.openspec.watchers, speckit: metrics.speckit.watchers },
      { name: "Releases", openspec: metrics.openspec.releases, speckit: metrics.speckit.releases },
      { name: "npm 下载/周", openspec: metrics.openspec.npmDownloads, speckit: metrics.speckit.npmDownloads },
      { name: "开放问题", openspec: metrics.openspec.issuesOpen, speckit: metrics.speckit.issuesOpen },
    ];
  }, [metrics]);

  const examples = [
    {
      title: "定义规格",
      openspec: `spec {\n  name: "Order"\n  fields: [\n    { id: "id", type: "string" },\n    { id: "total", type: "number", min: 0 }\n  ]\n}`,
      speckit: `createSpec("Order", {\n  id: t.string(),\n  total: t.number().min(0)\n})`,
    },
    {
      title: "数据校验",
      openspec: `validate(order, spec("Order"))`,
      speckit: `speckit.validate(order, "Order")`,
    },
    {
      title: "生成客户端",
      openspec: `gen client ts --spec order.yaml`,
      speckit: `speckit.client("Order").ts()`,
    },
  ];

  return (
    <div className="min-h-[100dvh] p-4 md:p-6 bg-gray-50 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">OpenSpec vs SpecKit 开源生态对比</h1>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center gap-2 text-gray-700 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800"
            onClick={loadCommunity}
          >
            <RefreshCw className="w-4 h-4" /> 拉取开源数据
          </button>
          <button
            className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800"
            onClick={clearCache}
          >
            清除缓存
          </button>
          <button
            className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800"
            onClick={toggleTheme}
            aria-label="切换主题"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <nav className="flex gap-2 mb-4">
        {[
          { id: "compare", label: "对比" },
          { id: "ecosystem", label: "开源生态" },
          { id: "examples", label: "例子" },
          { id: "config", label: "配置" },
        ].map((t) => (
          <button
            key={t.id}
            className={`px-3 py-2 rounded-md border text-gray-700 dark:text-neutral-200 ${tab === t.id ? "bg-white dark:bg-neutral-800 shadow border-gray-200 dark:border-neutral-700" : "border-gray-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"}`}
            onClick={() => setTab(t.id as any)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {error && (
        <div className="flex items-center gap-2 p-3 border border-red-300 bg-red-50 text-red-700 rounded-md mb-4">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      {tab === "compare" && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {["openspec", "speckit"].map((key) => {
            const k = key as EntityKey;
            const c = cfg[k];
            const m = metrics[k];
            return (
              <div key={key} className="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    <span className="text-lg font-semibold">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-200">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4" /> {m.stars}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-4 h-4" /> {m.forks}</span>
                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {m.watchers}</span>
                    <span className="flex items-center gap-1"><Package className="w-4 h-4" /> {m.npmDownloads}</span>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bars}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey={k} fill={k === "openspec" ? "#10b981" : "#ef4444"} radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {loading && <div className="text-sm text-gray-500 mt-2">加载中…</div>}
                {(!normalizeRepo(cfg[k].githubRepo || "") && !cfg[k].npmPkg) && (
                  <div className="text-sm text-gray-500 mt-2">尚未配置或仓库格式错误（可直接粘贴 GitHub URL 或 owner/repo），请在“配置”页填写后拉取数据</div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {tab === "ecosystem" && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["openspec", "speckit"].map((key) => {
            const k = key as EntityKey;
            const c = cfg[k];
            const m = metrics[k];
            const lineData = (m.commits4w.length ? m.commits4w : [0,0,0,0]).map((v, i) => ({ w: `W${i+1}`, v }));
            return (
              <div key={key} className="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800 shadow-sm md:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold">{c.name} - 活跃趋势</span>
                  <span className="text-xs text-gray-500 dark:text-neutral-400">最近更新：{m.pushedAt ? new Date(m.pushedAt).toLocaleDateString() : "—"}</span>
                </div>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <XAxis dataKey="w" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="v" stroke={k === "openspec" ? "#10b981" : "#ef4444"} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div className="p-2 rounded-md bg-gray-50 dark:bg-neutral-700/50">版本：{m.npmVersion ?? "—"}</div>
                  <div className="p-2 rounded-md bg-gray-50 dark:bg-neutral-700/50">维护者：{m.maintainers ?? "—"}</div>
                  <div className="p-2 rounded-md bg-gray-50 dark:bg-neutral-700/50">发布数：{m.releases}</div>
                  <div className="p-2 rounded-md bg-gray-50 dark:bg-neutral-700/50">开放问题：{m.issuesOpen}</div>
                </div>
              </div>
            );
          })}
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800 shadow-sm md:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold">汇总对比</span>
              <span className="text-xs text-gray-500 dark:text-neutral-400">npm 下载/周</span>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: "OpenSpec", v: metrics.openspec.npmDownloads }, { name: "SpecKit", v: metrics.speckit.npmDownloads }] }>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="v" radius={[6,6,0,0]} fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {tab === "examples" && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.map((ex) => (
            <div key={ex.title} className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
              <div className="p-3 border-b font-semibold">{ex.title}</div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-3">
                  <div className="text-xs text-gray-500 dark:text-neutral-400 mb-1">OpenSpec</div>
                  <div className="rounded-md bg-gray-50 dark:bg-neutral-700/50">
                  <SyntaxHighlighter language="bash" style={docco} customStyle={{ borderRadius: 8, background: "transparent" }}>
                    {ex.openspec}
                  </SyntaxHighlighter>
                  </div>
                </div>
                <div className="p-3 border-t md:border-t-0 md:border-l">
                  <div className="text-xs text-gray-500 dark:text-neutral-400 mb-1">SpecKit</div>
                  <div className="rounded-md bg-gray-50 dark:bg-neutral-700/50">
                  <SyntaxHighlighter language="bash" style={docco} customStyle={{ borderRadius: 8, background: "transparent" }}>
                    {ex.speckit}
                  </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === "config" && (
        <section className="grid grid-cols-1 gap-4">
          {["openspec", "speckit"].map((key) => {
            const k = key as EntityKey;
            const c = cfg[k];
            return (
              <div key={key} className="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800 shadow-sm">
                <div className="font-semibold mb-2">{c.name} 配置</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="text-sm">
                    <span className="block mb-1">GitHub 仓库（owner/repo）</span>
                    <input
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 border-gray-300 dark:border-neutral-700"
                      value={c.githubRepo ?? ""}
                      onChange={(e) => setCfg({ ...cfg, [k]: { ...c, githubRepo: e.target.value } })}
                      placeholder="例如：facebook/react"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="block mb-1">npm 包名</span>
                    <input
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 border-gray-300 dark:border-neutral-700"
                      value={c.npmPkg ?? ""}
                      onChange={(e) => setCfg({ ...cfg, [k]: { ...c, npmPkg: e.target.value } })}
                      placeholder="例如：react"
                    />
                  </label>
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-neutral-400">保存于本地缓存，点击上方“拉取开源数据”以更新</div>
              </div>
            );
          })}
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="font-semibold">数据导出</div>
              <button
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center gap-2 text-gray-700 dark:text-neutral-200"
                onClick={() => {
                  const blob = new Blob([JSON.stringify({ cfg, metrics }, null, 2)], { type: "application/json" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = "community-data.json";
                  a.click();
                }}
              >
                <Download className="w-4 h-4" /> 下载当前数据
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}