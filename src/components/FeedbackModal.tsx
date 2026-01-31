import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { useEffect } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  feedback: string;
  scamSignals?: string[];
  xpEarned?: number;
  onNext?: () => void;
  onRetry?: () => void;
}

export function FeedbackModal({
  isOpen,
  isCorrect,
  feedback,
  scamSignals = [],
  xpEarned = 0,
  onNext,
  onRetry,
}: FeedbackModalProps) {
  useEffect(() => {
    if (isOpen && !isCorrect) {
      // Trigger shake animation on wrong answer
      document.body.style.animation = 'shake 0.4s';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 400);
    }
  }, [isOpen, isCorrect]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onNext ? onNext() : onRetry?.();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`max-w-lg w-full p-8 rounded-3xl shadow-2xl ${
              isCorrect
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-300'
                : 'bg-gradient-to-br from-red-50 to-orange-50 border-4 border-red-300'
            }`}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex justify-center mb-6"
            >
              {isCorrect ? (
                <div className="relative">
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-green-500 opacity-30" />
                  </motion.div>
                </div>
              ) : (
                <XCircle className="w-20 h-20 text-red-500" />
              )}
            </motion.div>

            {/* Feedback */}
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              {feedback}
            </h2>

            {/* XP Badge */}
            {isCorrect && xpEarned > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="flex justify-center mb-6"
              >
                <div className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg">
                  <span className="text-xl font-bold text-white">
                    +{xpEarned} XP
                  </span>
                </div>
              </motion.div>
            )}

            {/* Scam Signals */}
            {scamSignals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 p-4 bg-white/70 rounded-xl"
              >
                <h3 className="font-semibold text-gray-800 mb-3">
                  🚩 Scam Signals to Watch:
                </h3>
                <ul className="space-y-2">
                  {scamSignals.map((signal, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-red-500 mt-0.5">❗</span>
                      <span>{signal}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Confetti effect for correct answers */}
            {isCorrect && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{
                      top: '50%',
                      left: '50%',
                      scale: 0,
                    }}
                    animate={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      delay: i * 0.05,
                      duration: 1,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {isCorrect ? (
                <ActionButton
                  onClick={onNext || (() => {})}
                  variant="primary"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Next Scenario
                </ActionButton>
              ) : (
                <ActionButton
                  onClick={onRetry || (() => {})}
                  variant="secondary"
                  icon={<RotateCcw className="w-5 h-5" />}
                >
                  Try Again
                </ActionButton>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
