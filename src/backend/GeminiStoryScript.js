import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { createAudio, saveAudio } from "./GenerateAudio.js";
import { INTRO_PROMPT, NARRATOR_VOICE, MAX, NARRATOR_SPEED, MAX_SPEED } from "./Constants.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? import.meta.env?.GEMINI_API_KEY });

export async function generateNarration() {
  const story = await generateStory(INTRO_PROMPT);
  const dialogue = parseDialogue(story);
  const audioChunks = [];

  for(const line of dialogue) {
    const [character, text] = line;
    const voice = character.toLowerCase() === "narrator" ? NARRATOR_VOICE : MAX;
    
    console.log(text);
    audioChunks.push(await createAudio(text, voice));
  }
  await saveAudio(audioChunks, "intro-story");
}

export async function speak() {
  const story = await generateStory(INTRO_PROMPT);
  const dialogue = parseDialogue(story);
  const audioChunks = [];

  for(const line of dialogue) {
    const [character, text] = line;
    const voice = character.toLowerCase() === "narrator" ? NARRATOR_VOICE : MAX;
    const speed = character.toLowerCase() === "narrator" ? NARRATOR_SPEED : MAX_SPEED;
    
    console.log(text);
    createAndSaveAudio(text, voice, speed);
  }
  await saveAudio(audioChunks, "intro-story");
}

async function generateStory(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
//   console.log(response.text);
  return response.text;
}

function parseDialogue(dialogueText) {
  // Split by newlines first
  const lines = dialogueText.split(/\n+/).filter((line) => line.trim() !== "");

  // Map each line to [character, line]
  const tuples = lines.map((line) => {
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const [, character, text] = match;
      return [character.trim(), text.trim()];
    } else {
      // If line doesn't match, return it as narrator with the full text
      return ["Narrator", line.trim()];
    }
  });
  return tuples;
}