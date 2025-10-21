export type AgentConfig = {
  model: string;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
};

export type Convention = {
  prefix: string;
  description: string;
}

export type CommitConfig = {
  language: string;
  conventions: Convention[];
}

export type Config = {
  agentConfig: AgentConfig;
  commitConfig: CommitConfig;
}

