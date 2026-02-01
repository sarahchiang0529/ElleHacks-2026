import { motion, AnimatePresence } from "motion/react";
import { VoiceMessagePlayer } from "./voice-message-player";
import { NPCSprite } from "./assets/npc-sprite";

interface Message {
  type: 'text' | 'voice';
  content: string;
  callerName?: string;
  duration?: number;
}

type ResultState = "correct" | "wrong" | null;

interface ConversationModalProps {
  isOpen: boolean;
  villagerName: string;
  villagerVariant: 'lily' | 'max' | 'zoe';
  villagerMood: 'neutral' | 'worried' | 'happy';
  message: Message;
  onTrust: () => void;
  onQuestion: () => void;
  onReject: () => void;
  effectiveResult?: ResultState;
}

export function ConversationModal({
  isOpen,
  villagerName,
  villagerVariant,
  villagerMood,
  message,
  onTrust,
  onQuestion,
  onReject,
  effectiveResult = null,
}: ConversationModalProps) {
  const getMoodColor = () => {
    switch (villagerMood) {
      case 'worried':
        return '#f4d09a';
      case 'happy':
        return '#b4e8d4';
      default:
        return '#a8b9e8';
    }
  };

  const isWrong = effectiveResult === "wrong";
  const isCorrect = effectiveResult === "correct";
  const resultClass =
    effectiveResult === "correct"
      ? "ring-4 ring-green-400 shadow-[0_0_40px_rgba(34,197,94,0.35)]"
      : effectiveResult === "wrong"
      ? "ring-4 ring-red-400 shadow-[0_0_40px_rgba(239,68,68,0.35)]"
      : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0, x: isWrong ? [0, -14, 14, -10, 10, -6, 6, 0] : 0,}}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-2xl"
          >
          <motion.div
            animate={isCorrect ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className={`relative bg-white rounded-3xl shadow-2xl border-4 border-[#3a3a3a] p-8 ${resultClass}`}
          >
            {isCorrect && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Sparkles */}
            <motion.div
              className="absolute top-6 right-8 text-2xl"
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], rotate: [0, 25, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.7 }}
            >
              ✨
            </motion.div>

            <motion.div
              className="absolute top-10 left-10 text-xl"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: [8, -6, -14], opacity: [0, 1, 0] }}
              transition={{ duration: 0.75 }}
            >
              ✨
            </motion.div>

            <motion.div
              className="absolute bottom-8 right-14 text-xl"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: [10, -4, -12], opacity: [0, 1, 0] }}
              transition={{ duration: 0.7 }}
            >
              ✨
            </motion.div>
          </motion.div>
        )}

              {/* Header with villager */}
              <div className="flex items-center gap-4 mb-6">
                {/* Villager portrait */}
                <motion.div
                  className="rounded-2xl border-4 border-[#3a3a3a] flex items-center justify-center p-4"
                  style={{ backgroundColor: getMoodColor() }}
                  animate={{ rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="scale-150">
                    <NPCSprite variant={villagerVariant} mood={villagerMood} />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-2xl">{villagerName}</h2>
                  <p className="text-sm text-[var(--color-text-light)]">Villager</p>
                </div>
              </div>

              {/* Message area */}
              <div className="mb-8">
                {message.type === 'text' ? (
                  <div className="bg-[#f0f0f0] rounded-2xl p-6 border-3 border-[#3a3a3a]">
                    <p className="text-lg leading-relaxed">{message.content}</p>
                  </div>
                ) : (
                  <VoiceMessagePlayer
                    callerName={message.callerName || 'Unknown Caller'}
                    duration={message.duration || 10}
                  />
                )}
              </div>

              {/* Action buttons - ALWAYS IN SAME ORDER */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onTrust}
                  className="flex-1 bg-[var(--color-warning)] text-[#3a3a3a] py-4 px-6 rounded-2xl border-4 border-[#3a3a3a] font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  💸 SPEND NOW
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onQuestion}
                  className="flex-1 bg-[var(--color-info)] text-[#3a3a3a] py-4 px-6 rounded-2xl border-4 border-[#3a3a3a] font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  🤔 THINK FIRST
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onReject}
                  className="flex-1 bg-[var(--color-success)] text-[#3a3a3a] py-4 px-6 rounded-2xl border-4 border-[#3a3a3a] font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  💰 SAVE SMART
                </motion.button>
              </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
