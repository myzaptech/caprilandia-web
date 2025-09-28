import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import FaviconManager from "@/components/favicon-manager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hostal Caprilandia - Donde la tradición y la comodidad se encuentran",
  description:
    "Descubre la experiencia única del Hostal Caprilandia, un refugio acogedor que combina la calidez de un hogar con la comodidad moderna.",
  keywords: "hostal, caprilandia, alojamiento, turismo, habitaciones, colombia",
  authors: [{ name: "Hostal Caprilandia" }],
  openGraph: {
    title: "Hostal Caprilandia",
    description: "Donde la tradición y la comodidad se encuentran",
    type: "website",
    locale: "es_ES",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Protección adicional en el head */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.youtube.com *.google.com *.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *.vercel-storage.com *.v0.dev; frame-src 'self' *.youtube.com *.google.com; connect-src 'self' *.vercel.app *.googleapis.com *.google.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com;"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Protección CSS */
            * {
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              -khtml-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            
            /* Permitir selección solo en inputs */
            input, textarea {
              -webkit-user-select: text;
              -moz-user-select: text;
              -ms-user-select: text;
              user-select: text;
            }
            
            /* Ocultar scrollbars de DevTools */
            ::-webkit-scrollbar {
              display: none;
            }
          `,
          }}
        />
        {/* Favicon Manager */}
        <FaviconManager />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
