import { execSync } from "child_process";

export type DiffMode = "staged" | "all" | "path";

export const getGitDiff = (mode: DiffMode, pathArg?: string): string => {
  try {
    let command = "";

    switch (mode) {
      case "staged":
        command = "git diff --cached";
        break;
      case "all":
        command = "git diff";
        break;
      case "path":
        if (!pathArg) {
          throw new Error("❌ Path mode selected but no path provided.");
        }
        command = `git diff ${pathArg}`;
        break;
    }

    const diff = execSync(command, { encoding: "utf8" });

    if (!diff.trim()) {
      console.log("⚠️  No changes detected for the selected mode.");
    }

    return diff;
  } catch (err) {
    console.error("❌ Error reading git diff:", err);
    return "";
  }
};


