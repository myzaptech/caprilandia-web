import { type NextRequest, NextResponse } from "next/server"
import { readContentFromFirebase, writeContentToFirebase } from "@/lib/firebase-db"

// GET - Obtener todo el contenido desde Firebase con cache optimized
export async function GET(request: NextRequest) {
  try {
    console.log("API: Fetching content from Firebase...")
    
    // Check for cache-busting parameter
    const url = new URL(request.url)
    const bustCache = url.searchParams.get('bust') === 'true'
    const timestamp = new Date().toISOString()
    
    const content = await readContentFromFirebase()

    const response = NextResponse.json({
      success: true,
      data: content,
      source: "firebase",
      timestamp,
      cacheInfo: {
        bustCache,
        version: Date.now().toString(36), // Short version string
      }
    })

    // Set cache headers for Firebase-only architecture
    if (bustCache) {
      // Cache busting - no cache
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
    } else {
      // Short cache for performance but ensure freshness
      response.headers.set('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=120')
    }
    
    // Add content versioning headers
    response.headers.set('X-Content-Version', Date.now().toString())
    response.headers.set('X-Content-Source', 'firebase')
    response.headers.set('ETag', `"${Date.now()}"`)

    return response
  } catch (error) {
    console.error("API Error fetching content from Firebase:", error)

    const errorResponse = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch content from Firebase",
        details: error instanceof Error ? error.message : "Unknown error",
        source: "firebase",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )

    // No caching for errors
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    return errorResponse
  }
}

// POST - Actualizar todo el contenido en Firebase con cache invalidation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content data",
          source: "firebase",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    console.log("API: Writing content to Firebase...")
    
    // Escribir el contenido a Firebase
    const result = await writeContentToFirebase(content)

    if (result.success) {
      const response = NextResponse.json({
        success: true,
        message: "Content updated successfully in Firebase",
        source: "firebase",
        timestamp: new Date().toISOString(),
        cacheInfo: {
          invalidated: true,
          newVersion: Date.now().toString(36),
        }
      })

      // Invalidate caches after successful update
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('X-Content-Updated', 'true')
      response.headers.set('X-Cache-Invalidated', 'true')

      return response
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to update content in Firebase",
          source: "firebase",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API Error updating content in Firebase:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update content in Firebase",
        details: error instanceof Error ? error.message : "Unknown error",
        source: "firebase",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
