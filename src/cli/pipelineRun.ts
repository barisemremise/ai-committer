import { getGitDiff, gitPostJob, validateDiffSize } from "../core/git.util";
import { getCommitMessageFactory } from "./models/getCommitMessageFactory";
import { Config, DiffMode, Model } from "../types";

export const pipelineRun = async (config: Config) => {
  const {
    commitConfig,
    agentConfig,
    models,
    isAutoPush,
    pipelineConfig: { modelIndex = 0, diffMode = "staged" } = {},
  } = config;

  const diff = getGitDiff(diffMode as DiffMode);

  validateDiffSize(diff);

  let model: Model | undefined = undefined;
  if (models.length === 1) {
    model = models[0];
  } else {
    model = models[modelIndex];
  }

  console.log(`- Using model: ${model!.type}`);

  if (!model) {
    console.error("❌ No model selected.");
    return;
  }

  const commitOptions = await getCommitMessageFactory({
    diff,
    commitConfig,
    agentConfig,
    model,
    numberOfSuggestions: 1,
  });

  const selectedCommit = commitOptions[0];

  console.log(`- Selected commit message: ${selectedCommit}`);

  gitPostJob({
    isAutoPush,
    commitMessage: selectedCommit,
    diffMode: diffMode as DiffMode,
  });
};
