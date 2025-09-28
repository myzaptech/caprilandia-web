"use client"

import { useEffect } from "react"

interface FaviconManagerProps {
  faviconUrl?: string
  title?: string
}

export default function FaviconManager({ faviconUrl, title }: FaviconManagerProps) {
  useEffect(() => {
    // Actualizar favicon
    if (faviconUrl) {
      // Remover favicon existente
      const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (existingFavicon) {
        existingFavicon.remove()
      }

      // Crear nuevo favicon
      const newFavicon = document.createElement("link")
      newFavicon.rel = "icon"
      newFavicon.type = "image/x-icon"
      newFavicon.href = faviconUrl
      document.head.appendChild(newFavicon)

      // También agregar como shortcut icon para mejor compatibilidad
      const shortcutIcon = document.createElement("link")
      shortcutIcon.rel = "shortcut icon"
      shortcutIcon.href = faviconUrl
      document.head.appendChild(shortcutIcon)

      // Agregar como apple-touch-icon para dispositivos móviles
      const appleTouchIcon = document.createElement("link")
      appleTouchIcon.rel = "apple-touch-icon"
      appleTouchIcon.href = faviconUrl
      document.head.appendChild(appleTouchIcon)
    }

    // Actualizar título de la página
    if (title) {
      document.title = title
    }
  }, [faviconUrl, title])

  return null
}
