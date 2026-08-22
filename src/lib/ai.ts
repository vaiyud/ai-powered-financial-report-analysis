import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function askOllama(prompt: string) {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3.1:8b", prompt, stream: false }),
  });
  const data = await res.json();
  return data.response as string;
}

export async function askAI(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // confirm this is still current in AI Studio
      contents: prompt,
    });
    if (!response.text) throw new Error("Empty Gemini response");
    return response.text;
  } catch (err) {
    console.warn("Gemini failed, falling back to Ollama:", err);
    return askOllama(prompt); // requires `ollama serve` running locally
  }
}
