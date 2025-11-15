import { ResearchAgentConcept, CodeExample } from '../types';

export const agentConcepts: ResearchAgentConcept[] = [
  {
    id: 'agent-basics',
    name: 'Agent 基础概念',
    description: 'Research Agent 是一个能够自主进行信息收集、分析和总结的智能体。它通过调用各种工具来完成复杂的研究任务。',
    category: 'basic',
    icon: '🤖',
    components: [
      {
        id: 'planner',
        name: '规划器 (Planner)',
        description: '负责制定研究计划和步骤',
        type: 'core',
        responsibilities: ['制定研究策略', '分解复杂任务', '优先级排序'],
        interactions: ['调用工具', '更新计划', '处理结果']
      },
      {
        id: 'executor',
        name: '执行器 (Executor)',
        description: '执行具体的工具调用和操作',
        type: 'core',
        responsibilities: ['调用工具', '处理参数', '管理调用顺序'],
        interactions: ['接收指令', '返回结果', '错误处理']
      },
      {
        id: 'memory',
        name: '记忆系统 (Memory)',
        description: '存储和管理研究过程中的信息',
        type: 'core',
        responsibilities: ['存储中间结果', '维护上下文', '知识积累'],
        interactions: ['读取信息', '写入信息', '更新状态']
      },
      {
        id: 'evaluator',
        name: '评估器 (Evaluator)',
        description: '评估研究结果的质量和完整性',
        type: 'optional',
        responsibilities: ['质量评估', '完整性检查', '结果验证'],
        interactions: ['分析结果', '提供反馈', '建议改进']
      }
    ],
    workflows: [
      {
        id: 'basic-research',
        name: '基础研究流程',
        description: 'Research Agent执行研究任务的基本流程',
        steps: [
          {
            id: 'step1',
            name: '接收任务',
            description: '接收用户的研究问题和要求',
            order: 1,
            inputs: ['用户问题', '研究范围', '输出格式'],
            outputs: ['任务定义', '成功标准']
          },
          {
            id: 'step2',
            name: '制定计划',
            description: '分析任务并制定研究计划',
            order: 2,
            inputs: ['任务定义', '可用工具', '历史经验'],
            outputs: ['研究步骤', '工具选择', '时间安排'],
            tools: ['计划生成器']
          },
          {
            id: 'step3',
            name: '信息收集',
            description: '按计划收集相关信息',
            order: 3,
            inputs: ['研究计划', '搜索查询'],
            outputs: ['原始数据', '信息片段', '来源链接'],
            tools: ['搜索引擎', '数据库', 'API调用']
          },
          {
            id: 'step4',
            name: '分析处理',
            description: '对收集的信息进行分析和整理',
            order: 4,
            inputs: ['原始数据', '分析要求'],
            outputs: ['结构化数据', '关键洞察', '分析结果'],
            tools: ['文本分析', '数据提取', '总结生成']
          },
          {
            id: 'step5',
            name: '生成报告',
            description: '综合所有信息生成最终报告',
            order: 5,
            inputs: ['分析结果', '用户要求', '格式模板'],
            outputs: ['研究报告', '引用来源', '建议行动'],
            tools: ['报告生成器', '格式化工具']
          }
        ]
      }
    ],
    examples: [
      {
        id: 'example1',
        title: '简单Agent定义',
        description: '使用Python定义一个基础的研究Agent',
        language: 'python',
        code: `class ResearchAgent:
    def __init__(self, tools):
        self.tools = tools
        self.memory = []
        self.plan = []
    
    def research(self, query):
        # 制定研究计划
        self.plan = self.create_plan(query)
        
        # 执行研究步骤
        results = []
        for step in self.plan:
            result = self.execute_step(step)
            results.append(result)
            self.memory.append(result)
        
        # 生成最终报告
        return self.generate_report(results)
    
    def create_plan(self, query):
        return ["搜索相关信息", "分析收集的数据", "生成总结报告"]
    
    def execute_step(self, step):
        # 执行具体的研究步骤
        return f"执行步骤: {step}"
    
    def generate_report(self, results):
        return "研究完成: " + "; ".join(results)`,
        output: '研究完成: 执行步骤: 搜索相关信息; 执行步骤: 分析收集的数据; 执行步骤: 生成总结报告'
      }
    ]
  },
  {
    id: 'tool-calling',
    name: '工具调用机制',
    description: 'Research Agent通过调用各种工具来获取信息、处理数据和完成任务。工具调用是Agent能力的核心。',
    category: 'basic',
    icon: '🔧',
    components: [
      {
        id: 'tool-registry',
        name: '工具注册表',
        description: '管理和注册所有可用工具',
        type: 'core',
        responsibilities: ['工具注册', '参数验证', '权限管理'],
        interactions: ['工具发现', '能力查询', '状态更新']
      },
      {
        id: 'tool-executor',
        name: '工具执行器',
        description: '实际执行工具调用的组件',
        type: 'core',
        responsibilities: ['参数解析', '错误处理', '结果格式化'],
        interactions: ['调用工具', '监控执行', '返回结果']
      },
      {
        id: 'result-processor',
        name: '结果处理器',
        description: '处理工具返回的结果',
        type: 'core',
        responsibilities: ['结果解析', '数据提取', '格式转换'],
        interactions: ['接收结果', '数据处理', '存储信息']
      }
    ],
    workflows: [
      {
        id: 'tool-calling-flow',
        name: '工具调用流程',
        description: 'Agent调用工具的完整流程',
        steps: [
          {
            id: 'tool1',
            name: '工具选择',
            description: '根据任务需求选择合适的工具',
            order: 1,
            inputs: ['任务需求', '工具列表', '选择策略'],
            outputs: ['选中工具', '调用参数'],
            tools: ['工具推荐器']
          },
          {
            id: 'tool2',
            name: '参数准备',
            description: '准备工具调用所需的参数',
            order: 2,
            inputs: ['选中工具', '上下文信息', '用户需求'],
            outputs: ['调用参数', '验证结果'],
            tools: ['参数生成器']
          },
          {
            id: 'tool3',
            name: '执行调用',
            description: '实际执行工具调用',
            order: 3,
            inputs: ['工具名称', '调用参数', '认证信息'],
            outputs: ['调用结果', '执行状态', '错误信息'],
            tools: ['API调用', '函数执行']
          },
          {
            id: 'tool4',
            name: '结果处理',
            description: '处理和分析工具返回的结果',
            order: 4,
            inputs: ['原始结果', '处理要求', '格式需求'],
            outputs: ['处理结果', '提取信息', '下一步建议'],
            tools: ['数据解析器', '信息提取器']
          }
        ]
      }
    ],
    examples: [
      {
        id: 'tool-example',
        title: '工具调用示例',
        description: '实现一个工具调用系统',
        language: 'python',
        code: `class Tool:
    def __init__(self, name, function, description):
        self.name = name
        self.function = function
        self.description = description
    
    def execute(self, **kwargs):
        return self.function(**kwargs)

class SearchTool(Tool):
    def __init__(self):
        super().__init__(
            "search",
            self.search_function,
            "搜索互联网信息"
        )
    
    def search_function(self, query, num_results=5):
        # 模拟搜索功能
        return f"搜索结果: {query} 的前 {num_results} 条结果"

class Agent:
    def __init__(self):
        self.tools = {}
        self.register_tool(SearchTool())
    
    def register_tool(self, tool):
        self.tools[tool.name] = tool
    
    def use_tool(self, tool_name, **kwargs):
        if tool_name in self.tools:
            return self.tools[tool_name].execute(**kwargs)
        else:
            return f"工具 {tool_name} 未找到"

# 使用示例
agent = Agent()
result = agent.use_tool("search", query="人工智能最新进展", num_results=3)
print(result)`,
        output: '搜索结果: 人工智能最新进展 的前 3 条结果'
      }
    ]
  },
  {
    id: 'memory-management',
    name: '记忆管理',
    description: 'Research Agent需要有效地管理研究过程中的信息，包括短期记忆和长期记忆的维护。',
    category: 'advanced',
    icon: '🧠',
    components: [
      {
        id: 'short-term-memory',
        name: '短期记忆',
        description: '存储当前任务的临时信息',
        type: 'core',
        responsibilities: ['会话管理', '上下文维护', '临时存储'],
        interactions: ['读取写入', '状态更新', '清理过期']
      },
      {
        id: 'long-term-memory',
        name: '长期记忆',
        description: '存储跨任务的知识和经验',
        type: 'advanced',
        responsibilities: ['知识积累', '经验学习', '模式识别'],
        interactions: ['知识检索', '模式匹配', '知识更新']
      },
      {
        id: 'memory-optimizer',
        name: '记忆优化器',
        description: '优化记忆存储和检索效率',
        type: 'advanced',
        responsibilities: ['索引构建', '压缩存储', '快速检索'],
        interactions: ['索引管理', '存储优化', '查询加速']
      }
    ],
    workflows: [
      {
        id: 'memory-flow',
        name: '记忆管理流程',
        description: '信息的存储、检索和更新流程',
        steps: [
          {
            id: 'mem1',
            name: '信息接收',
            description: '接收新的信息并分类',
            order: 1,
            inputs: ['新信息', '信息类型', '重要性评估'],
            outputs: ['分类结果', '存储策略'],
            tools: ['信息分类器']
          },
          {
            id: 'mem2',
            name: '存储决策',
            description: '决定信息的存储方式和位置',
            order: 2,
            inputs: ['分类结果', '存储策略', '容量限制'],
            outputs: ['存储位置', '存储格式', '索引信息'],
            tools: ['存储优化器']
          },
          {
            id: 'mem3',
            name: '实际存储',
            description: '将信息存储到指定位置',
            order: 3,
            inputs: ['存储位置', '存储格式', '待存储信息'],
            outputs: ['存储结果', '索引更新', '元数据'],
            tools: ['存储引擎', '索引系统']
          },
          {
            id: 'mem4',
            name: '检索使用',
            description: '在需要时检索存储的信息',
            order: 4,
            inputs: ['查询需求', '检索条件', '优先级'],
            outputs: ['检索结果', '相关信息', '使用统计'],
            tools: ['检索引擎', '相关性分析']
          }
        ]
      }
    ],
    examples: [
      {
        id: 'memory-example',
        title: '记忆系统实现',
        description: '实现一个简单的记忆管理系统',
        language: 'python',
        code: `import time
from collections import deque
from typing import Dict, List, Any

class MemoryItem:
    def __init__(self, content: str, importance: int = 1):
        self.content = content
        self.importance = importance
        self.timestamp = time.time()
        self.access_count = 0
    
    def access(self):
        self.access_count += 1
        return self.content

class ShortTermMemory:
    def __init__(self, capacity: int = 10):
        self.capacity = capacity
        self.items = deque(maxlen=capacity)
    
    def add(self, item: MemoryItem):
        self.items.append(item)
    
    def get_recent(self, n: int = 5) -> List[MemoryItem]:
        return list(self.items)[-n:]

class LongTermMemory:
    def __init__(self):
        self.items: Dict[str, MemoryItem] = {}
        self.index: Dict[str, List[str]] = {}
    
    def add(self, key: str, item: MemoryItem):
        self.items[key] = item
        # 简单的关键词索引
        words = key.lower().split()
        for word in words:
            if word not in self.index:
                self.index[word] = []
            self.index[word].append(key)
    
    def search(self, query: str) -> List[MemoryItem]:
        query_words = query.lower().split()
        results = []
        for word in query_words:
            if word in self.index:
                for key in self.index[word]:
                    if key in self.items:
                        item = self.items[key]
                        item.access()
                        results.append(item)
        return results

class MemoryManager:
    def __init__(self):
        self.short_term = ShortTermMemory()
        self.long_term = LongTermMemory()
    
    def process_information(self, info: str, importance: int = 1):
        item = MemoryItem(info, importance)
        
        # 根据重要性决定存储位置
        if importance >= 7:
            self.long_term.add(info, item)
        else:
            self.short_term.add(item)
        
        return item
    
    def recall(self, query: str) -> List[str]:
        # 先从短期记忆查找
        recent = self.short_term.get_recent()
        short_term_results = [item.content for item in recent if query in item.content]
        
        # 再从长期记忆查找
        long_term_items = self.long_term.search(query)
        long_term_results = [item.content for item in long_term_items]
        
        return short_term_results + long_term_results

# 使用示例
memory = MemoryManager()
memory.process_information("人工智能是计算机科学的一个分支", importance=8)
memory.process_information("机器学习是AI的子集", importance=7)
memory.process_information("深度学习使用神经网络", importance=6)

results = memory.recall("人工智能")
for result in results:
    print(f"记忆: {result}")`,
        output: '记忆: 人工智能是计算机科学的一个分支\n记忆: 机器学习是AI的子集'
      }
    ]
  },
  {
    id: 'security-permissions',
    name: '安全权限系统',
    description: '企业级Research Agent需要完善的安全与权限控制，包括角色权限、钩子校验和审计。',
    category: 'expert',
    icon: '🔒',
    components: [
      {
        id: 'rbac',
        name: 'RBAC权限模型',
        description: '基于角色的访问控制',
        type: 'core',
        responsibilities: ['角色定义', '权限分配', '资源范围控制'],
        interactions: ['身份认证', '权限验证', '权限继承']
      },
      {
        id: 'security-hooks',
        name: '安全钩子系统',
        description: '在工具执行前后进行安全校验与审计',
        type: 'advanced',
        responsibilities: ['危险操作阻断', '结果审计', '异常告警'],
        interactions: ['PreToolUse', 'PostToolUse', 'ErrorHandling']
      }
    ],
    workflows: [
      {
        id: 'permission-flow',
        name: '权限控制流程',
        description: '从身份验证到权限校验的完整流程',
        steps: [
          { id: 'auth', name: '身份验证', description: '验证用户或代理身份', order: 1, inputs: ['凭证'], outputs: ['身份信息'] },
          { id: 'role-check', name: '角色检查', description: '检查角色与权限', order: 2, inputs: ['身份信息'], outputs: ['角色'] },
          { id: 'resource-check', name: '资源校验', description: '校验资源访问权限', order: 3, inputs: ['资源标识'], outputs: ['授权结果'] },
          { id: 'hook-verify', name: '钩子验证', description: '执行前安全钩子校验', order: 4, inputs: ['操作参数'], outputs: ['安全决策'] }
        ]
      }
    ],
    examples: [
      {
        id: 'security-hook-example',
        title: 'PreToolUse 安全钩子',
        description: '在工具执行前进行安全校验',
        language: 'python',
        code: `import re

def pre_tool_security_hook(tool_name, tool_input, context):
    dangerous_patterns = [
        r'rm\\s+-rf',
        r'sudo\\s+',
        r'chmod\\s+777',
        r'curl.*\\|.*sh'
    ]
    input_str = str(tool_input)
    for pattern in dangerous_patterns:
        if re.search(pattern, input_str):
            return {'decision': 'block', 'reason': f'检测到危险操作模式: {pattern}', 'severity': 'high'}
    if isinstance(tool_input, dict) and 'file_path' in tool_input:
        file_path = tool_input['file_path']
        protected_paths = ['/etc/', '/sys/', '/proc/', '.env', '.key', 'secrets/']
        for protected in protected_paths:
            if protected in file_path:
                return {'decision': 'block', 'reason': f'尝试访问受保护路径: {protected}', 'severity': 'high'}
    if tool_name == 'bash':
        command = tool_input.get('command', '')
        if 'network' in str(command).lower() and not context.get('network_allowed', False):
            return {'decision': 'ask', 'reason': '尝试网络访问，需要用户确认', 'severity': 'medium'}
    return {'decision': 'allow'}`,
        output: "{'decision': 'allow'}"
      }
    ]
  },
  {
    id: 'mcp-ecosystem',
    name: 'MCP 生态系统',
    description: 'MCP通过标准化协议连接模型与工具/服务，提升集成效率与安全性。',
    category: 'expert',
    icon: '🌐',
    components: [
      {
        id: 'mcp-client',
        name: 'MCP客户端',
        description: '在应用中实现协议交互',
        type: 'core',
        responsibilities: ['消息编码', '连接管理', '错误处理'],
        interactions: ['协议层', '传输层', '服务器']
      },
      {
        id: 'mcp-server',
        name: 'MCP服务器',
        description: '提供工具或服务的协议实现',
        type: 'advanced',
        responsibilities: ['工具注册', '调用路由', '权限校验'],
        interactions: ['客户端', '工具执行', '返回编码']
      }
    ],
    workflows: [
      {
        id: 'mcp-call-flow',
        name: '工具调用流程',
        description: '客户端通过协议调用服务器工具',
        steps: [
          { id: 'req', name: '请求编码', description: '编码方法与参数', order: 1, inputs: ['方法', '参数'], outputs: ['请求'] },
          { id: 'tx', name: '传输发送', description: '发送至服务器', order: 2, inputs: ['请求'], outputs: ['到达'] },
          { id: 'exec', name: '工具执行', description: '服务器执行工具', order: 3, inputs: ['参数'], outputs: ['结果'] },
          { id: 'resp', name: '结果返回', description: '编码并返回结果', order: 4, inputs: ['结果'], outputs: ['响应'] }
        ]
      }
    ],
    examples: [
      {
        id: 'web-search-mcp-server',
        title: 'WebSearch MCP服务器示例',
        description: '实现一个标准化的网络搜索工具',
        language: 'python',
        code: `import asyncio

async def perform_search(query, max_results):
    return [f'Result {i} for {query}' for i in range(1, max_results+1)]

def format_search_results(results):
    return "\n".join(results)

class WebSearchMCPServer:
    def __init__(self):
        self.tools = {
            "search_web": {
                "name": "search_web",
                "description": "在网络上搜索信息",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "max_results": {"type": "integer", "default": 5}
                    },
                    "required": ["query"]
                }
            }
        }
    async def call_tool(self, name: str, arguments: dict):
        if name == "search_web":
            return await self.search_web(
                arguments["query"],
                arguments.get("max_results", 5)
            )
        raise ValueError(f"Unknown tool: {name}")
    async def search_web(self, query: str, max_results: int):
        results = await perform_search(query, max_results)
        return {
            "content": [{
                "type": "text",
                "text": format_search_results(results)
            }]
        }

async def main():
    server = WebSearchMCPServer()
    res = await server.call_tool("search_web", {"query": "AI trends 2025", "max_results": 3})
    print(res["content"][0]["text"])

asyncio.run(main())`,
        output: 'Result 1 for AI trends 2025\nResult 2 for AI trends 2025\nResult 3 for AI trends 2025'
      }
    ]
  }
];