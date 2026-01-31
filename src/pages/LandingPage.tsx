import { motion } from 'motion/react';
import { Shield, Info } from 'lucide-react';
import { ActionButton } from '../components/ActionButton';
import { useState } from 'react';
import { useSound } from '../hooks/useSound';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [showInfo, setShowInfo] = useState(false);
  const { playSound } = useSound();

  const handleStart = () => {
    playSound('transition');
    onStart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Animated Shield Icon */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <Shield className="w-24 h-24 text-purple-600" strokeWidth={1.5} />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-purple-400 rounded-full blur-xl"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold text-gray-800 mb-4"
        >
          🛡️ Vault Guardian
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-600 italic mb-12"
        >
          Train your financial instincts. Safely.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ActionButton onClick={handleStart} variant="primary">
              <span className="text-xl">Start Training</span>
            </ActionButton>
          </motion.div>
        </motion.div>

        {/* Secondary Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => setShowInfo(true)}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <Info className="w-5 h-5" />
            <span>I'm a Parent / Teacher</span>
          </button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { emoji: '🎮', text: 'Learn by Playing' },
            { emoji: '🔒', text: 'Safe Practice' },
            { emoji: '🏆', text: 'Earn Badges' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-md"
            >
              <div className="text-4xl mb-2">{feature.emoji}</div>
              <div className="text-gray-700 font-medium">{feature.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Info Modal */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowInfo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              For Parents & Teachers 👨‍👩‍👧‍👦
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Vault Guardian</strong> teaches kids to recognize common scams through
                interactive scenarios based on real-world tactics.
              </p>
              <p>
                Each scenario helps children develop critical thinking skills and learn to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Pause before acting on urgent requests</li>
                <li>Verify identity before sharing information</li>
                <li>Recognize emotional manipulation</li>
                <li>Question suspicious requests</li>
              </ul>
              <p className="text-sm italic">
                All scenarios are educational and completely safe. No real money or information is involved.
              </p>
            </div>
            <div className="mt-6">
              <ActionButton onClick={() => setShowInfo(false)} variant="primary">
                Got it!
              </ActionButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
