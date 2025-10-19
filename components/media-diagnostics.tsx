"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useContent } from '@/hooks/use-content'
import { useMediaChecker } from '@/hooks/use-media-checker'

interface MediaDiagnosticsProps {
  className?: string
}

export default function MediaDiagnostics({ className }: MediaDiagnosticsProps) {
  const { content } = useContent()
  const { isChecking, lastCheck, checkContentMedia } = useMediaChecker()
  const [showDetails, setShowDetails] = useState(false)
  const [showContentPreview, setShowContentPreview] = useState(false)

  const handleCheckMedia = async () => {
    await checkContentMedia(content)
    setShowDetails(true)
  }

  const handleShowContent = () => {
    console.log('📋 Contenido actual:', content)
    setShowContentPreview(!showContentPreview)
  }

  if (process.env.NODE_ENV !== 'development') {
    return null // Solo mostrar en desarrollo
  }

  return (
    <Card className={`fixed bottom-4 left-4 z-50 w-96 max-h-96 overflow-y-auto ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          🔧 Diagnóstico de Medios
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowContent}
              className="text-xs h-7"
            >
              📋 Contenido
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckMedia}
              disabled={isChecking}
              className="text-xs h-7"
            >
              {isChecking ? '🔍 Verificando...' : '🔍 Verificar'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {showContentPreview && (
          <div className="mb-4 p-3 bg-gray-50 rounded border">
            <h4 className="font-semibold text-sm mb-2">Habitaciones con videos:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {content.rooms?.rooms?.map((room: any, index: number) => (
                <div key={index} className="text-xs">
                  <strong>{room.name}:</strong>
                  {room.media?.filter((m: any) => m.type === 'video').map((video: any, videoIndex: number) => (
                    <div key={videoIndex} className="ml-2 text-gray-600">
                      📹 {video.url || '(Sin URL)'}
                    </div>
                  )) || <span className="ml-2 text-gray-500">Sin videos</span>}
                </div>
              )) || <div className="text-gray-500">No hay habitaciones</div>}
            </div>
          </div>
        )}
        
        {lastCheck && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-50">
                📊 Total: {lastCheck.summary.total}
              </Badge>
              <Badge variant="outline" className="bg-green-50">
                ✅ OK: {lastCheck.summary.existing}
              </Badge>
              <Badge variant="outline" className="bg-red-50">
                ❌ Faltan: {lastCheck.summary.missing}
              </Badge>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs h-8"
            >
              {showDetails ? '👁️ Ocultar detalles' : '👁️ Ver detalles'}
            </Button>
            
            {showDetails && (
              <div className="space-y-1 max-h-48 overflow-y-auto border rounded p-2 bg-gray-50">
                {lastCheck.results.map((result, index) => (
                  <div
                    key={index}
                    className={`text-xs p-1 rounded ${
                      result.exists 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <div className="flex items-start gap-1">
                      <span className="text-xs">
                        {result.exists ? '✅' : '❌'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-mono">
                          {result.url}
                        </div>
                        {result.external && (
                          <div className="text-xs opacity-75">
                            🌐 Externo (no verificado)
                          </div>
                        )}
                        {result.error && (
                          <div className="text-xs text-red-600">
                            Error: {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {!lastCheck && !isChecking && (
          <p className="text-sm text-gray-600">
            Haz clic en "Verificar" para diagnosticar los medios del sitio
          </p>
        )}
        
        {isChecking && (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-sm">Verificando medios...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}