import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile } from 'fs/promises'
import path from 'path'

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

export async function POST(request: NextRequest) {
  try {
    console.log('📁 API Upload: Recibiendo archivo...')
    
    // Get the uploaded file
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'media'
    
    if (!file) {
      return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
    }
    
    console.log(`📁 Archivo recibido: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
    
    // Validar tamaño para videos
    const isVideo = file.type.startsWith('video/')
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB para videos, 10MB para imágenes
    
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Archivo muy grande. Máximo ${isVideo ? '100MB para videos' : '10MB para imágenes'}` 
      }, { status: 400 })
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substr(2, 9)
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const filename = `${timestamp}_${randomId}.${fileExtension}`
    const filePath = `uploads/${folder}/${filename}`

    // En producción (Vercel), usar Vercel Blob
    if (isProduction) {
      console.log('☁️ Modo producción: Usando Vercel Blob...')
      
      try {
        const blob = await put(filePath, file, {
          access: 'public',
          addRandomSuffix: false,
        })
        
        console.log(`✅ Archivo subido a Vercel Blob: ${blob.url}`)
        
        return NextResponse.json({
          success: true,
          url: blob.url,
          type: isVideo ? 'video' : 'image',
          filename,
          path: filePath
        })
      } catch (blobError) {
        console.error('❌ Error subiendo a Vercel Blob:', blobError)
        return NextResponse.json(
          { error: 'Error subiendo archivo a almacenamiento en la nube' },
          { status: 500 }
        )
      }
    }
    
    // En desarrollo, usar sistema de archivos local
    console.log('💻 Modo desarrollo: Usando sistema de archivos local...')
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    const localFilePath = path.join(uploadDir, filename)
    
    try {
      // Ensure directory exists
      const fs = require('fs')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      // Save file to public directory
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(localFilePath, buffer)
      
      // Return public URL
      const publicUrl = `/uploads/${folder}/${filename}`
      
      console.log(`✅ Archivo guardado localmente: ${publicUrl}`)
      
      return NextResponse.json({
        success: true,
        url: publicUrl,
        type: isVideo ? 'video' : 'image',
        filename,
        path: `${folder}/${filename}`
      })
      
    } catch (fsError) {
      console.error('❌ Error guardando archivo localmente:', fsError)
      
      // Para videos, no usar base64 fallback
      if (isVideo) {
        return NextResponse.json(
          { error: 'Error guardando video. Intente de nuevo.' },
          { status: 500 }
        )
      }
      
      // Solo para imágenes pequeñas, usar base64 fallback
      if (file.size < 1024 * 1024) { // Solo si es menor a 1MB
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
        
        console.log(`✅ Imagen procesada como base64 fallback: ${filename}`)
        
        return NextResponse.json({
          success: true,
          url: base64,
          type: 'image',
          filename,
          path: `${folder}/${filename}`
        })
      }
      
      return NextResponse.json(
        { error: 'Error guardando archivo' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('❌ Error en API upload:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error procesando archivo' },
      { status: 500 }
    )
  }
}

// Configuración para archivos grandes
export const config = {
  api: {
    bodyParser: false,
  },
}
