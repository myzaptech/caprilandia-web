/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica
  poweredByHeader: false,
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.youtube.com *.google.com *.googleapis.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: blob: *.vercel-storage.com *.v0.dev; frame-src 'self' *.youtube.com *.google.com; connect-src 'self' *.vercel.app *.googleapis.com *.google.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com; font-src 'self' fonts.gstatic.com;"
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },
  
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blob.v0.dev',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      }
    ],
    unoptimized: true,
  },

  // Optimizaciones de producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },

  // Webpack personalizado para ofuscación
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Configuración para ofuscar en producción
      config.optimization.minimize = true
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Renombrar variables y funciones
      config.optimization.mangleExports = true
    }
    
    return config
  },

  // Ignorar errores durante la construcción
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ignorar errores de TypeScript durante la construcción
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
