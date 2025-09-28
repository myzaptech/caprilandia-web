# 🏨 Hostal Caprilandia - Sitio Web Oficial

Una aplicación web moderna para el Hostal Caprilandia, construida con Next.js y diseñada para ofrecer una experiencia única a los huéspedes potenciales.

## 🌟 Características Principales

- **🎨 Diseño Responsive:** Optimizado para todos los dispositivos
- **🖼️ Galería Multimedia:** Soporta tanto imágenes como videos locales
- **⚙️ Panel de Administración:** Sistema completo de gestión de contenido
- **🔥 Firebase Integration:** Base de datos en tiempo real y autenticación
- **📱 Progressive Web App:** Experiencia similar a una aplicación nativa
- **🎬 Tour Virtual:** Recorrido inmersivo del hostal
- **📞 Contacto Directo:** Integración con WhatsApp
- **🔒 Autenticación Segura:** Sistema de login para administradores

## 🚀 Tecnologías Utilizadas

- **Framework:** Next.js 14
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **UI Components:** Radix UI
- **Base de Datos:** Firebase Firestore
- **Autenticación:** Firebase Auth
- **Almacenamiento:** Firebase Storage + Local Storage
- **Iconos:** Lucide React

## 📋 Funcionalidades

### 🏠 Sitio Web Principal
- Hero section con imagen de fondo personalizable
- Información detallada sobre el hostal
- Galería de fotos y videos
- Sección de habitaciones con precios opcionales
- Testimonios de huéspedes
- Información de servicios
- Formulario de contacto
- Integración con redes sociales

### 🛠️ Panel de Administración
- **Configuración del Sitio:** Logo, favicon, título y descripción
- **Gestión de Contenido:** Edición completa de todas las secciones
- **Galería Multimedia:** Subida de imágenes y videos locales
- **Habitaciones:** Gestión de habitaciones con precios opcionales
- **Testimonios:** Administración de reseñas de huéspedes
- **Auto-guardado:** Cambios se guardan automáticamente cada 2 segundos
- **Respaldo Local:** Funciona offline con localStorage

### 🎬 Características Avanzadas
- **Subida de Videos:** Soporta archivos MP4, WebM, MOV hasta 50MB
- **Generación de Thumbnails:** Automática para videos
- **Migración de Datos:** Conversión automática de formatos anteriores
- **Validación de Archivos:** Verificación de tipo y tamaño
- **Drag & Drop:** Subida intuitiva de archivos

## 🏗️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm, yarn o pnpm
- Cuenta de Firebase

### 1. Clonar el repositorio
```bash
git clone https://github.com/myzaptech/caprilandia-web.git
cd caprilandia-web
```

### 2. Instalar dependencias
```bash
npm install
# o
pnpm install
# o 
yarn install
```

### 3. Configurar Firebase
1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Firestore y Authentication
3. Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
# o
pnpm dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
├── app/                    # Pages y API routes (App Router)
│   ├── admin/             # Panel de administración
│   ├── api/               # API endpoints
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   ├── ui/                # Componentes base de UI
│   ├── gallery-upload.tsx # Subida de galería
│   ├── video-upload.tsx   # Subida de videos
│   └── ...
├── hooks/                 # Custom hooks
│   └── use-content.ts     # Hook para gestión de contenido
├── lib/                   # Utilidades y configuraciones
│   ├── firebase.ts        # Configuración de Firebase
│   └── utils.ts           # Utilidades generales
├── data/                  # Datos por defecto
│   └── content.json       # Contenido inicial
└── public/                # Archivos estáticos
```

## 🔐 Uso del Panel de Administración

1. Navegar a `/admin/login`
2. Iniciar sesión con credenciales de Firebase
3. Acceder al dashboard en `/admin/dashboard`
4. Editar contenido usando las pestañas disponibles:
   - **Sitio:** Logo, favicon, configuración general
   - **Inicio:** Hero section y contenido principal
   - **Acerca:** Información del hostal
   - **Habitaciones:** Gestión de habitaciones y precios
   - **Galería:** Subida de fotos y videos
   - **Servicios:** Listado de servicios ofrecidos
   - **Testimonios:** Reseñas de huéspedes
   - **Contacto:** Información de contacto y redes sociales

## 🌐 Despliegue

### Vercel (Recomendado)
1. Conectar el repositorio a Vercel
2. Configurar variables de entorno de Firebase
3. Desplegar automáticamente

### Otros Proveedores
- Netlify
- AWS Amplify  
- Railway
- Render

## 🤝 Contribución

1. Fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es privado y está bajo los términos definidos por MyZap Tech.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contactar:

- **Email:** support@myzaptech.com
- **GitHub Issues:** [Crear un issue](https://github.com/myzaptech/caprilandia-web/issues)

## 🎯 Roadmap

- [ ] Integración con sistema de reservas
- [ ] Multiidioma (ES/EN)
- [ ] PWA con notificaciones push
- [ ] Optimización SEO avanzada
- [ ] Analytics y métricas
- [ ] Chat en vivo

---

**Desarrollado con ❤️ por [MyZap Tech](https://myzaptech.com)**