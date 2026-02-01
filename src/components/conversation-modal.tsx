import { motion, AnimatePresence } from "framer-motion"
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
  villagerVariant: 'bob' | 'sally' | 'lily' | 'max' | 'zoe';
  villagerMood: 'neutral' | 'worried' | 'happy';
  message: Message;
  result?: ResultState;
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
  onTrust,
  onQuestion,
  onReject,
  result = null,
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

  const isCorrect = result === "correct";
  const isWrong = result === "wrong";

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

          {/* Flash overlay for feedback */}
          {isCorrect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.3, 0] }}
              transition={{ duration: 1 }}
              className="fixed inset-0 bg-gradient-to-br from-green-400 to-emerald-400 pointer-events-none z-45"
            />
          )}
          {isWrong && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-red-500 pointer-events-none z-45"
            />
          )}

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ 
              scale: isCorrect ? [1, 1.15, 1.05, 1] : 1, 
              opacity: 1, 
              y: 0,
              x: isWrong ? [0, -10, 10, -8, 8, -5, 5, 0] : 0,
              rotate: isCorrect ? [0, -2, 2, 0] : 0,
            }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ 
              type: 'spring', 
              damping: 20,
              x: { duration: 0.5 },
              scale: { duration: 0.8 },
              rotate: { duration: 0.6 }
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-2xl"
          >
            <div 
              className={`bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300 ${
                isCorrect 
                  ? 'border-4 border-green-400' 
                  : isWrong 
                  ? 'border-4 border-red-400' 
                  : 'border-4 border-[#3a3a3a]'
              }`}
            >
              {/* MEGA Sparkles & Confetti for correct answer */}
              {isCorrect && (
                <>
                  {/* Radial pulse waves */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[0, 1, 2].map((wave) => (
                      <motion.div
                        key={`wave-${wave}`}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-green-400 rounded-full"
                        initial={{ width: 0, height: 0, opacity: 0.8 }}
                        animate={{ 
                          width: 600, 
                          height: 600, 
                          opacity: 0 
                        }}
                        transition={{
                          delay: wave * 0.15,
                          duration: 1,
                          ease: 'easeOut'
                        }}
                      />
                    ))}
                  </div>

                  {/* Sparkles explosion */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[...Array(60)].map((_, i) => (
                      <motion.div
                        key={`sparkle-${i}`}
                        className="absolute"
                        initial={{ 
                          top: '50%', 
                          left: '50%',
                          scale: 0,
                          opacity: 1,
                          rotate: 0
                        }}
                        animate={{
                          top: `${Math.random() * 120 - 10}%`,
                          left: `${Math.random() * 120 - 10}%`,
                          scale: [0, 1.5, 0],
                          opacity: [1, 1, 0],
                          rotate: [0, 360]
                        }}
                        transition={{
                          delay: i * 0.015,
                          duration: 1,
                          ease: 'easeOut'
                        }}
                      >
                        <span className="text-3xl">
                          {['✨', '⭐', '💫', '🌟', '⚡', '💚', '🎉'][i % 7]}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Confetti burst */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[...Array(50)].map((_, i) => {
                      const colors = ['bg-green-400', 'bg-yellow-400', 'bg-blue-400', 'bg-pink-400', 'bg-purple-400', 'bg-orange-400'];
                      return (
                        <motion.div
                          key={`confetti-${i}`}
                          className={`absolute w-3 h-3 ${colors[i % colors.length]} rounded-sm`}
                          initial={{ 
                            top: '50%', 
                            left: '50%',
                            scale: 0,
                            rotate: 0
                          }}
                          animate={{
                            top: `${Math.random() * 120 - 10}%`,
                            left: `${Math.random() * 120 - 10}%`,
                            scale: [0, 1, 0.8, 0],
                            rotate: [0, Math.random() * 720 - 360]
                          }}
                          transition={{
                            delay: i * 0.01,
                            duration: 1.2,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                        />
                      );
                    })}
                  </div>
                </>
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}