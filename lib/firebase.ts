import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getFirestore, Firestore } from "firebase/firestore"
import { getAuth, Auth } from "firebase/auth"
import { getStorage, FirebaseStorage } from "firebase/storage"

// Firebase configuration - configuración para producción
// Usamos credenciales hardcodeadas que tienen prioridad sobre variables de entorno
const firebaseConfig = {
  apiKey: "AIzaSyAJd6zyhkkqVjuQWb6thS05UeD8-rCaCZ0",
  authDomain: "carilandia-base.firebaseapp.com",
  projectId: "carilandia-base",
  storageBucket: "carilandia-base.firebasestorage.app",
  messagingSenderId: "841945640213",
  appId: "1:841945640213:web:35cec3e1e3c91085db0d1c",
  measurementId: "G-HXPX889G7H",
}

// Verificar que Firebase no esté ya inicializado (evita errores en desarrollo)
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

let db: Firestore | null = null
let auth: Auth | null = null
let storage: FirebaseStorage | null = null

try {
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app)
  
  // Initialize Firebase Authentication
  auth = getAuth(app)
  
  // Initialize Firebase Storage
  storage = getStorage(app)
  
  // Log de confirmación (solo en desarrollo)
  if (process.env.NODE_ENV === "development") {
    console.log("✅ Firebase inicializado correctamente")
  }
} catch (error) {
  console.error("❌ Error inicializando Firebase:", error)
  // Crear objetos fallback para evitar errores
  db = null
  auth = null
  storage = null
}

export { db, auth, storage }
export default app
