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

export function validateDiffSize(diff: string, maxChars = 50000) {
  if (diff.length > maxChars) {
    throw new Error(
      `❌ Diff too large (${(diff.length / 1000).toFixed(1)} KB).\n` +
      `Allowed max ${maxChars} characters.\n` +
      `Tip: Stage fewer files or commit incrementally.`
    );
  }
}

export const commitChanges = (commitMessage: string, mode: string) => {
  try {

    if (mode === "all") {
      console.log("📦 Staging all files...");
      execSync("git add .", { stdio: "inherit" });
    }

    execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
      stdio: "inherit",
    });
    console.log("✅ Changes committed successfully.");
  } catch (err) {
    console.error("❌ Error committing changes:", err);
  }
}

