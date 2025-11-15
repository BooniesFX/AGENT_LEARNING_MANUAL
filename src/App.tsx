import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ConceptDisplay } from './components/concept/ConceptDisplay';
import { ProjectComparison } from './components/comparison/ProjectComparison';
import { EvolutionPath } from './components/evolution/EvolutionPath';
import { InteractiveLearning } from './components/interactive/InteractiveLearning';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/concepts', label: '核心概念', icon: '🧠' },
    { path: '/comparison', label: '项目对比', icon: '⚖️' },
    { path: '/evolution', label: '架构演进', icon: '📈' },
    { path: '/interactive', label: '交互学习', icon: '🎮' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              🤖 Research Agent 学习中心
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          深入理解 Research Agent
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          通过对比分析三个代表性项目，掌握从原型到生产级Agent的完整演进路径。
          学习核心概念、架构设计和最佳实践。
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/concepts"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            开始学习 →
          </Link>
          <Link
            to="/comparison"
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            查看项目对比
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🧠</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">核心概念</h3>
          <p className="text-gray-600 text-sm">
            深入理解Research Agent的基本概念、组件和工作原理。
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">⚖️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">项目对比</h3>
          <p className="text-gray-600 text-sm">
            对比分析DeepSearchAgent-Demo、deep-research和Claude Agent SDK。
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">📈</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">架构演进</h3>
          <p className="text-gray-600 text-sm">
            了解从原型到企业级应用的完整架构演进路径。
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-3">🎮</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">交互学习</h3>
          <p className="text-gray-600 text-sm">
            通过交互式教程和编程练习加深理解和掌握。
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">学习路径</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-900">基础概念</h3>
              <p className="text-gray-600">理解Agent、工具调用、记忆管理等核心概念</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-900">项目对比</h3>
              <p className="text-gray-600">分析不同复杂度项目的架构和实现差异</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-900">架构演进</h3>
              <p className="text-gray-600">掌握从原型到生产级的演进路径</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <h3 className="font-semibold text-gray-900">实践练习</h3>
              <p className="text-gray-600">通过交互式练习巩固所学知识</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">准备开始了吗？</h2>
        <p className="text-gray-600 mb-6">
          选择一个模块开始你的Research Agent学习之旅
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/concepts"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            核心概念
          </Link>
          <Link
            to="/interactive"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            交互学习
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/concepts" element={<ConceptDisplay />} />
            <Route path="/comparison" element={<ProjectComparison />} />
            <Route path="/evolution" element={<EvolutionPath />} />
            <Route path="/interactive" element={<InteractiveLearning />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
