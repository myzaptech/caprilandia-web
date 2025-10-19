"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import FaviconManager from "@/components/favicon-manager"
import SafeImage from "@/components/safe-image"
import SafeVideo from "@/components/safe-video"
import {
  MapPin,
  Phone,
  Mail,
  Wifi,
  Users,
  Star,
  ChevronDown,
  Bed,
  Mountain,
  Clock,
  Home,
  UtensilsCrossed,
  MessageCircle,
  Menu,
  Images,
  Play,
  Eye
} from "lucide-react"
import { useContent } from "@/hooks/use-content"
import { useContentCleanup } from "@/hooks/use-content-cleanup"
import { useState } from "react"

// Función helper para manejar enlaces de WhatsApp multiplataforma
const openWhatsApp = (phoneNumber: string, message: string, fallbackMessage?: string) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  const encodedMessage = encodeURIComponent(message);
  
  // Detectar el tipo de dispositivo/navegador
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isDesktop = !isMobile;
  
  // Intentar diferentes métodos según el dispositivo
  if (isMobile) {
    // Para móviles, usar wa.me que funciona mejor
    const waLink = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(waLink, '_blank');
  } else {
    // Para escritorio, intentar primero wa.me
    const waLink = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    // Abrir el enlace
    const newWindow = window.open(waLink, '_blank');
    
    // Si después de 3 segundos el usuario sigue en la página, 
    // mostrar un fallback con el mensaje para copiar
    setTimeout(() => {
      if (newWindow && !newWindow.closed) {
        // Si la ventana sigue abierta, es probable que no se haya abierto WhatsApp
        const shouldCopy = confirm(
          `¿No se abrió WhatsApp automáticamente?\n\n` +
          `Número: ${phoneNumber}\n` +
          `Mensaje: ${message}\n\n` +
          `¿Quieres copiar el mensaje al portapapeles para enviarlo manualmente?`
        );
        
        if (shouldCopy) {
          navigator.clipboard.writeText(message).then(() => {
            alert('¡Mensaje copiado! Ahora puedes pegarlo en WhatsApp manualmente.');
          }).catch(() => {
            // Fallback si no se puede copiar
            prompt('Copia este mensaje para WhatsApp:', message);
          });
        }
        newWindow.close();
      }
    }, 3000);
  }
};

// Componente para mostrar la galería multimedia de la habitación
function RoomGallery({ room, content }: { room: any; content: any }) {
  const [selectedMedia, setSelectedMedia] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const media = room.media || []
  
  if (media.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
        <Images className="w-12 h-12 mx-auto mb-2" />
        <p className="text-lg font-medium">{content.ui?.messages.noGallery || "No hay galería disponible"}</p>
        <p className="text-sm mt-1">Esta habitación aún no tiene imágenes o videos</p>
      </div>
    )
  }

  const currentMedia = media[selectedMedia]
  const totalMedia = media.length

  const nextMedia = () => {
    setSelectedMedia((prev) => (prev + 1) % totalMedia)
  }

  const prevMedia = () => {
    setSelectedMedia((prev) => (prev - 1 + totalMedia) % totalMedia)
  }

  return (
    <div className="space-y-4">
      {/* Header de la galería */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          {room.name} - Galería Multimedia
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Images className="w-4 h-4" />
          <span>{selectedMedia + 1} de {totalMedia}</span>
        </div>
      </div>

      {/* Media principal */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 group">
        {currentMedia?.type === 'video' ? (
          <SafeVideo
            src={currentMedia?.url}
            poster={currentMedia?.thumbnail}
            className="w-full h-full object-cover"
            key={selectedMedia} // Fuerza re-render cuando cambia
            fallbackMessage={content.ui?.messages.videoNotSupported || "Tu navegador no soporta video HTML5."}
          >
            {content.ui?.messages.videoNotSupported || "Tu navegador no soporta video HTML5."}
          </SafeVideo>
        ) : (
          <Image
            src={currentMedia?.url || "/placeholder.svg"}
            alt={currentMedia?.alt || room.name}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Controles de navegación */}
        {totalMedia > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </>
        )}

        {/* Botón fullscreen */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
          <Eye className="w-5 h-5" />
        </button>

        {/* Indicador de tipo de media */}
        <div className="absolute top-4 left-4">
          {currentMedia?.type === 'video' ? (
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
              <Play className="w-3 h-3 mr-1" />
              VIDEO
            </div>
          ) : (
            <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
              <Images className="w-3 h-3 mr-1" />
              IMAGEN
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails mejorados */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-700">Vista rápida:</h4>
          <div className="text-xs text-gray-500">
            {media.filter((m: any) => m.type === 'image').length} imágenes, {media.filter((m: any) => m.type === 'video').length} videos
          </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {media.map((item: any, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedMedia(index)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                selectedMedia === index
                  ? "border-teal-600 ring-2 ring-teal-200 shadow-lg"
                  : "border-gray-300 hover:border-teal-400"
              }`}
            >
              {item.type === 'video' ? (
                <>
                  <Image
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.alt || `Video ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" fill="white" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-red-500 text-white text-xs px-1 rounded">
                    VIDEO
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt={item.alt || `Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
                    IMG
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Modal de vista completa */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] p-2">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{room.name} - {currentMedia?.type === 'video' ? 'Video' : 'Imagen'} {selectedMedia + 1}</span>
                <div className="flex items-center space-x-2">
                  {totalMedia > 1 && (
                    <>
                      <Button variant="outline" size="sm" onClick={prevMedia}>
                        ← Anterior
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextMedia}>
                        Siguiente →
                      </Button>
                    </>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
              {currentMedia?.type === 'video' ? (
                <SafeVideo
                  src={currentMedia?.url}
                  poster={currentMedia?.thumbnail}
                  className="w-full h-full object-contain"
                  autoPlay
                  fallbackMessage="Video no disponible"
                >
                  Tu navegador no soporta video HTML5.
                </SafeVideo>
              ) : (
                <Image
                  src={currentMedia?.url || "/placeholder.svg"}
                  alt={currentMedia?.alt || room.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            {currentMedia?.description && (
              <p className="text-sm text-gray-600 mt-2">{currentMedia.description}</p>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function HomePage() {
  const { content, isLoading, setContent } = useContent()

  // Hook para limpiar URLs de uploads que no existen
  useContentCleanup(content, setContent)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Favicon Manager */}
      <FaviconManager faviconUrl={content.siteConfig?.favicon} title={content.siteConfig?.title} />

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const message = "🏨 ¡Hola! Estoy navegando en su página web y me interesa conocer más sobre el Hostal Caprilandia. ¿Podrían ayudarme?";
            openWhatsApp(content.contact.whatsapp, message);
          }}
          className="group bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center relative"
        >
          <div className="flex items-center p-4">
            <MessageCircle className="w-6 h-6 mr-0 group-hover:mr-3 transition-all duration-300" />
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs font-medium">
              ¡Contáctanos!
            </span>
          </div>
          {/* Subtle pulse ring - reduced intensity */}
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping" style={{animationDuration: '3s'}}></div>
        </button>
      </div>

      {/* Top Contact Bar */}
      <div className="bg-teal-700 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <button
                onClick={() => {
                  const message = "📞 ¡Hola! Vi su número en la página web. Me gustaría obtener información básica sobre el Hostal Caprilandia.";
                  openWhatsApp(content.contact.whatsapp, message);
                }}
                className="hover:text-teal-200 transition-colors"
              >
                {content.contact.whatsapp}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${content.contact.email}`} className="hover:text-teal-200 transition-colors">
                {content.contact.email}
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span className="text-teal-100">{content.contact.address}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Image
                src={content.siteConfig?.logo || "/placeholder.svg"}
                alt="Caprilandia - Hostal en Zapatoca, Santander"
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
              <span className="text-xl font-bold text-teal-700">Caprilandia</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => {
                  const section = document.getElementById('inicio');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-1 text-base font-medium"
              >
                {content.ui?.navigation.home || "Inicio"}
              </button>
              <button
                onClick={() => {
                  const section = document.getElementById('habitaciones');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-1 text-base font-medium"
              >
                {content.ui?.navigation.rooms || "Habitaciones"}
              </button>
              <button
                onClick={() => {
                  const section = document.getElementById('galeria');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-1 text-base font-medium"
              >
                {content.ui?.navigation.gallery || "Galería"}
              </button>
              <button
                onClick={() => {
                  const section = document.getElementById('servicios');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-1 text-base font-medium"
              >
                {content.ui?.navigation.services || "Servicios"}
              </button>
              <Button 
                className="bg-teal-600 hover:bg-teal-700 ml-4"
                onClick={() => {
                  const message = "🛏️ ¡Hola! Quiero hacer una RESERVA en el Hostal Caprilandia. ¿Podrían ayudarme con disponibilidad y precios para mis fechas?";
                  openWhatsApp(content.contact.whatsapp, message);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {content.ui?.navigation.book || "Reservar"}
              </Button>
              <Button 
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 ml-2"
                onClick={() => {
                  const message = "⚡ ¡Hola! Necesito información RÁPIDA sobre el Hostal Caprilandia. ¿Están disponibles ahora para atenderme?";
                  openWhatsApp(content.contact.whatsapp, message);
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Contacto
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-8">
                    <SheetClose asChild>
                      <button
                        onClick={() => {
                          const section = document.getElementById('inicio');
                          section?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-left text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors"
                      >
                        {content.ui?.navigation.home || "Inicio"}
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => {
                          const section = document.getElementById('habitaciones');
                          section?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-left text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors"
                      >
                        {content.ui?.navigation.rooms || "Habitaciones"}
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => {
                          const section = document.getElementById('galeria');
                          section?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-left text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors"
                      >
                        {content.ui?.navigation.gallery || "Galería"}
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => {
                          const section = document.getElementById('servicios');
                          section?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-left text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors"
                      >
                        {content.ui?.navigation.services || "Servicios"}
                      </button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button 
                        className="bg-teal-600 hover:bg-teal-700 w-full"
                        onClick={() => {
                          const message = "📱 ¡Hola! Estoy desde mi móvil y quiero hacer una RESERVA en el Hostal Caprilandia. ¿Me pueden ayudar?";
                          openWhatsApp(content.contact.whatsapp, message);
                        }}
                      >
                        {content.ui?.navigation.book || "Reservar"}
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={content.hero.backgroundImage || "/placeholder.svg"}
            alt="Hostal Caprilandia Exterior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">{content.hero.title}</h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8">{content.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-teal-600 hover:bg-teal-700 px-8 py-3"
              onClick={() => {
                const roomsSection = document.getElementById('habitaciones');
                roomsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {content.ui?.buttons.viewRooms || "Ver Habitaciones"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent px-8 py-3"
              onClick={() => {
                const message = "🌟 ¡Hola! Vi la página principal del Hostal Caprilandia y quiero RESERVAR YA. ¿Cuáles son sus tarifas y disponibilidad?";
                openWhatsApp(content.contact.whatsapp, message);
              }}
            >
              {content.ui?.buttons.bookNow || "Reservar Ahora"}
            </Button>
          </div>
          
          {/* Quick Contact Info in Hero */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-lg mb-4 text-teal-100">📞 Contacto directo:</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  const message = "💬 ¡Hola! Necesito hablar con ustedes AHORA MISMO sobre el Hostal Caprilandia. ¿Están disponibles?";
                  openWhatsApp(content.contact.whatsapp, message);
                }}
                className="flex items-center space-x-3 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">WhatsApp: {content.contact.whatsapp}</span>
              </button>
              <a
                href={`mailto:${content.contact.email}`}
                className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">{content.contact.email}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ubicación Perfecta</h3>
              <p className="text-teal-100">{content.contact.address}</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Contacto Directo</h3>
              <button
                onClick={() => {
                  const message = "📍 ¡Hola! Vi la información de ubicación y contacto. Quiero consultar DISPONIBILIDAD y PRECIOS del Hostal Caprilandia.";
                  openWhatsApp(content.contact.whatsapp, message);
                }}
                className="text-teal-100 hover:text-white transition-colors"
              >
                {content.contact.whatsapp}
              </button>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Experiencia Única</h3>
              <p className="text-teal-100">Hostal tradicional en el corazón de Zapatoca</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <SafeImage
                src={content.about.image}
                alt="Interior del hostal"
                width={600}
                height={400}
                className="rounded-lg object-cover w-full h-80 lg:h-96"
              />
              <div className="absolute bottom-4 left-4 bg-teal-600 text-white px-4 py-2 rounded-lg">
                <h3 className="font-bold text-sm lg:text-base">Experiencia única</h3>
                <p className="text-xs lg:text-sm">Un ambiente acogedor y familiar</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-700 mb-6">{content.about.title}</h2>
              <p className="text-base lg:text-lg text-gray-600 mb-6">{content.about.description1}</p>
              <p className="text-base lg:text-lg text-gray-600 mb-8">{content.about.description2}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {content.about.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-teal-100 p-2 rounded-full flex-shrink-0">
                      {feature.icon === "users" && <Users className="w-5 h-5 text-teal-600" />}
                      {feature.icon === "wifi" && <Wifi className="w-5 h-5 text-teal-600" />}
                      {feature.icon === "map-pin" && <MapPin className="w-5 h-5 text-teal-600" />}
                      {feature.icon === "clock" && <Clock className="w-5 h-5 text-teal-600" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{feature.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section - Dynamic from Firebase */}
      {content.location && (
        <section className="py-16 lg:py-20 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-700 mb-4">{content.location.title}</h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                {content.location.subtitle}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-teal-700 mb-6">{content.location.whyChooseTitle}</h3>
                
                <div className="space-y-4">
                  {content.location.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="bg-teal-100 p-2 rounded-full flex-shrink-0">
                        {feature.icon === "map-pin" && <MapPin className="w-5 h-5 text-teal-600" />}
                        {feature.icon === "mountain" && <Mountain className="w-5 h-5 text-teal-600" />}
                        {feature.icon === "home" && <Home className="w-5 h-5 text-teal-600" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {content.location.highlight && (
                  <div className="mt-8 p-6 bg-teal-600 text-white rounded-lg">
                    <h4 className="font-bold text-lg mb-2">{content.location.highlight.title}</h4>
                    <p className="text-teal-100 text-sm">
                      {content.location.highlight.description}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <SafeImage
                  src={content.location.image}
                  alt={content.location.imageAlt || "Vista del pueblo"}
                  width={600}
                  height={400}
                  className="rounded-lg object-cover w-full h-80 lg:h-96"
                />
                {content.location.imageCaption && (
                  <div className="absolute bottom-4 left-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg">
                    <h3 className="font-bold text-sm lg:text-base">{content.location.imageCaption.title}</h3>
                    <p className="text-xs lg:text-sm">{content.location.imageCaption.subtitle}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Attractions - Dynamic */}
            {content.location.attractions && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-teal-700 mb-8 text-center">{content.location.attractions.title}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {content.location.attractions.items.map((item, index) => (
                    <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        {item.icon === "mountain" && <Mountain className="w-8 h-8 text-cyan-600" />}
                        {item.icon === "home" && <Home className="w-8 h-8 text-cyan-600" />}
                        {item.icon === "users" && <Users className="w-8 h-8 text-cyan-600" />}
                        {item.icon === "utensils-crossed" && <UtensilsCrossed className="w-8 h-8 text-cyan-600" />}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Rooms Section */}
      <section id="habitaciones" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-teal-700 mb-4">{content.rooms.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">{content.rooms.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {content.rooms.rooms.map((room, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <SafeImage 
                    src={room.image} 
                    alt={room.name} 
                    fill 
                    className="object-cover" 
                  />
                  {/* Solo mostrar precio si showPrice es true y price existe */}
                  {room.showPrice && room.price && (
                    <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {room.price}
                    </div>
                  )}
                  {room.popular && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-teal-700">{room.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm lg:text-base">{room.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="space-y-2">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      {room.showPrice && room.price ? (content.ui?.buttons.book || "Reservar") : (content.ui?.buttons.checkAvailability || "Consultar Disponibilidad")}
                    </Button>
                    
                    {/* Botón para ver galería si tiene media */}
                    {room.media && room.media.length > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            {content.ui?.buttons.viewGallery || "Ver Galería"} ({room.media.length} {room.media.length === 1 ? 'archivo' : 'archivos'})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl text-teal-700">
                              {(content.ui?.labels.galleryOf || "Galería de {name}").replace("{name}", room.name)}
                            </DialogTitle>
                          </DialogHeader>
                          <RoomGallery room={room} content={content} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-teal-700 mb-4">{content.virtualTour.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600">{content.virtualTour.subtitle}</p>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={content.virtualTour.videoUrl}
              title="Tour Virtual Hostal Caprilandia"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-teal-700 mb-4">{content.gallery.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600">{content.gallery.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {content.gallery.items && content.gallery.items.length > 0 ? content.gallery.items.map((item, index) => (
              <div
                key={index}
                className={`${index === 0 ? "col-span-2 md:col-span-1" : ""} ${
                  index === content.gallery.items.length - 1 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <div className="relative">
                  {item.type === 'image' ? (
                    <SafeImage
                      src={item.url}
                      alt={item.alt}
                      width={400}
                      height={300}
                      className="rounded-lg object-cover w-full h-48 lg:h-64"
                    />
                  ) : (
                    <div className="relative">
                      <SafeVideo
                        src={item.url}
                        poster={item.thumbnail}
                        className="rounded-lg object-cover w-full h-48 lg:h-64"
                        preload="metadata"
                        fallbackMessage={content.ui?.messages.videoNotSupported || "Tu navegador no soporta video HTML5."}
                      >
                        {content.ui?.messages.videoNotSupportedFull || "Tu navegador no soporta la reproducción de videos."}
                      </SafeVideo>
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {content.ui?.labels.video || "VIDEO"}
                      </div>
                    </div>
                  )}
                  {index === content.gallery.items.length - 1 && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl lg:text-2xl font-bold">Caprilandia</span>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">{content.ui?.messages.noGalleryItems || "No hay elementos en la galería"}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-teal-700 mb-4">{content.services.title}</h2>
            <p className="text-lg lg:text-xl text-gray-600">{content.services.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {content.services.services.map((service, index) => (
              <Card key={index} className="p-6 bg-cyan-50 border-cyan-200 text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {service.icon === "bed" && <Bed className="w-8 h-8 text-cyan-600" />}
                  {service.icon === "utensils-crossed" && <UtensilsCrossed className="w-8 h-8 text-cyan-600" />}
                  {service.icon === "wifi" && <Wifi className="w-8 h-8 text-cyan-600" />}
                  {service.icon === "mountain" && <Mountain className="w-8 h-8 text-cyan-600" />}
                  {service.icon === "home" && <Home className="w-8 h-8 text-cyan-600" />}
                  {service.icon === "users" && <Users className="w-8 h-8 text-cyan-600" />}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-cyan-700">{service.name}</h3>
                <p className="text-gray-600 text-sm lg:text-base">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{content.testimonials.title}</h2>
            <p className="text-lg lg:text-xl text-teal-100">{content.testimonials.subtitle}</p>
          </div>

          <div className="bg-teal-700 p-4 lg:p-6 rounded-lg mb-8">
            <div className="flex items-start space-x-2 mb-4">
              <span className="text-red-400 text-lg">📍</span>
              <div>
                <h3 className="text-white font-semibold">Nota importante:</h3>
                <p className="text-teal-100 text-sm lg:text-base">{content.testimonials.note}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {content.testimonials.reviews.map((review, index) => (
              <Card key={index} className="bg-teal-700 border-teal-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "stroke-current"}`} />
                      ))}
                    </div>
                    <Link href={review.mapLink} className="ml-2 text-teal-200 text-sm hover:text-white">
                      Ver en Google Maps
                    </Link>
                  </div>
                  <p className="text-teal-100 mb-4 italic text-sm lg:text-base">"{review.comment}"</p>
                  <div className="flex items-center">
                    <div className="bg-teal-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.initials}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold">{review.name}</h4>
                      <p className="text-teal-200 text-sm">Reseña verificada - Google Maps</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-700 mb-6">{content.contact.title}</h2>
              <p className="text-base lg:text-lg text-gray-600 mb-8">{content.contact.description}</p>

              <div className="space-y-4 lg:space-y-6">
                <button
                  onClick={() => {
                    const message = "📧 ¡Hola! Estoy en la sección de contacto y prefiero hablar por WhatsApp. ¿Pueden atenderme sobre el Hostal Caprilandia?";
                    openWhatsApp(content.contact.whatsapp, message);
                  }}
                  className="flex items-center space-x-4 p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors w-full text-left"
                >
                  <div className="bg-cyan-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-700">WhatsApp</h4>
                    <p className="text-gray-600">{content.contact.whatsapp}</p>
                  </div>
                </button>

                <a
                  href={`mailto:${content.contact.email}`}
                  className="flex items-center space-x-4 p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
                >
                  <div className="bg-cyan-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-700">Email</h4>
                    <p className="text-gray-600">{content.contact.email}</p>
                  </div>
                </a>

                <div className="flex items-center space-x-4 p-4 bg-cyan-50 rounded-lg">
                  <div className="bg-cyan-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-700">Dirección</h4>
                    <p className="text-gray-600">{content.contact.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Síguenos</h3>
                <div className="flex space-x-4">
                  <Link
                    href={content.contact.socialLinks.facebook}
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.367-12 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.387 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                    </svg>
                  </Link>
                  <Link
                    href={content.contact.socialLinks.instagram}
                    className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.387 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                    </svg>
                  </Link>
                  <Link
                    href={content.contact.socialLinks.youtube}
                    className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <span className="sr-only">YouTube</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 text-teal-700">Formulario de Contacto</h3>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const nombre = formData.get('nombre') as string;
                const apellido = formData.get('apellido') as string;
                const email = formData.get('email') as string;
                const llegada = formData.get('llegada') as string;
                const salida = formData.get('salida') as string;
                const habitacion = formData.get('habitacion') as string;
                const mensaje = formData.get('mensaje') as string;
                
                const whatsappMessage = `¡Hola! Me interesa hacer una reserva en el Hostal Caprilandia.

*Datos de contacto:*
Nombre: ${nombre} ${apellido}
Email: ${email}

*Detalles de la reserva:*
Fecha de llegada: ${llegada}
Fecha de salida: ${salida}
Tipo de habitación: ${habitacion}

*Mensaje adicional:*
${mensaje || 'Sin mensaje adicional'}

¡Espero su respuesta!`;

                openWhatsApp(content.contact.whatsapp, whatsappMessage);
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de llegada</label>
                    <input
                      type="date"
                      name="llegada"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de salida</label>
                    <input
                      type="date"
                      name="salida"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de habitación</label>
                  <select 
                    name="habitacion"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Seleccionar habitación</option>
                    {content.rooms.rooms.map((room, index) => (
                      <option key={index} value={room.name}>{room.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea
                    name="mensaje"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Mensaje adicional (opcional)"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {content.ui?.buttons.sendWhatsApp || "Enviar por WhatsApp"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96">
        <iframe
          src={content.map?.embedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d350.16210276890513!2d-73.26600351968037!3d6.814540731844357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6832a2bf719429%3A0x50f0263dbf207ef2!2sHostal%20caprilandia!5e0!3m2!1ses-419!2sco!4v1760895441635!5m2!1ses-419!2sco"}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={content.map?.title || "Ubicación Hostal Caprilandia - Zapatoca, Santander"}
        ></iframe>
      </section>

      {/* Footer */}
      <footer className="bg-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src={content.siteConfig?.logo || "/placeholder.svg"}
                  alt="Caprilandia - Hostal Caprilandia Logo"
                  width={32}
                  height={32}
                  className="rounded object-cover"
                />
                <span className="text-xl font-bold">Caprilandia</span>
              </div>
              <p className="text-teal-100 text-sm lg:text-base">
                {content.footer?.description || "Un refugio de autenticidad donde el pasado y el presente se encuentran para crear experiencias memorables."}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-teal-100">
                <li>
                  <button 
                    onClick={() => {
                      const section = document.getElementById('inicio');
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-sm lg:text-base text-left"
                  >
                    Inicio
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const section = document.getElementById('habitaciones');
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-sm lg:text-base text-left"
                  >
                    Habitaciones
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const section = document.getElementById('galeria');
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-sm lg:text-base text-left"
                  >
                    Galería
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const section = document.getElementById('servicios');
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-sm lg:text-base text-left"
                  >
                    Servicios
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const section = document.getElementById('contacto');
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors text-sm lg:text-base text-left"
                  >
                    Contacto
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-teal-100 text-sm lg:text-base">
                <li>{content.contact.address}</li>
                <li>
                  <button
                    onClick={() => {
                      const message = "� ¡Hola! Terminé de ver toda su página web del Hostal Caprilandia y me interesa. ¿Podrían contactarme?";
                      openWhatsApp(content.contact.whatsapp, message);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    WhatsApp: {content.contact.whatsapp}
                  </button>
                </li>
                <li>
                  <a href={`mailto:${content.contact.email}`} className="hover:text-white transition-colors">
                    Email: {content.contact.email}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
              <p className="text-teal-100 text-sm lg:text-base mb-4">
                Suscríbete para recibir ofertas especiales y noticias.
              </p>
              <div className="flex space-x-4">
                <Link
                  href={content.contact.socialLinks.facebook}
                  className="bg-teal-600 text-white p-2 rounded hover:bg-teal-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.367-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link
                  href={content.contact.socialLinks.instagram}
                  className="bg-teal-600 text-white p-2 rounded hover:bg-teal-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.387 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                  </svg>
                </Link>
                <Link
                  href={content.contact.socialLinks.youtube}
                  className="bg-teal-600 text-white p-2 rounded hover:bg-teal-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0-3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-teal-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-teal-100 text-sm">&copy; {content.footer?.copyright || "2025 Hostal Caprilandia. Todos los derechos reservados."}</p>
              <p className="text-teal-200 text-xs mt-1">{content.footer?.tagline || "Hostal Caprilandia | Alojamiento de calidad | Turismo Colombia"}</p>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href={content.contact.socialLinks.facebook}
                className="text-teal-100 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.367-12 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.387 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                </svg>
              </Link>
              <Link
                href={content.contact.socialLinks.instagram}
                className="text-teal-100 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.387 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                </svg>
              </Link>
              <Link
                href={content.contact.socialLinks.youtube}
                className="text-teal-100 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
