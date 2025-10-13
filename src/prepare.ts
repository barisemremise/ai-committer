import { exec } from "child_process";
import { chmod } from "fs/promises";

function runCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

async function main() {
  try {
    // 1️⃣ TypeScript derlemesi
    await runCommand("tsc -p tsconfig.json");

    // 2️⃣ dist/main.js'i executable yap (mode: 0o755)
    await chmod("dist/main.js", 0o755);
    console.log("✅ dist/main.js is now executable");

  } catch (err) {
    console.error("❌ Prepare script failed:", err);
    process.exit(1);
  }
}

main();
