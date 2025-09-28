import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Firebase configuration - configuración para producción
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAJd6zyhkkqVjuQWb6thS05UeD8-rCaCZ0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "carilandia-base.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "carilandia-base",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "carilandia-base.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "841945640213",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:841945640213:web:35cec3e1e3c91085db0d1c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HXPX889G7H",
}

// Verificar que Firebase no esté ya inicializado (evita errores en desarrollo)
let app
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

let db
let auth

try {
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app)
  
  // Initialize Firebase Authentication
  auth = getAuth(app)
  
  // Log de confirmación (solo en desarrollo)
  if (process.env.NODE_ENV === "development") {
    console.log("✅ Firebase inicializado correctamente")
  }
} catch (error) {
  console.error("❌ Error inicializando Firebase:", error)
  // Crear objetos fallback para evitar errores
  db = null
  auth = null
}

export { db, auth }
export default app
