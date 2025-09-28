import { type NextRequest, NextResponse } from "next/server"
import { readSection, updateSection } from "@/lib/json-db"

// GET - Obtener contenido de una sección específica
export async function GET(request: NextRequest, { params }: { params: { section: string } }) {
  try {
    const { section } = params
    const sectionData = await readSection(section)

    if (!sectionData) {
      return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: sectionData,
      section: section,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching section content:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch section content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// PUT - Actualizar contenido de una sección específica
export async function PUT(request: NextRequest, { params }: { params: { section: string } }) {
  try {
    const { section } = params
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 })
    }

    const result = await updateSection(section, content)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Section ${section} updated successfully`,
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to update section",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error updating section content:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update section content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
