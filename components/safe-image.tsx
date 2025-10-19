"use client"

import Image from "next/image"
import { useState } from "react"

interface SafeImageProps {
  src?: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fallbackSrc?: string
}

export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
  fallbackSrc = "/placeholder.svg"
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc)
  const [hasError, setHasError] = useState(false)

  // Si no hay src o está vacío, usar fallback inmediatamente
  if (!src || src.trim() === "") {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    )
  }

  // Verificar si es una URL local de uploads que podría no existir
  const isLocalUpload = src.startsWith('/uploads/')
  
  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
      console.warn(`❌ Error cargando imagen: ${src} - usando fallback: ${fallbackSrc}`)
    }
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
      // Para imágenes de upload local, no usar priority por defecto
      unoptimized={isLocalUpload}
    />
  )
}