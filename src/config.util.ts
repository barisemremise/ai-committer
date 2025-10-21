import fs from "fs";
import path from "path";
import { Config } from "./types";

export const loadConfig = (): Config => {
  const configPath = path.resolve(process.cwd(), "commit-config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error("❌ commit-config.json not found in current directory");
  }

  const data = fs.readFileSync(configPath, "utf8");
  const parsed = JSON.parse(data);

  const { language, conventions, agentConfig } = parsed;

  if (typeof language !== "string") {
    throw new Error("❌ Invalid config: 'language' must be a string.");
  }

  if (!Array.isArray(conventions)) {
    throw new Error("❌ Invalid config: 'conventions' must be an array.");
  }

  if (typeof agentConfig.apiKey !== "string") {
    throw new Error("❌ Invalid config: 'agent.apiKey' must be a string.");
  }

  if (typeof agentConfig.model !== "string") {
    throw new Error("❌ Invalid config: 'agent.model' must be a string.");
  }

  return { commitConfig: { language, conventions }, agentConfig };
};
