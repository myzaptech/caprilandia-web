"use client"

import { useEffect } from "react"

export default function AntiDebug() {
  useEffect(() => {
    // Solo aplicar en producción
    if (process.env.NODE_ENV !== "production") return

    // Anti-debugging técnicas avanzadas
    const antiDebug = () => {
      // Detectar debugger
      let devtools = false
      const detector = () => {
        if (devtools) return
        devtools = true

        // Crear loop infinito si se detecta debugger
        while (true) {
          debugger
        }
      }

      // Detectar timing de ejecución (indica si hay debugger activo)
      const start = performance.now()
      debugger
      const end = performance.now()

      if (end - start > 100) {
        detector()
      }

      // Verificar tamaño de ventana para detectar DevTools
      const threshold = 160
      if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
        detector()
      }
    }

    // Ofuscar código fuente
    const obfuscateSource = () => {
      // Reemplazar contenido del DOM si se detecta inspección
      const originalHTML = document.documentElement.innerHTML

      Object.defineProperty(document, "documentElement", {
        get() {
          antiDebug()
          return {
            innerHTML: `
              <!-- 
                ╔══════════════════════════════════════╗
                ║          CÓDIGO PROTEGIDO            ║
                ║                                      ║
                ║    🔒 Acceso no autorizado           ║
                ║    © 2025 Hostal Caprilandia         ║
                ║                                      ║
                ║    Este código está protegido por    ║
                ║    sistemas de seguridad avanzados   ║
                ╚══════════════════════════════════════╝
              -->
              <html>
                <head>
                  <title>🔒 Contenido Protegido</title>
                </head>
                <body>
                  <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #000;
                    color: #0f0;
                    font-family: 'Courier New', monospace;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                  ">
                    <div style="text-align: center;">
                      <h1>🔒 ACCESO DENEGADO</h1>
                      <p>Sistema de protección activado</p>
                      <p>© 2025 Hostal Caprilandia</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          }
        },
      })
    }

    // Proteger contra selección de texto
    const disableSelection = () => {
      document.onselectstart = () => false
      document.ondragstart = () => false
      document.body.style.userSelect = "none"
      document.body.style.webkitUserSelect = "none"
      document.body.style.mozUserSelect = "none"
      document.body.style.msUserSelect = "none"
    }

    // Detectar herramientas de red
    const detectNetworkTools = () => {
      // Crear requests falsos para detectar interceptores
      fetch("/fake-endpoint-detection")
        .then(() => {
          // Si la request es interceptada, activar protección
          antiDebug()
        })
        .catch(() => {
          // Request falló como esperado
        })
    }

    // Aplicar todas las protecciones
    const applyProtections = () => {
      antiDebug()
      obfuscateSource()
      disableSelection()
      detectNetworkTools()

      // Ejecutar verificaciones periódicas
      setInterval(antiDebug, 1000)
      setInterval(detectNetworkTools, 5000)
    }

    // Delay para evitar detección
    setTimeout(applyProtections, 1000)

    // Proteger contra modificación del script
    Object.freeze(window)
    Object.freeze(document)
    Object.freeze(console)
  }, [])

  return null
}
