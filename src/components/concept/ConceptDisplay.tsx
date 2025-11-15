import React, { useState } from 'react';
import { ResearchAgentConcept } from '../../types';
import { ConceptCard, ComponentCard, WorkflowDiagram } from './ConceptCard';
import { MultiCodeExample } from './CodeExample';
import { agentConcepts } from '../../data/concepts';

interface ConceptDisplayProps {
  concept?: ResearchAgentConcept;
  onConceptChange?: (concept: ResearchAgentConcept) => void;
}

export const ConceptDisplay: React.FC<ConceptDisplayProps> = ({ 
  concept = agentConcepts[0], 
  onConceptChange 
}) => {
  const [selectedConcept, setSelectedConcept] = useState<ResearchAgentConcept>(concept);
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'workflows' | 'examples'>('overview');

  const tabs = [
    { id: 'overview', label: '概览', icon: '📖' },
    { id: 'components', label: '组件', icon: '⚙️' },
    { id: 'workflows', label: '工作流', icon: '🔄' },
    { id: 'examples', label: '示例', icon: '💻' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 概念选择器 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Research Agent 核心概念</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentConcepts.map((conceptItem) => (
            <ConceptCard
              key={conceptItem.id}
              concept={conceptItem}
              onClick={(c) => { setSelectedConcept(c); onConceptChange?.(c); }}
              isActive={selectedConcept.id === conceptItem.id}
            />
          ))}
        </div>
      </div>

      {/* 当前概念的详细展示 */}
      {selectedConcept && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 标签页导航 */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* 标签页内容 */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl">{selectedConcept.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedConcept.name}</h3>
                    <p className="text-gray-600">{selectedConcept.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">组件数量</h4>
                    <p className="text-2xl font-bold text-blue-600">{selectedConcept.components.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">工作流</h4>
                    <p className="text-2xl font-bold text-green-600">{selectedConcept.workflows.length}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">代码示例</h4>
                    <p className="text-2xl font-bold text-purple-600">{selectedConcept.examples.length}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">学习路径建议</h4>
                  <p className="text-yellow-800 text-sm">
                    {selectedConcept.category === 'basic' && '建议初学者从这里开始，掌握基础概念后再学习高级内容。'}
                    {selectedConcept.category === 'advanced' && '建议在掌握基础概念后学习，需要一定的编程经验。'}
                    {selectedConcept.category === 'expert' && '适合有经验的开发者，涉及复杂的架构设计和优化技巧。'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'components' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">核心组件</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedConcept.components.map((component) => (
                    <ComponentCard key={component.id} component={component} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'workflows' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">工作流程</h3>
                {selectedConcept.workflows.map((workflow) => (
                  <WorkflowDiagram key={workflow.id} workflow={workflow} />
                ))}
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">代码示例</h3>
                <MultiCodeExample examples={selectedConcept.examples} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
