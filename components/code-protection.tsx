"use client"

import { useEffect } from "react"

export default function CodeProtection() {
  useEffect(() => {
    // Deshabilitar clic derecho
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Deshabilitar teclas de desarrollador
    const disableDevKeys = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault()
        return false
      }
      // Ctrl+U (ver código fuente)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault()
        return false
      }
      // Ctrl+S (guardar página)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault()
        return false
      }
    }

    // Detectar herramientas de desarrollador
    const detectDevTools = () => {
      const threshold = 160
      const devtools = {
        open: false,
        orientation: null as string | null,
      }

      const checkDevTools = () => {
        if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true
            // Redirigir o mostrar mensaje
            document.body.innerHTML = `
              <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                font-family: Arial, sans-serif;
              ">
                <div style="
                  background: white;
                  padding: 40px;
                  border-radius: 10px;
                  text-align: center;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                  max-width: 500px;
                ">
                  <h2 style="color: #333; margin-bottom: 20px;">🔒 Acceso Restringido</h2>
                  <p style="color: #666; margin-bottom: 30px;">
                    Por seguridad, las herramientas de desarrollador están deshabilitadas en este sitio.
                  </p>
                  <button onclick="window.location.reload()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                  ">
                    Recargar Página
                  </button>
                </div>
              </div>
            `
          }
        } else {
          devtools.open = false
        }
      }

      setInterval(checkDevTools, 500)
    }

    // Ofuscar consola
    const obfuscateConsole = () => {
      // Sobrescribir métodos de consola
      const originalLog = console.log
      const originalError = console.error
      const originalWarn = console.warn
      const originalInfo = console.info

      console.log = () => {
        originalLog("🔒 Acceso restringido")
      }
      console.error = () => {
        originalError("🔒 Acceso restringido")
      }
      console.warn = () => {
        originalWarn("🔒 Acceso restringido")
      }
      console.info = () => {
        originalInfo("🔒 Acceso restringido")
      }

      // Limpiar consola periódicamente
      setInterval(() => {
        console.clear()
      }, 1000)
    }

    // Detectar si se está ejecutando en modo desarrollo
    const isProduction = process.env.NODE_ENV === "production"

    if (isProduction) {
      // Aplicar protecciones solo en producción
      document.addEventListener("contextmenu", disableRightClick)
      document.addEventListener("keydown", disableDevKeys)
      detectDevTools()
      obfuscateConsole()

      // Mensaje de advertencia en consola
      console.log("%c🔒 ADVERTENCIA DE SEGURIDAD", "color: red; font-size: 20px; font-weight: bold;")
      console.log(
        "%cEste sitio web está protegido. El acceso no autorizado está prohibido.",
        "color: red; font-size: 14px;",
      )
      console.log("%c© 2025 Hostal Caprilandia - Todos los derechos reservados", "color: #666; font-size: 12px;")
    }

    // Cleanup
    return () => {
      if (isProduction) {
        document.removeEventListener("contextmenu", disableRightClick)
        document.removeEventListener("keydown", disableDevKeys)
      }
    }
  }, [])

  return null
}
