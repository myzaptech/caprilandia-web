/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica
  poweredByHeader: false,
  
  // Configuración del servidor de desarrollo
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  
  // Headers de seguridad ahora se manejan en middleware.ts para mayor robustez
  
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

  // Webpack personalizado para ofuscación y chunk handling
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Configuración para ofuscar en producción
      config.optimization.minimize = true
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Renombrar variables y funciones
      config.optimization.mangleExports = true

      // Configuración mejorada de chunks para evitar errores de carga
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      }
    }
    
    return config
  },

  // Configuración para generar build ID consistente basado en contenido
  generateBuildId: async () => {
    // Generar build ID basado en timestamp y contenido para forzar updates
    const timestamp = Date.now()
    return `build-${timestamp}`
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
