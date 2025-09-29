"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FaviconManager from "@/components/favicon-manager"
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
import { useState } from "react"

// Componente para mostrar la galería de la habitación
function RoomGallery({ room }: { room: any }) {
  const [selectedMedia, setSelectedMedia] = useState(0)
  const media = room.media || []
  
  if (media.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <Images className="w-12 h-12 mx-auto mb-2" />
        <p>No hay galería disponible para esta habitación</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Media principal */}
      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
        {media[selectedMedia]?.type === 'video' ? (
          <video
            controls
            className="w-full h-full object-cover"
            poster={media[selectedMedia]?.thumbnail}
          >
            <source src={media[selectedMedia]?.url} type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
        ) : (
          <Image
            src={media[selectedMedia]?.url || "/placeholder.svg"}
            alt={media[selectedMedia]?.alt || room.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {media.map((item: any, index: number) => (
          <button
            key={index}
            onClick={() => setSelectedMedia(index)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              selectedMedia === index
                ? "border-teal-600 ring-2 ring-teal-200"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {item.type === 'video' ? (
              <>
                <Image
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" fill="white" />
                </div>
              </>
            ) : (
              <Image
                src={item.url || "/placeholder.svg"}
                alt={item.alt}
                fill
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>

      {/* Info del media actual */}
      <div className="text-sm text-gray-600">
        <p>{media[selectedMedia]?.alt}</p>
        <p className="text-xs">
          {selectedMedia + 1} de {media.length} • {media[selectedMedia]?.type === 'video' ? 'Video' : 'Imagen'}
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { content, isLoading } = useContent()

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
        <Link
          href={`https://wa.me/${content.contact.whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Image
                src={content.siteConfig?.logo || "/placeholder.svg"}
                alt="Hostal Caprilandia"
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
              <span className="text-xl font-bold text-teal-700">Hostal Caprilandia</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#inicio"
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-1 text-base font-medium"
              >
                Inicio
              </Link>
              <Link
                href="#habitaciones"
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-1 text-base font-medium"
              >
                Habitaciones
              </Link>
              <Link
                href="#galeria"
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-1 text-base font-medium"
              >
                Galería
              </Link>
              <Link
                href="#servicios"
                className="text-gray-700 hover:text-teal-600 transition-colors py-2 px-1 text-base font-medium"
              >
                Servicios
              </Link>
              <Button className="bg-teal-600 hover:bg-teal-700 ml-4">Reservar</Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
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
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 px-8 py-3">
              Ver Habitaciones
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent px-8 py-3"
            >
              Reservar Ahora
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <Image
                src={content.about.image || "/placeholder.svg"}
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
                  <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
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
                      {room.showPrice && room.price ? "Reservar" : "Consultar Disponibilidad"}
                    </Button>
                    
                    {/* Botón para ver galería si tiene media */}
                    {room.media && room.media.length > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Galería ({room.media.length} {room.media.length === 1 ? 'archivo' : 'archivos'})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl text-teal-700">
                              Galería de {room.name}
                            </DialogTitle>
                          </DialogHeader>
                          <RoomGallery room={room} />
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
                    <Image
                      src={item.url || "/placeholder.svg"}
                      alt={item.alt}
                      width={400}
                      height={300}
                      className="rounded-lg object-cover w-full h-48 lg:h-64"
                    />
                  ) : (
                    <div className="relative">
                      <video
                        src={item.url}
                        poster={item.thumbnail}
                        className="rounded-lg object-cover w-full h-48 lg:h-64"
                        controls
                        preload="metadata"
                      >
                        Tu navegador no soporta la reproducción de videos.
                      </video>
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        VIDEO
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
                <p className="text-gray-500">No hay elementos en la galería</p>
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
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-teal-700 mb-6">{content.contact.title}</h2>
              <p className="text-base lg:text-lg text-gray-600 mb-8">{content.contact.description}</p>

              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-cyan-50 rounded-lg">
                  <div className="bg-cyan-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-700">WhatsApp</h4>
                    <p className="text-gray-600">{content.contact.whatsapp}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-cyan-50 rounded-lg">
                  <div className="bg-cyan-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-700">Email</h4>
                    <p className="text-gray-600">{content.contact.email}</p>
                  </div>
                </div>

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
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de llegada</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de salida</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de habitación</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {content.rooms.rooms.map((room, index) => (
                      <option key={index}>{room.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar por WhatsApp
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8234567890123!2d-74.0123456789!3d4.6123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzYnNDQuNCJOIDc0wrAwMCc0NC40Ilc!5e0!3m2!1ses!2sco!4v1234567890123!5m2!1ses!2sco"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Hostal Caprilandia"
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
                  alt="Hostal Caprilandia"
                  width={32}
                  height={32}
                  className="rounded object-cover"
                />
                <span className="text-xl font-bold">Hostal Caprilandia</span>
              </div>
              <p className="text-teal-100 text-sm lg:text-base">
                Un refugio de autenticidad donde el pasado y el presente se encuentran para crear experiencias
                memorables.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-teal-100">
                <li>
                  <Link href="#inicio" className="hover:text-white transition-colors text-sm lg:text-base">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="#habitaciones" className="hover:text-white transition-colors text-sm lg:text-base">
                    Habitaciones
                  </Link>
                </li>
                <li>
                  <Link href="#galeria" className="hover:text-white transition-colors text-sm lg:text-base">
                    Galería
                  </Link>
                </li>
                <li>
                  <Link href="#servicios" className="hover:text-white transition-colors text-sm lg:text-base">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="#contacto" className="hover:text-white transition-colors text-sm lg:text-base">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-teal-100 text-sm lg:text-base">
                <li>{content.contact.address}</li>
                <li>WhatsApp: {content.contact.whatsapp}</li>
                <li>Email: {content.contact.email}</li>
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
            <p className="text-teal-100 text-sm">&copy; 2025 Hostal Caprilandia. Todos los derechos reservados.</p>
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
