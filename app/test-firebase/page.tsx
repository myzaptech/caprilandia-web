"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

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
    try {
      const result = await signInWithEmailAndPassword(auth, "test@caprilandia.com", "Test123456!")
      setStatus(`✅ Login exitoso: ${result.user.email}`)
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Firebase</h1>
      <p className="mb-4">{status}</p>
      <button onClick={testLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Test Login
      </button>
    </div>
  )
}
