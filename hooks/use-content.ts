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
    description: string
    whatsapp: string
    email: string
    address: string
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

// Datos por defecto como fallback
const defaultContent: ContentData = {
  siteConfig: {
    favicon: "",
    logo: "",
    title: "Hostal Caprilandia - Donde la tradición y la comodidad se encuentran",
    description:
      "Descubre la experiencia única del Hostal Caprilandia, un refugio acogedor que combina la calidez de un hogar con la comodidad moderna.",
  },
  hero: {
    title: "Hostal Caprilandia",
    subtitle: "Donde la tradición y la comodidad se encuentran",
    backgroundImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.07.07_afd07f47.jpg-FB6tz2Q2qWXSTPnQVQyvw64Cso6zam.jpeg",
  },
  about: {
    title: "Bienvenidos a Caprilandia",
    description1:
      "Ubicado en un entorno privilegiado, el Hostal Caprilandia es un refugio acogedor que combina la calidez de un hogar con la comodidad que necesitas para disfrutar de tu estancia.",
    description2:
      "Nuestros espacios llenos de color, detalles artesanales y un ambiente familiar crean una experiencia única que te hará sentir como en casa.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.10.22_95b0216a.jpg-I5MQLmHJbMYdpGnGGhsmTbyeHFBdKI.jpeg",
    features: [
      { name: "Ambiente familiar", icon: "users" },
      { name: "WiFi de alta velocidad", icon: "wifi" },
      { name: "Ubicación privilegiada", icon: "map-pin" },
      { name: "Check-in 24/7", icon: "clock" },
    ],
  },
  rooms: {
    title: "Muestra de Habitaciones",
    subtitle:
      "Descubre nuestros espacios únicos diseñados para brindarte comodidad y una experiencia auténtica durante tu estadía.",
    rooms: [
      {
        name: "Habitación Standard",
        description: "Ideal para viajeros que buscan comodidad y autenticidad a un precio accesible.",
        price: "$120/noche",
        showPrice: true,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2016.51.44_4247fa14.jpg-TLpkNK3FIReTv94oiatcfK9XXC4ugl.jpeg",
        features: ["1 cama doble", "Baño privado", "WiFi"],
        popular: false,
      },
      {
        name: "Habitación Superior",
        description: "Amplio espacio con detalles artesanales y vista a nuestro patio interior.",
        price: "$180/noche",
        showPrice: true,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.07.05_9b539c78.jpg-Lbxbzr2clkfiDEt4Z2bXfas3yClCC4.jpeg",
        features: ["1 cama king", "Baño con jacuzzi", "Balcón privado"],
        popular: false,
      },
      {
        name: "Suite Caprilandia",
        description: "Nuestra suite más exclusiva, con detalles originales y todas las comodidades modernas.",
        price: "$250/noche",
        showPrice: true,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.07.07_0e74c316.jpg-OM1mNM8adZDhivB8RzKRa6uQmkQ4TI.jpeg",
        features: ["Dormitorio + sala", "Baño completo", "Terraza privada"],
        popular: false,
      },
    ],
  },
  virtualTour: {
    title: "Tour Virtual",
    subtitle: "Conoce cada rincón de nuestro hostal Caprilandia a través de este recorrido virtual.",
    videoUrl: "https://www.youtube.com/embed/73uIlU90th0",
  },
  gallery: {
    title: "Galería",
    subtitle: "Un vistazo a los espacios que hacen único a nuestro hostal.",
    items: [
      {
        type: "image",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.07.05_29417220.jpg-3eeWaNe474kWdzXsophopKdyiCUlbW.jpeg",
        alt: "Fachada del hostal",
      },
      {
        type: "image",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2016.51.44_4247fa14.jpg-TLpkNK3FIReTv94oiatcfK9XXC4ugl.jpeg",
        alt: "Detalles arquitectónicos",
      },
      {
        type: "image",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2015.46.57_d9e82168.jpg-Bh4HBqs7fTTwdijxqviqD08miTn2jX.jpeg",
        alt: "Área de restaurante",
      },
      {
        type: "image",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.07.06_20165b0e.jpg-7CJeiR7FIf0WX0cLbqaGmyctchZOgH.jpeg",
        alt: "Decoración tradicional",
      },
      {
        type: "image",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.10.22_95b0216a.jpg-I5MQLmHJbMYdpGnGGhsmTbyeHFBdKI.jpeg",
        alt: "Vista interior",
      },
      {
        type: "image",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2015.46.57_8ba5e1de.jpg-BDqgTOAKgB9QSVi9n9hfs4CS62JFvR.jpeg",
        alt: "Letrero Caprilandia",
      },
    ],
  },
  services: {
    title: "Nuestros Servicios",
    subtitle: "Más que un lugar para dormir, una experiencia auténtica.",
    services: [
      {
        name: "Habitaciones Confortables",
        description:
          "Disfruta de nuestras habitaciones decoradas con un estilo único, combinando comodidad y autenticidad.",
        icon: "bed",
      },
      {
        name: "Desayuno Casero",
        description: "Comienza tu día con un desayuno preparado con ingredientes locales y recetas tradicionales.",
        icon: "utensils-crossed",
      },
      {
        name: "WiFi Gratuito",
        description: "Mantente conectado durante todo tu estancia con nuestro servicio de internet de alta velocidad.",
        icon: "wifi",
      },
      {
        name: "Tours Locales",
        description:
          "Ofrecemos información y organización de tours para que conozcas los mejores lugares de la región.",
        icon: "mountain",
      },
      {
        name: "Experiencia Colonial",
        description: "Sumérgete en la arquitectura y el ambiente colonial que caracteriza nuestro hostal y la región.",
        icon: "home",
      },
      {
        name: "Áreas Comunes",
        description:
          "Disfruta de nuestros espacios compartidos, ideales para relajarte y socializar con otros viajeros.",
        icon: "users",
      },
    ],
  },
  testimonials: {
    title: "Lo que dicen nuestros huéspedes",
    subtitle: "Experiencias reales de viajeros que han disfrutado de nuestro hostal.",
    note: "El número de teléfono registrado en Google Maps no está relacionado al establecimiento. Estamos trabajando en solucionar este inconveniente. Para contacto directo, utiliza nuestro WhatsApp oficial.",
    reviews: [
      {
        name: "María González",
        rating: 5,
        comment:
          "Una experiencia auténtica que nos encantó. Cada detalle del hostal respira calidez y encanto. El personal fue excepcionalmente amable y servicial.",
        initials: "MG",
        mapLink: "https://g.co/kgs/3c4hdq1",
      },
      {
        name: "John Smith",
        rating: 5,
        comment:
          "El balance perfecto entre autenticidad y comodidad. Nos encantó el ambiente familiar y la decoración única. Volveremos pronto.",
        initials: "JS",
        mapLink: "https://g.co/kgs/RXStUEn",
      },
      {
        name: "Ana Rodríguez",
        rating: 4,
        comment:
          "El hostal superó todas nuestras expectativas. La combinación de colores y el ambiente acogedor hacen de este lugar algo especial. Volveremos sin duda.",
        initials: "AR",
        mapLink: "https://g.co/kgs/FSxqwfx",
      },
    ],
  },
  contact: {
    title: "Reserva tu estadía",
    description:
      "Estamos disponibles para responder tus preguntas y ayudarte a planificar tu visita. Completa el formulario o contáctanos directamente.",
    whatsapp: "+57 318 265 8636",
    email: "info@caprilandia.com",
    address: "Calle Principal 123, Ciudad, País",
    socialLinks: {
      facebook: "https://www.facebook.com/people/Hostal-Caprilandia-Ardila/100063707374733/",
      instagram: "https://www.instagram.com/hostalcaprilandia/",
      youtube: "https://www.youtube.com/@caprilandia4701",
    },
  },
}

// Función para migrar formato de galería de images a items
const migrateGalleryFormat = (data: any): ContentData => {
  let migratedData = { ...data }
  
  // Migración para galería
  if (!migratedData.gallery?.items) {
    if (migratedData.gallery?.images) {
      migratedData.gallery = {
        ...migratedData.gallery,
        items: migratedData.gallery.images.map((image: any) => ({
          type: 'image' as const,
          url: image.url,
          alt: image.alt
        }))
      }
    } else {
      migratedData.gallery = defaultContent.gallery
    }
  }
  
  // Migración para habitaciones: convertir image a media array
  if (migratedData.rooms?.rooms) {
    migratedData.rooms.rooms = migratedData.rooms.rooms.map((room: any) => {
      // Si ya tiene media array, mantenerlo
      if (room.media) {
        return room
      }
      
      // Si tiene image string, convertir a media array
      if (room.image) {
        return {
          ...room,
          media: [{
            type: 'image' as const,
            url: room.image,
            alt: room.name || 'Habitación'
          }]
        }
      }
      
      // Si no tiene ni image ni media, crear array vacío
      return {
        ...room,
        image: room.image || '',
        media: []
      }
    })
  }
  
  return migratedData as ContentData
}

export function useContent() {
  const [content, setContentState] = useState<ContentData>(defaultContent)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [useLocalStorage, setUseLocalStorage] = useState(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Función para cargar contenido desde localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem("hostal-content")
      if (stored) {
        const parsedContent = JSON.parse(stored)
        const migratedContent = migrateGalleryFormat(parsedContent)
        setContentState(migratedContent)
        console.log("📱 Contenido cargado desde localStorage")
        return true
      }
    } catch (error) {
      console.error("Error cargando desde localStorage:", error)
    }
    return false
  }, [])

  // Función para guardar en localStorage
  const saveToLocalStorage = useCallback((content: ContentData) => {
    try {
      localStorage.setItem("hostal-content", JSON.stringify(content))
      console.log("💾 Contenido guardado en localStorage")
      return true
    } catch (error) {
      console.error("Error guardando en localStorage:", error)
      return false
    }
  }, [])

  // Función para cargar contenido (Firebase o localStorage)
  const loadContent = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Cargar desde localStorage PRIMERO para mostrar contenido inmediatamente
      console.log("📱 Cargando desde localStorage para mostrar contenido inmediatamente...")
      const loadedFromLocal = loadFromLocalStorage()

      if (loadedFromLocal) {
        // Si hay datos en localStorage, usarlos inmediatamente
        console.log("✅ Contenido cargado desde localStorage")
        setIsConnected(false)
        setUseLocalStorage(true)
        setError("Contenido local cargado - Intentando conexión con Firebase...")
        setIsLoading(false) // Mostrar contenido inmediatamente
      } else {
        // Si no hay datos locales, usar contenido por defecto inmediatamente
        console.log("📦 Usando contenido por defecto")
        setContentState(defaultContent)
        setIsConnected(false)
        setUseLocalStorage(true)
        setError("Contenido por defecto cargado - Intentando conexión con Firebase...")
        setIsLoading(false) // Mostrar contenido inmediatamente
      }

      // Luego intentar cargar desde Firebase en segundo plano
      try {
        console.log("🔥 Intentando cargar desde Firebase en segundo plano...")

        const response = await fetch("/api/content", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            // Migrar formato de galería si es necesario
            const migratedData = migrateGalleryFormat(result.data)
            setContentState(migratedData)
            setIsConnected(true)
            setUseLocalStorage(false)
            setError(null)
            // Guardar backup en localStorage
            saveToLocalStorage(migratedData)
            console.log("✅ Contenido actualizado desde Firebase")
            return
          }
        }
      } catch (firebaseError) {
        console.warn("⚠️ No se pudo conectar con Firebase:", firebaseError)
        // Mantener el contenido local que ya se cargó
      }
    } catch (error) {
      console.error("❌ Error cargando contenido:", error)
      // Como último recurso, usar contenido por defecto
      setContentState(defaultContent)
      setIsConnected(false)
      setUseLocalStorage(true)
      setError("Usando contenido por defecto")
      setIsLoading(false)
    }
  }, [loadFromLocalStorage, saveToLocalStorage])

  // Función para guardar contenido
  const saveContent = useCallback(
    async (newContent: ContentData) => {
      try {
        console.log("💾 Guardando contenido...")

        // Si estamos usando localStorage, guardar ahí
        if (useLocalStorage) {
          const success = saveToLocalStorage(newContent)
          if (success) {
            setError("Guardado en almacenamiento local")
            return { success: true }
          } else {
            throw new Error("Error guardando en localStorage")
          }
        }

        // Intentar guardar en Firebase
        const response = await fetch("/api/content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newContent }),
        })

        if (!response.ok) {
          throw new Error("Error de Firebase, usando localStorage")
        }

        const result = await response.json()

        if (result.success) {
          setIsConnected(true)
          setError(null)
          // Guardar backup en localStorage también
          saveToLocalStorage(newContent)
          console.log("✅ Contenido guardado en Firebase")
          return { success: true }
        } else {
          throw new Error(result.error || "Error guardando en Firebase")
        }
      } catch (error) {
        console.warn("⚠️ Error con Firebase, guardando en localStorage...")

        // Fallback a localStorage
        const success = saveToLocalStorage(newContent)
        setIsConnected(false)
        setUseLocalStorage(true)

        if (success) {
          setError("Guardado en almacenamiento local (Firebase no disponible)")
          return { success: true }
        } else {
          setError("Error guardando contenido")
          return {
            success: false,
            error: "Error guardando contenido",
          }
        }
      }
    },
    [useLocalStorage, saveToLocalStorage],
  )

  // Función para actualizar contenido con auto-guardado
  const setContent = useCallback(
    (newContent: ContentData | ((prev: ContentData) => ContentData)) => {
      const updatedContent = typeof newContent === "function" ? newContent(content) : newContent

      // Actualizar estado local inmediatamente
      setContentState(updatedContent)

      // Cancelar auto-guardado anterior si existe
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      // Programar auto-guardado
      autoSaveTimeoutRef.current = setTimeout(async () => {
        console.log("🔄 Auto-guardando...")
        const result = await saveContent(updatedContent)
        if (result.success) {
          console.log("✅ Auto-guardado exitoso")
        } else {
          console.error("❌ Error en auto-guardado:", result.error)
        }
      }, 2000)

      return { success: true }
    },
    [content, saveContent],
  )

  // Función para guardar cambios manualmente
  const saveChanges = useCallback(async () => {
    // Cancelar auto-guardado si está pendiente
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
      autoSaveTimeoutRef.current = null
    }

    const result = await saveContent(content)
    return result
  }, [content, saveContent])

  // Cargar contenido al montar el componente
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

  // Función para refrescar contenido manualmente
  const refreshContent = useCallback(() => {
    return loadContent()
  }, [loadContent])

  return {
    content,
    setContent,
    saveChanges,
    isLoading,
    error,
    isConnected,
    refreshContent,
  }
}
