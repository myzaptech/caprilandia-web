/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica
  poweredByHeader: false,
  
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
