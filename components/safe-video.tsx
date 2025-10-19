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
      const videoId = match[1]
      // Usar youtube-nocookie.com para mejor privacidad y menos restricciones
      // Agregar parámetros para evitar problemas de embedding
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&controls=1`
    }
  }
  
  return null
}

// Función para verificar si un video de YouTube puede ser embebido
function getYouTubeVideoId(url: string): string | null {
  const regexPatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube-nocookie\.com\/embed\/([^?]+)/
  ]
  
  for (const pattern of regexPatterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
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
  const [youtubeError, setYoutubeError] = useState(false)

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
      const videoId = getYouTubeVideoId(src)
      console.log(`📺 YouTube Video ID: ${videoId}`)
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
      setYoutubeError(false)
    }
  }, [src])

  // Detectar errores de X-Frame-Options para YouTube
  useEffect(() => {
    if (src && isYouTubeUrl(src)) {
      // Escuchar errores de console para detectar X-Frame-Options
      const originalError = console.error
      console.error = (...args) => {
        const errorMessage = args.join(' ')
        if (errorMessage.includes('X-Frame-Options') || errorMessage.includes('sameorigin')) {
          console.warn(`🚫 YouTube video bloqueado por X-Frame-Options: ${src}`)
          setYoutubeError(true)
        }
        originalError.apply(console, args)
      }

      // Cleanup
      return () => {
        console.error = originalError
      }
    }
  }, [src])

  // Si no hay src o está vacío, mostrar mensaje de fallback
  if (!src || src.trim() === "") {
    return (
      <div className={`bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="text-gray-400 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-600 mb-2">📹 Sin video configurado</h3>
          <p className="text-gray-500 text-sm mb-2">{fallbackMessage}</p>
          <p className="text-xs text-gray-400">No se proporcionó URL de video</p>
          
          <div className="mt-4 p-3 bg-white/70 rounded border border-gray-200">
            <p className="text-xs text-gray-500">
              Estado: <span className="font-mono">Sin fuente de video</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Si está verificando o tiene error, mostrar estado correspondiente
  if (isChecking) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="text-blue-500 mb-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-blue-700 mb-2">🔍 Verificando video...</h3>
          <p className="text-blue-600 text-sm">
            Comprobando disponibilidad del archivo
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="text-orange-500 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-orange-700 mb-2">🎥 Video no disponible</h3>
          <p className="text-orange-600 text-sm mb-2 font-medium">
            No se pudo cargar el video
          </p>
          <p className="text-gray-600 text-xs mb-4">
            El archivo de video puede estar dañado o no existe en el servidor.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setHasError(false)
                if (src) setVideoSrc(normalizeVideoUrl(src))
              }}
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              🔄 Reintentar
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-white/70 rounded border border-orange-200">
            <p className="text-xs text-gray-600 break-all">
              <span className="font-mono">URL:</span> {src.length > 50 ? src.substring(0, 50) + '...' : src}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Verificar si es un video de YouTube
  const youtubeEmbedUrl = getYouTubeEmbedUrl(src)
  const youtubeVideoId = getYouTubeVideoId(src)
  
  if (youtubeEmbedUrl && !youtubeError) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={youtubeEmbedUrl}
          title="Video de YouTube"
          className="w-full h-full absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 0 }}
          onLoad={(e) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`✅ YouTube iframe cargado: ${src}`)
            }
            
            // Verificar si el iframe realmente cargó contenido
            setTimeout(() => {
              try {
                const iframe = e.target as HTMLIFrameElement
                // Si el iframe está vacío o no responde, probablemente fue bloqueado
                if (!iframe.contentDocument && !iframe.contentWindow) {
                  console.warn(`🚫 YouTube iframe posiblemente bloqueado: ${src}`)
                  setYoutubeError(true)
                }
              } catch (error) {
                // Cross-origin error es normal, pero si hay otros errores...
                if (process.env.NODE_ENV === 'development') {
                  console.log(`ℹ️ Cross-origin restriction (normal): ${src}`)
                }
              }
            }, 2000)
          }}
          onError={(e) => {
            console.warn(`❌ Error directo en iframe de YouTube: ${src}`, e)
            setYoutubeError(true)
          }}
        />
        
        {/* Timeout para detectar bloqueo por X-Frame-Options */}
        {(() => {
          setTimeout(() => {
            // Si después de 5 segundos no se ha cargado correctamente, asumir que está bloqueado
            const checkBlocked = () => {
              if (!youtubeError) {
                console.warn(`⏰ YouTube iframe timeout - posible bloqueo X-Frame-Options: ${src}`)
                // No establecer error automáticamente, solo log
              }
            }
            checkBlocked()
          }, 5000)
          return null
        })()}
      </div>
    )
  }
  
  // Si YouTube falló, mostrar enlace directo mejorado
  if (youtubeEmbedUrl && youtubeError && youtubeVideoId) {
    return (
      <div className={`bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-700 mb-2">🎬 Video de YouTube</h3>
          <p className="text-red-600 text-sm mb-2 font-medium">
            Video protegido contra incrustación
          </p>
          <p className="text-gray-600 text-xs mb-4">
            Este video no se puede mostrar aquí debido a las restricciones de privacidad de YouTube.
          </p>
          
          <div className="space-y-3">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              ▶️ Ver en YouTube
            </a>
            
            <button
              onClick={() => setYoutubeError(false)}
              className="block mx-auto px-4 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              🔄 Intentar de nuevo
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-white/70 rounded border border-red-200">
            <p className="text-xs text-gray-600 font-mono">ID: {youtubeVideoId}</p>
          </div>
        </div>
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