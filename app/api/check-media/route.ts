import { NextRequest, NextResponse } from 'next/server'
import { existsSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()
    
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: 'URLs array requerido' }, { status: 400 })
    }

    const results = urls.map((url: string) => {
      try {
        // Solo verificar archivos locales de uploads
        if (url.startsWith('/uploads/')) {
          const filePath = join(process.cwd(), 'public', url)
          const exists = existsSync(filePath)
          
          return {
            url,
            exists,
            path: filePath
          }
        }
        
        // Para URLs externas (Firebase, YouTube, etc), asumir que existen
        return {
          url,
          exists: true,
          external: true
        }
      } catch (error) {
        console.error(`Error verificando ${url}:`, error)
        return {
          url,
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })

    const existingFiles = results.filter(result => result.exists)
    const missingFiles = results.filter(result => !result.exists)

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        existing: existingFiles.length,
        missing: missingFiles.length
      }
    })

  } catch (error) {
    console.error('Error en check-media API:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}