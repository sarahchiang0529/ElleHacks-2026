// src/backend/PlayAudio.js

let currentAudio = null;

export async function createAndSaveAudio(audioText, voiceId) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  const response = await fetch('http://localhost:3001/api/generate-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: audioText, voiceId: voiceId }),
  });

  if (!response.ok) throw new Error("Server error");

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;

  audio.onended = () => {
    if (currentAudio === audio) currentAudio = null;
    URL.revokeObjectURL(url);
  };
  await audio.play();
  return audio;
}