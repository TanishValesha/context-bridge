import "dotenv/config";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  buildMetaPrompt,
  buildCodePrompt,
  buildMergePrompt,
} from "./prompt.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callGroq(prompt) {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });
  return response.choices[0].message.content;
}

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
  // process all chunks in parallel
  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const [metaText, codeText] = await Promise.all([
        callGroq(buildMetaPrompt(chunk)),
        callGroq(buildCodePrompt(chunk)),
      ]);

      const metaMatch = metaText.match(/\{[\s\S]*\}/);
      if (!metaMatch) throw new Error("No JSON found in meta response");
      const meta = JSON.parse(metaMatch[0]);

      const code_snippets = parseCodeSnippets(codeText);

      return { ...meta, code_snippets };
    }),
  );

  // if only one chunk, return directly
  if (results.length === 1) return results[0];

  // merge all chunks into one
  const mergeText = await callGroq(buildMergePrompt(results));
  const mergeMatch = mergeText.match(/\{[\s\S]*\}/);
  if (!mergeMatch) throw new Error("No JSON found in merge response");
  const merged = JSON.parse(mergeMatch[0]);

  const allSnippets = results.flatMap((r) => r.code_snippets);

  return { ...merged, code_snippets: allSnippets };
}
