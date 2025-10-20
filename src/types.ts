export type MCPServerConfig = {
  name: string;
  model: string;
  url: string;
  apiKey: string;
};

export type Convention = {
  prefix: string;
  description: string;
}

export type CommitConfig = {
  maxMessageLength: number;
  language: string;
  conventions: Convention[];
}

export type Config = {
  commitConfig: CommitConfig;
  mcpServer: MCPServerConfig;
}

