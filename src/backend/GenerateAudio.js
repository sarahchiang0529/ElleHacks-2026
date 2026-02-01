import { ElevenLabsClient } from 'elevenlabs';
import { writeFileSync } from 'fs';
import 'dotenv/config';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function createAudio(audioText, voiceId) {
  const response = await elevenlabs.textToSpeech.convert(voiceId, {
    text: audioText,
    modelId: 'eleven_turbo_v2_5',
    outputFormat: 'mp3_44100_128',
  });
  
  return await streamToBuffer(response);
}

export async function saveAudio(buffers, audioFileName) {
  const audioBuffer = Buffer.concat(buffers);
  writeFileSync(`${audioFileName}.mp3`, audioBuffer);
  console.log("Success!");
}

export async function streamToBuffer(stream) {
  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  // return chunks;
  return Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));
}
