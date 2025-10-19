"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FirebaseStorageManager } from "@/lib/firebase-storage"

export default function FirebaseStorageTest() {
  const [testResult, setTestResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  
  const testStorageConnection = async () => {
    setIsLoading(true)
    setTestResult("Probando conexión...")
    
    try {
      const isConnected = await FirebaseStorageManager.checkStorageConnection()
      if (isConnected) {
        setTestResult("✅ Firebase Storage conectado correctamente")
      } else {
        setTestResult("❌ No se pudo conectar a Firebase Storage")
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  const testFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsLoading(true)
    setTestResult("Subiendo archivo de prueba...")
    
    try {
      const result = await FirebaseStorageManager.uploadFile(file, 'test')
      setTestResult(`✅ Archivo subido: ${result.url}`)
    } catch (error) {
      setTestResult(`❌ Error subiendo archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      console.error("Error detallado:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Test Firebase Storage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testStorageConnection} disabled={isLoading}>
            Probar Conexión
          </Button>
          <div>
            <input
              type="file"
              onChange={testFileUpload}
              accept="image/*,video/*"
              disabled={isLoading}
              style={{ display: 'none' }}
              id="file-test"
            />
            <Button 
              onClick={() => document.getElementById('file-test')?.click()}
              disabled={isLoading}
              variant="outline"
            >
              Probar Subida de Archivo
            </Button>
          </div>
        </div>
        
        {testResult && (
          <Alert>
            <AlertDescription>
              <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Procesando...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}