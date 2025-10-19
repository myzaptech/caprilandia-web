import { type NextRequest, NextResponse } from "next/server"
import { readContentFromFirebase, writeContentToFirebase } from "@/lib/firebase-db"
import { writeFile } from 'fs/promises'
import path from 'path'

// POST - Convertir videos base64 a archivos físicos
export async function POST(request: NextRequest) {
  try {
    console.log("🎬 API: Iniciando conversión de videos base64...")

    // Obtener contenido actual
    const content = await readContentFromFirebase()
    let hasChanges = false
    let convertedCount = 0
    const cleanedContent = { ...content }

    // Función para detectar y convertir videos base64
    const convertBase64Video = async (base64Video: string): Promise<string> => {
      if (!base64Video.startsWith('data:video/')) {
        return base64Video // No es base64, no cambiar
      }

      try {
        console.log(`🔄 Convirtiendo video base64 (${base64Video.length} chars)...`)
        
        // Extraer el tipo MIME y los datos
        const [mimeType, base64Data] = base64Video.split(',')
        const videoType = mimeType.split(';')[0].split(':')[1] // ej: video/mp4
        const extension = videoType.split('/')[1] // ej: mp4
        
        // Generar nombre único
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substr(2, 9)
        const filename = `converted_${timestamp}_${randomId}.${extension}`
        
        // Crear directorio y guardar archivo
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos')
        const fs = require('fs')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
        
        const filePath = path.join(uploadDir, filename)
        const buffer = Buffer.from(base64Data, 'base64')
        await writeFile(filePath, buffer)
        
        const publicUrl = `/uploads/videos/${filename}`
        console.log(`✅ Video convertido: ${publicUrl}`)
        
        convertedCount++
        hasChanges = true
        return publicUrl
        
      } catch (error) {
        console.error('❌ Error convirtiendo video:', error)
        return base64Video // Mantener original si falla
      }
    }

    // Función recursiva para buscar y convertir videos en el contenido
    const processContent = async (obj: any): Promise<any> => {
      if (typeof obj === 'string' && obj.startsWith('data:video/')) {
        return await convertBase64Video(obj)
      } else if (Array.isArray(obj)) {
        const processedArray = []
        for (const item of obj) {
          processedArray.push(await processContent(item))
        }
        return processedArray
      } else if (obj && typeof obj === 'object') {
        const processedObj: any = {}
        for (const [key, value] of Object.entries(obj)) {
          processedObj[key] = await processContent(value)
        }
        return processedObj
      }
      return obj
    }

    // Procesar todo el contenido
    const processedContent = await processContent(cleanedContent)

    // Si hay cambios, guardar el contenido actualizado
    if (hasChanges) {
      const result = await writeContentToFirebase(processedContent)
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: `Conversión completada. Se convirtieron ${convertedCount} videos.`,
          converted: convertedCount,
          timestamp: new Date().toISOString(),
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Error guardando contenido convertido en Firebase",
            details: result.error,
          },
          { status: 500 },
        )
      }
    } else {
      return NextResponse.json({
        success: true,
        message: "No se encontraron videos base64 para convertir",
        converted: 0,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("API Error en conversión de videos:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error en la conversión de videos",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}