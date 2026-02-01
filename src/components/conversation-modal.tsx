import { motion, AnimatePresence } from "motion/react";
import { VoiceMessagePlayer } from "./voice-message-player";
import { NPCSprite } from "./assets/npc-sprite";

interface Message {
  type: 'text' | 'voice';
  content: string;
  callerName?: string;
  duration?: number;
}

interface Choices {
  trust: string;
  question: string;
  reject: string;
}

interface ConversationModalProps {
  isOpen: boolean;
  villagerName: string;
  villagerVariant: 'lily' | 'max' | 'zoe';
  villagerMood: 'neutral' | 'worried' | 'happy';
  message: Message;
  choices?: Choices;
  onTrust: () => void;
  onQuestion: () => void;
  onReject: () => void;
}

export function ConversationModal({
  isOpen,
  villagerName,
  villagerVariant,
  villagerMood,
  message,
  choices,
  onTrust,
  onQuestion,
  onReject,
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
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-2xl"
          >
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-[#3a3a3a] p-8">
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
                  💸 {choices?.trust || "SPEND NOW"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onQuestion}
                  className="flex-1 bg-[var(--color-info)] text-[#3a3a3a] py-4 px-6 rounded-2xl border-4 border-[#3a3a3a] font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  🤔 {choices?.question || "THINK FIRST"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onReject}
                  className="flex-1 bg-[var(--color-success)] text-[#3a3a3a] py-4 px-6 rounded-2xl border-4 border-[#3a3a3a] font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  💰 {choices?.reject || "SAVE SMART"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
