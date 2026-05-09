import { readFileSync } from "fs";
import clipboard from "clipboardy";

export function loadTranscript(options) {
  if (options.file) {
    return readFileSync(options.file, "utf-8");
  }

  if (options.paste) {
    return clipboard.readSync();
  }

  throw new Error("Provide --file <path> or --paste");
}

export function cleanTranscript(raw) {
  return raw
    .replace(/\r\n/g, "\n") // normalize line endings
    .replace(/[ \t]+$/gm, "") // remove trailing spaces
    .replace(/\n{3,}/g, "\n\n") // collapse 3+ blank lines into 2
    .trim();
}

export function chunkTranscript(text, maxChars = 12000) {
  if (text.length <= maxChars) return [text];

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + maxChars));
    start += maxChars;
  }

  return chunks;
}
