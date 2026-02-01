import { useEffect } from "react"
import { useTypewriter } from "./useTypewriter"

type Choice = {
  label: string
  onSelect: () => void
}

type Props = {
  speaker: string
  mood?: "neutral" | "happy" | "warning"
  portrait: React.ReactNode
  text: string
  audio?: HTMLAudioElement
  choices: Choice[]
}

export function DialogueBox({
  speaker,
  mood = "neutral",
  portrait,
  text,
  audio,
  choices,
}: Props) {
  const { displayed, isTyping } = useTypewriter(text, 30)

  useEffect(() => {
    if (audio) {
      audio.currentTime = 0
      audio.play()
    }
  }, [text])

  return (
    <div className="dialogue-wrapper">
      <div className={`dialogue-header ${mood}`}>
        <span>{mood === "happy" ? "😊" : mood === "warning" ? "⚠️" : "💬"}</span>
        <strong>{speaker}</strong>
      </div>

      <div className="dialogue-content">
        <div className="portrait-box">{portrait}</div>

        <div className="text-box">
          <p>
            {displayed}
            {isTyping && <span className="cursor">▌</span>}
          </p>
        </div>
      </div>

      {!isTyping && (
        <div className="choices">
          {choices.map((c, i) => (
            <button key={i} onClick={c.onSelect}>
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
