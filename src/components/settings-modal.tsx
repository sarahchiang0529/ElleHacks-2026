import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  movementControl: 'arrows' | 'wasd';
  onMovementControlChange: (control: 'arrows' | 'wasd') => void;
  reducedMotion: boolean;
  onReducedMotionToggle: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  soundEnabled,
  onSoundToggle,
  movementControl,
  onMovementControlChange,
  reducedMotion,
  onReducedMotionToggle,
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-[#3a3a3a] p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Settings className="w-8 h-8" />
                  <h2 className="text-2xl">Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-200 border-3 border-[#3a3a3a] flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Movement Controls */}
              <div className="mb-6">
                <h3 className="text-lg mb-3">Movement Controls</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => onMovementControlChange('arrows')}
                    className={`flex-1 py-3 px-4 rounded-xl border-3 border-[#3a3a3a] font-bold transition-colors ${
                      movementControl === 'arrows'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-gray-100 text-[#3a3a3a]'
                    }`}
                  >
                    Arrow Keys ↑↓←→
                  </button>
                  <button
                    onClick={() => onMovementControlChange('wasd')}
                    className={`flex-1 py-3 px-4 rounded-xl border-3 border-[#3a3a3a] font-bold transition-colors ${
                      movementControl === 'wasd'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-gray-100 text-[#3a3a3a]'
                    }`}
                  >
                    WASD
                  </button>
                </div>
              </div>

              {/* Sound */}
              <div className="mb-6">
                <h3 className="text-lg mb-3">Sound</h3>
                <button
                  onClick={onSoundToggle}
                  className={`w-full py-4 px-6 rounded-xl border-3 border-[#3a3a3a] font-bold flex items-center justify-between transition-colors ${
                    soundEnabled
                      ? 'bg-[var(--color-success)] text-[#3a3a3a]'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                  {soundEnabled ? (
                    <Volume2 className="w-6 h-6" />
                  ) : (
                    <VolumeX className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Accessibility */}
              <div className="mb-6">
                <h3 className="text-lg mb-3">Accessibility</h3>
                <button
                  onClick={onReducedMotionToggle}
                  className={`w-full py-4 px-6 rounded-xl border-3 border-[#3a3a3a] font-bold transition-colors ${
                    reducedMotion
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-gray-100 text-[#3a3a3a]'
                  }`}
                >
                  {reducedMotion ? '✓ Reduced Motion Enabled' : 'Reduced Motion'}
                </button>
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-2xl border-4 border-[#3a3a3a] font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Settings button for town view
export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed top-8 right-8 z-30 w-14 h-14 bg-white rounded-full border-4 border-[#3a3a3a] flex items-center justify-center shadow-lg"
    >
      <Settings className="w-7 h-7" />
    </motion.button>
  );
}
