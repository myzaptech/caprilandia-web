"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, VideoIcon, Play } from "lucide-react"

interface VideoUploadProps {
  currentVideo?: string
  onVideoChange: (videoUrl: string) => void
  onThumbnailChange?: (thumbnailUrl: string) => void
  label?: string
  maxSize?: number // en MB
}

export default function VideoUpload({
  currentVideo,
  onVideoChange,
  onThumbnailChange,
  label = "Video",
  maxSize = 50, // Videos pueden ser más grandes
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("video/")) {
      alert("Por favor selecciona solo archivos de video (MP4, WebM, MOV)")
      return
    }

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      alert(`El archivo es muy grande. Máximo ${maxSize}MB`)
      return
    }

    setIsUploading(true)

    try {
      // Convertir video a base64 para almacenamiento local
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onVideoChange(result)
        
        // Generar thumbnail del video si es posible
        generateThumbnail(file).then(thumbnail => {
          if (thumbnail && onThumbnailChange) {
            onThumbnailChange(thumbnail)
          }
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error subiendo video:", error)
      alert("Error al subir el video")
    } finally {
      setIsUploading(false)
    }
  }

  const generateThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        video.currentTime = 1 // Capturar frame al segundo 1
      }
      
      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8)
          resolve(thumbnailUrl)
        }
      }
      
      video.onerror = () => {
        resolve('') // Si hay error, devolver string vacío
      }
      
      video.src = URL.createObjectURL(videoFile)
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    onVideoChange("")
    if (onThumbnailChange) {
      onThumbnailChange("")
    }
  }

  const getAspectRatioClass = () => {
    return "aspect-video" // Los videos generalmente son 16:9
  }

  return (
    <div className="space-y-3">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragActive 
            ? "border-teal-500 bg-teal-50" 
            : "border-gray-300 hover:border-gray-400"
        } ${getAspectRatioClass()}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {currentVideo ? (
          <div className="relative w-full h-full">
            <video
              src={currentVideo}
              className="w-full h-full object-cover rounded-lg"
              controls
              preload="metadata"
            >
              Tu navegador no soporta la reproducción de videos.
            </video>
            <Button
              onClick={handleRemove}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center h-full">
            <VideoIcon className={`w-8 h-8 mb-3 ${dragActive ? "text-teal-500" : "text-gray-400"}`} />
            <p className={`text-sm mb-2 ${dragActive ? "text-teal-600" : "text-gray-600"}`}>
              {dragActive ? "Suelta el video aquí" : "Arrastra un video aquí"}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              o
            </p>
            <Button 
              onClick={handleButtonClick} 
              variant="outline" 
              size="sm"
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Subiendo..." : "Seleccionar Video"}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              MP4, WebM, MOV (máx. {maxSize}MB)
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleFileSelect(file)
            }
          }}
          className="hidden"
        />
      </div>
    </div>
  )
}