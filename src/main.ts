import inquirer from "inquirer";
import { loadConfig } from "./config.util";
import { getGitDiff, DiffMode } from "./git.util";

import { deleteDiffFile, saveDiffToFile } from "./file.util";

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

  console.log("📦 Diff summary:", diff);

  if (!diff) return;

  saveDiffToFile(diff);

  // 3️⃣ Config dosyasını yüklüyoruz
  const config = loadConfig();

  console.log("✅ Config loaded:");
  console.log(`- Language: ${config.language}`);
  console.log(`- Max message length: ${config.maxMessageLength}\n`);
  console.log("Commit conventions:");
  config.conventions.forEach((c) =>
    console.log(`  • ${c.prefix}: ${c.description}`)
  );

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

  console.log("\n📦 Diff summary:\n");
  console.log(diff.slice(0, 400) + (diff.length > 400 ? "\n..." : ""));

  deleteDiffFile();
};

run();
