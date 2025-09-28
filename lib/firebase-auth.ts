import { auth } from "./firebase"
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"

// Configurar persistencia de sesión
if (typeof window !== "undefined" && auth) {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error configurando persistencia:", error)
  })
}

// Lista temporal de emails admin (REMOVER EN PRODUCCIÓN)
const TEMP_ADMIN_EMAILS = [
  "admin@caprilandia.com",
  "test@caprilandia.com", // Usuario de prueba
]

// Función para iniciar sesión
export async function signInAdmin(email: string, password: string) {
  if (!auth) {
    console.error("🚫 Firebase Auth no está disponible")
    return {
      success: false,
      error: "Firebase Auth no está disponible",
    }
  }

  try {
    console.log("🔐 Intentando iniciar sesión con:", email)
    console.log("📋 Lista de emails admin:", TEMP_ADMIN_EMAILS)

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("✅ Usuario autenticado:", user.uid)
    console.log("📧 Email del usuario:", user.email)

    // VERIFICACIÓN TEMPORAL: Verificar si el email está en la lista de admins
    const isInList = TEMP_ADMIN_EMAILS.includes(email)
    console.log("🔍 ¿Email está en lista?", isInList)

    if (isInList) {
      console.log("✅ Usuario admin verificado (modo temporal)")
      return { success: true, user }
    }

    // Si no está en la lista temporal, intentar verificación normal
    console.log("⚠️ Email no está en lista temporal, intentando verificación normal...")
    const token = await user.getIdTokenResult()
    console.log("🎫 Token claims:", token.claims)

    if (!token.claims.admin) {
      console.log("❌ Usuario no tiene permisos de admin")
      await signOut(auth)
      throw new Error("No tienes permisos de administrador")
    }

    console.log("✅ Usuario admin verificado")
    return { success: true, user }
  } catch (error) {
    console.error("❌ Error en login:", error)

    let errorMessage = "Error desconocido"

    if (error instanceof Error) {
      switch (error.message) {
        case "Firebase: Error (auth/user-not-found).":
          errorMessage = "Usuario no encontrado"
          break
        case "Firebase: Error (auth/wrong-password).":
          errorMessage = "Contraseña incorrecta"
          break
        case "Firebase: Error (auth/invalid-email).":
          errorMessage = "Email inválido"
          break
        case "Firebase: Error (auth/network-request-failed).":
          errorMessage = "Error de conexión. Verifica tu internet."
          break
        default:
          errorMessage = error.message
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

// Función para cerrar sesión
export async function signOutAdmin() {
  if (!auth) {
    return { success: false, error: "Firebase Auth no está disponible" }
  }

  try {
    await signOut(auth)
    console.log("✅ Sesión cerrada correctamente")
    return { success: true }
  } catch (error) {
    console.error("❌ Error en logout:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al cerrar sesión",
    }
  }
}

// Función para verificar el estado de autenticación
export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null)
    return () => {}
  }

  return onAuthStateChanged(auth, (user) => {
    console.log("🔄 Estado de auth cambió:", user ? `Usuario: ${user.email}` : "No autenticado")
    callback(user)
  })
}

// Función para verificar si el usuario actual es admin (TEMPORAL)
export async function isCurrentUserAdmin(): Promise<boolean> {
  if (!auth) return false

  try {
    const user = auth.currentUser
    if (!user) return false

    // Verificación temporal por email
    if (TEMP_ADMIN_EMAILS.includes(user.email || "")) {
      console.log("🛡️ Verificación admin (temporal):", true)
      return true
    }

    // Verificación normal de claims
    const token = await user.getIdTokenResult()
    const isAdmin = !!token.claims.admin
    console.log("🛡️ Verificación admin:", isAdmin)
    return isAdmin
  } catch (error) {
    console.error("❌ Error verificando admin:", error)
    return false
  }
}

// Función para obtener el usuario actual
export function getCurrentUser(): User | null {
  if (!auth) return null
  return auth.currentUser
}

// Función para forzar refresh del token
export async function refreshUserToken(): Promise<boolean> {
  if (!auth || !auth.currentUser) return false

  try {
    await auth.currentUser.getIdToken(true) // Force refresh
    console.log("🔄 Token refrescado")
    return true
  } catch (error) {
    console.error("❌ Error refrescando token:", error)
    return false
  }
}
