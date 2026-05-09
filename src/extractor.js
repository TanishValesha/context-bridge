import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "./prompt.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractContext(chunks) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const results = [];

  for (const chunk of chunks) {
    const prompt = buildPrompt(chunk);
    const response = await model.generateContent(prompt);
    const text = response.response.text();

    // Remove markdown code fences and trim whitespace
    const cleaned = text.replace(/```json|```/g, "").trim();

    try {
      results.push(JSON.parse(cleaned));
    } catch {
      throw new Error("Gemini returned malformed JSON:\n" + text);
    }
  }

  return results[0];
}
