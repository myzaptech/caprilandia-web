"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, X, VideoIcon, Play, Loader2 } from "lucide-react"
import { FirebaseStorageManager } from "@/lib/firebase-storage"

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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<string>("")
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
    setUploadProgress(0)
    setUploadStatus("Preparando video...")

    try {
      console.log(`🚀 Subiendo video a Firebase Storage: ${file.name}`)
      
      // Subir video con progreso usando XMLHttpRequest
      const result = await uploadFileWithProgress(file, 'videos')
      
      console.log(`✅ Video subido exitosamente: ${result.url}`)
      setUploadProgress(100)
      setUploadStatus("Video subido correctamente")
      onVideoChange(result.url)
      
      // Generar thumbnail del video si es posible
      try {
        setUploadStatus("Generando miniatura...")
        const thumbnail = await generateThumbnail(file)
        if (thumbnail && onThumbnailChange) {
          console.log(`🖼️ Generando thumbnail para video...`)
          
          // Convertir thumbnail blob URL a File para subirlo a Firebase Storage
          const response = await fetch(thumbnail)
          const blob = await response.blob()
          const thumbnailFile = new File([blob], `thumbnail_${file.name.replace(/\.[^/.]+$/, '')}.jpg`, { type: 'image/jpeg' })
          
          // Limpiar el blob URL temporal para liberar memoria
          URL.revokeObjectURL(thumbnail)
          
          // Subir thumbnail a Firebase Storage (sin progreso para thumbnail, es pequeño)
          setUploadStatus("Subiendo miniatura...")
          const thumbnailResult = await FirebaseStorageManager.uploadFile(thumbnailFile, 'thumbnails')
          console.log(`✅ Thumbnail subido exitosamente: ${thumbnailResult.url}`)
          onThumbnailChange(thumbnailResult.url)
        }
        setUploadStatus("Completado")
      } catch (thumbnailError) {
        console.warn("⚠️ No se pudo generar thumbnail:", thumbnailError)
        setUploadStatus("Video subido (sin miniatura)")
        // No es crítico si falla el thumbnail
      }
    } catch (error) {
      console.error("❌ Error subiendo video:", error)
      setUploadStatus("Error al subir el video")
      alert(`Error al subir el video: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      // Mantener el estado de carga por 1 segundo más para que el usuario vea el 100%
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        setUploadStatus("")
      }, 1000)
    }
  }

  // Función para subir archivo con progreso usando XMLHttpRequest
  const uploadFileWithProgress = (file: File, folder: string): Promise<{ url: string; type: string; filename: string; path: string }> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      
      const xhr = new XMLHttpRequest()
      
      // Monitorear progreso
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(percentComplete)
          setUploadStatus(`Subiendo video... ${percentComplete}%`)
        }
      })
      
      // Manejar respuesta
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText)
            if (result.success) {
              resolve({
                url: result.url,
                type: result.type,
                filename: result.filename,
                path: result.path
              })
            } else {
              reject(new Error(result.error || 'Error desconocido'))
            }
          } catch (error) {
            reject(new Error('Error parseando respuesta'))
          }
        } else {
          reject(new Error(`Error HTTP: ${xhr.status}`))
        }
      })
      
      // Manejar errores
      xhr.addEventListener('error', () => {
        reject(new Error('Error de red al subir el archivo'))
      })
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Carga cancelada'))
      })
      
      // Iniciar carga
      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    })
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
          
          // Convertir canvas a blob en lugar de data URL para evitar problemas CSP
          canvas.toBlob((blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob)
              resolve(blobUrl)
            } else {
              resolve('')
            }
          }, 'image/jpeg', 0.8)
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
        {currentVideo && !isUploading ? (
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
        ) : isUploading ? (
          <div className="flex flex-col items-center justify-center p-6 text-center h-full bg-gray-50">
            <Loader2 className="w-12 h-12 mb-4 text-teal-600 animate-spin" />
            <p className="text-sm font-medium text-gray-700 mb-2">
              {uploadStatus || "Subiendo video..."}
            </p>
            <div className="w-full max-w-xs space-y-2">
              <Progress value={uploadProgress} className="h-3" />
              <p className="text-xs text-gray-500">
                {uploadProgress}% completado
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Por favor, no cierres esta página hasta que termine la carga
            </p>
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
          disabled={isUploading}
        />
      </div>
    </div>
  )
}