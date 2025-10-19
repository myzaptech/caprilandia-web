"use client"

import { useState } from "react"
import VideoUpload from "@/components/video-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VideoTestPage() {
  const [currentVideo, setCurrentVideo] = useState("")
  const [currentThumbnail, setCurrentThumbnail] = useState("")
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(message)
  }

  const handleVideoChange = (url: string) => {
    addLog(`📹 Video URL recibida: ${url}`)
    setCurrentVideo(url)
  }

  const handleThumbnailChange = (url: string) => {
    addLog(`🖼️ Thumbnail URL recibida: ${url}`)
    setCurrentThumbnail(url)
  }

  const clearAll = () => {
    setCurrentVideo("")
    setCurrentThumbnail("")
    setLogs([])
    addLog("🧹 Estado limpiado")
  }

  const testManualUpload = async () => {
    addLog("🧪 Iniciando prueba manual de API...")
    
    // Crear un archivo de prueba pequeño (1x1 pixel video)
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')
    ctx?.fillRect(0, 0, 1, 1)
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        addLog("❌ Error creando blob de prueba")
        return
      }
      
      const file = new File([blob], 'test-video.mp4', { type: 'video/mp4' })
      addLog(`📁 Archivo de prueba creado: ${file.name} (${file.size} bytes)`)
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'videos')
        
        addLog("📤 Enviando a API...")
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        addLog(`📥 Respuesta API: ${response.status} ${response.statusText}`)
        
        if (response.ok) {
          const result = await response.json()
          addLog(`✅ Resultado API: ${JSON.stringify(result)}`)
          
          if (result.success) {
            setCurrentVideo(result.url)
            addLog("🎉 Prueba exitosa!")
          }
        } else {
          const error = await response.text()
          addLog(`❌ Error API: ${error}`)
        }
      } catch (error) {
        addLog(`❌ Error de red: ${error}`)
      }
    }, 'video/mp4')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🎬 Prueba de Subida de Videos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Subir Video Real</h3>
              <VideoUpload
                currentVideo={currentVideo}
                onVideoChange={handleVideoChange}
                onThumbnailChange={handleThumbnailChange}
                label="Selecciona un video de prueba"
                maxSize={10} // Más pequeño para pruebas
              />
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Estado Actual</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Video URL:</p>
                  <p className="text-xs text-gray-600 break-all">
                    {currentVideo || "Sin video"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Thumbnail URL:</p>
                  <p className="text-xs text-gray-600 break-all">
                    {currentThumbnail || "Sin thumbnail"}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={testManualUpload} variant="outline" size="sm">
                    🧪 Prueba API
                  </Button>
                  <Button onClick={clearAll} variant="outline" size="sm">
                    🧹 Limpiar
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Vista Previa</h3>
            {currentVideo ? (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video
                  src={currentVideo}
                  controls
                  className="w-full h-full object-cover"
                  preload="metadata"
                >
                  Tu navegador no soporta videos.
                </video>
              </div>
            ) : (
              <div className="relative aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Sin video para mostrar</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Log de Eventos</h3>
            <div className="bg-gray-100 p-3 rounded-lg max-h-60 overflow-y-auto">
              <pre className="text-xs font-mono">
                {logs.length > 0 ? logs.join('\n') : 'Sin eventos...'}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}