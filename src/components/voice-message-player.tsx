import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState, useEffect } from "react";

interface VoiceMessagePlayerProps {
  callerName: string;
  duration: number;
}

export function VoiceMessagePlayer({ callerName, duration }: VoiceMessagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const togglePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-[#a8b9e8] rounded-2xl p-4 border-3 border-[#3a3a3a]">
      <div className="flex items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-white border-3 border-[#3a3a3a] flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" fill="currentColor" />
          ) : (
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          )}
        </button>

        <div className="flex-1">
          <div className="text-sm mb-2">📞 {callerName}</div>
          {/* Animated sound wave */}
          <div className="flex items-center gap-1 h-8">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full"
                animate={{
                  height: isPlaying
                    ? [
                        Math.random() * 20 + 10,
                        Math.random() * 30 + 5,
                        Math.random() * 20 + 10,
                      ]
                    : 8,
                }}
                transition={{
                  duration: 0.3,
                  repeat: isPlaying ? Infinity : 0,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        </div>

        {/* Time display */}
        <div className="text-sm">
          {Math.floor(currentTime)}s / {duration}s
        </div>
      </div>
    </div>
  );
}
