"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface ContentData {
  siteConfig: {
    favicon: string
    logo: string
    title: string
    description: string
  }
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  about: {
    title: string
    description1: string
    description2: string
    image: string
    features: Array<{
      name: string
      icon: string
    }>
  }
  location?: {
    title: string
    subtitle: string
    whyChooseTitle: string
    features: Array<{
      name: string
      description: string
      icon: string
    }>
    highlight: {
      title: string
      description: string
    }
    image: string
    imageAlt: string
    imageCaption: {
      title: string
      subtitle: string
    }
    attractions: {
      title: string
      items: Array<{
        name: string
        description: string
        icon: string
      }>
    }
  }
  rooms: {
    title: string
    subtitle: string
    rooms: Array<{
      name: string
      description: string
      price?: string
      showPrice: boolean
      image: string // Mantenemos para compatibilidad hacia atrás
      media?: Array<{
        type: 'image' | 'video'
        url: string
        alt: string
        thumbnail?: string
      }>
      features: string[]
      popular: boolean
    }>
  }
  virtualTour: {
    title: string
    subtitle: string
    videoUrl: string
  }
  gallery: {
    title: string
    subtitle: string
    items: Array<{
      type: 'image' | 'video'
      url: string
      alt: string
      thumbnail?: string // Para videos, imagen de vista previa
    }>
  }
  services: {
    title: string
    subtitle: string
    services: Array<{
      name: string
      description: string
      icon: string
    }>
  }
  testimonials: {
    title: string
    subtitle: string
    note: string
    testimonials: Array<{
      name: string
      comment: string
      rating: number
      date: string
    }>
    reviews: Array<{
      name: string
      rating: number
      comment: string
      initials: string
      mapLink: string
    }>
  }
  contact: {
    title: string
    subtitle: string
    description: string
    phone: string
    whatsapp: string
    email: string
    address: string
    hours: string
    socialLinks: {
      facebook: string
      instagram: string
      youtube: string
    }
  }
  footer?: {
    description: string
    copyright: string
    tagline: string
  }
  ui?: {
    navigation: {
      home: string
      rooms: string
      gallery: string
      services: string
      contact: string
      book: string
    }
    buttons: {
      viewRooms: string
      bookNow: string
      book: string
      checkAvailability: string
      viewGallery: string
      sendWhatsApp: string
    }
    messages: {
      noGallery: string
      noGalleryItems: string
      videoNotSupported: string
      videoNotSupportedFull: string
      fileCount: string
    }
    labels: {
      galleryOf: string
      video: string
      image: string
      of: string
    }
  }
  map?: {
    latitude: string
    longitude: string
    zoom: string
    title: string
    embedUrl: string
    directUrl: string
  }
}

// Contenido por defecto para Firebase-only architecture
const defaultContent: ContentData = {
  siteConfig: {
    favicon: "",
    logo: "",
    title: "Hostal Caprilandia - Cargando...",
    description: "Cargando contenido desde Firebase...",
  },
  hero: {
    title: "Cargando...",
    subtitle: "Conectando con Firebase",
    backgroundImage: "",
  },
  about: {
    title: "Cargando...",
    description1: "",
    description2: "",
    image: "",
    features: [],
  },
  rooms: {
    title: "Cargando habitaciones...",
    subtitle: "",
    rooms: [],
  },
  virtualTour: {
    title: "Cargando...",
    subtitle: "",
    videoUrl: "",
  },
  gallery: {
    title: "Cargando galería...",
    subtitle: "",
    items: [],
  },
  services: {
    title: "Cargando servicios...",
    subtitle: "",
    services: [],
  },
  testimonials: {
    title: "Cargando testimonios...",
    subtitle: "",
    note: "",
    testimonials: [],
    reviews: [],
  },
  contact: {
    title: "Contacto",
    subtitle: "",
    description: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    hours: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
    },
  },
}

// Función para migrar formato de galería (legacy support)
function migrateGalleryFormat(content: any): ContentData {
  if (!content.gallery?.items) {
    return content
  }

  // Verificar si ya está en el nuevo formato
  const isNewFormat = content.gallery.items.every((item: any) => 
    item.type && (item.type === 'image' || item.type === 'video')
  )

  if (isNewFormat) {
    return content
  }

  // Migrar formato antiguo al nuevo
  const migratedItems = content.gallery.items.map((item: any) => {
    if (typeof item === 'string') {
      // Item simple como string
      return {
        type: 'image' as const,
        url: item,
        alt: 'Imagen de galería'
      }
    }
    
    if (item.url) {
      // Item con estructura pero sin tipo
      return {
        type: 'image' as const,
        url: item.url,
        alt: item.alt || 'Imagen de galería',
        thumbnail: item.thumbnail
      }
    }
    
    return item
  })

  return {
    ...content,
    gallery: {
      ...content.gallery,
      items: migratedItems
    }
  }
}

// Hook principal para gestión de contenido - Firebase Only
export function useContent() {
  const [content, setContent] = useState<ContentData>(defaultContent)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Función para cargar contenido directamente desde Firebase
  const loadContent = useCallback(async (bustCache: boolean = false) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log(`🔥 Cargando contenido desde Firebase... ${bustCache ? '(cache busted)' : ''}`)

      const url = `/api/content${bustCache ? '?bust=true' : ''}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: bustCache ? "no-store" : "default",
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          // Migrar formato de galería si es necesario
          const migratedData = migrateGalleryFormat(result.data)
          setContent(migratedData)
          setIsConnected(true)
          setError(null)
          console.log(`✅ Contenido cargado desde Firebase ${result.cacheInfo?.version ? `(v${result.cacheInfo.version})` : ''}`)
        } else {
          throw new Error(result.error || "Error cargando contenido")
        }
      } else {
        throw new Error(`HTTP Error: ${response.status}`)
      }
    } catch (error) {
      console.error("❌ Error cargando contenido desde Firebase:", error)
      setIsConnected(false)
      setError("Error conectando con Firebase")
      // No fallback a localStorage - mantener loading state
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función para guardar contenido directamente en Firebase
  const saveContent = useCallback(
    async (newContent: ContentData) => {
      try {
        console.log("💾 Guardando contenido en Firebase...")

        const response = await fetch("/api/content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newContent }),
        })

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          setIsConnected(true)
          setError(null)
          console.log("✅ Contenido guardado en Firebase")
          return { success: true }
        } else {
          throw new Error(result.error || "Error guardando en Firebase")
        }
      } catch (error) {
        console.error("❌ Error guardando contenido en Firebase:", error)
        setIsConnected(false)
        setError("Error guardando en Firebase")
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error"
        }
      }
    },
    []
  )

  // Función para actualizar contenido con auto-save
  const updateContent = useCallback(
    (newContent: ContentData) => {
      setContent(newContent)

      // Auto-save después de 2 segundos de inactividad
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        saveContent(newContent)
      }, 2000)
    },
    [saveContent]
  )

  // Función para refrescar contenido manualmente con cache busting
  const refreshContent = useCallback(async () => {
    console.log("🔄 Refrescando contenido con cache busting...")
    await loadContent(true) // Force cache bust on refresh
  }, [loadContent])

  // Cargar contenido al inicializar el hook
  useEffect(() => {
    loadContent()
  }, [loadContent])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  return {
    content,
    isLoading,
    error,
    isConnected,
    setContent: updateContent, // Alias for backward compatibility
    updateContent,
    saveContent,
    saveChanges: saveContent, // Alias for backward compatibility  
    refreshContent,
    loadContent,
  }
}