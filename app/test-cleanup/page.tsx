"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function CleanupTestPage() {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testSpecificCleanup = async () => {
    setLoading(true)
    setResult("Ejecutando limpieza específica...")
    
    try {
      const response = await fetch('/api/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cleanupAll: false,
          specificUrls: [
            '/uploads/images/1760910730291_i39grg9i7.png',
            '/uploads/images/1760910971555_yo7ny8tge.png'
          ]
        })
      })

      const data = await response.json()
      setResult(`✅ Respuesta específica:\n${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      setResult(`❌ Error específico:\n${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testFullCleanup = async () => {
    setLoading(true)
    setResult("Ejecutando limpieza completa...")
    
    try {
      const response = await fetch('/api/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cleanupAll: true
        })
      })

      const data = await response.json()
      setResult(`✅ Respuesta completa:\n${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      setResult(`❌ Error completo:\n${error}`)
    } finally {
      setLoading(false)
    }
  }

  const checkContent = async () => {
    setLoading(true)
    setResult("Obteniendo contenido actual...")
    
    try {
      const response = await fetch('/api/content')
      const data = await response.json()
      
      // Filtrar solo URLs de uploads para diagnóstico
      const uploadUrls: string[] = []
      
      const findUploads = (obj: any, path: string = "") => {
        if (typeof obj === 'string' && obj.includes('/uploads/')) {
          uploadUrls.push(`${path}: ${obj}`)
        } else if (Array.isArray(obj)) {
          obj.forEach((item, index) => findUploads(item, `${path}[${index}]`))
        } else if (obj && typeof obj === 'object') {
          Object.entries(obj).forEach(([key, value]) => 
            findUploads(value, path ? `${path}.${key}` : key)
          )
        }
      }
      
      findUploads(data)
      
      setResult(`📊 URLs de uploads encontradas:\n${uploadUrls.join('\n')}`)
    } catch (error) {
      setResult(`❌ Error obteniendo contenido:\n${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧹 Test de API de Limpieza</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={checkContent}
              disabled={loading}
              variant="outline"
            >
              📊 Ver Contenido
            </Button>
            <Button 
              onClick={testSpecificCleanup}
              disabled={loading}
              variant="default"
            >
              🎯 Limpieza Específica
            </Button>
            <Button 
              onClick={testFullCleanup}
              disabled={loading}
              variant="destructive"
            >
              💀 Limpieza Completa
            </Button>
          </div>
          
          <Textarea
            value={result}
            readOnly
            placeholder="Los resultados aparecerán aquí..."
            className="min-h-[400px] font-mono text-sm"
          />
        </CardContent>
      </Card>
    </div>
  )
}