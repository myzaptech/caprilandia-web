import { type NextRequest, NextResponse } from "next/server"
import { readContentFromFirebase, writeContentToFirebase } from "@/lib/firebase-db"

// POST - Limpiar URLs de uploads que no existen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cleanupAll = false, specificUrls = [] } = body

    console.log("🧹 API: Iniciando limpieza de URLs de uploads...")

    // Obtener contenido actual
    const content = await readContentFromFirebase()
    let hasChanges = false
    const cleanedContent = { ...content }

    // Función para verificar si una URL debe ser limpiada
    const shouldClean = (url: string): boolean => {
      if (!url || !url.startsWith('/uploads/')) {
        return false
      }
      
      if (cleanupAll) {
        return true
      }
      
      return specificUrls.includes(url)
    }

    // Función para limpiar una URL
    const cleanUrl = (url: string): string => {
      if (shouldClean(url)) {
        console.log(`🧹 Limpiando URL: ${url}`)
        hasChanges = true
        return ""
      }
      return url
    }

    // Limpiar hero
    if (cleanedContent.hero?.backgroundImage) {
      cleanedContent.hero.backgroundImage = cleanUrl(cleanedContent.hero.backgroundImage)
    }

    // Limpiar about
    if (cleanedContent.about?.image) {
      cleanedContent.about.image = cleanUrl(cleanedContent.about.image)
    }

    // Limpiar configuración del sitio
    if (cleanedContent.siteConfig?.logo) {
      cleanedContent.siteConfig.logo = cleanUrl(cleanedContent.siteConfig.logo)
    }
    if (cleanedContent.siteConfig?.favicon) {
      cleanedContent.siteConfig.favicon = cleanUrl(cleanedContent.siteConfig.favicon)
    }

    // Limpiar habitaciones
    if (cleanedContent.rooms?.rooms) {
      cleanedContent.rooms.rooms = cleanedContent.rooms.rooms.map((room: any) => {
        const cleanedRoom = { ...room }
        
        // Limpiar imagen principal
        if (cleanedRoom.image) {
          cleanedRoom.image = cleanUrl(cleanedRoom.image)
        }

        // Limpiar media gallery
        if (cleanedRoom.media && Array.isArray(cleanedRoom.media)) {
          cleanedRoom.media = cleanedRoom.media.filter((media: any) => {
            if (shouldClean(media.url)) {
              console.log(`🧹 Removiendo media: ${media.url}`)
              hasChanges = true
              return false
            }
            return true
          })
        }

        return cleanedRoom
      })
    }

    // Limpiar galería
    if (cleanedContent.gallery?.items) {
      cleanedContent.gallery.items = cleanedContent.gallery.items.filter((item: any) => {
        if (shouldClean(item.url)) {
          console.log(`🧹 Removiendo item de galería: ${item.url}`)
          hasChanges = true
          return false
        }
        return true
      })
    }

    // Limpiar location si existe
    if (cleanedContent.location?.image) {
      cleanedContent.location.image = cleanUrl(cleanedContent.location.image)
    }

    // Si hay cambios, guardar el contenido limpio
    if (hasChanges) {
      const result = await writeContentToFirebase(cleanedContent)
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: `Limpieza completada. Se removieron/limpiaron URLs de uploads inexistentes.`,
          cleaned: true,
          timestamp: new Date().toISOString(),
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Error guardando contenido limpio en Firebase",
            details: result.error,
          },
          { status: 500 },
        )
      }
    } else {
      return NextResponse.json({
        success: true,
        message: "No se encontraron URLs de uploads para limpiar",
        cleaned: false,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("API Error en limpieza:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error en la limpieza de URLs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}