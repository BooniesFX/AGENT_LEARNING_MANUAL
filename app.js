const state={features:[],ecosystem:[],examples:[]};
const sample={features:[{title:"设计范式",items:[{key:"模式",openspec:"规范驱动",speckit:"工具包驱动"},{key:"定义来源",openspec:"先定义规范",speckit:"按需封装"},{key:"协作方式",openspec:"跨团队共享规范",speckit:"团队内快速落地"}]},{title:"工程能力",items:[{key:"代码生成",openspec:"多语言生成器",speckit:"内置适配器"},{key:"校验与约束",openspec:"基于规范严格校验",speckit:"轻量校验"},{key:"文档输出",openspec:"自动文档与示例",speckit:"简明说明"}]}],ecosystem:[{metric:"生成器数量",unit:"个",openspec:8,speckit:3},{metric:"社区插件",unit:"个",openspec:24,speckit:9},{metric:"CI 集成",unit:"项",openspec:12,speckit:6},{metric:"采用项目",unit:"个",openspec:50,speckit:20}],examples:[{title:"定义规范/规格",openspec:`spec {
  name: "Order"
  fields: [
    { id: "id", type: "string" },
    { id: "total", type: "number", min: 0 }
  ]
}`,speckit:`createSpec("Order", {
  id: t.string(),
  total: t.number().min(0)
})`},{title:"数据校验",openspec:`validate(order, spec("Order"))`,speckit:`speckit.validate(order, "Order")`},{title:"生成客户端",openspec:`gen client ts --spec order.yaml`,speckit:`speckit.client("Order").ts()`},{title:"测试用例",openspec:`cases("Order")
  .given({ id: "A-1", total: 9.9 })
  .expect(valid)`,speckit:`test("Order", {
  valid: { id: "A-1", total: 9.9 }
})`}]};
function render(){renderCompare();renderEcosystem();renderExamples();renderEditor();}
function renderCompare(){const el=document.getElementById("compareTable");const rows=[];rows.push(row(["维度","OpenSpec","SpecKit"],true));state.features.forEach(group=>{rows.push(groupRow(group.title));group.items.forEach(i=>{rows.push(row([i.key,i.openspec,i.speckit]));});});el.innerHTML=rows.join("");}
function groupRow(text){return `<div class="row header"><div class="cell">${text}</div><div class="cell"></div><div class="cell"></div></div>`}
function row(cols,header){return `<div class="row${header?" header":""}">${cols.map((c,idx)=>`<div class="cell">${c}</div>`).join("")}</div>`}
function renderEcosystem(){const wrap=document.getElementById("ecosystemCharts");wrap.innerHTML=state.ecosystem.map(m=>{const max=Math.max(m.openspec||0,m.speckit||0,1);const a=Math.round(((m.openspec||0)/max)*100);const b=Math.round(((m.speckit||0)/max)*100);return `<div class="chart"><div>${m.metric}（${m.unit}）</div><div class="bar-wrap"><div class="bar-label">OpenSpec</div><div class="bar green" style="width:${a}%"></div><div class="bar-value">${m.openspec||0}</div></div><div class="bar-wrap"><div class="bar-label">SpecKit</div><div class="bar red" style="width:${b}%"></div><div class="bar-value">${m.speckit||0}</div></div></div>`}).join("");}
function renderExamples(){const list=document.getElementById("examplesList");list.innerHTML=state.examples.map(ex=>`<div class="example-card"><h3>${ex.title}</h3><div><div class="code">${escapeHtml(ex.openspec)}</div></div><div style="height:8px"></div><div><div class="code">${escapeHtml(ex.speckit)}</div></div></div>`).join("");}
function renderEditor(){const input=document.getElementById("dataInput");input.value=JSON.stringify(state,null,2);}
function escapeHtml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function applyData(json){state.features=json.features||[];state.ecosystem=json.ecosystem||[];state.examples=json.examples||[];render();}
document.getElementById("applyData").addEventListener("click",()=>{try{const v=document.getElementById("dataInput").value;applyData(JSON.parse(v));}catch(e){alert("JSON 解析失败");}});
document.getElementById("downloadData").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="data.json";a.click();});
document.getElementById("loadSample").addEventListener("click",()=>{applyData(sample);});
document.getElementById("resetData").addEventListener("click",()=>{applyData({features:[],ecosystem:[],examples:[]});});
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");const id=t.getAttribute("data-tab");document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));document.getElementById(`tab-${id}`).classList.add("active");}));
applyData(sample);