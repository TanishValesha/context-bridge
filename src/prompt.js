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
