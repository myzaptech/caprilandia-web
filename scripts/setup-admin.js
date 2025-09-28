// Script para configurar el usuario administrador en Firebase
// Ejecutar con: npm run setup-admin

import { initializeApp, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// IMPORTANTE: Reemplaza estas credenciales con las tuyas desde Firebase Console
// Ve a: Configuración del proyecto > Cuentas de servicio > Generar nueva clave privada
const serviceAccount = {
  type: "service_account",
  project_id: "carilandia-base", // Tu project ID real
  private_key_id: "tu_private_key_id_real",
  private_key: "-----BEGIN PRIVATE KEY-----\ntu_clave_privada_real_aqui\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-xxxxx@carilandia-base.iam.gserviceaccount.com", // Tu email real
  client_id: "tu_client_id_real",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40carilandia-base.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

// Inicializar Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
})

const auth = getAuth(app)

async function createAdminUser() {
  try {
    console.log("🚀 Iniciando configuración de usuario administrador...")

    // Primero, intentar obtener el usuario si ya existe
    let userRecord
    try {
      userRecord = await auth.getUserByEmail("admin@caprilandia.com")
      console.log("👤 Usuario ya existe:", userRecord.uid)
    } catch (error) {
      // Usuario no existe, crearlo
      console.log("👤 Creando nuevo usuario administrador...")
      userRecord = await auth.createUser({
        email: "admin@caprilandia.com",
        password: "CaprilandiaAdmin2025!",
        displayName: "Administrador Caprilandia",
        emailVerified: true,
      })
      console.log("✅ Usuario creado exitosamente:", userRecord.uid)
    }

    // Asignar custom claim de admin
    console.log("🛡️ Asignando permisos de administrador...")
    await auth.setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: "administrator",
      permissions: ["read", "write", "delete"],
      createdAt: new Date().toISOString(),
    })

    console.log("✅ Permisos de admin asignados correctamente")

    // Verificar que los claims se asignaron correctamente
    const updatedUser = await auth.getUser(userRecord.uid)
    console.log("🔍 Custom claims verificados:", updatedUser.customClaims)

    console.log("")
    console.log("🎉 ¡Configuración completada!")
    console.log("📧 Email:", "admin@caprilandia.com")
    console.log("🔑 Contraseña:", "CaprilandiaAdmin2025!")
    console.log("🛡️ Permisos:", "Administrador completo")
    console.log("")
    console.log("⚠️  IMPORTANTE: El usuario debe cerrar sesión y volver a iniciar para que los claims tomen efecto.")
  } catch (error) {
    console.error("❌ Error configurando usuario admin:", error)

    if (error.code === "auth/email-already-exists") {
      console.log("💡 El usuario ya existe. Intentando solo asignar permisos...")
      try {
        const existingUser = await auth.getUserByEmail("admin@caprilandia.com")
        await auth.setCustomUserClaims(existingUser.uid, {
          admin: true,
          role: "administrator",
          permissions: ["read", "write", "delete"],
          updatedAt: new Date().toISOString(),
        })
        console.log("✅ Permisos asignados al usuario existente")
      } catch (claimError) {
        console.error("❌ Error asignando permisos:", claimError)
      }
    }
  }
}

// Función para verificar usuario admin
async function verifyAdminUser() {
  try {
    const user = await auth.getUserByEmail("admin@caprilandia.com")
    console.log("👤 Usuario encontrado:", user.uid)
    console.log("🛡️ Custom claims:", user.customClaims)
    console.log("📧 Email verificado:", user.emailVerified)
    console.log("🕐 Creado:", user.metadata.creationTime)
    console.log("🕐 Último login:", user.metadata.lastSignInTime)
  } catch (error) {
    console.error("❌ Error verificando usuario:", error)
  }
}

// Ejecutar las funciones
async function main() {
  await createAdminUser()
  console.log("\n" + "=".repeat(50))
  console.log("🔍 VERIFICANDO CONFIGURACIÓN:")
  console.log("=".repeat(50))
  await verifyAdminUser()
}

main()
