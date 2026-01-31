import { motion, AnimatePresence } from "motion/react";

interface RewardScreenProps {
  isOpen: boolean;
  badgeName: string;
  badgeEmoji: string;
  xpGained: number;
  decoration: string;
  onClose: () => void;
}

export function RewardScreen({
  isOpen,
  badgeName,
  badgeEmoji,
  xpGained,
  decoration,
  onClose,
}: RewardScreenProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Reward card */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', damping: 15 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-gradient-to-br from-[#b4e8d4] to-[#a8b9e8] rounded-3xl shadow-2xl border-4 border-[#3a3a3a] p-8 text-center relative overflow-hidden">
              {/* Confetti */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#ffd89b', '#f4a6a0', '#b4e8d4', '#a8b9e8'][i % 4],
                    left: `${Math.random() * 100}%`,
                    top: `-10%`,
                  }}
                  animate={{
                    y: [0, 500],
                    x: [0, (Math.random() - 0.5) * 200],
                    rotate: [0, 360],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* Badge */}
              <motion.div
                className="w-32 h-32 mx-auto mb-4 bg-white rounded-full border-4 border-[#3a3a3a] flex items-center justify-center text-7xl shadow-xl"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {badgeEmoji}
              </motion.div>

              <h2 className="text-3xl mb-2">🎉 Badge Unlocked! 🎉</h2>
              <p className="text-xl mb-6">{badgeName}</p>

              {/* XP Bar */}
              <div className="mb-6">
                <div className="text-sm mb-2">+{xpGained} XP</div>
                <div className="w-full h-4 bg-white/50 rounded-full overflow-hidden border-3 border-[#3a3a3a]">
                  <motion.div
                    className="h-full bg-[#ffd89b]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Decoration */}
              <div className="text-lg mb-6">
                New decoration unlocked: {decoration}
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-white text-[#3a3a3a] py-3 px-8 rounded-2xl border-4 border-[#3a3a3a] font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
