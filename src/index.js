#!/usr/bin/env node
import { program } from "commander";
import {
  loadTranscript,
  chunkTranscript,
  cleanTranscript,
} from "./preprocessor.js";
import { extractContext } from "./extractor.js";

program
  .name("cb")
  .description(
    "Compress any AI session transcript into a structured handoff file",
  )
  .version("1.0.0");

program
  .command("compress")
  .description("Compress a transcript into a handoff markdown file")
  .option("--file <path>", "Path to transcript file")
  .option("--paste", "Read transcript from clipboard")
  .option("--out <dir>", "Output directory", "./output")
  .action(async (options) => {
    const raw = loadTranscript(options);
    const cleaned = cleanTranscript(raw);
    const chunks = chunkTranscript(cleaned);
    console.log(
      `Loaded transcript — ${cleaned.length} chars, ${chunks.length} chunk(s)`,
    );
    console.log("Extracting context...");

    const result = await extractContext(chunks);
    console.log("\nExtracted:");
    console.log(JSON.stringify(result, null, 2));
  });

program.parse();
