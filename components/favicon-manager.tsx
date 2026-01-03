"use client"

// Este componente ya no es necesario porque el favicon se maneja
// a través del metadata de Next.js en layout.tsx
// Se mantiene como un componente vacío para evitar errores de importación

interface FaviconManagerProps {
  faviconUrl?: string
  title?: string
}

export default function FaviconManager({ faviconUrl, title }: FaviconManagerProps) {
  // No hacer nada - el favicon se maneja en metadata de Next.js
  return null
}
