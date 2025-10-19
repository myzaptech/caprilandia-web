import { NextRequest, NextResponse } from 'next/server'
import { writeContentToFirebase, readContentFromFirebase } from '@/lib/firebase-db'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Reemplazando contenido completo en Firebase...')
    
    // Leer contenido desde archivo local
    const contentPath = join(process.cwd(), 'data', 'content.json')
    
    if (!existsSync(contentPath)) {
      return NextResponse.json({ 
        success: false, 
        error: 'No se encontró archivo content.json local. Ejecuta: node scripts/create-content.js'
      }, { status: 404 })
    }
    
    const newContent = JSON.parse(readFileSync(contentPath, 'utf8'))
    
    // Mostrar contenido actual vs nuevo
    console.log('📋 Obteniendo contenido actual de Firebase...')
    const currentContent = await readContentFromFirebase()
    
    const currentRooms = currentContent.rooms?.rooms || []
    const newRooms = newContent.rooms?.rooms || []
    
    console.log(`📊 Contenido ACTUAL en Firebase:`)
    console.log(`   - Habitaciones: ${currentRooms.length}`)
    currentRooms.forEach((room: any, index: number) => {
      const videos = room.media?.filter((m: any) => m.type === 'video') || []
      console.log(`   - ${room.name}: ${videos.length} videos`)
      videos.forEach((video: any, vIndex: number) => {
        console.log(`     Video ${vIndex + 1}: ${video.url || '(VACÍO)'}`)
      })
    })
    
    console.log(`📊 Contenido NUEVO a subir:`)
    console.log(`   - Habitaciones: ${newRooms.length}`)
    newRooms.forEach((room: any, index: number) => {
      const videos = room.media?.filter((m: any) => m.type === 'video') || []
      console.log(`   - ${room.name}: ${videos.length} videos`)
      videos.forEach((video: any, vIndex: number) => {
        console.log(`     Video ${vIndex + 1}: ${video.url}`)
      })
    })
    
    console.log('🔥 REEMPLAZANDO contenido completo en Firebase...')
    
    // Reemplazar completamente el contenido
    const result = await writeContentToFirebase(newContent)
    
    if (result.success) {
      console.log('✅ Contenido REEMPLAZADO exitosamente en Firebase!')
      
      // Contar videos en el nuevo contenido
      let totalVideos = 0
      newRooms.forEach((room: any) => {
        const videos = room.media?.filter((m: any) => m.type === 'video') || []
        totalVideos += videos.length
      })
      
      return NextResponse.json({
        success: true,
        message: 'Contenido completamente reemplazado en Firebase',
        oldRooms: currentRooms.length,
        newRooms: newRooms.length,
        totalVideos: totalVideos,
        action: 'COMPLETE_REPLACEMENT',
        timestamp: new Date().toISOString()
      })
    } else {
      throw new Error(result.error || 'Error reemplazando contenido en Firebase')
    }
    
  } catch (error) {
    console.error('❌ Error reemplazando contenido:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}