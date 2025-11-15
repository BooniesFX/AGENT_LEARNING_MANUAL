import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EvolutionStage } from '../../types';
import { MultiCodeExample } from '../concept/CodeExample';
import { evolutionStages } from '../../data/evolution';

interface EvolutionPathProps {
  stages?: EvolutionStage[];
}

interface StageCardProps {
  stage: EvolutionStage;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  position: { x: number; y: number };
}

const StageCard: React.FC<StageCardProps> = ({ stage, isActive, isCompleted, onClick, position }) => {
  const getComplexityColor = (complexity: number) => {
    if (complexity <= 3) return 'from-green-400 to-green-600';
    if (complexity <= 6) return 'from-yellow-400 to-yellow-600';
    if (complexity <= 8) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <motion.div
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
        isActive ? 'z-20' : 'z-10'
      }`}
      style={{ left: position.x, top: position.y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className={`w-48 p-4 rounded-lg shadow-lg border-2 transition-all duration-300 ${
        isActive 
          ? 'border-blue-500 bg-white shadow-xl' 
          : isCompleted 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-300 bg-white hover:border-gray-400'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{stage.name}</h3>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-r ${getComplexityColor(stage.complexity)}`}>
            {stage.complexity}
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-2">{stage.description}</p>
        <div className="flex flex-wrap gap-1">
          {stage.keyTechnologies.slice(0, 3).map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {tech}
            </span>
          ))}
          {stage.keyTechnologies.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{stage.keyTechnologies.length - 3}
            </span>
          )}
        </div>
        {isCompleted && (
          <div className="mt-2 text-green-600 text-xs flex items-center">
            <span className="mr-1">✓</span>
            已完成
          </div>
        )}
      </div>
      
      {/* 连接线 */}
      {isCompleted && (
        <motion.div
          className="absolute top-full left-1/2 w-1 h-16 bg-green-500 transform -translate-x-1/2"
          initial={{ height: 0 }}
          animate={{ height: 64 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
};

interface StageDetailPanelProps {
  stage: EvolutionStage;
  onClose: () => void;
}

const StageDetailPanel: React.FC<StageDetailPanelProps> = ({ stage, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'capabilities' | 'challenges' | 'code'>('overview');

  const tabs = [
    { id: 'overview', label: '概览', icon: '📊' },
    { id: 'capabilities', label: '能力', icon: '⚡' },
    { id: 'challenges', label: '挑战', icon: '⚠️' },
    { id: 'code', label: '代码', icon: '💻' }
  ];

  return (
    <motion.div
      className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-30 overflow-y-auto"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{stage.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">复杂度</span>
            <span className="text-lg font-semibold text-gray-900">{stage.complexity}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stage.complexity / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{stage.description}</p>

        {/* 标签页导航 */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 标签页内容 */}
        <div className="space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">关键技术</h3>
                <div className="flex flex-wrap gap-2">
                  {stage.keyTechnologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">前置要求</h3>
                <ul className="space-y-1">
                  {stage.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'capabilities' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">核心能力</h3>
              <ul className="space-y-2">
                {stage.capabilities.map((capability, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700 text-sm">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-900 mb-2">主要挑战</h3>
                <ul className="space-y-2">
                  {stage.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">⚠️</span>
                      <span className="text-gray-700 text-sm">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-green-900 mb-2">解决方案</h3>
                <ul className="space-y-2">
                  {stage.solutions.map((solution, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">💡</span>
                      <span className="text-gray-700 text-sm">{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">代码示例</h3>
              <MultiCodeExample examples={stage.codeExamples} />
            </div>
          )}
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          {stage.previousStage && (
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center">
              <span className="mr-2">←</span>
              上一阶段
            </button>
          )}
          {stage.nextStage && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ml-auto">
              下一阶段
              <span className="ml-2">→</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const EvolutionPath: React.FC<EvolutionPathProps> = ({ stages = evolutionStages }) => {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [completedStages, setCompletedStages] = useState<string[]>(['prototype']);

  // 计算每个阶段的位置
  const calculatePositions = () => {
    const positions: { [key: string]: { x: number; y: number } } = {};
    const centerX = 400;
    const startY = 100;
    const verticalSpacing = 180;

    stages.forEach((stage, index) => {
      positions[stage.id] = {
        x: centerX,
        y: startY + index * verticalSpacing
      };
    });

    return positions;
  };

  const positions = calculatePositions();

  const handleStageClick = (stageId: string) => {
    setActiveStage(stageId);
  };

  const handleStageComplete = (stageId: string) => {
    if (!completedStages.includes(stageId)) {
      setCompletedStages([...completedStages, stageId]);
      
      // 自动进入下一阶段
      const currentStage = stages.find(s => s.id === stageId);
      if (currentStage?.nextStage) {
        setTimeout(() => {
          setActiveStage(currentStage.nextStage!);
        }, 500);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Research Agent 架构演进路径</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          从简单的原型到企业级应用，了解Research Agent架构的完整演进过程。点击每个阶段查看详细信息。
        </p>
      </div>

      <div className="relative bg-gradient-to-b from-blue-50 to-white rounded-lg p-8 min-h-[800px]">
        {/* 背景网格 */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* 演进路径标题 */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white px-4 py-2 rounded-lg shadow-md border">
            <span className="text-lg font-semibold text-gray-900">演进时间线</span>
          </div>
        </div>

        {/* 阶段卡片 */}
        {stages.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            isActive={activeStage === stage.id}
            isCompleted={completedStages.includes(stage.id)}
            onClick={() => handleStageClick(stage.id)}
            position={positions[stage.id]}
          />
        ))}

        {/* 阶段详情面板 */}
        {activeStage && (
          <StageDetailPanel
            stage={stages.find(s => s.id === activeStage)!}
            onClose={() => setActiveStage(null)}
          />
        )}
      </div>

      {/* 进度指示器 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">学习进度</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">完成度</span>
          <span className="text-sm font-medium text-gray-900">
            {completedStages.length} / {stages.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedStages.length / stages.length) * 100}%` }}
          ></div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              const currentStage = activeStage ? stages.find(s => s.id === activeStage) : null;
              if (currentStage) {
                handleStageComplete(currentStage.id);
              }
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            标记当前阶段为完成
          </button>
        </div>
      </div>
    </div>
  );
};