import { promises as fs } from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "data", "content.json")

// Asegurar que el directorio data existe
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Leer el archivo JSON
export async function readContentData() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DB_PATH, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading content data:", error)
    // Si el archivo no existe, devolver datos por defecto
    return getDefaultContent()
  }
}

// Escribir al archivo JSON
export async function writeContentData(content: any) {
  try {
    await ensureDataDir()

    // Agregar metadata de actualización
    const dataWithMetadata = {
      ...content,
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: "1.0.0",
      },
    }

    await fs.writeFile(DB_PATH, JSON.stringify(dataWithMetadata, null, 2), "utf8")
    return { success: true }
  } catch (error) {
    console.error("Error writing content data:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Leer una sección específica
export async function readSection(section: string) {
  try {
    const data = await readContentData()
    return data[section] || null
  } catch (error) {
    console.error(`Error reading section ${section}:`, error)
    return null
  }
}

// Actualizar una sección específica
export async function updateSection(section: string, sectionData: any) {
  try {
    const data = await readContentData()
    data[section] = sectionData
    return await writeContentData(data)
  } catch (error) {
    console.error(`Error updating section ${section}:`, error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Datos por defecto si no existe el archivo
function getDefaultContent() {
  return {
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
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2016.51.44_4247fa14.jpg-TLpkNK3FIReTv94oiatcfK9XXC4ugl.jpeg",
          features: ["1 cama doble", "Baño privado", "WiFi"],
          popular: false,
        },
        {
          name: "Habitación Superior",
          description: "Amplio espacio con detalles artesanales y vista a nuestro patio interior.",
          price: "$180/noche",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.07.05_9b539c78.jpg-Lbxbzr2clkfiDEt4Z2bXfas3yClCC4.jpeg",
          features: ["1 cama king", "Baño con jacuzzi", "Balcón privado"],
          popular: false,
        },
        {
          name: "Suite Caprilandia",
          description: "Nuestra suite más exclusiva, con detalles originales y todas las comodidades modernas.",
          price: "$250/noche",
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
      images: [
        {
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.07.05_29417220.jpg-3eeWaNe474kWdzXsophopKdyiCUlbW.jpeg",
          alt: "Fachada del hostal",
        },
        {
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2016.51.44_4247fa14.jpg-TLpkNK3FIReTv94oiatcfK9XXC4ugl.jpeg",
          alt: "Detalles arquitectónicos",
        },
        {
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2015.46.57_d9e82168.jpg-Bh4HBqs7fTTwdijxqviqD08miTn2jX.jpeg",
          alt: "Área de restaurante",
        },
        {
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.07.06_20165b0e.jpg-7CJeiR7FIf0WX0cLbqaGmyctchZOgH.jpeg",
          alt: "Decoración tradicional",
        },
        {
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen%20de%20WhatsApp%202025-05-16%20a%20las%2017.10.22_95b0216a.jpg-I5MQLmHJbMYdpGnGGhsmTbyeHFBdKI.jpeg",
          alt: "Vista interior",
        },
        {
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
          description:
            "Mantente conectado durante todo tu estancia con nuestro servicio de internet de alta velocidad.",
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
          description:
            "Sumérgete en la arquitectura y el ambiente colonial que caracteriza nuestro hostal y la región.",
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
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: "1.0.0",
    },
  }
}
