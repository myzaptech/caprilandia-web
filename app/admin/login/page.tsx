"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, Shield, Wifi, WifiOff } from "lucide-react"
import { signInAdmin, onAuthStateChange } from "@/lib/firebase-auth"

export default function AdminLogin() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  // Verificar conexión a internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Verificar si ya está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        // Usuario ya autenticado, redirigir al dashboard
        router.push("/admin/dashboard")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isOnline) {
      setError("No hay conexión a internet. Verifica tu conexión.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("🚀 Iniciando proceso de login...")
      const result = await signInAdmin(credentials.email, credentials.password)

      if (result.success) {
        console.log("✅ Login exitoso, redirigiendo...")
        // Redirigir al panel de administración
        router.push("/admin/dashboard")
      } else {
        console.log("❌ Login falló:", result.error)
        setError(result.error || "Error al iniciar sesión")
      }
    } catch (error) {
      console.error("💥 Error inesperado:", error)
      setError("Error inesperado al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-600 p-4 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-teal-700 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Hostal Caprilandia</p>
          <div className="mt-2 flex justify-center items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              🔥 Firebase Auth
            </span>
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              {isOnline ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        {/* Formulario de login */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gray-800">Iniciar Sesión</CardTitle>
            <p className="text-center text-sm text-gray-600">Ingresa con tu cuenta de administrador</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isOnline && (
                <Alert variant="destructive">
                  <WifiOff className="h-4 w-4" />
                  <AlertDescription>
                    Sin conexión a internet. Verifica tu conexión para poder iniciar sesión.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    placeholder="admin@caprilandia.com"
                    required
                    disabled={!isOnline}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={!isOnline}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={!isOnline}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading || !isOnline}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            {/* Información de configuración */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">🔧 Configuración requerida:</h3>
              <ol className="text-xs text-blue-700 space-y-1">
                <li>1. Crear usuario admin en Firebase Console</li>
                <li>2. Asignar custom claim "admin: true"</li>
                <li>3. Configurar reglas de Firestore</li>
                <li>4. Habilitar Authentication con Email/Password</li>
              </ol>
            </div>

            {/* Credenciales de prueba */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center mb-2">
                <strong>Credenciales de prueba:</strong>
              </p>
              <p className="text-xs text-gray-500 text-center">
                Email: <code className="bg-gray-200 px-1 rounded">admin@caprilandia.com</code>
              </p>
              <p className="text-xs text-gray-500 text-center">
                Contraseña: <code className="bg-gray-200 px-1 rounded">CaprilandiaAdmin2025!</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">&copy; 2025 Hostal Caprilandia. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
