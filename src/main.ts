import inquirer from "inquirer";
import { loadConfig } from "./config.util";
import { getGitDiff, DiffMode } from "./git.util";

import { deleteDiffFile, saveDiffToFile } from "./file.util";
import { getCommitMessage } from "./openai/openAi";

const run = async () => {
  console.log("🚀 AI Commit Helper starting...\n");

  // 1️⃣ Kullanıcıya diff modu seçtiriyoruz
  const { diffMode } = await inquirer.prompt([
    {
      type: "list",
      name: "diffMode",
      message: "Select which changes should be analyzed:",
      choices: [
        { name: "Staged changes only", value: "staged" },
        { name: "All changes (working tree)", value: "all" },
        { name: "Specific path", value: "path" }
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

  // 2️⃣ Git diff'i alıyoruz
  const diff = getGitDiff(diffMode as DiffMode, pathArg);

  if (!diff) {
    return;
  }

  saveDiffToFile(diff);

  // 3️⃣ Config dosyasını yüklüyoruz
  const { commitConfig, agentConfig } = loadConfig();

  console.log("✅ Config loaded:");
  console.log(`- Language: ${commitConfig.language}`);
  console.log("Commit conventions:");
  const conventions = commitConfig.conventions;
  conventions.forEach((c) =>
    console.log(`  • ${c.prefix}: ${c.description}`)
  );

  const aiResponse = await getCommitMessage({
    diff,
    commitConfig,
    agentConfig
  });

  console.log("\n💡 Suggested Commit Message:\n", aiResponse, "\n");


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

  deleteDiffFile();
};

run();
