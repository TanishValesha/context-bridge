import { readdirSync, statSync } from "fs";

export function getHistory(outDir) {
  let files;
  try {
    files = readdirSync(outDir).filter((f) => f.endsWith(".md"));
  } catch {
    console.log("No handoffs yet. Run cb compress first.");
    process.exit(0);
  }

  if (files.length === 0) {
    console.log("No handoffs yet. Run cb compress first.");
    process.exit(0);
  }

  return files;
}
