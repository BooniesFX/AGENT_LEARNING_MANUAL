import React, { useState } from 'react';
import { ResearchAgentProject, ComparisonDimension } from '../../types';

interface ProjectCardProps {
  project: ResearchAgentProject;
  isSelected?: boolean;
  onClick?: (project: ResearchAgentProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isSelected, onClick }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity <= 3) return 'text-green-600';
    if (complexity <= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div 
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={() => onClick?.(project)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(project.level)}`}>
          {project.level}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{project.description}</p>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">复杂度:</span>
          <span className={`text-sm font-medium ${getComplexityColor(project.complexity)}`}>
            {project.complexity}/10
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">功能:</span>
          <span className="text-sm font-medium text-gray-700">{project.features.length}</span>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">技术栈:</h4>
        <div className="flex flex-wrap gap-1">
          {project.techStack.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{project.useCases.length} 个应用场景</span>
        <a 
          href={project.repository} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
          onClick={(e) => e.stopPropagation()}
        >
          查看仓库 →
        </a>
      </div>
    </div>
  );
};

interface ProjectDetailModalProps {
  project: ResearchAgentProject | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">基本信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">难度等级:</span>
                  <span className="font-medium">{project.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">复杂度:</span>
                  <span className="font-medium">{project.complexity}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">架构模式:</span>
                  <span className="font-medium">{project.architecture.pattern}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">架构评分</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">可扩展性:</span>
                  <span className="font-medium">{project.architecture.scalability}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">可维护性:</span>
                  <span className="font-medium">{project.architecture.maintainability}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* 技术栈 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 主要功能 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">主要功能</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feature) => (
                <div key={feature.id} className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">{feature.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                    {feature.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 优缺点 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-3">优势</h3>
              <ul className="space-y-2">
                {project.pros.map((pro, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-3">劣势</h3>
              <ul className="space-y-2">
                {project.cons.map((con, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span className="text-gray-700">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 应用场景 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">适用场景</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {project.useCases.map((useCase, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 架构组件 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">架构组件</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-3">{project.architecture.dataFlow}</p>
              <div className="flex flex-wrap gap-2">
                {project.architecture.components.map((component, index) => (
                  <span key={index} className="px-2 py-1 bg-white text-gray-700 text-sm rounded border">
                    {component}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 外部链接 */}
          <div className="flex justify-center pt-4 border-t border-gray-200">
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看项目仓库 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};