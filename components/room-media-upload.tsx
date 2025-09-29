"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Upload, Plus, Image as ImageIcon, Video as VideoIcon } from "lucide-react"
import ImageUpload from "./image-upload"
import VideoUpload from "./video-upload"

interface MediaItem {
  type: 'image' | 'video'
  url: string
  alt: string
  thumbnail?: string // Para videos
}

interface RoomMediaUploadProps {
  media: MediaItem[]
  onMediaChange: (media: MediaItem[]) => void
  roomName: string
}

export default function RoomMediaUpload({ media, onMediaChange, roomName }: RoomMediaUploadProps) {
  const addMedia = (type: 'image' | 'video') => {
    const newMedia = [
      ...media,
      {
        type,
        url: "",
        alt: `${roomName} - ${type === 'image' ? 'Imagen' : 'Video'}`,
        ...(type === 'video' && { thumbnail: "" })
      },
    ]
    onMediaChange(newMedia)
  }

  const removeMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index)
    onMediaChange(newMedia)
  }

  const updateMedia = (index: number, field: keyof MediaItem, value: string) => {
    const newMedia = media.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onMediaChange(newMedia)
  }

  const updateMediaType = (index: number, newType: 'image' | 'video') => {
    const newMedia = media.map((item, i) => {
      if (i === index) {
        const baseItem = {
          ...item,
          type: newType,
          url: "", // Reset URL when changing type
          alt: `${roomName} - ${newType === 'image' ? 'Imagen' : 'Video'}`
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
    onMediaChange(newMedia)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium text-gray-700">
          Galería de {roomName} ({media.length} archivos)
        </h4>
        <div className="flex gap-2">
          <Button onClick={() => addMedia('image')} size="sm" variant="outline">
            <ImageIcon className="w-3 h-3 mr-1" />
            Imagen
          </Button>
          <Button onClick={() => addMedia('video')} size="sm" variant="outline">
            <VideoIcon className="w-3 h-3 mr-1" />
            Video
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {media.map((item, index) => (
          <Card key={index} className="p-3">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {item.type === 'image' ? (
                    <ImageIcon className="w-3 h-3 text-blue-600" />
                  ) : (
                    <VideoIcon className="w-3 h-3 text-purple-600" />
                  )}
                  <Label className="text-sm font-medium">
                    {item.type === 'image' ? 'Imagen' : 'Video'} {index + 1}
                  </Label>
                </div>
                <Button
                  onClick={() => removeMedia(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div>
                <Label className="text-xs">Tipo</Label>
                <Select 
                  value={item.type} 
                  onValueChange={(value: 'image' | 'video') => updateMediaType(index, value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" />
                        Imagen
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <VideoIcon className="w-3 h-3" />
                        Video
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {item.type === 'image' ? (
                <ImageUpload
                  currentImage={item.url}
                  onImageChange={(url) => updateMedia(index, "url", url)}
                  label=""
                  aspectRatio="landscape"
                />
              ) : (
                <VideoUpload
                  currentVideo={item.url}
                  onVideoChange={(url) => updateMedia(index, "url", url)}
                  onThumbnailChange={(thumbnail) => updateMedia(index, "thumbnail", thumbnail)}
                  label=""
                  maxSize={30}
                />
              )}

              <div>
                <Label htmlFor={`alt-${index}`} className="text-xs">Descripción</Label>
                <Input
                  id={`alt-${index}`}
                  value={item.alt}
                  onChange={(e) => updateMedia(index, "alt", e.target.value)}
                  placeholder={`Descripción del ${item.type === 'image' ? 'imagen' : 'video'}`}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm mb-3">No hay archivos multimedia para esta habitación</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => addMedia('image')} variant="outline" size="sm">
              <ImageIcon className="w-3 h-3 mr-1" />
              Primera imagen
            </Button>
            <Button onClick={() => addMedia('video')} variant="outline" size="sm">
              <VideoIcon className="w-3 h-3 mr-1" />
              Primer video
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}