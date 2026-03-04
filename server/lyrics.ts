import OpenAI from "openai";
import { storage } from "./storage";
import { DEITIES, OCCASIONS, RELATIONS, LANGUAGES, type Song } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

function buildPrompt(song: Song): string {
  const deity = DEITIES.find((d) => d.id === song.deity);
  const occasion = OCCASIONS.find((o) => o.id === song.occasion);
  const relation = RELATIONS.find((r) => r.id === song.recipientRelation);
  const lang = LANGUAGES.find((l) => l.id === song.language);

  return `You are a devotional song writer specializing in Indian bhajans. 

Write a bhajan with these specifications:
- Deity: ${deity?.labelEn || song.deity}
- Language/Style: ${lang?.labelEn || "Hindi (Classical)"}
- Occasion: ${occasion?.labelEn || song.occasion}
- Recipient name: ${song.recipientName}${song.recipientPronunciation ? ` (pronunciation: ${song.recipientPronunciation})` : ""}
- Recipient relation: ${relation?.labelEn || song.recipientRelation}
- Blessing intention: ${song.userSankalp}

Structure:
1. [पल्लवी / PALLAVI] - Main refrain, 2 lines, mentions the recipient's name naturally
2. [अंतरा १ / ANTRA 1] - First verse, 4 lines, about the occasion
3. [पल्लवी / PALLAVI] - Repeat
4. [अंतरा २ / ANTRA 2] - Second verse, 4 lines, incorporating the user's specific blessing
5. [पल्लवी / PALLAVI - समापन] - Closing with slight variation

Guidelines:
- Use simple, devotional Hindi appropriate to the tradition and style
- Include the recipient's name naturally in the pallavi
- Reference the specific deity appropriately with their common epithets
- Keep it emotionally warm and blessing-focused
- Total length: suitable for 2-3 minute song
- Write in Devanagari script
- Each section should be clearly labeled
- Make the bhajan feel personal and heartfelt

Output the bhajan directly without any preamble or explanation.`;
}

export async function generateLyrics(song: Song): Promise<void> {
  try {
    await storage.updateSongStatus(song.id, "generating");

    const prompt = buildPrompt(song);

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert Indian devotional song (bhajan) writer. You write beautiful, emotionally resonant bhajans in Hindi/Devanagari script that feel authentic and personal. You always follow the requested structure precisely.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: 2048,
    });

    const lyrics = response.choices[0]?.message?.content;

    if (!lyrics) {
      throw new Error("No lyrics generated");
    }

    await storage.updateSongLyrics(song.id, lyrics.trim());
  } catch (error) {
    console.error("Error generating lyrics:", error);
    await storage.updateSongStatus(song.id, "failed");
  }
}
