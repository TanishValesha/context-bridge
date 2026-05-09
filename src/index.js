#!/usr/bin/env node
import { program } from "commander";
import {
  loadTranscript,
  chunkTranscript,
  cleanTranscript,
} from "./preprocessor.js";
import { extractContext } from "./extractor.js";
import { buildMarkdown } from "./formatter.js";
import { saveMarkdown } from "./formatter.js";
import clipboard from "clipboardy";
import { getHistory } from "./history.js";
import chalk from "chalk";
import { statSync } from "fs";
import { join } from "path";

let outDir = "./output";

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
      chalk.yellow(
        `Loaded transcript — ${cleaned.length} chars, ${chunks.length} chunk(s)`,
      ),
    );
    console.log(chalk.yellow("Extracting context..."));

    const result = await extractContext(chunks);
    const markdown = buildMarkdown(result);
    const filepath = saveMarkdown(markdown, options.out);

    clipboard.writeSync(markdown);

    console.log(chalk.green(`\nHandoff saved to: ${filepath}`));
    console.log(chalk.green("Handoff copied to clipboard"));
  });

program
  .command("history")
  .description("List past compressions")
  .action(() => {
    const files = getHistory(outDir);
    console.log(chalk.green(`\nPast handoffs (${files.length}):\n`));

    files
      .map((f) => ({
        name: f,
        time: statSync(join(outDir, f)).mtime,
      }))
      .sort((a, b) => b.time - a.time)
      .forEach((f, i) => {
        console.log(`${i + 1}. ${f.name}`);
        console.log(`   ${f.time.toLocaleString()}\n`);
      });
  });

program.parse();
