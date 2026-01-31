import { ElevenLabsClient } from 'elevenlabs';
import { writeFileSync } from 'fs';
import 'dotenv/config';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function saveAudio() {
  console.log("Fetching audio from ElevenLabs...");

  const response = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
    text: 'The first move is what sets everything in motion.',
    modelId: 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128',
    voice_id: 'G17SuINrv2H9FC6nvetn'
  });

  const chunks = [];
  const reader = response.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const audioBuffer = Buffer.concat(chunks);

  const fileName = 'manual_audio.mp3';
  writeFileSync(fileName, audioBuffer);

  console.log(`Success!`);
}

saveAudio().catch(console.error);