'use client'

import { useState } from 'react'
import SafeVideo from '@/components/safe-video'

const testScenarios = [
  {
    id: 'local-working',
    name: '✅ Video Local Funcionando',
    src: '/uploads/videos/test-video.mp4',
    description: 'Video local que existe y debería funcionar'
  },
  {
    id: 'local-broken',
    name: '❌ Video Local Roto',
    src: '/uploads/videos/video-inexistente.mp4',
    description: 'Video local que no existe - debería mostrar error'
  },
  {
    id: 'youtube-working',
    name: '📺 YouTube Funcionando',
    src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Video de YouTube que debería funcionar'
  },
  {
    id: 'youtube-blocked',
    name: '🚫 YouTube Bloqueado',
    src: 'https://www.youtube.com/watch?v=6n3pFFPSlW4',
    description: 'Video que puede estar bloqueado por X-Frame-Options'
  },
  {
    id: 'empty-url',
    name: '🔍 Sin URL',
    src: '',
    description: 'Sin URL - debería mostrar estado de fallback'
  },
  {
    id: 'invalid-url',
    name: '💥 URL Inválida',
    src: 'https://ejemplo-invalido.com/video-inexistente.mp4',
    description: 'URL externa inválida'
  }
]

export default function TestSafeVideoPage() {
  const [selectedScenario, setSelectedScenario] = useState(testScenarios[0])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧪 Test SafeVideo Component
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Prueba todos los estados posibles del componente SafeVideo: videos locales, 
            YouTube, errores, estados de carga y fallbacks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de Escenarios */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📋 Escenarios de Prueba
              </h2>
              <div className="space-y-3">
                {testScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedScenario.id === scenario.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">
                      {scenario.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {scenario.description}
                    </div>
                    {scenario.src && (
                      <div className="text-xs text-gray-400 mt-2 font-mono break-all">
                        {scenario.src.length > 40 
                          ? scenario.src.substring(0, 40) + '...' 
                          : scenario.src
                        }
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Info del Escenario Actual */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                🔍 Escenario Actual
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Nombre:</span>
                  <p className="text-gray-600">{selectedScenario.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Descripción:</span>
                  <p className="text-gray-600">{selectedScenario.description}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">URL:</span>
                  <p className="text-gray-600 font-mono text-sm break-all">
                    {selectedScenario.src || '(vacía)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel del Video */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🎬 Vista del Componente
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <SafeVideo
                  src={selectedScenario.src}
                  className="w-full h-96"
                  fallbackMessage="Video de prueba no disponible"
                />
              </div>
              
              {/* Información técnica */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">
                  📊 Información Técnica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Tipo:</span>
                    <span className="ml-2 text-gray-800">
                      {selectedScenario.src.includes('youtube.com') || selectedScenario.src.includes('youtu.be') 
                        ? '📺 YouTube' 
                        : selectedScenario.src.startsWith('/uploads/') 
                        ? '📁 Video Local' 
                        : selectedScenario.src === '' 
                        ? '🔍 Sin URL' 
                        : '🌐 URL Externa'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Estado Esperado:</span>
                    <span className="ml-2 text-gray-800">
                      {selectedScenario.id.includes('working') 
                        ? '✅ Funcional' 
                        : selectedScenario.id.includes('broken') || selectedScenario.id.includes('blocked') || selectedScenario.id.includes('invalid')
                        ? '❌ Error' 
                        : '🔍 Fallback'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs en tiempo real */}
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 mt-6 text-green-400 font-mono text-sm">
              <h3 className="text-white font-bold mb-3">🖥️ Console Logs</h3>
              <div className="bg-black p-3 rounded border">
                <p>💡 Abre las DevTools (F12) para ver los logs del componente SafeVideo</p>
                <p className="text-gray-500">Los logs incluyen:</p>
                <ul className="text-gray-400 ml-4 mt-1">
                  <li>• Detección de tipo de video (YouTube/Local)</li>
                  <li>• Verificación de existencia de archivos</li>
                  <li>• Errores de X-Frame-Options</li>
                  <li>• Estados de carga y errores</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-lg">
          <p className="text-gray-600">
            🚀 Esta página te permite probar todos los estados del componente SafeVideo
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Desarrollado para Caprilandia Web - Sistema de Videos Robusto
          </p>
        </div>
      </div>
    </div>
  )
}