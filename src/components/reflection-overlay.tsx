import { motion, AnimatePresence } from "framer-motion";

interface ReflectionOverlayProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function ReflectionOverlay({
  isOpen,
  title,
  message,
  onClose,
}: ReflectionOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#a8b9e8]/90 z-50"
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-[#3a3a3a] p-8 text-center">
              {/* Icon */}
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-[#ffd89b] rounded-full border-4 border-[#3a3a3a] flex items-center justify-center text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                💡
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl mb-4">{title}</h2>

              {/* Message */}
              <p className="text-lg leading-relaxed mb-6 text-[var(--color-text-light)]">
                {message}
              </p>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-[var(--color-primary)] text-white py-3 px-8 rounded-2xl border-4 border-[#3a3a3a] font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                Got it!
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
