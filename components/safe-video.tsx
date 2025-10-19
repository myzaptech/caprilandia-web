"use client"

import { useState } from "react"

interface SafeVideoProps {
  src?: string
  poster?: string
  className?: string
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  preload?: string
  fallbackMessage?: string
  children?: React.ReactNode
}

export default function SafeVideo({
  src,
  poster,
  className,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  preload = "metadata",
  fallbackMessage = "Video no disponible",
  children
}: SafeVideoProps) {
  const [hasError, setHasError] = useState(false)
  const [videoSrc, setVideoSrc] = useState(src)

  // Si no hay src o está vacío, mostrar mensaje de fallback
  if (!src || src.trim() === "" || hasError) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">{fallbackMessage}</p>
          {src && hasError && (
            <p className="text-xs text-gray-400 mt-1">
              Error cargando: {src.length > 50 ? src.substring(0, 50) + '...' : src}
            </p>
          )}
        </div>
      </div>
    )
  }

  const handleError = () => {
    console.warn(`❌ Error cargando video: ${src}`)
    setHasError(true)
  }

  const handleLoadStart = () => {
    // Verificar si es una URL local de uploads
    if (src.startsWith('/uploads/')) {
      fetch(src, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            handleError()
          }
        })
        .catch(() => {
          handleError()
        })
    }
  }

  return (
    <video
      src={videoSrc}
      poster={poster}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      preload={preload}
      onError={handleError}
      onLoadStart={handleLoadStart}
    >
      {children}
    </video>
  )
}