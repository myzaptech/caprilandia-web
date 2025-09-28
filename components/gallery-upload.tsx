"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Upload, Plus, Image as ImageIcon, Video as VideoIcon } from "lucide-react"
import ImageUpload from "./image-upload"
import VideoUpload from "./video-upload"

interface GalleryItem {
  type: 'image' | 'video'
  url: string
  alt: string
  thumbnail?: string // Para videos
}

interface GalleryUploadProps {
  items: GalleryItem[]
  onItemsChange: (items: GalleryItem[]) => void
}

export default function GalleryUpload({ items, onItemsChange }: GalleryUploadProps) {
  const addItem = (type: 'image' | 'video') => {
    const newItems = [
      ...items,
      {
        type,
        url: "",
        alt: type === 'image' ? "Nueva imagen" : "Nuevo video",
        ...(type === 'video' && { thumbnail: "" })
      },
    ]
    onItemsChange(newItems)
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onItemsChange(newItems)
  }

  const updateItem = (index: number, field: keyof GalleryItem, value: string) => {
    const newItems = items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onItemsChange(newItems)
  }

  const updateItemType = (index: number, newType: 'image' | 'video') => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        const baseItem = {
          ...item,
          type: newType,
          url: "", // Reset URL when changing type
        }
        
        // Add thumbnail field for videos, remove for images
        if (newType === 'video') {
          return { ...baseItem, thumbnail: "" }
        } else {
          const { thumbnail, ...itemWithoutThumbnail } = baseItem as any
          return itemWithoutThumbnail
        }
      }
      return item
    })
    onItemsChange(newItems)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Galería Multimedia ({items.length} elementos)</h3>
        <div className="flex gap-2">
          <Button onClick={() => addItem('image')} size="sm" variant="outline">
            <ImageIcon className="w-4 h-4 mr-2" />
            Agregar Imagen
          </Button>
          <Button onClick={() => addItem('video')} size="sm" variant="outline">
            <VideoIcon className="w-4 h-4 mr-2" />
            Agregar Video
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {item.type === 'image' ? (
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                  ) : (
                    <VideoIcon className="w-4 h-4 text-purple-600" />
                  )}
                  <Label className="font-medium">
                    {item.type === 'image' ? 'Imagen' : 'Video'} {index + 1}
                  </Label>
                </div>
                <Button
                  onClick={() => removeItem(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label>Tipo de contenido</Label>
                <Select 
                  value={item.type} 
                  onValueChange={(value: 'image' | 'video') => updateItemType(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Imagen
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <VideoIcon className="w-4 h-4" />
                        Video
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {item.type === 'image' ? (
                <ImageUpload
                  currentImage={item.url}
                  onImageChange={(url) => updateItem(index, "url", url)}
                  label=""
                  aspectRatio="landscape"
                />
              ) : (
                <VideoUpload
                  currentVideo={item.url}
                  onVideoChange={(url) => updateItem(index, "url", url)}
                  onThumbnailChange={(thumbnail) => updateItem(index, "thumbnail", thumbnail)}
                  label=""
                  maxSize={50}
                />
              )}

              <div>
                <Label htmlFor={`alt-${index}`}>Descripción</Label>
                <Input
                  id={`alt-${index}`}
                  value={item.alt}
                  onChange={(e) => updateItem(index, "alt", e.target.value)}
                  placeholder={`Descripción del ${item.type === 'image' ? 'imagen' : 'video'}`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No hay elementos en la galería</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => addItem('image')} variant="outline">
              <ImageIcon className="w-4 h-4 mr-2" />
              Agregar primera imagen
            </Button>
            <Button onClick={() => addItem('video')} variant="outline">
              <VideoIcon className="w-4 h-4 mr-2" />
              Agregar primer video
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
