// src/backend/PlayAudio.js

let currentAudio = null;
/** If set, a request/play is in progress; concurrent callers get this promise to avoid echo. */
let inProgressPromise = null;

export async function createAndSaveAudio(audioText, voiceId, speed = 1.0) {
  if (inProgressPromise) return inProgressPromise;

  inProgressPromise = (async () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    const response = await fetch('http://localhost:3001/api/generate-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: audioText,
        voiceId: voiceId,
        voice_settings: {
          speed: speed,
        }
      })
    });

    if (!response.ok) throw new Error("Server error");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.playbackRate = speed;
    currentAudio = audio;

    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      URL.revokeObjectURL(url);
    };
    await audio.play();
    return audio;
  })().finally(() => {
    inProgressPromise = null;
  });

  return inProgressPromise;
}