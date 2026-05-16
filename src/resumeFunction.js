import open from "open";
import chalk from "chalk";
import clipboard from "clipboardy";

export function resumeSession(ai, markdown, result) {
  const shortContext = `${result.resume_prompt}

Key decisions:
${result.decisions.map((d) => `- ${d}`).join("\n")}

Current state: ${result.current_state}`;

  const encoded = encodeURIComponent(shortContext);

  const urls = {
    chatgpt: `https://chatgpt.com/?q=${encoded}`,
    gemini: `https://gemini.google.com/app`,
    claude: `https://claude.ai/new`,
  };

  const url = urls[ai.toLowerCase()];
  if (!url) {
    console.log(chalk.red(`Unknown AI: ${ai}. Use claude, chatgpt, or gemini`));
    return;
  }

  // always copy full markdown to clipboard
  clipboard.writeSync(markdown);
  console.log(
    chalk.cyan(
      `Full handoff copied to clipboard — paste it after the tab opens`,
    ),
  );

  open(url);
  console.log(chalk.green(`Opening ${ai}...`));
}
