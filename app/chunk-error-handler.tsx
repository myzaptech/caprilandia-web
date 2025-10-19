"use client"

import { useEffect } from 'react'

export function ChunkErrorHandler() {
  useEffect(() => {
    let chunkErrorCount = 0
    const MAX_CHUNK_ERRORS = 3

    // Manejar errores de carga de chunks
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error
      
      // Detectar si es un ChunkLoadError
      if (error && (
        error.name === 'ChunkLoadError' || 
        error.message?.includes('Loading chunk') ||
        error.message?.includes('failed')
      )) {
        chunkErrorCount++
        console.warn(`🔄 Chunk loading error detected (#${chunkErrorCount}):`, error)
        
        if (chunkErrorCount >= MAX_CHUNK_ERRORS) {
          // Si hay múltiples errores, redirigir a la página de limpieza
          console.warn('🔄 Multiple chunk errors detected, redirecting to cache clear page...')
          window.location.href = '/clear-cache.html?auto=clear'
          return
        }
        
        // Para el primer error, intentar reload suave
        if (chunkErrorCount === 1) {
          console.log('🔄 Attempting soft reload...')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      }
    }

    // Manejar errores de recursos (JS chunks que fallan al cargar)
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLScriptElement | HTMLLinkElement | null
      
      if (target) {
        const src = (target as HTMLScriptElement).src || (target as HTMLLinkElement).href
        
        if (src && src.includes('/_next/static/chunks/')) {
          console.warn('🔄 Chunk resource error detected:', src)
          
          // Intentar recargar después de un breve delay
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.reload()
            }
          }, 1000)
        }
      }
    }

    // Agregar listeners globales
    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleChunkError)
      window.addEventListener('error', handleResourceError, true) // Use capture

      // Manejar promesas rechazadas no capturadas (puede incluir chunk errors)
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const reason = event.reason
        
        if (reason && (
          reason.name === 'ChunkLoadError' ||
          (typeof reason === 'string' && reason.includes('Loading chunk'))
        )) {
          console.warn('🔄 Unhandled chunk loading promise rejection:', reason)
          
          // Recargar automáticamente en este caso
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.reload()
            }
          }, 500)
        }
      }

      window.addEventListener('unhandledrejection', handleUnhandledRejection)

      // Cleanup
      return () => {
        window.removeEventListener('error', handleChunkError)
        window.removeEventListener('error', handleResourceError, true)
        window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      }
    }
  }, [])

  return null
}