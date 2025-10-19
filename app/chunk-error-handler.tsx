"use client"

import { useEffect } from 'react'

export function ChunkErrorHandler() {
  useEffect(() => {
    // Manejar errores de carga de chunks
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error
      
      // Detectar si es un ChunkLoadError
      if (error && (
        error.name === 'ChunkLoadError' || 
        error.message?.includes('Loading chunk') ||
        error.message?.includes('failed')
      )) {
        console.warn('🔄 Chunk loading error detected, reloading page...', error)
        
        // Mostrar mensaje al usuario antes de recargar
        const shouldReload = confirm(
          'La página necesita actualizarse para cargar la versión más reciente. ¿Deseas continuar?'
        )
        
        if (shouldReload) {
          // Limpiar cache del navegador y recargar
          if (typeof window !== 'undefined' && 'caches' in window) {
            caches.keys().then(names => {
              names.forEach(name => {
                if (name.includes('next-static') || name.includes('webpack')) {
                  caches.delete(name)
                }
              })
            }).then(() => {
              window.location.reload()
            })
          } else if (typeof window !== 'undefined') {
            window.location.reload()
          }
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