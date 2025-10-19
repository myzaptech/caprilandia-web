import Head from 'next/head'

export default function SEOHead() {
  return (
    <Head>
      {/* Meta tags adicionales para Caprilandia y Zapatoca */}
      <meta name="description" content="Hostal Caprilandia en Zapatoca, Santander. El mejor alojamiento en Zapatoca. Hostal de calidad, habitaciones cómodas, servicios excepcionales. Reserva en el mejor hostal de Zapatoca." />
      <meta name="keywords" content="caprilandia, hostal caprilandia, capri landia, hostal zapatoca, hostales en zapatoca, hostal santander, hotel zapatoca, alojamiento zapatoca, hospedaje zapatoca, turismo zapatoca, habitaciones zapatoca, reservas zapatoca, posada zapatoca, Colombia, santander, pueblo patrimonio" />
      
      {/* Open Graph adicional */}
      <meta property="og:title" content="Caprilandia | Hostal en Zapatoca, Santander - Alojamiento de Calidad" />
      <meta property="og:description" content="Descubre Caprilandia, el mejor hostal en Zapatoca, Santander. Combina tradición y comodidad en el corazón del pueblo patrimonio." />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="es_CO" />
      <meta property="og:site_name" content="Hostal Caprilandia Zapatoca" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Caprilandia | Hostal en Zapatoca, Santander" />
      <meta name="twitter:description" content="El mejor hostal en Zapatoca, Santander - Donde la tradición y la comodidad se encuentran" />
      
      {/* Otros meta tags importantes */}
      <meta name="author" content="Hostal Caprilandia Zapatoca" />
      <meta name="language" content="Spanish" />
      <meta name="geo.region" content="CO-SAN" />
      <meta name="geo.placename" content="Zapatoca, Santander, Colombia" />
      <meta name="geo.position" content="6.814540731844357;-73.26600351968037" />
      <meta name="ICBM" content="6.814540731844357, -73.26600351968037" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://caprilandia.com" />
      
      {/* Preconnect para mejor performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  )
}