import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export function buildMarkdown(data) {
  const timestamp = new Date().toISOString();

  const snippets =
    data.code_snippets
      ?.map(
        (s) => `
### ${s.label}
\`\`\`
${s.code}
\`\`\`
`,
      )
      .join("\n") || "_None_";

  const decisions = data.decisions?.map((d) => `- ${d}`).join("\n") || "_None_";
  const questions =
    data.open_questions?.map((q) => `- ${q}`).join("\n") || "_None_";
  const deadEnds = data.dead_ends?.map((d) => `- ${d}`).join("\n") || "_None_";

  return `# Context Bridge — Session Handoff
Generated: ${timestamp}

## Goal
${data.goal}

## Current State
${data.current_state}

## Decisions Made
${decisions}

## Code Snippets
${snippets}

## Open Questions
${questions}

## Dead Ends
${deadEnds}

---
## Resume Prompt (paste this first)
${data.resume_prompt}
`;
}

export function saveMarkdown(content, outDir = "./output") {
  mkdirSync(outDir, { recursive: true });

  const filename = `handoff-${Date.now()}.md`;
  const filepath = join(outDir, filename);

  writeFileSync(filepath, content, "utf-8");
  return filepath;
}
