export type AgentConfig = {
  temperature?: number;
  maxTokens?: number;
};

export const AIModelEnum = {
  OPENAI: "openai",
  GEMINI: "gemini"
}

export type AIModelType = keyof typeof AIModelEnum;

export type Model = {
  type: AIModelType
  model: string;
  apiKey: string;
}

export type Convention = {
  prefix: string;
  description: string;
}

export type CommitConfig = {
  language: string;
  conventions: Convention[];
}

export type PipelineConfig = {
  modelIndex: number;
  diffMode: string;
}

export type Config = {
  agentConfig: AgentConfig;
  commitConfig: CommitConfig;
  models: Model[];
  isPipeline: boolean;
  isAutoPush: boolean;
  pipelineConfig?: PipelineConfig;
}

export type GetCommitMessageParams = {
  diff: string,
  commitConfig: CommitConfig
  agentConfig: AgentConfig
  numberOfSuggestions?: number
  model: Model
}

export type SystemPrompt = {
  numberOfSuggestions: number;
  language: string;
  conventionString: string;
}

export type UserPrompt = {
  diff: string;
  language: string;
}
