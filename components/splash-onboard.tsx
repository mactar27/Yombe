"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function SplashOnboard() {
  const [show, setShow] = useState(true)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    // Check if user has already visited in this session
    if (sessionStorage.getItem("hasVisited")) {
      setShow(false)
      return
    }

    // Show splash screen for 2s, then fade out for 0.5s
    const timer1 = setTimeout(() => {
      setFade(true)
    }, 2000)

    const timer2 = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem("hasVisited", "true")
    }, 2500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  if (!show) return null

  return (
    <div
      suppressHydrationWarning
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex w-full max-w-sm flex-col items-center justify-center gap-6 p-8 animate-in fade-in zoom-in duration-1000">
        <div className="relative h-32 w-full sm:h-48">
          <Image
            src="/logo.png"
            alt="Yombe Ctyi 313 Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
