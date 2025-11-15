import { ResearchAgentProject, ComparisonDimension } from '../types';

export const researchProjects: ResearchAgentProject[] = [
  {
    id: 'deep-search-agent-demo',
    name: 'DeepSearchAgent-Demo',
    level: 'beginner',
    repository: 'https://github.com/BooniesFX/DeepSearchAgent-Demo',
    description: '一个入门级的研究Agent演示项目，展示了基本的搜索和研究功能。适合初学者理解Agent的基本概念和实现方式。',
    complexity: 3,
    techStack: ['Python', 'OpenAI API', 'Requests', 'BeautifulSoup'],
    security: 2,
    monitoring: 3,
    tooling: 3,
    performance: 4,
    features: [
      {
        id: 'basic-search',
        name: '基础搜索功能',
        description: '使用搜索引擎API进行信息检索',
        category: 'core',
        implementation: '调用SerpAPI或类似搜索API获取搜索结果'
      },
      {
        id: 'simple-analysis',
        name: '简单分析',
        description: '对搜索结果进行基础的分析和总结',
        category: 'research',
        implementation: '使用LLM对搜索结果进行总结和提取关键信息'
      },
      {
        id: 'single-step',
        name: '单步执行',
        description: '一次性的搜索和分析流程',
        category: 'core',
        implementation: '线性执行搜索->分析->输出的简单流程'
      },
      {
        id: 'basic-ui',
        name: '基础界面',
        description: '简单的命令行或Web界面',
        category: 'ui',
        implementation: 'Streamlit或简单的HTML界面'
      }
    ],
    architecture: {
      pattern: '单体架构',
      components: ['搜索模块', 'LLM模块', '简单UI'],
      dataFlow: '线性流程：输入→搜索→分析→输出',
      scalability: 2,
      maintainability: 6
    },
    pros: [
      '代码简单易懂，适合学习',
      '依赖较少，部署简单',
      '快速原型验证',
      '学习成本较低'
    ],
    cons: [
      '功能较为简单',
      '缺乏复杂的决策逻辑',
      '扩展性有限',
      '错误处理能力较弱'
    ],
    useCases: [
      '学习Agent基本概念',
      '快速原型开发',
      '教学演示',
      '简单搜索任务'
    ]
  },
  {
    id: 'deep-research',
    name: 'deep-research',
    level: 'intermediate',
    repository: 'https://github.com/dzhng/deep-research',
    description: '一个中等复杂度的研究Agent项目，实现了多步骤研究流程和更复杂的决策逻辑。适合生产环境的初步应用。',
    complexity: 6,
    techStack: ['TypeScript', 'OpenAI API', 'Puppeteer', 'Redis', 'PostgreSQL'],
    security: 6,
    monitoring: 6,
    tooling: 6,
    performance: 8,
    features: [
      {
        id: 'multi-step-research',
        name: '多步骤研究',
        description: '支持复杂的多步骤研究流程',
        category: 'core',
        implementation: '使用状态机管理复杂的研究流程和步骤'
      },
      {
        id: 'adaptive-planning',
        name: '自适应规划',
        description: '根据中间结果动态调整研究计划',
        category: 'research',
        implementation: '基于LLM的规划器，能够根据新信息重新规划'
      },
      {
        id: 'web-scraping',
        name: '网页抓取',
        description: '从网页中提取详细信息',
        category: 'research',
        implementation: '使用Puppeteer进行动态网页抓取和内容提取'
      },
      {
        id: 'persistent-storage',
        name: '持久化存储',
        description: '存储研究过程和结果',
        category: 'integration',
        implementation: '使用Redis缓存和PostgreSQL持久化存储'
      },
      {
        id: 'quality-control',
        name: '质量控制',
        description: '评估研究结果的准确性和完整性',
        category: 'research',
        implementation: '使用多个LLM进行交叉验证和质量评估'
      },
      {
        id: 'citation-tracking',
        name: '引用跟踪',
        description: '跟踪信息来源和引用',
        category: 'research',
        implementation: '维护信息来源的完整链路和时间戳'
      }
    ],
    architecture: {
      pattern: '微服务架构',
      components: ['研究引擎', '规划器', '执行器', '存储层', 'API网关'],
      dataFlow: '循环流程：规划→执行→评估→调整→重复',
      scalability: 7,
      maintainability: 8
    },
    pros: [
      '功能完整，适合复杂研究任务',
      '架构清晰，易于维护',
      '支持生产环境部署',
      '有良好的错误处理机制'
    ],
    cons: [
      '部署复杂度较高',
      '需要较多的外部依赖',
      '学习成本相对较高',
      '资源消耗较大'
    ],
    useCases: [
      '学术研究辅助',
      '市场调研分析',
      '竞品分析',
      '深度报告生成'
    ]
  },
  {
    id: 'claude-agent-sdk',
    name: 'Claude Agent SDK',
    level: 'advanced',
    repository: 'https://github.com/anthropics/anthropic-sdk-typescript',
    description: 'Anthropic官方的企业级Agent SDK，提供了完整的Agent开发框架和高级功能。适合大规模生产环境应用。',
    complexity: 9,
    techStack: ['TypeScript', 'Claude API', 'Docker', 'Kubernetes', 'GraphQL', 'Apache Kafka'],
    security: 10,
    monitoring: 9,
    tooling: 9,
    performance: 7,
    features: [
      {
        id: 'enterprise-architecture',
        name: '企业级架构',
        description: '支持大规模部署和高可用性',
        category: 'core',
        implementation: '基于Kubernetes的容器化部署，支持自动扩缩容'
      },
      {
        id: 'advanced-reasoning',
        name: '高级推理',
        description: '支持复杂的多步推理和规划',
        category: 'research',
        implementation: '使用Claude的高级推理能力和链式思考'
      },
      {
        id: 'multi-agent-coordination',
        name: '多Agent协调',
        description: '支持多个Agent之间的协作',
        category: 'advanced',
        implementation: '使用消息队列和事件驱动架构实现Agent间通信'
      },
      {
        id: 'tool-ecosystem',
        name: '工具生态系统',
        description: '丰富的内置工具和第三方集成',
        category: 'integration',
        implementation: '插件化架构，支持自定义工具和第三方API集成'
      },
      {
        id: 'security-compliance',
        name: '安全合规',
        description: '企业级的安全和合规特性',
        category: 'core',
        implementation: '完整的身份认证、授权、审计和加密机制'
      },
      {
        id: 'monitoring-analytics',
        name: '监控分析',
        description: '全面的性能监控和业务分析',
        category: 'integration',
        implementation: '集成Prometheus、Grafana等监控工具'
      },
      {
        id: 'workflow-engine',
        name: '工作流引擎',
        description: '复杂业务流程的自动化管理',
        category: 'advanced',
        implementation: '基于状态机和工作流引擎的复杂流程管理'
      },
      {
        id: 'ml-ops-integration',
        name: 'MLOps集成',
        description: '与机器学习运维流程的集成',
        category: 'advanced',
        implementation: '支持模型训练、部署、监控的完整MLOps流程'
      }
    ],
    architecture: {
      pattern: '云原生微服务',
      components: ['API网关', 'Agent协调器', '工具服务', '数据平台', '监控平台', '安全服务'],
      dataFlow: '分布式事件驱动架构，支持复杂的业务流程',
      scalability: 10,
      maintainability: 9
    },
    pros: [
      '企业级特性和可靠性',
      '高度可扩展和可定制',
      '完善的安全和监控',
      '丰富的功能和工具',
      '专业的技术支持'
    ],
    cons: [
      '部署和运维复杂度高',
      '学习曲线陡峭',
      '资源需求大',
      '成本较高'
    ],
    useCases: [
      '企业级研究平台',
      '大规模数据分析',
      '复杂业务流程自动化',
      'AI驱动的决策支持'
    ]
  }
];

export const comparisonDimensions: ComparisonDimension[] = [
  {
    id: 'complexity',
    name: '复杂度',
    description: '项目的技术复杂度和学习难度',
    metrics: [
      { id: 'code-complexity', name: '代码复杂度', description: '代码结构和算法复杂度', value: '低-中-高', unit: '等级' },
      { id: 'learning-curve', name: '学习曲线', description: '掌握项目所需的学习时间', value: '短-中-长', unit: '时间' },
      { id: 'setup-difficulty', name: '部署难度', description: '项目部署和配置的复杂程度', value: '简单-中等-复杂', unit: '难度' }
    ]
  },
  {
    id: 'functionality',
    name: '功能性',
    description: '项目提供的功能丰富程度',
    metrics: [
      { id: 'research-depth', name: '研究深度', description: '支持的研究深度和广度', value: '基础-中等-深度', unit: '等级' },
      { id: 'tool-integration', name: '工具集成', description: '内置和可扩展的工具数量', value: '少-中-多', unit: '数量' },
      { id: 'automation-level', name: '自动化程度', description: '研究过程的自动化水平', value: '手动-半自动-全自动', unit: '等级' }
    ]
  },
  {
    id: 'architecture',
    name: '架构',
    description: '项目的架构设计和可扩展性',
    metrics: [
      { id: 'scalability', name: '可扩展性', description: '系统处理大规模任务的能力', value: '1-10', unit: '评分' },
      { id: 'maintainability', name: '可维护性', description: '代码维护和更新的难易程度', value: '1-10', unit: '评分' },
      { id: 'modularity', name: '模块化', description: '系统的模块化程度', value: '低-中-高', unit: '等级' }
    ]
  },
  {
    id: 'production-readiness',
    name: '生产就绪',
    description: '项目在生产环境中运行的准备程度',
    metrics: [
      { id: 'error-handling', name: '错误处理', description: '异常情况和错误处理机制', value: '基础-完善-企业级', unit: '等级' },
      { id: 'monitoring', name: '监控能力', description: '系统监控和日志记录功能', value: '基础-完善-企业级', unit: '等级' },
      { id: 'security', name: '安全性', description: '安全特性和数据保护', value: '基础-完善-企业级', unit: '等级' }
    ]
  }
];