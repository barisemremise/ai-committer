import fs from "fs";
import path from "path";
import { Config } from "./types/config";

export const loadConfig = (): Config => {
  const configPath = path.resolve(process.cwd(), "commit-config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error("❌ commit-config.json not found in current directory");
  }

  const data = fs.readFileSync(configPath, "utf8");
  const parsed = JSON.parse(data);

  if (!parsed.conventions || !Array.isArray(parsed.conventions)) {
    throw new Error("❌ Invalid config: 'conventions' field missing or invalid.");
  }

  if (typeof parsed.maxMessageLength !== "number") {
    throw new Error("❌ Invalid config: 'maxMessageLength' must be a number.");
  }

  if (typeof parsed.language !== "string") {
    throw new Error("❌ Invalid config: 'language' must be a string.");
  }

  return parsed;
};
