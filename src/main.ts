import { loadConfig } from "./config.util";

import { userRun } from "./cli/userRun";
import { pipelineRun } from "./cli/pipelineRun";
import { mcpRun } from "./mcp/server";

const main = async () => {
  try {
    const args = process.argv.slice(2);
    const cliMode = args[0];

    if (cliMode === "--mcp") {
      console.error("⚠️  MCP mode is experimental.");
      await mcpRun();
      return;
    }

    console.log("🚀 AI Commit Helper starting...\n");
    const config = loadConfig();
    if (config.isPipeline) {
      await pipelineRun(config);
      return;
    } else {
      await userRun(config);
      return;
    }
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

main();
