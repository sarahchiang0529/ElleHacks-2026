import express from "express";
import cors from "cors";
import { ElevenLabsClient } from "elevenlabs";
import "dotenv/config";
import { Readable } from 'stream';
import { generateNarration } from "./GeminiStoryScript.js";

const app = express();
app.use(cors());
app.use(express.json());

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

app.post("/api/generate-audio", async (req, res) => {
  const { text, voiceId } = req.body;
  try {
    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text: text,
      modelId: "eleven_turbo_v2_5",
      outputFormat: "mp3_44100_128",
    });

    // Node-friendly way to handle the stream and send it to browser
    res.setHeader("Content-Type", "audio/mpeg");
    Readable.fromWeb(audioStream).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating audio");
  }
});

app.post("/api/generate-narration", async (req, res) => {
  try {
    await generateNarration();
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error?.message || error) });
  }
});

app.listen(3001, () => console.log("Server active on port 3001"));
