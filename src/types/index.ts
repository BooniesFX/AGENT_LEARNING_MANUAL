export interface ResearchAgentConcept {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'advanced' | 'expert';
  components: Component[];
  workflows: Workflow[];
  examples: CodeExample[];
  icon?: string;
}

export interface Component {
  id: string;
  name: string;
  description: string;
  type: 'core' | 'optional' | 'advanced';
  responsibilities: string[];
  interactions: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  diagram?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  order: number;
  inputs?: string[];
  outputs?: string[];
  tools?: string[];
}

export interface CodeExample {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  output?: string;
  explanation?: string;
}

export interface ResearchAgentProject {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  repository: string;
  description: string;
  features: ProjectFeature[];
  architecture: ArchitectureInfo;
  pros: string[];
  cons: string[];
  useCases: string[];
  techStack: string[];
  complexity: number; // 1-10
  security?: number; // 1-10
  monitoring?: number; // 1-10
  tooling?: number; // 1-10
  performance?: number; // 1-10
}

export interface ProjectFeature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'research' | 'integration' | 'ui' | 'advanced';
  implementation: string;
}

export interface ArchitectureInfo {
  pattern: string;
  components: string[];
  dataFlow: string;
  scalability: number; // 1-10
  maintainability: number; // 1-10
}

export interface ComparisonDimension {
  id: string;
  name: string;
  description: string;
  metrics: Metric[];
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  value: number | string;
  unit?: string;
}

export interface EvolutionStage {
  id: string;
  name: string;
  description: string;
  complexity: number; // 1-10
  capabilities: string[];
  requirements: string[];
  codeExamples: CodeExample[];
  nextStage?: string;
  previousStage?: string;
  keyTechnologies: string[];
  challenges: string[];
  solutions: string[];
}