import inquirer from "inquirer";
import { commitChanges, DiffMode, getGitDiff, validateDiffSize } from "./git.util";
import { getCommitMessageFactory } from "./models/getCommitMessageFactory";
import { Config, Model } from "./types";

export const userRun = async (config: Config) => {
  const { diffMode } = await inquirer.prompt([
    {
      type: "list",
      name: "diffMode",
      message: "Select which changes should be analyzed:",
      choices: [
        { name: "Staged changes only", value: "staged" },
        { name: "All changes (working tree)", value: "all" },
      ],
      default: "staged"
    }
  ]);

  let pathArg: string | undefined;
  if (diffMode === "path") {
    const { pathInput } = await inquirer.prompt([
      {
        type: "input",
        name: "pathInput",
        message: "Enter the file or folder path to diff:",
        validate: (input) => input.trim().length > 0 || "Path cannot be empty."
      }
    ]);
    pathArg = pathInput;
  }

  const diff = getGitDiff(diffMode as DiffMode, pathArg);

  validateDiffSize(diff);

  const { commitConfig, agentConfig, models } = config;

  let model: Model | undefined = undefined

  if(models.length === 1) {
    model = models[0];
  } else {
    const modelChoices = models.map((m, index) => ({
      name: `${m.type} (${m.model})`,
      value: index
    }));

    const { selectedModelIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedModelIndex",
        message: "Multiple models found in config. Select which model to use:",
        choices: modelChoices
      }
    ]);

    model = models[selectedModelIndex];
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
  });

  const { selectedCommit } = await inquirer.prompt([
  {
    type: "list",
    name: "selectedCommit",
    message: "Select the best commit message:",
    choices: commitOptions,
  },
]);

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Continue to AI commit suggestion?",
      default: true
    }
  ]);

  if (!confirm) {
    console.log("🛑 Cancelled.");
    return;
  }

  commitChanges(selectedCommit, diffMode);
};