export function buildPrompt(transcript) {
  return `You are a context extractor. Given a raw AI session transcript, extract ONLY what is needed to resume this session in a new AI conversation.

Return a JSON object with these exact keys:
{
  "goal": "one line - what are we building/solving",
  "current_state": "where we left off exactly",
  "decisions": ["decision + reason"],
  "code_snippets": [{"label": "", "code": ""}],
  "open_questions": ["..."],
  "dead_ends": ["what failed + why"],
  "resume_prompt": "A ready-to-paste prompt to start the next session"
}

Return ONLY valid JSON. No preamble, no markdown fences.

Transcript:
${transcript}`;
}
