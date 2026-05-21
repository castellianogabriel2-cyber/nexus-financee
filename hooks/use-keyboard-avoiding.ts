"use client"

import { useEffect, useState } from "react"

export function useKeyboardAvoiding() {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const visualViewport = window.visualViewport
      if (visualViewport) {
        const height = window.innerHeight - visualViewport.height
        setKeyboardHeight(Math.max(0, height))
      }
    }

    window.visualViewport?.addEventListener("resize", handleResize)
    window.visualViewport?.addEventListener("scroll", handleResize)

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize)
      window.visualViewport?.removeEventListener("scroll", handleResize)
    }
  }, [])

  return keyboardHeight
}
