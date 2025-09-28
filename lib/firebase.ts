import { initializeApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getAuth, connectAuthEmulator } from "firebase/auth"

// Firebase configuration - usando variables de entorno para seguridad
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAJd6zyhkkqVjuQWb6thS05UeD8-rCaCZ0", // Tu API Key real
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "carilandia-base.firebaseapp.com", // Tu dominio real
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "carilandia-base", // Tu project ID real
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "carilandia-base.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "841945640213",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:841945640213:web:35cec3e1e3c91085db0d1c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HXPX889G7H",
}

let app
let db
let auth

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig)

  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app)

  // Initialize Firebase Authentication
  auth = getAuth(app)

  // Solo conectar a emuladores en desarrollo
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    // Verificar si ya están conectados los emuladores
    try {
      // Solo conectar si no están ya conectados
      if (!auth._delegate._config.emulator) {
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
      }
      if (!db._delegate._databaseId.projectId.includes("demo-")) {
        connectFirestoreEmulator(db, "localhost", 8080)
      }
    } catch (error) {
      // Los emuladores ya están conectados o no están disponibles
      console.log("Emuladores no disponibles o ya conectados")
    }
  }

  console.log("✅ Firebase inicializado correctamente")
} catch (error) {
  console.error("❌ Error inicializando Firebase:", error)
  // Create mock objects for development
  db = null
  auth = null
}

export { db, auth }
export default app
