const fs = require('fs');
const path = require('path');

// Script para crear contenido con videos automáticamente detectados
async function createContentWithVideos() {
  try {
    console.log('🎬 Detectando videos disponibles...');
    
    const videosDir = path.join(__dirname, '..', 'public', 'uploads', 'videos');
    const videoFiles = fs.readdirSync(videosDir).filter(file => 
      file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mov')
    );
    
    console.log(`📹 Encontrados ${videoFiles.length} videos:`, videoFiles);
    
    // Crear estructura de contenido completa
    const content = {
      siteConfig: {
        favicon: "/uploads/images/favicon.ico",
        logo: "/uploads/images/caprilandia-logo.png", 
        title: "Hostal Caprilandia - Zapatoca, Santander",
        description: "Hostal Caprilandia en Zapatoca, Santander. Experiencia auténtica en un pueblo colonial con habitaciones cómodas y atención personalizada."
      },
      hero: {
        title: "Bienvenidos a Caprilandia",
        subtitle: "Un refugio de autenticidad en el corazón de Zapatoca",
        backgroundImage: "/uploads/images/hero-background.jpg"
      },
      about: {
        title: "Nuestra Historia",
        description1: "Caprilandia es más que un hostal; es un refugio donde el pasado y el presente se encuentran para crear experiencias memorables.",
        description2: "Ubicado en el encantador pueblo colonial de Zapatoca, ofrecemos hospitalidad auténtica en un ambiente familiar y acogedor.",
        image: "/uploads/images/about-interior.jpg",
        features: [
          { name: "Ambiente Familiar", icon: "users" },
          { name: "WiFi Gratuito", icon: "wifi" },
          { name: "Ubicación Central", icon: "map-pin" },
          { name: "Atención 24/7", icon: "clock" }
        ]
      },
      rooms: {
        title: "Nuestras Habitaciones",
        subtitle: "Comodidad y autenticidad en cada espacio",
        rooms: [
          {
            name: "Habitación Standard",
            description: "Habitación cómoda con todas las comodidades básicas para una estancia placentera.",
            price: "Desde $50,000/noche",
            showPrice: true,
            image: "/uploads/images/room-standard.jpg",
            media: videoFiles.slice(0, 1).map((video, index) => ({
              type: "video",
              url: `/uploads/videos/${video}`,
              alt: `Video de Habitación Standard ${index + 1}`,
              thumbnail: "/uploads/thumbnails/room-standard-thumb.jpg"
            })),
            features: ["Cama doble", "Baño privado", "WiFi", "Ventilador"],
            popular: false
          },
          {
            name: "Habitación Deluxe", 
            description: "Habitación espaciosa con vistas al pueblo y comodidades premium.",
            price: "Desde $70,000/noche",
            showPrice: true,
            image: "/uploads/images/room-deluxe.jpg",
            media: videoFiles.slice(1, 2).map((video, index) => ({
              type: "video",
              url: `/uploads/videos/${video}`,
              alt: `Video de Habitación Deluxe ${index + 1}`,
              thumbnail: "/uploads/thumbnails/room-deluxe-thumb.jpg"
            })),
            features: ["Cama queen", "Baño privado", "WiFi", "A/C", "Balcón"],
            popular: true
          },
          {
            name: "Habitación Familiar",
            description: "Ideal para familias, con espacio amplio y múltiples camas.",
            price: "Desde $90,000/noche", 
            showPrice: true,
            image: "/uploads/images/room-family.jpg",
            media: videoFiles.slice(2, 3).map((video, index) => ({
              type: "video",
              url: `/uploads/videos/${video}`,
              alt: `Video de Habitación Familiar ${index + 1}`,
              thumbnail: "/uploads/thumbnails/room-family-thumb.jpg"
            })),
            features: ["2 camas dobles", "Baño privado", "WiFi", "Área de estar"],
            popular: false
          }
        ]
      },
      virtualTour: {
        title: "Tour Virtual",
        subtitle: "Conoce nuestras instalaciones desde casa",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      gallery: {
        title: "Galería",
        subtitle: "Descubre la belleza de nuestro hostal y Zapatoca",
        items: [
          ...videoFiles.map((video, index) => ({
            type: "video",
            url: `/uploads/videos/${video}`,
            alt: `Video ${index + 1} - Hostal Caprilandia`,
            thumbnail: `/uploads/thumbnails/video-${index + 1}-thumb.jpg`
          })),
          {
            type: "image",
            url: "/uploads/images/gallery-1.jpg",
            alt: "Fachada del hostal"
          },
          {
            type: "image", 
            url: "/uploads/images/gallery-2.jpg",
            alt: "Patio interior"
          }
        ]
      },
      services: {
        title: "Nuestros Servicios",
        subtitle: "Todo lo que necesitas para una estancia perfecta",
        services: [
          { name: "Alojamiento Cómodo", description: "Habitaciones limpias y confortables", icon: "bed" },
          { name: "Desayuno", description: "Desayuno continental incluido", icon: "utensils-crossed" },
          { name: "WiFi Gratuito", description: "Internet de alta velocidad", icon: "wifi" },
          { name: "Tours Locales", description: "Excursiones a sitios de interés", icon: "mountain" },
          { name: "Ambiente Familiar", description: "Atención personalizada y cálida", icon: "home" },
          { name: "Grupos", description: "Tarifas especiales para grupos", icon: "users" }
        ]
      },
      testimonials: {
        title: "Lo que Dicen Nuestros Huéspedes",
        subtitle: "Experiencias reales de quienes nos han visitado",
        note: "Las siguientes reseñas son ejemplos basados en comentarios típicos de huéspedes. Visítanos para crear tu propia experiencia memorable.",
        testimonials: [],
        reviews: [
          {
            name: "María González",
            rating: 5,
            comment: "Excelente atención y muy limpio. La ubicación es perfecta para conocer Zapatoca.",
            initials: "MG",
            mapLink: "https://goo.gl/maps/example1"
          },
          {
            name: "Carlos Rodríguez", 
            rating: 5,
            comment: "Un lugar muy acogedor, se siente como en casa. Altamente recomendado.",
            initials: "CR",
            mapLink: "https://goo.gl/maps/example2"
          },
          {
            name: "Ana Martínez",
            rating: 4,
            comment: "Muy buena relación calidad-precio. El personal es muy amable.",
            initials: "AM",
            mapLink: "https://goo.gl/maps/example3"
          }
        ]
      },
      contact: {
        title: "Contacto",
        subtitle: "¿Listo para tu próxima aventura?",
        description: "Estamos aquí para hacer de tu estancia una experiencia inolvidable. Contáctanos para reservas o información.",
        phone: "+57 300 123 4567",
        whatsapp: "+57 300 123 4567",
        email: "info@hostalcaprilandia.com",
        address: "Calle Principal #123, Zapatoca, Santander",
        hours: "24 horas",
        socialLinks: {
          facebook: "https://facebook.com/hostalcaprilandia",
          instagram: "https://instagram.com/hostalcaprilandia", 
          youtube: "https://youtube.com/@hostalcaprilandia"
        }
      },
      footer: {
        description: "Un refugio de autenticidad donde el pasado y el presente se encuentran para crear experiencias memorables.",
        copyright: "2025 Hostal Caprilandia. Todos los derechos reservados.",
        tagline: "Hostal Caprilandia | Alojamiento de calidad | Turismo Colombia"
      },
      ui: {
        navigation: {
          home: "Inicio",
          rooms: "Habitaciones", 
          gallery: "Galería",
          services: "Servicios",
          contact: "Contacto",
          book: "Reservar"
        },
        buttons: {
          viewRooms: "Ver Habitaciones",
          bookNow: "Reservar Ahora",
          book: "Reservar",
          checkAvailability: "Consultar Disponibilidad",
          viewGallery: "Ver Galería",
          sendWhatsApp: "Enviar por WhatsApp"
        },
        messages: {
          noGallery: "No hay galería disponible",
          noGalleryItems: "No hay elementos en la galería",
          videoNotSupported: "Tu navegador no soporta video HTML5.",
          videoNotSupportedFull: "Tu navegador no soporta la reproducción de videos.",
          fileCount: "archivos"
        },
        labels: {
          galleryOf: "Galería de {name}",
          video: "VIDEO",
          image: "IMAGEN", 
          of: "de"
        }
      },
      map: {
        latitude: "6.8145",
        longitude: "-73.2660",
        zoom: "15",
        title: "Ubicación Hostal Caprilandia - Zapatoca, Santander",
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d350.16210276890513!2d-73.26600351968037!3d6.814540731844357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6832a2bf719429%3A0x50f0263dbf207ef2!2sHostal%20caprilandia!5e0!3m2!1ses-419!2sco!4v1760895441635!5m2!1ses-419!2sco",
        directUrl: "https://goo.gl/maps/example"
      }
    };
    
    // Crear directorio data si no existe
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Guardar contenido en archivo local
    const contentPath = path.join(dataDir, 'content.json');
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
    
    console.log('✅ Archivo content.json creado con éxito!');
    console.log(`📍 Ubicación: ${contentPath}`);
    console.log(`🎬 Videos incluidos en habitaciones: ${videoFiles.length}`);
    console.log('\n📋 Videos asignados:');
    content.rooms.rooms.forEach((room, index) => {
      if (room.media && room.media.length > 0) {
        console.log(`   ${room.name}: ${room.media[0].url}`);
      }
    });
    
    console.log('\n🚀 Ahora ejecuta: node scripts/upload-content.js');
    
  } catch (error) {
    console.error('❌ Error creando contenido:', error);
  }
}

createContentWithVideos();