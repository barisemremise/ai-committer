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

  const { language, conventions, agentConfig, models, isPipeline, pipelineConfig, isAutoPush } = parsed;

  if (typeof language !== "string") {
    throw new Error("❌ Invalid config: 'language' must be a string.");
  }

  if (!Array.isArray(conventions)) {
    throw new Error("❌ Invalid config: 'conventions' must be an array.");
  }

  if (!Array.isArray(models) || models.length === 0) {
    throw new Error("❌ Invalid config: 'models' must be a non-empty array.");
  }

  if(isPipeline && !pipelineConfig) {
    throw new Error("❌ Invalid config: 'pipelineConfig' must be provided when 'isPipeline' is true.");
  }

  return { commitConfig: { language, conventions }, agentConfig, models, pipelineConfig, isPipeline, isAutoPush };
};
