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

  const { commitConfig } = parsed;

  if (!commitConfig || typeof commitConfig !== "object") {
    throw new Error("❌ Invalid config: 'commitConfig' field missing or invalid.");
  }

  if (typeof commitConfig.maxMessageLength !== "number") {
    throw new Error("❌ Invalid config: 'maxMessageLength' must be a number.");
  }

  if (typeof commitConfig.language !== "string") {
    throw new Error("❌ Invalid config: 'language' must be a string.");
  }

  if (!Array.isArray(commitConfig.conventions)) {
    throw new Error("❌ Invalid config: 'conventions' must be an array.");
  }

  return parsed;
};
