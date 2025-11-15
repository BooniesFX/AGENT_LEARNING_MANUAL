import React from 'react';
import { ResearchAgentConcept, Component, Workflow } from '../../types';

interface ConceptCardProps {
  concept: ResearchAgentConcept;
  onClick?: (concept: ResearchAgentConcept) => void;
  isActive?: boolean;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ concept, onClick, isActive }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div 
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isActive ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:border-gray-300'
      }`}
      onClick={() => onClick?.(concept)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{concept.icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{concept.name}</h3>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(concept.category)}`}>
          {concept.category}
        </span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{concept.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{concept.components.length} 个组件</span>
        <span>{concept.workflows.length} 个工作流</span>
        <span>{concept.examples.length} 个示例</span>
      </div>
    </div>
  );
};

interface ComponentCardProps {
  component: Component;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'core': return 'bg-green-100 text-green-800';
      case 'optional': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{component.name}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(component.type)}`}>
          {component.type}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{component.description}</p>
      
      <div className="space-y-2">
        <div>
          <h5 className="text-xs font-medium text-gray-700 mb-1">主要职责：</h5>
          <ul className="text-xs text-gray-600 space-y-1">
            {component.responsibilities.map((resp, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-1">•</span>
                {resp}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="text-xs font-medium text-gray-700 mb-1">交互关系：</h5>
          <ul className="text-xs text-gray-600 space-y-1">
            {component.interactions.map((interaction, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-1">↔</span>
                {interaction}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

interface WorkflowDiagramProps {
  workflow: Workflow;
}

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ workflow }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">{workflow.name}</h4>
      <p className="text-gray-600 mb-6">{workflow.description}</p>
      
      <div className="space-y-4">
        {workflow.steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">{step.name}</h5>
                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {step.inputs && (
                    <div>
                      <span className="font-medium text-gray-700">输入：</span>
                      <ul className="text-gray-600 mt-1 space-y-1">
                        {step.inputs.map((input, i) => (
                          <li key={i}>• {input}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {step.outputs && (
                    <div>
                      <span className="font-medium text-gray-700">输出：</span>
                      <ul className="text-gray-600 mt-1 space-y-1">
                        {step.outputs.map((output, i) => (
                          <li key={i}>• {output}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {step.tools && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">使用工具：</span>
                      <ul className="text-gray-600 mt-1 space-y-1">
                        {step.tools.map((tool, i) => (
                          <li key={i}>🔧 {tool}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {index < workflow.steps.length - 1 && (
              <div className="flex-shrink-0">
                <div className="w-px h-8 bg-gray-300 mx-4"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};