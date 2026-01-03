"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"

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

// Función para convertir URL de YouTube a URL embebida
function getYouTubeEmbedUrl(url: string): string | null {
  const regexPatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube-nocookie\.com\/embed\/([^?]+)/
  ]
  
  for (const pattern of regexPatterns) {
    const match = url.match(pattern)
    if (match) {
      const videoId = match[1]
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&fs=1`
    }
  }
  
  return null
}

// Función para detectar si es una URL de YouTube
function isYouTubeUrl(url: string): boolean {
  const youtubePatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\//,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\//,
    /(?:https?:\/\/)?(?:www\.)?youtube-nocookie\.com\/embed\//
  ]
  
  return youtubePatterns.some(pattern => pattern.test(url))
}

// Función para detectar si es un video local
function isLocalVideo(url: string): boolean {
  return url.startsWith('/uploads/') || url.startsWith('./uploads/') || url.startsWith('../uploads/')
}

// Función para normalizar la URL del video
function normalizeVideoUrl(url: string): string {
  if (isLocalVideo(url) && !url.startsWith('/')) {
    return `/${url.replace(/^\.?\/?/, '')}`
  }
  return url
}

export default function SafeVideo({
  src,
  poster,
  className = "",
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  preload = "metadata",
  fallbackMessage = "Video no disponible",
  children
}: SafeVideoProps) {
  // Todos los hooks al inicio, sin condiciones
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Normalizar URL una sola vez con useMemo
  const videoSrc = useMemo(() => {
    return src ? normalizeVideoUrl(src) : ""
  }, [src])
  
  const isYoutube = useMemo(() => {
    return src ? isYouTubeUrl(src) : false
  }, [src])
  
  const youtubeEmbedUrl = useMemo(() => {
    return src && isYoutube ? getYouTubeEmbedUrl(src) : null
  }, [src, isYoutube])

  // Resetear estados cuando cambia src
  useEffect(() => {
    setHasError(false)
    setIsLoaded(false)
  }, [src])

  // Handlers con useCallback para evitar re-renders
  const handleError = useCallback(() => {
    setHasError(true)
    setIsLoaded(true)
  }, [])

  const handleLoaded = useCallback(() => {
    setIsLoaded(true)
    setHasError(false)
  }, [])

  const handleRetry = useCallback(() => {
    setHasError(false)
    setIsLoaded(false)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [])

  // Si no hay src o está vacío, mostrar mensaje de fallback
  if (!src || src.trim() === "") {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center min-h-[200px] ${className}`}>
        <div className="text-center p-6">
          <div className="text-gray-400 mb-3">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">{fallbackMessage}</p>
        </div>
      </div>
    )
  }

  // Si hay error, mostrar mensaje
  if (hasError) {
    return (
      <div className={`bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center min-h-[200px] ${className}`}>
        <div className="text-center p-6">
          <div className="text-orange-400 mb-3">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-orange-600 font-medium mb-2">Video no disponible</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Video de YouTube
  if (youtubeEmbedUrl) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={youtubeEmbedUrl}
          title="Video de YouTube"
          className="w-full h-full absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 0 }}
        />
      </div>
    )
  }

  // Video local/normal
  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        preload={preload}
        className="w-full h-full object-cover"
        onError={handleError}
        onLoadedData={handleLoaded}
        onCanPlay={handleLoaded}
        playsInline
      >
        {children}
        Tu navegador no soporta video HTML5.
      </video>
    </div>
  )
}
