import { db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import type { ContentData } from "@/hooks/use-content"

const CONTENT_DOC_ID = "website-content"
const COLLECTION_NAME = "hostal-data"

// Datos por defecto
const getDefaultContent = (): ContentData => ({
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
        type: "image" as const,
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.07.05_29417220.jpg-3eeWaNe474kWdzXsophopKdyiCUlbW.jpeg",
        alt: "Fachada del hostal",
      },
      {
        type: "image" as const,
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2016.51.44_4247fa14.jpg-TLpkNK3FIReTv94oiatcfK9XXC4ugl.jpeg",
        alt: "Detalles arquitectónicos",
      },
      {
        type: "image" as const,
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2015.46.57_d9e82168.jpg-Bh4HBqs7fTTwdijxqviqD08miTn2jX.jpeg",
        alt: "Área de restaurante",
      },
      {
        type: "image" as const,
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.07.06_20165b0e.jpg-7CJeiR7FIf0WX0cLbqaGmyctchZOgH.jpeg",
        alt: "Decoración tradicional",
      },
      {
        type: "image" as const,
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.10.22_95b0216a.jpg-I5MQLmHJbMYdpGnGGhsmTbyeHFBdKI.jpeg",
        alt: "Vista interior",
      },
      {
        type: "image" as const,
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
})

// Check if Firebase is available
const isFirebaseAvailable = () => {
  return db !== null && db !== undefined
}

// Leer contenido desde Firebase
export async function readContentFromFirebase(): Promise<ContentData> {
  // If Firebase is not available, return default content
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available, using default content")
    return getDefaultContent()
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, CONTENT_DOC_ID)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      // Filtrar metadata y devolver solo el contenido
      const { metadata, ...contentData } = data
      return contentData as ContentData
    } else {
      // Si no existe el documento, crear uno con datos por defecto
      const defaultContent = getDefaultContent()
      await writeContentToFirebase(defaultContent)
      return defaultContent
    }
  } catch (error) {
    console.error("Error reading from Firebase:", error)
    return getDefaultContent()
  }
}

// Escribir contenido a Firebase
export async function writeContentToFirebase(content: ContentData): Promise<{ success: boolean; error?: string }> {
  // If Firebase is not available, return success false
  if (!isFirebaseAvailable()) {
    console.warn("Firebase not available, cannot write content")
    return { success: false, error: "Firebase not available" }
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, CONTENT_DOC_ID)

    const dataWithMetadata = {
      ...content,
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: "1.0.0",
        updatedBy: "admin",
      },
    }

    await setDoc(docRef, dataWithMetadata)
    return { success: true }
  } catch (error) {
    console.error("Error writing to Firebase:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Actualizar una sección específica
export async function updateSectionInFirebase(
  section: string,
  sectionData: any,
): Promise<{ success: boolean; error?: string }> {
  if (!isFirebaseAvailable()) {
    return { success: false, error: "Firebase not available" }
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, CONTENT_DOC_ID)

    await updateDoc(docRef, {
      [section]: sectionData,
      "metadata.lastUpdated": new Date().toISOString(),
      "metadata.lastSection": section,
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating section in Firebase:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Verificar conexión con Firebase
export async function testFirebaseConnection(): Promise<boolean> {
  if (!isFirebaseAvailable()) {
    return false
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, "connection-test")
    await setDoc(docRef, {
      timestamp: new Date().toISOString(),
      test: true,
    })
    return true
  } catch (error) {
    console.error("Firebase connection test failed:", error)
    return false
  }
}
