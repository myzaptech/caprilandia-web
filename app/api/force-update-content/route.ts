import { NextRequest, NextResponse } from 'next/server'
import { readContentFromFirebase } from '@/lib/firebase-db'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Recargando contenido desde Firebase...')
    
    // Cargar contenido directamente desde Firebase
    const content = await readContentFromFirebase()
    
    if (content) {
      // Verificar que tengamos contenido válido
      const rooms = content.rooms?.rooms || []
      let videoCount = 0
      
      rooms.forEach((room: any) => {
        const videos = room.media?.filter((m: any) => m.type === 'video') || []
        videoCount += videos.length
        if (videos.length > 0) {
          console.log(`🎥 Habitación "${room.name}" tiene ${videos.length} videos`)
        }
      })
      
      console.log(`📊 Total de videos encontrados en Firebase: ${videoCount}`)
      
      return NextResponse.json({
        success: true,
        message: 'Contenido recargado desde Firebase',
        videosFound: videoCount,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'No se pudo cargar contenido desde Firebase'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Error recargando contenido:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}