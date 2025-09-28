"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  label?: string
  aspectRatio?: "square" | "landscape" | "portrait"
  maxSize?: number // en MB
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  label = "Imagen",
  aspectRatio = "landscape",
  maxSize = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona solo archivos de imagen")
      return
    }

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      alert(`El archivo es muy grande. Máximo ${maxSize}MB`)
      return
    }

    setIsUploading(true)

    try {
      // Convertir imagen a base64 para almacenamiento local
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageChange(result)
        setIsUploading(false)
      }
      reader.onerror = () => {
        alert("Error al leer el archivo")
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error subiendo imagen:", error)
      alert("Error al procesar la imagen")
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
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

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const removeImage = () => {
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square"
      case "portrait":
        return "aspect-[3/4]"
      default:
        return "aspect-video"
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>

      {currentImage ? (
        <div className="relative group">
          <div className={`relative ${getAspectRatioClass()} rounded-lg overflow-hidden border`}>
            <Image
              src={currentImage || "/placeholder.svg"}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button onClick={removeImage} variant="destructive" size="sm" className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" disabled={isUploading}>
              <Upload className="w-4 h-4 mr-2" />
              Cambiar imagen
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative ${getAspectRatioClass()} border-2 border-dashed rounded-lg transition-colors ${
            dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Arrastra una imagen aquí o haz clic para seleccionar</p>
            <p className="text-xs text-gray-500 mb-4">PNG, JPG, WEBP hasta {maxSize}MB</p>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" disabled={isUploading}>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Subiendo..." : "Seleccionar imagen"}
            </Button>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

      {isUploading && (
        <div className="text-sm text-gray-600 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600 mr-2"></div>
          Procesando imagen...
        </div>
      )}
    </div>
  )
}
