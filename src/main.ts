import { loadConfig } from "./config.util";

import { userRun } from "./userRun";
import { pipelineRun } from "./pipelineRun";

const main = async () => {
  try {
    console.log("🚀 AI Commit Helper starting...\n");
    const config = loadConfig();

    if(config.isPipeline) {
      pipelineRun(config);
    } else { 
      userRun(config);
    };
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
};

main();
