import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildMetaPrompt, buildCodePrompt } from "./prompt.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const response = await model.generateContent(prompt);
  return response.response.text();
}

function parseCodeSnippets(text) {
  if (text.trim() === "NONE") return [];

  const snippets = [];
  const regex = /SNIPPET:\s*(.+?)\n([\s\S]*?)END/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    snippets.push({
      label: match[1].trim(),
      code: match[2].trim(),
    });
  }

  return snippets;
}

export async function extractContext(chunks) {
  const results = [];

  for (const chunk of chunks) {
    // call 1 — extract meta (no code)
    const metaText = await callGemini(buildMetaPrompt(chunk));
    const metaMatch = metaText.match(/\{[\s\S]*\}/);
    if (!metaMatch) throw new Error("No JSON found in meta response");
    const meta = JSON.parse(metaMatch[0]);

    // call 2 — extract code snippets separately
    const codeText = await callGemini(buildCodePrompt(chunk));
    const code_snippets = parseCodeSnippets(codeText);

    results.push({ ...meta, code_snippets });
  }

  return results[0];
}
