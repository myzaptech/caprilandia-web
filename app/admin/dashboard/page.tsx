"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, LogOut, Trash2, Plus, Star, RefreshCw, AlertCircle, Zap, Shield, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useContent, type ContentData } from "@/hooks/use-content"
import { signOutAdmin, onAuthStateChange, isCurrentUserAdmin } from "@/lib/firebase-auth"
import ImageUpload from "@/components/image-upload"
import GalleryUpload from "@/components/gallery-upload"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("hero")
  const [isSaving, setIsSaving] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const {
    content,
    setContent,
    saveChanges,
    isLoading: contentLoading,
    error,
    isConnected,
    refreshContent,
  } = useContent()

  useEffect(() => {
    // Verificar autenticación con Firebase
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        // Verificar si el usuario es admin
        const isAdmin = await isCurrentUserAdmin()
        if (isAdmin) {
          setIsAuthenticated(true)
          setUserEmail(user.email || "")
        } else {
          // Usuario no es admin, cerrar sesión y redirigir
          await signOutAdmin()
          router.push("/admin/login")
        }
      } else {
        // No hay usuario autenticado
        setIsAuthenticated(false)
        router.push("/admin/login")
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const logout = async () => {
    try {
      await signOutAdmin()
      router.push("/admin/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión correctamente",
        variant: "destructive",
      })
    }
  }

  const saveContent = async () => {
    setIsSaving(true)
    try {
      const result = await saveChanges()
      if (result.success) {
        toast({
          title: "✅ Guardado exitoso",
          description: "Los cambios se han guardado correctamente.",
        })
      } else {
        toast({
          title: "❌ Error al guardar",
          description: result.error || "No se pudo guardar el contenido.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Ocurrió un error inesperado al guardar.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateContent = (section: keyof ContentData, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const updateArrayItem = (
    section: keyof ContentData,
    arrayField: string,
    index: number,
    field: string,
    value: any,
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: (prev[section] as any)[arrayField].map((item: any, i: number) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      },
    }))
  }

  const addTestimonial = () => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        reviews: [
          ...prev.testimonials.reviews,
          {
            name: "Nuevo Usuario",
            rating: 5,
            comment: "Excelente experiencia en el hostal.",
            initials: "NU",
            mapLink: "https://g.co/kgs/example",
          },
        ],
      },
    }))
  }

  const removeTestimonial = (index: number) => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        reviews: prev.testimonials.reviews.filter((_, i) => i !== index),
      },
    }))
  }

  const addRoom = () => {
    setContent((prev) => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        rooms: [
          ...prev.rooms.rooms,
          {
            name: "Nueva Habitación",
            description: "Descripción de la habitación",
            price: "",
            showPrice: false, // Por defecto no mostrar precio
            image: "",
            features: ["Cama doble", "Baño privado", "WiFi"],
            popular: false,
          },
        ],
      },
    }))
  }

  const removeRoom = (index: number) => {
    setContent((prev) => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        rooms: prev.rooms.rooms.filter((_, i) => i !== index),
      },
    }))
  }

  if (isLoading || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{isLoading ? "Verificando autenticación..." : "Cargando contenido..."}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-teal-600 p-2 rounded">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    📱 Almacenamiento Local
                  </Badge>
                  <Badge className="text-xs bg-green-100 text-green-800">
                    <Zap className="w-3 h-3 mr-1" />
                    Auto-guardado activo
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{userEmail}</span>
              </div>
              <Button onClick={refreshContent} variant="outline" size="sm" disabled={contentLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${contentLoading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              <Button onClick={saveContent} className="bg-teal-600 hover:bg-teal-700" size="sm" disabled={isSaving}>
                <Save className={`w-4 h-4 mr-2 ${isSaving ? "animate-spin" : ""}`} />
                {isSaving ? "Guardando..." : "Guardar Ahora"}
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Estado de la conexión */}
        {error && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 gap-1">
            <TabsTrigger value="site" className="text-xs">
              Sitio
            </TabsTrigger>
            <TabsTrigger value="hero" className="text-xs">
              Inicio
            </TabsTrigger>
            <TabsTrigger value="about" className="text-xs">
              Acerca
            </TabsTrigger>
            <TabsTrigger value="rooms" className="text-xs">
              Habitaciones
            </TabsTrigger>
            <TabsTrigger value="tour" className="text-xs">
              Tour
            </TabsTrigger>
            <TabsTrigger value="gallery" className="text-xs">
              Galería
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs">
              Servicios
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="text-xs">
              Testimonios
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-xs">
              Contacto
            </TabsTrigger>
          </TabsList>

          {/* Site Configuration Section - NUEVA */}
          <TabsContent value="site">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sitio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="site-title">Título del Sitio (aparece en la pestaña del navegador)</Label>
                      <Input
                        id="site-title"
                        value={content.siteConfig?.title || ""}
                        onChange={(e) => updateContent("siteConfig", "title", e.target.value)}
                        placeholder="Hostal Caprilandia - Donde la tradición y la comodidad se encuentran"
                      />
                    </div>
                    <div>
                      <Label htmlFor="site-description">Descripción del Sitio (para SEO)</Label>
                      <Textarea
                        id="site-description"
                        value={content.siteConfig?.description || ""}
                        onChange={(e) => updateContent("siteConfig", "description", e.target.value)}
                        rows={3}
                        placeholder="Descripción que aparecerá en los resultados de búsqueda"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <ImageUpload
                        currentImage={content.siteConfig?.logo}
                        onImageChange={(url) => updateContent("siteConfig", "logo", url)}
                        label="Logo del Negocio - aparece en la navegación y footer"
                        aspectRatio="square"
                        maxSize={2}
                      />
                      <div className="mt-2 text-sm text-gray-600">
                        <p>• Recomendado: 64x64 píxeles o mayor</p>
                        <p>• Formato: PNG, JPG, o SVG</p>
                        <p>• Tamaño máximo: 2MB</p>
                      </div>
                    </div>
                    
                    <div>
                      <ImageUpload
                        currentImage={content.siteConfig?.favicon}
                        onImageChange={(url) => updateContent("siteConfig", "favicon", url)}
                        label="Icono del Sitio (Favicon) - aparece en la pestaña del navegador"
                        aspectRatio="square"
                        maxSize={1}
                      />
                      <div className="mt-2 text-sm text-gray-600">
                        <p>• Recomendado: 32x32 píxeles o 64x64 píxeles</p>
                        <p>• Formato: PNG, ICO, o JPG</p>
                        <p>• Tamaño máximo: 1MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Sección Principal (Hero)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="hero-title">Título Principal</Label>
                      <Input
                        id="hero-title"
                        value={content.hero.title}
                        onChange={(e) => updateContent("hero", "title", e.target.value)}
                        className="text-lg font-semibold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-subtitle">Subtítulo</Label>
                      <Textarea
                        id="hero-subtitle"
                        value={content.hero.subtitle}
                        onChange={(e) => updateContent("hero", "subtitle", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div>
                    <ImageUpload
                      currentImage={content.hero.backgroundImage}
                      onImageChange={(url) => updateContent("hero", "backgroundImage", url)}
                      label="Imagen de Fondo Principal"
                      aspectRatio="landscape"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Sección Acerca de</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="about-title">Título</Label>
                      <Input
                        id="about-title"
                        value={content.about.title}
                        onChange={(e) => updateContent("about", "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-desc1">Primer Párrafo</Label>
                      <Textarea
                        id="about-desc1"
                        value={content.about.description1}
                        onChange={(e) => updateContent("about", "description1", e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-desc2">Segundo Párrafo</Label>
                      <Textarea
                        id="about-desc2"
                        value={content.about.description2}
                        onChange={(e) => updateContent("about", "description2", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div>
                    <ImageUpload
                      currentImage={content.about.image}
                      onImageChange={(url) => updateContent("about", "image", url)}
                      label="Imagen de la Sección Acerca de"
                      aspectRatio="landscape"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rooms Section - ACTUALIZADA */}
          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Sección Habitaciones ({content.rooms.rooms.length} habitaciones)
                  <Button onClick={addRoom} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Habitación
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rooms-title">Título</Label>
                    <Input
                      id="rooms-title"
                      value={content.rooms.title}
                      onChange={(e) => updateContent("rooms", "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rooms-subtitle">Subtítulo</Label>
                    <Input
                      id="rooms-subtitle"
                      value={content.rooms.subtitle}
                      onChange={(e) => updateContent("rooms", "subtitle", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Habitaciones</h3>
                  {content.rooms.rooms.map((room, index) => (
                    <Card key={`room-${index}`} className="p-6 border-l-4 border-l-teal-500">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-lg">
                          Habitación {index + 1}: {room.name}
                        </h4>
                        <Button
                          onClick={() => removeRoom(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label>Nombre</Label>
                            <Input
                              value={room.name}
                              onChange={(e) => updateArrayItem("rooms", "rooms", index, "name", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Descripción</Label>
                            <Textarea
                              value={room.description}
                              onChange={(e) => updateArrayItem("rooms", "rooms", index, "description", e.target.value)}
                              rows={3}
                            />
                          </div>

                          {/* Configuración de precio - NUEVA */}
                          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`show-price-${index}`}
                                checked={room.showPrice || false}
                                onChange={(e) =>
                                  updateArrayItem("rooms", "rooms", index, "showPrice", e.target.checked)
                                }
                              />
                              <Label htmlFor={`show-price-${index}`} className="font-medium">
                                Mostrar precio para esta habitación
                              </Label>
                            </div>

                            {room.showPrice && (
                              <div>
                                <Label>Precio</Label>
                                <Input
                                  value={room.price || ""}
                                  onChange={(e) => updateArrayItem("rooms", "rooms", index, "price", e.target.value)}
                                  placeholder="Ej: $120/noche, Consultar, Desde $100"
                                />
                              </div>
                            )}

                            {!room.showPrice && (
                              <p className="text-sm text-gray-600">
                                El botón mostrará "Consultar Disponibilidad" en lugar de "Reservar"
                              </p>
                            )}
                          </div>

                          <div>
                            <Label>Características ({room.features.length})</Label>
                            <div className="space-y-2">
                              {room.features.map((feature, featureIndex) => (
                                <div key={`feature-${index}-${featureIndex}`} className="flex items-center space-x-2">
                                  <Input
                                    value={feature}
                                    onChange={(e) => {
                                      const newFeatures = [...room.features]
                                      newFeatures[featureIndex] = e.target.value
                                      updateArrayItem("rooms", "rooms", index, "features", newFeatures)
                                    }}
                                    placeholder="Característica"
                                  />
                                  <Button
                                    onClick={() => {
                                      const newFeatures = room.features.filter((_, i) => i !== featureIndex)
                                      updateArrayItem("rooms", "rooms", index, "features", newFeatures)
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                onClick={() => {
                                  const newFeatures = [...room.features, "Nueva característica"]
                                  updateArrayItem("rooms", "rooms", index, "features", newFeatures)
                                }}
                                variant="outline"
                                size="sm"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Característica
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`popular-${index}`}
                              checked={room.popular || false}
                              onChange={(e) => updateArrayItem("rooms", "rooms", index, "popular", e.target.checked)}
                            />
                            <Label htmlFor={`popular-${index}`}>Marcar como popular</Label>
                          </div>
                        </div>
                        <div>
                          <ImageUpload
                            currentImage={room.image}
                            onImageChange={(url) => updateArrayItem("rooms", "rooms", index, "image", url)}
                            label={`Imagen de ${room.name}`}
                            aspectRatio="landscape"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tour Section */}
          <TabsContent value="tour">
            <Card>
              <CardHeader>
                <CardTitle>Tour Virtual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tour-title">Título</Label>
                      <Input
                        id="tour-title"
                        value={content.virtualTour.title}
                        onChange={(e) => updateContent("virtualTour", "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tour-subtitle">Subtítulo</Label>
                      <Input
                        id="tour-subtitle"
                        value={content.virtualTour.subtitle}
                        onChange={(e) => updateContent("virtualTour", "subtitle", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tour-videoUrl">URL del Video (YouTube Embed)</Label>
                      <Input
                        id="tour-videoUrl"
                        value={content.virtualTour.videoUrl}
                        onChange={(e) => updateContent("virtualTour", "videoUrl", e.target.value)}
                        placeholder="https://www.youtube.com/embed/your_video_id"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>Vista Previa del Video</Label>
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      {content.virtualTour.videoUrl ? (
                        <iframe
                          src={content.virtualTour.videoUrl}
                          title="Recorrido Virtual"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <p className="text-gray-500">Ingresa una URL de video para ver la vista previa</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Section */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Galería de Imágenes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gallery-title">Título</Label>
                    <Input
                      id="gallery-title"
                      value={content.gallery.title}
                      onChange={(e) => updateContent("gallery", "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery-subtitle">Subtítulo</Label>
                    <Input
                      id="gallery-subtitle"
                      value={content.gallery.subtitle}
                      onChange={(e) => updateContent("gallery", "subtitle", e.target.value)}
                    />
                  </div>
                </div>

                <GalleryUpload
                  items={content.gallery.items}
                  onItemsChange={(items) => updateContent("gallery", "items", items)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Section */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Servicios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="services-title">Título</Label>
                    <Input
                      id="services-title"
                      value={content.services.title}
                      onChange={(e) => updateContent("services", "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="services-subtitle">Subtítulo</Label>
                    <Input
                      id="services-subtitle"
                      value={content.services.subtitle}
                      onChange={(e) => updateContent("services", "subtitle", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {content.services.services.map((service, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <h4 className="font-medium">Servicio {index + 1}</h4>
                        <div>
                          <Label>Nombre</Label>
                          <Input
                            value={service.name}
                            onChange={(e) => updateArrayItem("services", "services", index, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Descripción</Label>
                          <Textarea
                            value={service.description}
                            onChange={(e) =>
                              updateArrayItem("services", "services", index, "description", e.target.value)
                            }
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label>Icono</Label>
                          <Input
                            value={service.icon}
                            onChange={(e) => updateArrayItem("services", "services", index, "icon", e.target.value)}
                            placeholder="bed, wifi, utensils-crossed, etc."
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Section */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Testimonios
                  <Button onClick={addTestimonial} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Testimonio
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="testimonials-title">Título</Label>
                    <Input
                      id="testimonials-title"
                      value={content.testimonials.title}
                      onChange={(e) => updateContent("testimonials", "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="testimonials-subtitle">Subtítulo</Label>
                    <Input
                      id="testimonials-subtitle"
                      value={content.testimonials.subtitle}
                      onChange={(e) => updateContent("testimonials", "subtitle", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="testimonials-note">Nota Importante</Label>
                  <Textarea
                    id="testimonials-note"
                    value={content.testimonials.note}
                    onChange={(e) => updateContent("testimonials", "note", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Reseñas</h3>
                  {content.testimonials.reviews.map((review, index) => (
                    <Card key={index} className="p-4 border-l-4 border-l-yellow-500">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-lg">Reseña {index + 1}</h4>
                        <Button
                          onClick={() => removeTestimonial(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <Label>Nombre</Label>
                            <Input
                              value={review.name}
                              onChange={(e) =>
                                updateArrayItem("testimonials", "reviews", index, "name", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Comentario</Label>
                            <Textarea
                              value={review.comment}
                              onChange={(e) =>
                                updateArrayItem("testimonials", "reviews", index, "comment", e.target.value)
                              }
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>Calificación (1-5)</Label>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              value={review.rating}
                              onChange={(e) =>
                                updateArrayItem(
                                  "testimonials",
                                  "reviews",
                                  index,
                                  "rating",
                                  Number.parseInt(e.target.value) || 5,
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label>Iniciales</Label>
                            <Input
                              value={review.initials}
                              onChange={(e) =>
                                updateArrayItem("testimonials", "reviews", index, "initials", e.target.value)
                              }
                              placeholder="MG"
                            />
                          </div>
                          <div>
                            <Label>Enlace de Google Maps</Label>
                            <Input
                              value={review.mapLink}
                              onChange={(e) =>
                                updateArrayItem("testimonials", "reviews", index, "mapLink", e.target.value)
                              }
                              placeholder="https://g.co/kgs/..."
                            />
                          </div>
                          <div className="bg-gray-50 p-3 rounded border">
                            <p className="text-sm text-gray-600 mb-2 font-medium">Vista previa:</p>
                            <div className="flex items-center space-x-2">
                              <div className="bg-teal-500 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {review.initials}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{review.name}</p>
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${i < review.rating ? "fill-current" : "stroke-current"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-title">Título</Label>
                    <Input
                      id="contact-title"
                      value={content.contact.title}
                      onChange={(e) => updateContent("contact", "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-whatsapp">WhatsApp</Label>
                    <Input
                      id="contact-whatsapp"
                      value={content.contact.whatsapp}
                      onChange={(e) => updateContent("contact", "whatsapp", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact-description">Descripción</Label>
                  <Textarea
                    id="contact-description"
                    value={content.contact.description}
                    onChange={(e) => updateContent("contact", "description", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      value={content.contact.email}
                      onChange={(e) => updateContent("contact", "email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-address">Dirección</Label>
                    <Input
                      id="contact-address"
                      value={content.contact.address}
                      onChange={(e) => updateContent("contact", "address", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Redes Sociales</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="contact-facebook">Facebook</Label>
                      <Input
                        id="contact-facebook"
                        value={content.contact.socialLinks.facebook}
                        onChange={(e) =>
                          updateContent("contact", "socialLinks", {
                            ...content.contact.socialLinks,
                            facebook: e.target.value,
                          })
                        }
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-instagram">Instagram</Label>
                      <Input
                        id="contact-instagram"
                        value={content.contact.socialLinks.instagram}
                        onChange={(e) =>
                          updateContent("contact", "socialLinks", {
                            ...content.contact.socialLinks,
                            instagram: e.target.value,
                          })
                        }
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-youtube">YouTube</Label>
                      <Input
                        id="contact-youtube"
                        value={content.contact.socialLinks.youtube}
                        onChange={(e) =>
                          updateContent("contact", "socialLinks", {
                            ...content.contact.socialLinks,
                            youtube: e.target.value,
                          })
                        }
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
