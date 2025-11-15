import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { ResearchAgentProject } from '../../types';

interface ProjectRadarChartProps {
  projects: ResearchAgentProject[];
  selectedProjects?: string[];
}

export const ProjectRadarChart: React.FC<ProjectRadarChartProps> = ({ projects, selectedProjects }) => {
  // 过滤选中的项目，如果没有选中则显示所有项目
  const displayProjects = selectedProjects && selectedProjects.length > 0
    ? projects.filter(p => selectedProjects.includes(p.id))
    : projects;

  // 为雷达图准备数据
  const radarData = [
    {
      metric: '复杂度',
      fullMark: 10,
      ...displayProjects.reduce((acc, project) => ({
        ...acc,
        [project.name]: project.complexity
      }), {})
    },
    {
      metric: '可扩展性',
      fullMark: 10,
      ...displayProjects.reduce((acc, project) => ({
        ...acc,
        [project.name]: project.architecture.scalability
      }), {})
    },
    {
      metric: '可维护性',
      fullMark: 10,
      ...displayProjects.reduce((acc, project) => ({
        ...acc,
        [project.name]: project.architecture.maintainability
      }), {})
    },
    {
      metric: '功能丰富度',
      fullMark: 10,
      ...displayProjects.reduce((acc, project) => ({
        ...acc,
        [project.name]: Math.min(project.features.length * 1.5, 10) // 功能数量转换为0-10分
      }), {})
    },
    {
      metric: '技术栈成熟度',
      fullMark: 10,
      ...displayProjects.reduce((acc, project) => ({
        ...acc,
        [project.name]: project.level === 'advanced' ? 9 : project.level === 'intermediate' ? 6 : 3
      }), {})
    },
    {
      metric: '安全性',
      fullMark: 10,
      ...displayProjects.reduce((acc, project) => ({
        ...acc,
        [project.name]: project.security ?? 0
      }), {})
    },
    {
      metric: '监控能力',
      fullMark: 10,
      ...displayProjects.reduce((acc, project) => ({
        ...acc,
        [project.name]: project.monitoring ?? 0
      }), {})
    },
    {
      metric: '工具生态',
      fullMark: 10,
      ...displayProjects.reduce((acc, project) => ({
        ...acc,
        [project.name]: project.tooling ?? 0
      }), {})
    },
    {
      metric: '性能',
      fullMark: 10,
      ...displayProjects.reduce((acc, project) => ({
        ...acc,
        [project.name]: project.performance ?? 0
      }), {})
    }
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">项目对比雷达图</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            {displayProjects.map((project, index) => (
              <Radar
                key={project.id}
                name={project.name}
                dataKey={project.name}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface FeatureComparisonMatrixProps {
  projects: ResearchAgentProject[];
}

export const FeatureComparisonMatrix: React.FC<FeatureComparisonMatrixProps> = ({ projects }) => {
  // 获取所有功能类别
  const categories = Array.from(new Set(projects.flatMap(p => p.features.map(f => f.category))));
  
  // 构建对比矩阵
  const matrix = categories.map(category => {
    const categoryFeatures = projects.map(project => ({
      project: project.name,
      features: project.features.filter(f => f.category === category).length
    }));
    
    return {
      category,
      projects: categoryFeatures
    };
  });

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">功能类别对比矩阵</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                功能类别
              </th>
              {projects.map(project => (
                <th key={project.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {project.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matrix.map((row) => (
              <tr key={row.category}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                  {row.category}
                </td>
                {row.projects.map((project) => (
                  <td key={project.project} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold">{project.features}</span>
                      <div className="ml-2 flex space-x-1">
                        {Array.from({ length: Math.min(project.features, 5) }, (_, i) => (
                          <div key={i} className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ComplexityBarChartProps {
  projects: ResearchAgentProject[];
}

export const ComplexityBarChart: React.FC<ComplexityBarChartProps> = ({ projects }) => {
  const data = projects.map(project => ({
    name: project.name,
    complexity: project.complexity,
    scalability: project.architecture.scalability,
    maintainability: project.architecture.maintainability
  }));

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">复杂度与架构评分</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="text-xs text-gray-500">复杂度: {item.complexity}/10</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>可扩展性</span>
                <span>{item.scalability}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.scalability / 10) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>可维护性</span>
                <span>{item.maintainability}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.maintainability / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};