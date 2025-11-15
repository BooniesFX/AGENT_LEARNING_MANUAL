import React, { useEffect, useMemo, useState } from 'react';
import { ResearchAgentProject, ComparisonDimension } from '../../types';
import { ProjectCard, ProjectDetailModal } from './ProjectCard';
import { ProjectRadarChart, FeatureComparisonMatrix, ComplexityBarChart } from './ComparisonCharts';
import { researchProjects, comparisonDimensions } from '../../data/projects';

interface ProjectComparisonProps {
  projects?: ResearchAgentProject[];
  dimensions?: ComparisonDimension[];
}

export const ProjectComparison: React.FC<ProjectComparisonProps> = ({ 
  projects = researchProjects,
  dimensions = comparisonDimensions 
}) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<ResearchAgentProject | null>(null);
  const [activeView, setActiveView] = useState<'grid' | 'comparison' | 'charts'>('grid');
  const [communityStats, setCommunityStats] = useState<Record<string, { stars: number; forks: number; issues: number; updatedAt: string }>>({});

  const mapLevelToLearning = (level: ResearchAgentProject['level']): string => {
    if (level === 'beginner') return '短';
    if (level === 'intermediate') return '中';
    return '长';
  };

  const mapSetupDifficulty = (level: ResearchAgentProject['level']): string => {
    if (level === 'beginner') return '简单';
    if (level === 'intermediate') return '中等';
    return '复杂';
  };

  const mapCodeComplexity = (complexity: number): string => {
    if (complexity <= 4) return '低';
    if (complexity <= 7) return '中';
    return '高';
  };

  const mapThreeLevelByNumber = (score?: number): string => {
    const s = score ?? 0;
    if (s <= 3) return '基础';
    if (s <= 7) return '完善';
    return '企业级';
  };

  const mapQuantityLevel = (count: number, thresholds: [number, number] = [2, 4]): string => {
    if (count < thresholds[0]) return '少';
    if (count < thresholds[1]) return '中';
    return '多';
  };

  const getMetricValue = (project: ResearchAgentProject, dimensionId: string, metricId: string): string => {
    if (dimensionId === 'complexity') {
      if (metricId === 'code-complexity') return mapCodeComplexity(project.complexity);
      if (metricId === 'learning-curve') return mapLevelToLearning(project.level);
      if (metricId === 'setup-difficulty') return mapSetupDifficulty(project.level);
    }
    if (dimensionId === 'architecture') {
      if (metricId === 'scalability') return `${project.architecture.scalability}/10`;
      if (metricId === 'maintainability') return `${project.architecture.maintainability}/10`;
      if (metricId === 'modularity') {
        const c = project.architecture.components.length;
        return c <= 3 ? '低' : c <= 6 ? '中' : '高';
      }
    }
    if (dimensionId === 'functionality') {
      if (metricId === 'research-depth') {
        const researchCount = project.features.filter(f => f.category === 'research').length;
        return researchCount <= 1 ? '基础' : researchCount <= 3 ? '中等' : '深度';
      }
      if (metricId === 'tool-integration') {
        if (typeof project.tooling === 'number') return mapQuantityLevel(project.tooling, [4, 7]);
        const integrationCount = project.features.filter(f => f.category === 'integration').length;
        return mapQuantityLevel(integrationCount);
      }
      if (metricId === 'automation-level') {
        return project.level === 'beginner' ? '手动' : project.level === 'intermediate' ? '半自动' : '全自动';
      }
    }
    if (dimensionId === 'production-readiness') {
      if (metricId === 'error-handling') {
        return project.level === 'beginner' ? '基础' : project.level === 'intermediate' ? '完善' : '企业级';
      }
      if (metricId === 'monitoring') return mapThreeLevelByNumber(project.monitoring);
      if (metricId === 'security') return mapThreeLevelByNumber(project.security);
    }
    return '-';
  };

  const getMetricScore = (project: ResearchAgentProject, dimensionId: string, metricId: string): number | null => {
    if (dimensionId === 'architecture') {
      if (metricId === 'scalability') return project.architecture.scalability;
      if (metricId === 'maintainability') return project.architecture.maintainability;
    }
    if (dimensionId === 'complexity') {
      if (metricId === 'code-complexity') return project.complexity;
    }
    if (dimensionId === 'production-readiness') {
      if (metricId === 'monitoring') return typeof project.monitoring === 'number' ? project.monitoring : null;
      if (metricId === 'security') return typeof project.security === 'number' ? project.security : null;
    }
    if (dimensionId === 'functionality') {
      if (metricId === 'tool-integration') {
        if (typeof project.tooling === 'number') return Math.min(project.tooling, 10);
        const integrationCount = project.features.filter(f => f.category === 'integration').length;
        return Math.min(integrationCount * 2, 10);
      }
      if (metricId === 'automation-level') {
        return project.level === 'beginner' ? 3 : project.level === 'intermediate' ? 6 : 9;
      }
      if (metricId === 'research-depth') {
        const researchCount = project.features.filter(f => f.category === 'research').length;
        return researchCount <= 1 ? 3 : researchCount <= 3 ? 6 : 9;
      }
    }
    return null;
  };

  const badgeClass = (value: string): string => {
    if (['短', '简单', '基础', '少', '手动', '低'].includes(value)) return 'bg-green-100 text-green-700';
    if (['中', '中等', '完善', '半自动'].includes(value)) return 'bg-yellow-100 text-yellow-700';
    if (['长', '复杂', '企业级', '多', '全自动', '高'].includes(value)) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const displayedProjects = useMemo(() => {
    return selectedProjects.length > 0 ? projects.filter(p => selectedProjects.includes(p.id)) : projects;
  }, [projects, selectedProjects]);

  useEffect(() => {
    const parseRepo = (url: string) => {
      try {
        const u = new URL(url);
        const [owner, repo] = u.pathname.replace(/^\//, '').split('/');
        return { owner, repo };
      } catch {
        return null;
      }
    };
    const fetchStats = async () => {
      const promises = projects.map(async (p) => {
        const parsed = parseRepo(p.repository);
        if (!parsed) return { id: p.id, data: null };
        const base = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`;
        try {
          const res = await fetch(base);
          if (!res.ok) throw new Error('network');
          const json = await res.json();
          return {
            id: p.id,
            data: {
              stars: json.stargazers_count ?? 0,
              forks: json.forks_count ?? 0,
              issues: json.open_issues_count ?? 0,
              updatedAt: json.pushed_at ?? json.updated_at ?? ''
            }
          };
        } catch {
          return { id: p.id, data: { stars: 0, forks: 0, issues: 0, updatedAt: '' } };
        }
      });
      const results = await Promise.all(promises);
      const map: Record<string, { stars: number; forks: number; issues: number; updatedAt: string }> = {};
      results.forEach(r => { if (r.data) map[r.id] = r.data as any; });
      setCommunityStats(map);
    };
    fetchStats();
  }, [projects]);

  const toggleProjectSelection = (project: ResearchAgentProject) => {
    setSelectedProjects(prev => 
      prev.includes(project.id) 
        ? prev.filter(id => id !== project.id)
        : [...prev, project.id]
    );
  };

  const views = [
    { id: 'grid', label: '项目概览', icon: '📋' },
    { id: 'comparison', label: '详细对比', icon: '⚖️' },
    { id: 'charts', label: '可视化对比', icon: '📊' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 页面标题和导航 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Research Agent 项目对比分析</h1>
        <p className="text-gray-600 mb-6">
          通过对比三个不同复杂度的代表性项目，帮助您理解从原型到生产级Agent的完整演进路径。
        </p>
        
        {/* 视图切换 */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
                activeView === view.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{view.icon}</span>
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 项目选择提示 */}
      {selectedProjects.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">ℹ️</span>
              <span className="text-blue-800">
                已选择 {selectedProjects.length} 个项目进行对比
              </span>
            </div>
            <button
              onClick={() => setSelectedProjects([])}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              清除选择
            </button>
          </div>
        </div>
      )}

      {/* 不同视图的渲染 */}
      {activeView === 'grid' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={selectedProjects.includes(project.id)}
                onClick={toggleProjectSelection}
              />
            ))}
          </div>
          
          {/* 快速对比卡片 */}
          {selectedProjects.length >= 2 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速对比</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">对比项</th>
                      {selectedProjects.map(projectId => {
                        const project = projects.find(p => p.id === projectId);
                        return (
                          <th key={projectId} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {project?.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">复杂度</td>
                      {selectedProjects.map(projectId => {
                        const project = projects.find(p => p.id === projectId);
                        return (
                          <td key={projectId} className="px-4 py-3 text-sm text-gray-500">
                            {project?.complexity}/10
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">可扩展性</td>
                      {selectedProjects.map(projectId => {
                        const project = projects.find(p => p.id === projectId);
                        return (
                          <td key={projectId} className="px-4 py-3 text-sm text-gray-500">
                            {project?.architecture.scalability}/10
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">可维护性</td>
                      {selectedProjects.map(projectId => {
                        const project = projects.find(p => p.id === projectId);
                        return (
                          <td key={projectId} className="px-4 py-3 text-sm text-gray-500">
                            {project?.architecture.maintainability}/10
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">功能数量</td>
                      {selectedProjects.map(projectId => {
                        const project = projects.find(p => p.id === projectId);
                        return (
                          <td key={projectId} className="px-4 py-3 text-sm text-gray-500">
                            {project?.features.length}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">开源社区数据对比</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">项目</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stars</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Open Issues</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Update</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedProjects.map((p) => {
                    const s = communityStats[p.id];
                    return (
                      <tr key={p.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s ? s.stars : '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s ? s.forks : '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s ? s.issues : '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{s && s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* 详细对比维度 */}
          {dimensions.map((dimension) => (
            <div key={dimension.id} className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{dimension.name}</h3>
              <p className="text-gray-600 mb-4">{dimension.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="space-y-3">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    {dimension.metrics.map((metric) => {
                      const value = getMetricValue(project, dimension.id, metric.id);
                      const score = getMetricScore(project, dimension.id, metric.id);
                      return (
                        <div key={metric.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass(value)}`}>{value}</span>
                          </div>
                          {score !== null && (
                            <div className="space-y-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(score / 10) * 100}%` }}></div>
                              </div>
                              <div className="text-right text-[11px] text-gray-500">{score}/10</div>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeView === 'charts' && (
        <div className="space-y-6">
          <ProjectRadarChart projects={projects} selectedProjects={selectedProjects} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FeatureComparisonMatrix projects={projects} />
            <ComplexityBarChart projects={projects} />
          </div>
        </div>
      )}

      {/* 项目详情模态框 */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      
      {/* 点击项目卡片显示详情 */}
      {projects.map((project) => (
        <div key={project.id} onClick={() => setSelectedProject(project)} className="hidden">
          {project.name}
        </div>
      ))}
    </div>
  );
};
