# 🔧 Solución de Problemas - Caprilandia

## Errores de Carga de Chunks (ChunkLoadError)

### ¿Qué son estos errores?

Los errores tipo "ChunkLoadError: Loading chunk failed" ocurren cuando:
- El navegador intenta cargar archivos JavaScript obsoletos
- Hay inconsistencias entre la versión en cache y la versión actual
- Se ha desplegado una nueva versión y el navegador aún tiene cache antiguo

### Soluciones Implementadas

#### 1. **Auto-Recovery System**
- Detección automática de errores de chunks
- Reload automático en el primer error
- Redirección a página de limpieza tras múltiples errores

#### 2. **Cache Control Headers**
- Headers específicos para chunks de Next.js
- Cache inmutable para archivos con hash
- No-cache para HTML principal

#### 3. **Página de Limpieza de Cache**
Accesible en: `https://caprilandia.com/clear-cache.html`

**Funciones:**
- Limpia Service Workers
- Elimina todos los caches del navegador
- Borra localStorage y sessionStorage
- Redirección automática al sitio principal

### Guía de Uso

#### Para Usuarios
Si experimentas errores de carga:

1. **Espera 2-3 segundos** - El sistema intentará auto-recuperarse
2. **Si persiste** - Serás redirigido automáticamente a la página de limpieza
3. **Manual** - Visita `/clear-cache.html` directamente

#### Para Desarrolladores
Después de cada deployment:

```bash
# Build con nuevo timestamp
npm run build

# Commit con .next incluido
git add .
git commit -m "Deploy: New chunks with timestamp"
git push origin main
```

### Estructura de Chunks Optimizada

```
chunks/
├── vendors-[hash].js      # Librerías de terceros
├── main-[hash].js         # Código principal
├── app/page-[hash].js     # Páginas específicas
└── framework-[hash].js    # Framework de Next.js
```

### Headers de Cache

```typescript
// Chunks inmutables (1 año)
/_next/static/chunks/* → Cache-Control: public, max-age=31536000, immutable

// Assets estáticos (1 hora + stale-while-revalidate)
/_next/static/* → Cache-Control: public, max-age=3600, stale-while-revalidate=86400

// HTML principal (sin cache)
/ → Cache-Control: no-cache, no-store, must-revalidate
```

### Monitoreo

Los errores se registran en la consola con prefijo `🔄`:
- `🔄 Chunk loading error detected (#1)` - Primer error, intentando reload
- `🔄 Multiple chunk errors detected` - Múltiples errores, redirigiendo
- `🔄 Unhandled chunk loading promise rejection` - Error no capturado

### Prevención

1. **Build ID único por deployment**
2. **Chunks optimizados por tamaño y dependencias**
3. **Headers de cache apropiados**
4. **Sistema de fallback robusto**

---

**💡 Tip:** En caso de problemas persistentes, usar la URL con parámetro cache-bust:
`https://caprilandia.com/?v=123456789`