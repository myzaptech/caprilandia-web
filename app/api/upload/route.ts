import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

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
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 50MB para videos, 10MB para imágenes
    
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Archivo muy grande. Máximo ${isVideo ? '50MB para videos' : '10MB para imágenes'}` 
      }, { status: 400 })
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substr(2, 9)
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}_${randomId}.${fileExtension}`
    
    // Create directory path
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    const filePath = path.join(uploadDir, filename)
    
    try {
      // Ensure directory exists
      const fs = require('fs')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      // Save file to public directory
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)
      
      // Return public URL
      const publicUrl = `/uploads/${folder}/${filename}`
      
      console.log(`✅ Archivo guardado en: ${publicUrl}`)
      
      return NextResponse.json({
        success: true,
        url: publicUrl,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        filename,
        path: `${folder}/${filename}`
      })
      
    } catch (fsError) {
      console.warn('⚠️ Error guardando archivo:', fsError)
      
      // Para videos, NO usar base64 fallback ya que es muy pesado
      if (isVideo) {
        throw new Error('Error guardando video. Los videos deben guardarse como archivos físicos.')
      }
      
      // Solo para imágenes, usar base64 fallback
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
    
  } catch (error) {
    console.error('❌ Error en API upload:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error procesando archivo' },
      { status: 500 }
    )
  }
}

// Note: In App Router, body parsing is handled differently
// File size limits can be configured in next.config.js if needed