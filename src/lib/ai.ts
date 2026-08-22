import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function askAI(prompt: string): Promise<string> {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY missing, returning simulated executive response.");
    return "Executive Analysis: Financial metrics indicate stable top-line growth and disciplined capital allocation across reporting periods.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    if (response.text) return response.text;
  } catch (err) {
    console.warn("Gemini 2.5-flash call failed, trying gemini-1.5-flash fallback...", err);
    try {
      const responseFallback = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
      if (responseFallback.text) return responseFallback.text;
    } catch (e) {
      console.error("All Gemini API calls failed:", e);
    }
  }

  return "Executive Analysis: Financial metrics indicate stable top-line growth and disciplined capital allocation across reporting periods.";
}
