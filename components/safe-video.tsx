"use client"

import { useState, useEffect } from "react"

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
  // Extraer el ID del video de diferentes formatos de YouTube
  const regexPatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube-nocookie\.com\/embed\/([^?]+)/
  ]
  
  for (const pattern of regexPatterns) {
    const match = url.match(pattern)
    if (match) {
      // Usar youtube-nocookie.com para mejor privacidad
      return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0`
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
  // Si es una URL local, asegurar que empiece con /
  if (isLocalVideo(url) && !url.startsWith('/')) {
    return `/${url.replace(/^\.?\/?/, '')}`
  }
  return url
}

// Función para verificar si el video existe
async function checkVideoExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-cache'
    })
    return response.ok
  } catch {
    return false
  }
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
  const [videoSrc, setVideoSrc] = useState(src ? normalizeVideoUrl(src) : src)
  const [isChecking, setIsChecking] = useState(false)

  // Debug logging (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎥 SafeVideo iniciado con src:`, src)
    console.log(`🎥 Video src normalizado:`, videoSrc)
    
    // Si src está vacío o undefined
    if (!src || src.trim() === '') {
      console.warn(`⚠️ SafeVideo recibió src vacío o undefined:`, { src, videoSrc })
    }
    
    // Si es YouTube, log adicional
    if (src && isYouTubeUrl(src)) {
      console.log(`📺 Detectado video de YouTube: ${src}`)
    }
    
    // Si es video local, log adicional
    if (src && isLocalVideo(src)) {
      console.log(`📁 Detectado video local: ${src}`)
    }
  }

  // Verificar si el video existe cuando cambia la src
  useEffect(() => {
    if (src && isLocalVideo(src)) {
      setIsChecking(true)
      const normalizedUrl = normalizeVideoUrl(src)
      
      checkVideoExists(normalizedUrl).then(exists => {
        if (!exists) {
          console.warn(`❌ Video local no encontrado: ${normalizedUrl}`)
          setHasError(true)
        }
        setIsChecking(false)
      }).catch(error => {
        console.warn(`❌ Error verificando video local: ${normalizedUrl}`, error)
        setHasError(true)
        setIsChecking(false)
      })
    }
  }, [src])

  // Actualizar videoSrc cuando cambie src
  useEffect(() => {
    if (src) {
      setVideoSrc(normalizeVideoUrl(src))
      setHasError(false)
    }
  }, [src])

  // Si no hay src o está vacío, mostrar mensaje de fallback
  if (!src || src.trim() === "") {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">{fallbackMessage}</p>
          <p className="text-xs text-gray-400 mt-1">No se proporcionó URL de video</p>
        </div>
      </div>
    )
  }

  // Si está verificando o tiene error, mostrar estado correspondiente
  if (isChecking) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="text-gray-400 mb-2">
            <div className="w-8 h-8 mx-auto border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 text-sm">Verificando video...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">{fallbackMessage}</p>
          <p className="text-xs text-gray-400 mt-1">
            Error: {src.length > 50 ? src.substring(0, 50) + '...' : src}
          </p>
          <button
            onClick={() => {
              setHasError(false)
              if (src) setVideoSrc(normalizeVideoUrl(src))
            }}
            className="mt-2 px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Verificar si es un video de YouTube
  const youtubeEmbedUrl = getYouTubeEmbedUrl(src)
  
  if (youtubeEmbedUrl) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={youtubeEmbedUrl}
          title="Video de YouTube"
          className="w-full h-full absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 0 }}
          onLoad={() => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`✅ YouTube video cargado: ${src}`)
            }
          }}
          onError={(e) => {
            console.warn(`❌ Error cargando YouTube video: ${src}`, e)
            setHasError(true)
          }}
        />
      </div>
    )
  }

  const handleError = (event?: any) => {
    console.warn(`❌ Error cargando video: ${videoSrc}`)
    if (event?.target?.error) {
      const errorCode = event.target.error.code
      const errorMessages = {
        1: 'MEDIA_ERR_ABORTED - La descarga fue abortada por el usuario',
        2: 'MEDIA_ERR_NETWORK - Error de red durante la descarga',
        3: 'MEDIA_ERR_DECODE - Error decodificando el video',
        4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Formato de video no soportado'
      }
      console.warn(`❌ Error específico (${errorCode}):`, errorMessages[errorCode as keyof typeof errorMessages] || event.target.error)
      
      // Log adicional para URLs de uploads
      if (videoSrc?.startsWith('/uploads/')) {
        console.warn(`❌ Video local no accesible. Verifica que existe: ${videoSrc}`)
      }
    }
    setHasError(true)
  }

  const handleLoadStart = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎬 Iniciando carga de video: ${videoSrc}`)
    }
    setHasError(false) // Reset error state when starting to load
  }

  const handleCanPlay = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Video listo para reproducir: ${videoSrc}`)
    }
    setHasError(false) // Ensure error state is cleared when video can play
  }

  // Determinar si necesita crossOrigin
  const needsCrossOrigin = videoSrc?.includes('firebasestorage.googleapis.com') || 
                          videoSrc?.includes('googleapis.com') || 
                          videoSrc?.includes('blob.') ||
                          videoSrc?.startsWith('blob:')

  // Determinar el tipo MIME del video
  const getVideoType = (url: string): string => {
    if (url.endsWith('.mp4')) return 'video/mp4'
    if (url.endsWith('.webm')) return 'video/webm'
    if (url.endsWith('.ogg')) return 'video/ogg'
    if (url.endsWith('.mov')) return 'video/quicktime'
    return 'video/mp4' // fallback
  }

  return (
    <video
      className={className}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      preload={preload}
      crossOrigin={needsCrossOrigin ? "anonymous" : undefined}
      onError={handleError}
      onLoadStart={handleLoadStart}
      onCanPlay={handleCanPlay}
      onLoadedData={() => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 Datos de video cargados: ${videoSrc}`)
        }
      }}
      onLoadedMetadata={() => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`� Metadatos de video cargados: ${videoSrc}`)
        }
      }}
      onPlay={() => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`▶️ Video iniciado: ${videoSrc}`)
        }
      }}
    >
      {/* Usar elementos source para mejor compatibilidad */}
      {videoSrc && (
        <source 
          src={videoSrc} 
          type={getVideoType(videoSrc)}
        />
      )}
      {children}
      Tu navegador no soporta el elemento video.
    </video>
  )
}