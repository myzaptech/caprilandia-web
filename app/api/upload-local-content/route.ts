import { NextRequest, NextResponse } from 'next/server'
import { writeContentToFirebase } from '@/lib/firebase-db'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('📁 Cargando contenido desde archivo local...')
    
    // Leer contenido desde archivo local
    const contentPath = join(process.cwd(), 'data', 'content.json')
    
    if (!existsSync(contentPath)) {
      return NextResponse.json({ 
        success: false, 
        error: 'No se encontró archivo content.json local. Ejecuta: node scripts/create-content.js'
      }, { status: 404 })
    }
    
    const contentData = JSON.parse(readFileSync(contentPath, 'utf8'))
    
    // Verificar que tengamos videos en el contenido
    const rooms = contentData.rooms?.rooms || []
    let videoCount = 0
    
    rooms.forEach((room: any) => {
      const videos = room.media?.filter((m: any) => m.type === 'video') || []
      videoCount += videos.length
      if (videos.length > 0) {
        console.log(`🎥 Habitación "${room.name}" tiene ${videos.length} videos:`)
        videos.forEach((video: any, index: number) => {
          console.log(`   Video ${index + 1}: ${video.url}`)
        })
      }
    })
    
    console.log(`📊 Total de videos en contenido local: ${videoCount}`)
    
    if (videoCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No se encontraron videos en el contenido local'
      }, { status: 400 })
    }
    
    console.log('🔥 Subiendo contenido con videos a Firebase...')
    
    // Subir a Firebase
    const result = await writeContentToFirebase(contentData)
    
    if (result.success) {
      console.log('✅ Contenido subido exitosamente a Firebase!')
      
      return NextResponse.json({
        success: true,
        message: 'Contenido con videos subido a Firebase exitosamente',
        videosUploaded: videoCount,
        rooms: rooms.length,
        timestamp: new Date().toISOString()
      })
    } else {
      throw new Error(result.error || 'Error subiendo a Firebase')
    }
    
  } catch (error) {
    console.error('❌ Error subiendo contenido:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}