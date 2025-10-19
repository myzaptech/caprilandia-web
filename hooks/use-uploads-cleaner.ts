"use client"

import { useCallback, useEffect, useRef } from "react"

interface UploadError {
  url: string
  type: 'image' | 'video'
  error: Error | Event
}

// Crear un evento personalizado para coordinar la limpieza
const CLEANUP_EVENT = 'uploads-cleanup'

export function useUploadsCleaner() {
  const cleanupQueue = useRef<Set<string>>(new Set())
  const cleanupTimeout = useRef<NodeJS.Timeout | null>(null)

  const triggerCleanup = useCallback(async (urls: string[]) => {
    if (urls.length === 0) return

    try {
      // Agregar URLs a la cola
      urls.forEach(url => cleanupQueue.current.add(url))

      // Cancelar timeout anterior si existe
      if (cleanupTimeout.current) {
        clearTimeout(cleanupTimeout.current)
      }

      // Programar limpieza en batch (debounce de 2 segundos)
      cleanupTimeout.current = setTimeout(async () => {
        const urlsToClean = Array.from(cleanupQueue.current)
        cleanupQueue.current.clear()

        if (urlsToClean.length === 0) return

        console.log(`🧹 Global Cleaner: Executing batch cleanup for ${urlsToClean.length} URLs`, urlsToClean)
        
        // Dispatchear evento personalizado
        window.dispatchEvent(new CustomEvent(CLEANUP_EVENT, {
          detail: { urls: urlsToClean, timestamp: Date.now() }
        }))

        // Llamar a la API de limpieza usando XMLHttpRequest para evitar problemas
        try {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', '/api/cleanup', true)
          xhr.setRequestHeader('Content-Type', 'application/json')
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              try {
                const result = JSON.parse(xhr.responseText)
                if (result.success && result.cleaned) {
                  console.log('🧹 Global Cleaner: Cleanup API completed successfully')
                  // Recargar la página para reflejar los cambios
                  setTimeout(() => {
                    window.location.reload()
                  }, 1000)
                } else {
                  console.log('🧹 Global Cleaner: No changes needed from API')
                }
              } catch (parseError) {
                console.error('🧹 Global Cleaner: Error parsing API response:', parseError)
              }
            } else {
              console.error('🧹 Global Cleaner: API cleanup failed with status:', xhr.status)
            }
          }
          
          xhr.onerror = () => {
            console.error('🧹 Global Cleaner: API cleanup network error')
          }
          
          xhr.send(JSON.stringify({ 
            cleanupAll: false,
            specificUrls: urlsToClean 
          }))
          
        } catch (apiError) {
          console.error('🧹 Global Cleaner: API cleanup failed:', apiError)
        }
      }, 2000)
      
    } catch (error) {
      console.error('🧹 Global Cleaner: Error in cleanup:', error)
    }
  }, [])

  const handleUploadError = useCallback(async (error: UploadError) => {
    console.log(`🧹 Global Cleaner: Detected ${error.type} error for ${error.url}`)
    
    // Reemplazar inmediatamente con placeholder en el DOM
    if (error.type === 'image') {
      const images = document.querySelectorAll(`img[src*="${error.url}"]`)
      images.forEach(img => {
        (img as HTMLImageElement).src = '/images/placeholder.svg'
        img.setAttribute('data-original-src', error.url)
        img.setAttribute('data-upload-error', 'true')
      })
    } else if (error.type === 'video') {
      const videos = document.querySelectorAll(`video source[src*="${error.url}"], video[src*="${error.url}"]`)
      videos.forEach(video => {
        if (video.tagName === 'SOURCE') {
          (video as HTMLSourceElement).src = ''
        } else {
          (video as HTMLVideoElement).src = ''
        }
        video.setAttribute('data-original-src', error.url)
        video.setAttribute('data-upload-error', 'true')
      })
    }

    // Trigger cleanup
    await triggerCleanup([error.url])
  }, [triggerCleanup])

  useEffect(() => {
    // Solo interceptar errores de imagen/video, NO fetch para evitar problemas de contexto
    
    // Interceptar errores de imágenes
    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement
      if (img.src && img.src.includes('/uploads/')) {
        const relativeUrl = img.src.replace(window.location.origin, '')
        handleUploadError({
          url: relativeUrl,
          type: 'image',
          error: event
        })
      }
    }

    // Interceptar errores de videos
    const handleVideoError = (event: Event) => {
      const video = event.target as HTMLVideoElement
      if (video.src && video.src.includes('/uploads/')) {
        const relativeUrl = video.src.replace(window.location.origin, '')
        handleUploadError({
          url: relativeUrl,
          type: 'video',
          error: event
        })
      }
    }

    // Agregar listeners globales
    const errorHandler = (event: Event) => {
      if (event.target) {
        const target = event.target as HTMLElement
        if (target.tagName === 'IMG') {
          handleImageError(event)
        } else if (target.tagName === 'VIDEO') {
          handleVideoError(event)
        }
      }
    }

    document.addEventListener('error', errorHandler, true)

    // Cleanup function
    return () => {
      if (cleanupTimeout.current) {
        clearTimeout(cleanupTimeout.current)
      }
      document.removeEventListener('error', errorHandler, true)
    }
  }, [handleUploadError])

  // Función para limpiar manualmente todos los uploads
  const cleanAllUploads = useCallback(async () => {
    try {
      console.log('🧹 Global Cleaner: Executing full cleanup of all uploads')
      
      // Usar XMLHttpRequest para evitar problemas de contexto
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/cleanup', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText)
              console.log('🧹 Global Cleaner: Full cleanup completed')
              if (result.cleaned) {
                setTimeout(() => {
                  window.location.reload()
                }, 1000)
              }
              resolve(result)
            } catch (parseError) {
              reject(new Error('Error parsing API response'))
            }
          } else {
            reject(new Error(`API cleanup failed with status: ${xhr.status}`))
          }
        }
        
        xhr.onerror = () => {
          reject(new Error('Network error during cleanup'))
        }
        
        xhr.send(JSON.stringify({ 
          cleanupAll: true 
        }))
      })
      
    } catch (error) {
      console.error('🧹 Global Cleaner: Full cleanup failed:', error)
      throw error
    }
  }, [])

  return {
    triggerCleanup,
    cleanAllUploads,
    CLEANUP_EVENT
  }
}