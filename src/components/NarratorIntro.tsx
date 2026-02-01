import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import introAudio from "../backend/intro-story.mp3"

const API_BASE = "http://localhost:3001";

interface NarratorIntroProps {
  isPlaying: boolean;
  onComplete: () => void;
}

export function NarratorIntro({ isPlaying, onComplete }: NarratorIntroProps) {
  const [audio] = useState(() => new Audio(introAudio));
  const [fadeOut, setFadeOut] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const runGenerateNarration = async () => {
    setGenerateLoading(true);
    setGenerateError(null);
    try {
      const res = await fetch(`${API_BASE}/api/generate-narration`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : String(e));
    } finally {
      setGenerateLoading(false);
    }
  };

  const startAudio = () => {
    console.log("🎙️ Starting audio manually...");
    setAudioStarted(true);
    setShowStartButton(false);
    
    audio.play()
      .then(() => {
        console.log("✅ Audio playing successfully");
      })
      .catch((error) => {
        console.error("❌ Failed to play audio:", error);
        // Still unlock game after 2 seconds if audio fails
        setTimeout(() => {
          console.log("⏭️ Unlocking game despite audio failure");
          setFadeOut(true);
          setTimeout(onComplete, 1500);
        }, 2000);
      });
  };

  useEffect(() => {
    if (!isPlaying) return;

    console.log("🎙️ Narrator intro starting...");

    // Try autoplay first
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("✅ Audio autoplaying successfully");
          setAudioStarted(true);
        })
        .catch((error) => {
          console.warn("⚠️ Auto-play was prevented:", error);
          // Show manual start button
          setShowStartButton(true);
        });
    }

    // When audio ends, trigger fade out
    const handleEnded = () => {
      console.log("🎵 Audio finished");
      setFadeOut(true);
      setTimeout(() => {
        console.log("🔓 Game unlocked");
        onComplete();
      }, 1500); // Wait for 1.5s fade animation to complete
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isPlaying, audio, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isPlaying && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgb(49, 46, 129) 0%, rgb(88, 28, 135) 50%, rgb(159, 18, 57) 100%)',
            backgroundColor: '#581c87',
          }}
        >
          {/* Solid background layer - ensures gradient shows */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgb(49, 46, 129) 0%, rgb(88, 28, 135) 50%, rgb(159, 18, 57) 100%)',
            }}
          />

          {/* Animated background stars */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center px-8">
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-5xl font-bold text-white mb-4 tracking-wide"
              style={{ 
                textShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 50px rgba(139,92,246,0.6)',
                color: '#ffffff'
              }}
            >
              A Story Begins...
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl text-white"
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.6)',
                color: '#ffffff'
              }}
            >
              Listen carefully, young guardian
            </motion.p>

            {/* Manual start button if autoplay fails */}
            {showStartButton && (
              <motion.button
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                onClick={startAudio}
                className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl border-4 border-white font-bold text-xl shadow-2xl hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Game
              </motion.button>
            )}

            {/* Pulsing audio indicator - only show when audio is playing */}
            {audioStarted && (
              <motion.div
                className="mt-12 flex justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full"
                    animate={{
                      height: [16, 32, 16],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Generate narration button (runs backend generateNarration) */}
          <div className="absolute bottom-8 left-8 flex flex-col gap-2 items-start max-w-xs">
            {generateError && (
              <p className="text-red-200 text-sm">{generateError}</p>
            )}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={runGenerateNarration}
              disabled={generateLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl border-2 border-white font-semibold text-lg shadow-xl hover:scale-105 transition-transform disabled:opacity-60 disabled:pointer-events-none"
              whileHover={{ scale: generateLoading ? 1 : 1.05 }}
              whileTap={{ scale: generateLoading ? 1 : 0.95 }}
            >
              {generateLoading ? "Generating…" : "Generate intro narration"}
            </motion.button>
          </div>

          {/* Skip button in bottom right */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={() => {
              setFadeOut(true);
              setTimeout(onComplete, 1500);
            }}
            className="absolute bottom-8 right-8 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl border-2 border-white font-semibold text-lg shadow-xl hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip Intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}