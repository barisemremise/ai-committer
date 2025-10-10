import fs from "fs";
import path from "path";

export const saveDiffToFile = (diff: string) => {
  const filePath = path.resolve(process.cwd(), "ai-diff.txt");
  fs.writeFileSync(filePath, diff, "utf8");
  console.log(`📄 Diff saved to ${filePath}`);
};

export const deleteDiffFile = () => {
  const filePath = path.resolve(process.cwd(), "ai-diff.txt");
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️  Deleted ${filePath}`);
  }
};
