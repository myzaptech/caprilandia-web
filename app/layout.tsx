import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import FaviconManager from "@/components/favicon-manager"
import { ChunkErrorHandler } from "./chunk-error-handler"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Caprilandia | Hostal en Zapatoca - Hospedaje Caprilandia Santander",
  description:
    "Hostal Caprilandia en Zapatoca, Santander. El mejor alojamiento en Zapatoca. Hostal acogedor que combina tradición y comodidad moderna. Reserva tu estadía en el mejor hostal de Zapatoca.",
  keywords: "caprilandia, hostal caprilandia, hostal zapatoca, hostales en zapatoca, hostal santander, alojamiento zapatoca, hotel zapatoca, hospedaje zapatoca, turismo zapatoca, habitaciones zapatoca, posada zapatoca, reservas zapatoca, colombia, santander",
  authors: [{ name: "Hostal Caprilandia Zapatoca" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Caprilandia | Hostal en Zapatoca, Santander",
    description: "Hostal Caprilandia en Zapatoca - Donde la tradición y la comodidad se encuentran",
    type: "website",
    locale: "es_ES",
    siteName: "Hostal Caprilandia Zapatoca",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caprilandia | Hostal en Zapatoca, Santander",
    description: "El mejor hostal en Zapatoca, Santander - Donde la tradición y la comodidad se encuentran",
  },
  generator: 'Next.js',
  alternates: {
    canonical: 'https://caprilandia.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* SEO optimizado para Caprilandia */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Schema markup para mejor SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              "name": "Hostal Caprilandia",
              "alternateName": ["Caprilandia", "Hostal Zapatoca", "Caprilandia Zapatoca"],
              "description": "Hostal Caprilandia en Zapatoca, Santander - Donde la tradición y la comodidad se encuentran",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "CO",
                "addressRegion": "Santander",
                "addressLocality": "Zapatoca",
                "streetAddress": "Zapatoca, Santander"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "6.814540731844357",
                "longitude": "-73.26600351968037"
              },
              "servesCuisine": "Colombian",
              "priceRange": "$$",
              "telephone": "+57-XXX-XXXXXXX",
              "url": "https://caprilandia.com",
              "sameAs": [],
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "WiFi",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification", 
                  "name": "Parking",
                  "value": true
                }
              ],
              "keywords": ["hostal zapatoca", "alojamiento zapatoca", "hotel zapatoca", "caprilandia", "turismo santander"]
            })
          }}
        />
        
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Protección CSS reducida para no afectar SEO */
            input, textarea {
              -webkit-user-select: text;
              -moz-user-select: text;
              -ms-user-select: text;
              user-select: text;
            }
          `,
          }}
        />
        {/* Favicon Manager */}
        <FaviconManager />
      </head>
      <body className={inter.className}>
        <ChunkErrorHandler />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
