"use client"

import { useEffect } from "react"
import type { ContentData } from "@/hooks/use-content"

// Hook para limpiar URLs de uploads que no existen
export function useContentCleanup(content: ContentData, setContent: (content: ContentData) => void) {
  useEffect(() => {
    const cleanupContent = async () => {
      let hasChanges = false
      const cleanedContent = { ...content }

      // Función para verificar si una imagen existe
      const checkImageExists = async (url: string): Promise<boolean> => {
        if (!url || !url.startsWith('/uploads/')) {
          return true // No es una imagen local, no necesita verificación
        }

        try {
          const response = await fetch(url, { method: 'HEAD' })
          return response.ok
        } catch {
          return false
        }
      }

      // Limpiar imágenes de hero
      if (content.hero?.backgroundImage?.startsWith('/uploads/')) {
        const exists = await checkImageExists(content.hero.backgroundImage)
        if (!exists) {
          console.warn(`❌ Imagen de hero no encontrada: ${content.hero.backgroundImage}`)
          cleanedContent.hero.backgroundImage = ""
          hasChanges = true
        }
      }

      // Limpiar imágenes de about
      if (content.about?.image?.startsWith('/uploads/')) {
        const exists = await checkImageExists(content.about.image)
        if (!exists) {
          console.warn(`❌ Imagen de about no encontrada: ${content.about.image}`)
          cleanedContent.about.image = ""
          hasChanges = true
        }
      }

      // Limpiar imágenes de habitaciones
      if (content.rooms?.rooms) {
        for (let i = 0; i < content.rooms.rooms.length; i++) {
          const room = content.rooms.rooms[i]
          
          // Limpiar imagen principal
          if (room.image?.startsWith('/uploads/')) {
            const exists = await checkImageExists(room.image)
            if (!exists) {
              console.warn(`❌ Imagen de habitación no encontrada: ${room.image}`)
              cleanedContent.rooms.rooms[i].image = ""
              hasChanges = true
            }
          }

          // Limpiar media gallery
          if (room.media && room.media.length > 0) {
            const cleanedMedia = []
            for (const media of room.media) {
              if (media.url.startsWith('/uploads/')) {
                const exists = await checkImageExists(media.url)
                if (exists) {
                  cleanedMedia.push(media)
                } else {
                  console.warn(`❌ Media de habitación no encontrado: ${media.url}`)
                  hasChanges = true
                }
              } else {
                cleanedMedia.push(media)
              }
            }
            cleanedContent.rooms.rooms[i].media = cleanedMedia
          }
        }
      }

      // Limpiar galería
      if (content.gallery?.items) {
        const cleanedItems = []
        for (const item of content.gallery.items) {
          if (item.url.startsWith('/uploads/')) {
            const exists = await checkImageExists(item.url)
            if (exists) {
              cleanedItems.push(item)
            } else {
              console.warn(`❌ Item de galería no encontrado: ${item.url}`)
              hasChanges = true
            }
          } else {
            cleanedItems.push(item)
          }
        }
        cleanedContent.gallery.items = cleanedItems
      }

      // Si hubo cambios, actualizar el contenido
      if (hasChanges) {
        console.log("🧹 Limpiando URLs de archivos inexistentes...")
        setContent(cleanedContent)
      }
    }

    // Solo ejecutar si hay contenido
    if (content && Object.keys(content).length > 0) {
      cleanupContent()
    }
  }, []) // Solo ejecutar una vez al cargar

  return null
}