import { useEffect, useState } from "react"

export function useTypewriter(
  text: string,
  speed = 30
) {
  const [displayed, setDisplayed] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    setDisplayed("")
    setIsTyping(true)

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))

      if (i >= text.length) {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return { displayed, isTyping }
}