#!/usr/bin/env node
import { program } from "commander";

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
  .action((options) => {
    console.log("compress command hit", options);
  });

program.parse();
