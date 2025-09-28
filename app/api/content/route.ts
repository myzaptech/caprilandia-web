import { type NextRequest, NextResponse } from "next/server"
import { readContentFromFirebase, writeContentToFirebase } from "@/lib/firebase-db"

// GET - Obtener todo el contenido desde Firebase
export async function GET() {
  try {
    console.log("API: Fetching content from Firebase...")
    const content = await readContentFromFirebase()

    return NextResponse.json({
      success: true,
      data: content,
      source: "firebase",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API Error fetching content from Firebase:", error)

    // Return a more detailed error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch content from Firebase",
        details: error instanceof Error ? error.message : "Unknown error",
        source: "firebase",
      },
      { status: 500 },
    )
  }
}

// POST - Actualizar todo el contenido en Firebase
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
        },
        { status: 400 },
      )
    }

    console.log("API: Writing content to Firebase...")
    // Escribir el contenido a Firebase
    const result = await writeContentToFirebase(content)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Content updated successfully in Firebase",
        source: "firebase",
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to update content in Firebase",
          source: "firebase",
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
      },
      { status: 500 },
    )
  }
}
