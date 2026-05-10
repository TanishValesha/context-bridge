export function buildMetaPrompt(transcript) {
  return `You are a context extractor. Given a raw AI session transcript, extract everything EXCEPT code snippets.

Return ONLY this JSON with no markdown fences:
{
  "goal": "one line - what are we building/solving",
  "current_state": "where we left off exactly",
  "decisions": ["decision + reason"],
  "open_questions": ["..."],
  "dead_ends": ["what failed + why"],
  "resume_prompt": "A ready-to-paste prompt to start the next session"
}

Transcript:
${transcript}`;
}

export function buildCodePrompt(transcript) {
  return `You are a code extractor. Given a raw AI session transcript, extract ONLY the final working code snippets.

Return them in this exact plain text format and nothing else:

SNIPPET: <label describing what this code does and why>
<actual code here>
END

SNIPPET: <label>
<actual code here>
END

If there are no code snippets, return exactly: NONE

Transcript:
${transcript}`;
}

export function buildMergePrompt(results) {
  return `You are a context merger. You have multiple JSON summaries extracted from different parts of the same AI session transcript. Merge them into one coherent summary.

Rules:
- Combine all decisions, open_questions, dead_ends into single arrays without duplicates
- Write a single coherent goal and current_state from all parts
- The current_state should reflect the LATEST state (last chunk is most recent)
- The resume_prompt should cover the full session
- Return ONLY this JSON with no markdown fences:

{
  "goal": "one line - what are we building/solving",
  "current_state": "where we left off exactly",
  "decisions": ["decision + reason"],
  "open_questions": ["..."],
  "dead_ends": ["what failed + why"],
  "resume_prompt": "A ready-to-paste prompt to start the next session"
}

Summaries:
${JSON.stringify(results, null, 2)}`;
}
