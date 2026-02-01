import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import introAudio from "../backend/intro-story.mp3"

interface NarratorIntroProps {
  isPlaying: boolean;
  onComplete: () => void;
}

export function NarratorIntro({ isPlaying, onComplete }: NarratorIntroProps) {
  const [audio] = useState(() => new Audio(introAudio));
  const [fadeOut, setFadeOut] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}