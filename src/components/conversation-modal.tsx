import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { useTypewriter } from "../hooks/useTypewriter"
import { VoiceMessagePlayer } from "./voice-message-player"
import { NPCSprite } from "./assets/npc-sprite"

interface ConversationModalProps {
  isOpen: boolean
  villagerName: string
  villagerVariant: "bob" | "sally" | "lily" | "max" | "zoe"
  villagerMood: "neutral" | "worried" | "happy"
  message: string
  onTrust: () => void
  onQuestion: () => void
  onReject: () => void
  hideButtons?: boolean
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
  hideButtons = false,
}: ConversationModalProps) {
  const { displayed, isTyping } = useTypewriter(
    isOpen ? message : "",
    50
  )

  useEffect(() => {
    if (!isOpen) return
  }, [isOpen, message])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Soft background dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Bottom dialogue (Animal Crossing style) */}
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 22 }}
            className="dialogue-wrapper z-50"
          >
            {/* Header */}
            <div className={`dialogue-header ${villagerMood}`}>
              <span>
                {villagerMood === "happy"
                  ? "😊"
                  : villagerMood === "worried"
                  ? "⚠️"
                  : "💬"}
              </span>
              <strong>{villagerName}</strong>
            </div>

            {/* Content */}
            <div className="dialogue-content">
              {/* Portrait */}
              <motion.div
                className="dialogue-portrait"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <NPCSprite variant={villagerVariant} mood={villagerMood} />
              </motion.div>

              {/* Text */}
              <div className="dialogue-text-box">
                <p>
                  {displayed}
                  {isTyping && <span className="dialogue-cursor">▌</span>}
                </p>
              </div>
            </div>

            {/* Choices (ONLY after typing finishes and buttons are NOT hidden) */}
            {!isTyping && !hideButtons && (
              <motion.div
                className="dialogue-choices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 2 }}
                  onClick={onTrust}
                  className="dialogue-button danger"
                >
                  💸 SPEND NOW
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 2 }}
                  onClick={onQuestion}
                  className="dialogue-button neutral"
                >
                  🤔 THINK FIRST
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 2 }}
                  onClick={onReject}
                  className="dialogue-button safe"
                >
                  💰 SAVE SMART
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}