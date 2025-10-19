import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Manejar archivos de uploads que no existen
  if (pathname.startsWith('/uploads/')) {
    // Intentar servir el archivo normalmente
    // Si no existe, Next.js automáticamente devuelve 404
    // Esto lo capturaremos en el componente SafeImage
  }

  // Crear respuesta
  const response = NextResponse.next()

  // Headers especiales para chunks de Next.js para prevenir errores de chunk loading
  if (pathname.startsWith('/_next/static/chunks/')) {
    // Immutable caching para chunks con hash (nunca cambian)
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    return response
  }

  // Headers para archivos estáticos generales
  if (pathname.startsWith('/_next/static/')) {
    // Cache más agresivo para assets estáticos
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
    return response
  }

  // Headers para el HTML principal para evitar cache de versiones obsoletas
  if (pathname === '/' || pathname.startsWith('/admin') || !pathname.includes('.')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }
  
  // CSP simplificado sin nonce para evitar conflictos con Next.js
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.youtube.com *.google.com *.googleapis.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "img-src 'self' data: blob: *.vercel-storage.com *.v0.dev *.firebasestorage.app *.googleusercontent.com",
    "media-src 'self' data: blob: *.firebasestorage.app *.googleapis.com *.googleusercontent.com",
    "frame-src 'self' *.youtube.com *.google.com",
    "connect-src 'self' blob: *.vercel.app *.googleapis.com *.google.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com *.googleusercontent.com",
    "font-src 'self' fonts.gstatic.com data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ')

  // Aplicar headers de seguridad
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}