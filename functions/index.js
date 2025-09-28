const functions = require("firebase-functions")
const admin = require("firebase-admin")

admin.initializeApp()

// Función para hacer admin a un usuario (SOLO USAR UNA VEZ)
exports.makeAdmin = functions.https.onRequest(async (req, res) => {
  try {
    // IMPORTANTE: Esta función debe ser protegida o eliminada después de usar
    const email = "admin@caprilandia.com"

    // Buscar usuario por email
    const user = await admin.auth().getUserByEmail(email)

    // Asignar claim de admin
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
      role: "administrator",
    })

    res.json({
      success: true,
      message: `Usuario ${email} ahora es administrador`,
      uid: user.uid,
    })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})
