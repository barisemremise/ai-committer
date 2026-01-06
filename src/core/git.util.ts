import { DiffMode } from "@/types";
import { execSync } from "child_process";

type GitPostJobParams = {
  isAutoPush: boolean;
  commitMessage: string;
  diffMode: DiffMode;
  execOptions: GitCommitExecParams;
};

type GitCommitExecParams = {
  stdio: "pipe" | "inherit" | "ignore";
  cwd?: string;
};

type CommitChangesParams = {
  commitMessage: string;
  diffMode: DiffMode;
  execOptions: GitCommitExecParams;
};

export const getGitDiff = (mode: DiffMode, repoPath?: string): string => {
  try {
    let command = "";

    switch (mode) {
      case "staged":
        command = "git diff --cached ':(exclude)yarn.lock'";
        break;
      case "all":
        command = "git diff ':(exclude)yarn.lock'";
        break;
    }

    const diff = execSync(command, {
      cwd: repoPath ?? process.cwd(),
      encoding: "utf8",
    });

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

function commitChanges({
  commitMessage,
  diffMode,
  execOptions,
}: CommitChangesParams): void {
  try {
    if (diffMode === "all") {
      console.log("📦 Staging all files...");
      execSync("git add .", execOptions);
    }

    execSync(
      `git commit -m "${commitMessage.replace(/"/g, '\\"')}"`,
      execOptions
    );
    console.log("✅ Changes committed successfully.");
  } catch (err) {
    console.error("❌ Error committing changes:", err);
  }
}

function pushChanges(execOptions: GitCommitExecParams): void {
  try {
    console.log("🚀 Pushing changes to remote...");

    execSync("git push", execOptions);
    console.log("✅ Changes pushed successfully.");
  } catch (err) {
    console.error("❌ Error pushing changes:", err);
  }
}

export function gitPostJob({
  isAutoPush,
  commitMessage,
  diffMode,
  execOptions,
}: GitPostJobParams): void {
  console.log("🤖 Auto committing enabled. Committing changes...");
  commitChanges({ commitMessage, diffMode, execOptions });

  if (isAutoPush) {
    console.log("🤖 Auto pushing enabled. Pushing changes...");
    pushChanges(execOptions);
  }
}
