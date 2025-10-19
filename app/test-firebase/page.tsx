"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import FirebaseStorageTest from "@/components/firebase-storage-test"

export default function TestFirebase() {
  const [status, setStatus] = useState("Verificando...")

  useEffect(() => {
    if (auth) {
      setStatus("✅ Firebase Auth está disponible")
    } else {
      setStatus("❌ Firebase Auth NO está disponible")
    }
  }, [])

  const testLogin = async () => {
    if (!auth) {
      setStatus("❌ Firebase Auth no está disponible")
      return
    }
    
    try {
      const result = await signInWithEmailAndPassword(auth, "test@caprilandia.com", "Test123456!")
      setStatus(`✅ Login exitoso: ${result.user.email}`)
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Test Firebase Auth</h1>
        <p className="mb-4">{status}</p>
        <button onClick={testLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
          Test Login
        </button>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Test Firebase Storage</h2>
        <FirebaseStorageTest />
      </div>
    </div>
  )
}
