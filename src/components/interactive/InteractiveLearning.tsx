import React, { useState } from 'react';
import { InteractiveCodeEditor, CodeExercise, InteractiveTutorial } from './CodeEditor';
import { agentConcepts } from '../../data/concepts';
import { researchProjects } from '../../data/projects';
import { evolutionStages } from '../../data/evolution';

const tutorialSteps = [
  {
    title: 'Research Agent 基础',
    content: '首先了解什么是Research Agent。它是一个能够自主进行信息收集、分析和总结的智能体。',
    code: `# Research Agent 基础示例
class SimpleResearchAgent:
    def __init__(self, name):
        self.name = name
        self.memory = []
    
    def research(self, topic):
        print(f"{self.name} 正在研究: {topic}")
        return f"关于{topic}的研究结果"

# 创建一个Agent实例
agent = SimpleResearchAgent("小助手")
result = agent.research("人工智能")
print(result)`
  },
  {
    title: '工具调用机制',
    content: '学习如何让Agent调用工具来获取信息和完成任务。工具调用是Agent能力的核心。',
    code: `# 工具调用示例
class SearchTool:
    def search(self, query):
        return f"搜索 '{query}' 的结果"

class ResearchAgent:
    def __init__(self):
        self.tools = {
            'search': SearchTool()
        }
    
    def use_tool(self, tool_name, **kwargs):
        if tool_name in self.tools:
            return self.tools[tool_name].search(**kwargs)
        return "工具未找到"
    
    def research(self, query):
        return self.use_tool('search', query=query)

agent = ResearchAgent()
result = agent.research("机器学习")
print(result)`
  },
  {
    title: '记忆管理',
    content: '了解Agent如何管理研究过程中的信息，包括短期和长期记忆的维护。',
    code: `# 记忆管理示例
class MemoryManager:
    def __init__(self):
        self.short_term = []
        self.long_term = {}
    
    def add_memory(self, info, importance=1):
        if importance > 5:
            self.long_term[info] = importance
        else:
            self.short_term.append(info)
    
    def recall(self, query):
        # 简单的记忆检索
        results = []
        if query in self.long_term:
            results.append(f"长期记忆: {query}")
        for memory in self.short_term:
            if query in memory:
                results.append(f"短期记忆: {memory}")
        return results

memory = MemoryManager()
memory.add_memory("AI是人工智能", 8)
memory.add_memory("ML是机器学习", 6)
print(memory.recall("AI"))`
  }
];

const codeExercises = [
  {
    title: '创建你的第一个Agent',
    description: '编写一个简单的Agent类，能够接收任务并返回基本响应。',
    initialCode: `# 在这里编写你的Agent类
class MyAgent:
    # TODO: 实现Agent的基本功能
    pass

# 测试你的Agent
agent = MyAgent("我的助手")
# TODO: 调用Agent的方法`,
    solution: `class MyAgent:
    def __init__(self, name):
        self.name = name
        self.tasks = []
    
    def add_task(self, task):
        self.tasks.append(task)
        return f"任务 '{task}' 已添加到 {self.name} 的任务列表"
    
    def complete_task(self):
        if self.tasks:
            task = self.tasks.pop(0)
            return f"{self.name} 完成了任务: {task}"
        return "没有待完成的任务"
    
    def get_status(self):
        return f"{self.name} 有 {len(self.tasks)} 个待完成任务"

# 测试Agent
agent = MyAgent("我的助手")
print(agent.add_task("研究AI"))
print(agent.add_task("写报告"))
print(agent.get_status())
print(agent.complete_task())
print(agent.get_status())`,
    hints: [
      'Agent需要一个构造函数来初始化名称和任务列表',
      '添加任务的方法应该将任务保存到列表中',
      '完成任务的方法应该从列表中移除并返回完成的任务',
      '获取状态的方法应该返回当前任务数量'
    ],
    validate: (code: string) => {
      const hasClass = code.includes('class MyAgent');
      const hasInit = code.includes('def __init__');
      const hasAddTask = code.includes('def add_task');
      const hasCompleteTask = code.includes('def complete_task');
      
      if (!hasClass) return { isValid: false, message: '请定义 MyAgent 类' };
      if (!hasInit) return { isValid: false, message: '请实现构造函数 __init__' };
      if (!hasAddTask) return { isValid: false, message: '请实现 add_task 方法' };
      if (!hasCompleteTask) return { isValid: false, message: '请实现 complete_task 方法' };
      
      return { isValid: true, message: '很好！你已经成功创建了一个基本的Agent类。' };
    }
  },
  {
    title: '实现工具调用功能',
    description: '为你的Agent添加工具调用能力，让它能够执行特定的任务。',
    initialCode: `# 实现工具调用功能
class Tool:
    def __init__(self, name):
        self.name = name
    
    def execute(self, **kwargs):
        # TODO: 实现工具执行逻辑
        pass

class SmartAgent:
    def __init__(self, name):
        self.name = name
        self.tools = {}
    
    def add_tool(self, tool):
        # TODO: 实现添加工具的逻辑
        pass
    
    def use_tool(self, tool_name, **kwargs):
        # TODO: 实现使用工具的逻辑
        pass`,
    solution: `class Tool:
    def __init__(self, name):
        self.name = name
    
    def execute(self, **kwargs):
        return f"工具 {self.name} 执行成功，参数: {kwargs}"

class SmartAgent:
    def __init__(self, name):
        self.name = name
        self.tools = {}
    
    def add_tool(self, tool):
        self.tools[tool.name] = tool
        return f"工具 {tool.name} 已添加到 {self.name}"
    
    def use_tool(self, tool_name, **kwargs):
        if tool_name in self.tools:
            result = self.tools[tool_name].execute(**kwargs)
            return f"{self.name} 使用 {tool_name}: {result}"
        return f"工具 {tool_name} 未找到"

# 创建和使用工具
search_tool = Tool("search")
analytics_tool = Tool("analytics")

agent = SmartAgent("智能助手")
agent.add_tool(search_tool)
agent.add_tool(analytics_tool)

print(agent.use_tool("search", query="AI"))
print(agent.use_tool("analytics", data="用户数据"))`,
    hints: [
      'Tool类需要一个execute方法来执行具体功能',
      'Agent需要维护一个工具字典来存储所有工具',
      'add_tool方法应该将工具添加到字典中',
      'use_tool方法应该检查工具是否存在并调用其execute方法'
    ],
    validate: (code: string) => {
      const hasToolClass = code.includes('class Tool');
      const hasSmartAgent = code.includes('class SmartAgent');
      const hasExecute = code.includes('def execute');
      const hasAddTool = code.includes('def add_tool');
      const hasUseTool = code.includes('def use_tool');
      
      if (!hasToolClass) return { isValid: false, message: '请定义 Tool 类' };
      if (!hasSmartAgent) return { isValid: false, message: '请定义 SmartAgent 类' };
      if (!hasExecute) return { isValid: false, message: '请实现 Tool 类的 execute 方法' };
      if (!hasAddTool) return { isValid: false, message: '请实现 add_tool 方法' };
      if (!hasUseTool) return { isValid: false, message: '请实现 use_tool 方法' };
      
      return { isValid: true, message: '优秀！你已经成功实现了工具调用功能。' };
    }
  }
];

export const InteractiveLearning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'exercises' | 'playground'>('tutorial');

  const tabs = [
    { id: 'tutorial', label: '交互式教程', icon: '📚' },
    { id: 'exercises', label: '编程练习', icon: '💪' },
    { id: 'playground', label: '代码沙盒', icon: '🏖️' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">交互式学习中心</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          通过交互式教程、编程练习和代码沙盒，深入理解Research Agent的核心概念和实现技术。
        </p>
      </div>

      {/* 标签页导航 */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      {activeTab === 'tutorial' && (
        <div className="space-y-6">
          <InteractiveTutorial
            title="Research Agent 入门教程"
            steps={tutorialSteps}
          />
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 学习建议</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>按照教程顺序学习，确保理解每个概念</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>动手修改代码，观察不同的运行结果</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>完成所有练习后再进入下一个学习模块</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'exercises' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">编程练习</h2>
            <p className="text-gray-600">
              通过实际编程练习巩固所学知识，每个练习都有详细的提示和参考解决方案。
            </p>
          </div>
          
          <div className="grid gap-6">
            {codeExercises.map((exercise, index) => (
              <CodeExercise
                key={index}
                title={exercise.title}
                description={exercise.description}
                initialCode={exercise.initialCode}
                solution={exercise.solution}
                hints={exercise.hints}
                language={'python'}
                validate={exercise.validate}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'playground' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">代码沙盒</h2>
            <p className="text-gray-600">
              在这里自由实验和测试你的想法，支持多种编程语言和实时编辑。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">快速开始模板</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // 这里可以添加加载模板代码的逻辑
                  }}
                  className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">基础Agent模板</h4>
                  <p className="text-sm text-gray-600 mt-1">一个简单的Agent类模板</p>
                </button>
                
                <button
                  onClick={() => {
                    // 这里可以添加加载模板代码的逻辑
                  }}
                  className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">工具调用模板</h4>
                  <p className="text-sm text-gray-600 mt-1">支持工具调用的Agent模板</p>
                </button>
                
                <button
                  onClick={() => {
                    // 这里可以添加加载模板代码的逻辑
                  }}
                  className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">记忆系统模板</h4>
                  <p className="text-sm text-gray-600 mt-1">带记忆管理功能的Agent模板</p>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">代码编辑器</h3>
              <InteractiveCodeEditor
                initialCode={`# 在这里编写你的Research Agent代码
class MyResearchAgent:
    def __init__(self, name):
        self.name = name
        print(f"{name} Agent 已创建！")
    
    def research(self, topic):
        # 在这里实现你的研究逻辑
        return f"关于 {topic} 的研究结果"

# 测试你的代码
agent = MyResearchAgent("实验")
result = agent.research("人工智能")
print(result)`}
                language="python"
                height="400px"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">🎯 沙盒使用提示</h4>
            <ul className="space-y-1 text-yellow-800 text-sm">
              <li>• 可以自由修改代码，测试不同的实现方式</li>
              <li>• 尝试组合不同的功能模块</li>
              <li>• 实验各种算法和数据结构</li>
              <li>• 保存你觉得有用的代码片段</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};