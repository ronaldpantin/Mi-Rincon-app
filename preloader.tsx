"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface PreloaderProps {
  onLoadingComplete: () => void
}

export default function Preloader({ onLoadingComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState("Preparando tu experiencia...")

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2

        // Update loading messages based on progress
        if (newProgress <= 30) {
          setLoadingMessage("Preparando tu experiencia...")
        } else if (newProgress <= 60) {
          setLoadingMessage("Cargando recursos...")
        } else if (newProgress <= 90) {
          setLoadingMessage("Casi listo...")
        } else {
          setLoadingMessage("¡Bienvenido!")
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onLoadingComplete()
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 60)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 bg-[#2d4a2b] flex items-center justify-center z-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#9ACD32] rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Logo with rotating circles */}
        <div className="relative mb-8">
          <div className="relative w-24 h-24 mx-auto">
            <Image src="/images/logo_verde.png" alt="Hacienda Rincón Grande" fill className="object-contain" />

            {/* Rotating circles */}
            <div className="absolute inset-0 animate-spin">
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-[#9ACD32] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "3s" }}
            >
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-[#9ACD32] rounded-full transform -translate-x-1/2 translate-y-1/2 opacity-70"></div>
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "4s" }}>
              <div className="absolute right-0 top-1/2 w-2 h-2 bg-[#9ACD32] rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-3xl font-bold text-white mb-2">Mi Rincón</h1>
        <p className="text-[#9ACD32] text-lg mb-8">Hacienda Rincón Grande</p>

        {/* Progress bar */}
        <div className="w-80 max-w-sm mx-auto mb-6">
          <div className="bg-[#1a2f1a] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#9ACD32] to-[#7CB342] rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Progress percentage */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-[#9ACD32] text-sm font-medium">{loadingMessage}</span>
            <span className="text-white text-sm font-bold">{progress}%</span>
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#9ACD32] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
