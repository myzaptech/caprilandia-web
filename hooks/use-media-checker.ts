"use client"

import { useState, useEffect, useCallback } from 'react'

interface MediaCheckResult {
  url: string
  exists: boolean
  external?: boolean
  error?: string
  path?: string
}

interface MediaCheckSummary {
  total: number
  existing: number
  missing: number
}

export function useMediaChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<{
    results: MediaCheckResult[]
    summary: MediaCheckSummary
  } | null>(null)

  const checkMedia = useCallback(async (urls: string[]) => {
    if (!urls || urls.length === 0) {
      return { results: [], summary: { total: 0, existing: 0, missing: 0 } }
    }

    setIsChecking(true)
    
    try {
      const response = await fetch('/api/check-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setLastCheck({
          results: result.results,
          summary: result.summary
        })
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 Verificación de medios completada:`)
          console.log(`   Total: ${result.summary.total}`)
          console.log(`   Existentes: ${result.summary.existing}`)
          console.log(`   Faltantes: ${result.summary.missing}`)
          
          // Log de archivos faltantes
          const missing = result.results.filter((r: MediaCheckResult) => !r.exists)
          if (missing.length > 0) {
            console.warn(`❌ Archivos faltantes:`, missing.map((m: MediaCheckResult) => m.url))
          }
        }
        
        return {
          results: result.results,
          summary: result.summary
        }
      } else {
        throw new Error(result.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error verificando medios:', error)
      return {
        results: [],
        summary: { total: urls.length, existing: 0, missing: urls.length },
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    } finally {
      setIsChecking(false)
    }
  }, [])

  const checkContentMedia = useCallback(async (content: any) => {
    const urls: string[] = []
    
    // Recopilar todas las URLs de medios del contenido
    
    // Hero background
    if (content.hero?.backgroundImage) {
      urls.push(content.hero.backgroundImage)
    }
    
    // About image
    if (content.about?.image) {
      urls.push(content.about.image)
    }
    
    // Room images and media
    if (content.rooms?.rooms) {
      content.rooms.rooms.forEach((room: any) => {
        if (room.image) {
          urls.push(room.image)
        }
        if (room.media) {
          room.media.forEach((media: any) => {
            if (media.url) {
              urls.push(media.url)
            }
            if (media.thumbnail) {
              urls.push(media.thumbnail)
            }
          })
        }
      })
    }
    
    // Gallery items
    if (content.gallery?.items) {
      content.gallery.items.forEach((item: any) => {
        if (item.url) {
          urls.push(item.url)
        }
        if (item.thumbnail) {
          urls.push(item.thumbnail)
        }
      })
    }
    
    // Site config
    if (content.siteConfig?.logo) {
      urls.push(content.siteConfig.logo)
    }
    if (content.siteConfig?.favicon) {
      urls.push(content.siteConfig.favicon)
    }
    
    // Location image
    if (content.location?.image) {
      urls.push(content.location.image)
    }
    
    // Filtrar URLs válidas y únicas
    const validUrls = [...new Set(urls.filter(url => 
      url && 
      typeof url === 'string' && 
      url.trim() !== '' &&
      !url.startsWith('data:') // Excluir data URLs
    ))]
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Verificando ${validUrls.length} URLs de medios...`)
    }
    
    return await checkMedia(validUrls)
  }, [checkMedia])

  return {
    isChecking,
    lastCheck,
    checkMedia,
    checkContentMedia
  }
}