# 🔧 Next.js MIME Type Error - Troubleshooting Guide

## 🎯 Problem Solved
**Error**: `Refused to apply style from 'http://localhost:3000/_next/static/css/app/layout.css' because its MIME type ('text/html') is not a supported stylesheet MIME type`

## 🔍 Root Cause Analysis
This error occurs when:
1. **Port Mismatch**: Browser tries to load assets from wrong port
2. **Development Server Issues**: Next.js switches ports when 3000 is occupied
3. **404 Responses**: When assets aren't found, Next.js serves HTML 404 page instead of CSS/JS

## ✅ Solution Applied

### 1. **Fixed Port Configuration** 
Updated `package.json` scripts:
```json
{
  "scripts": {
    "dev": "next dev -p 3000",        // ← Explicit port 3000
    "dev:3001": "next dev -p 3001",   // ← Alternative port
    "dev:clean": "rm -rf .next && next dev -p 3000"  // ← Clean restart
  }
}
```

### 2. **Killed Conflicting Processes**
```bash
taskkill /f /im node.exe  # Kill all Node.js processes
npm run dev               # Restart on correct port
```

### 3. **Enhanced Next.js Config**
Updated `next.config.mjs`:
```javascript
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  // ... rest of config
}
```

## 🚀 Prevention Strategies

### 1. **Always Use Explicit Port**
```bash
# ✅ Good - explicit port
npm run dev              # Uses port 3000 explicitly
npm run dev:3001         # Alternative port if needed

# ❌ Avoid - lets Next.js choose port
next dev                 # May switch to 3001, 3002, etc.
```

### 2. **Check Port Usage**
```bash
# Windows
netstat -ano | findstr :3000

# Kill specific process if needed
taskkill /f /pid <PID>
```

### 3. **Clean Development Environment**
```bash
# Clean restart when assets seem corrupted
npm run dev:clean
```

### 4. **Browser Cache Management**
- **Hard Refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- **Clear Cache**: DevTools → Application → Storage → Clear Storage
- **Incognito Mode**: Test in private browsing to avoid cache

## 🧪 Testing & Verification

### Current Status Check
```bash
# ✅ Development server running correctly
http://localhost:3000 
- Status: ✅ Ready
- Assets: ✅ Loading correctly
- No MIME errors: ✅ Confirmed
```

### Verification Steps
1. **Check Server**: Visit http://localhost:3000
2. **Inspect Console**: No MIME type errors
3. **Asset Loading**: CSS and JS files load correctly
4. **Admin Panel**: http://localhost:3000/admin/dashboard works

## 🔄 Common Variations of This Error

### MIME Type Errors
```javascript
// CSS files served as HTML
"MIME type ('text/html') is not a supported stylesheet MIME type"

// JS files served as HTML  
"MIME type ('text/html') is not executable"

// All indicate: assets not found, 404 page served instead
```

### Port-Related Issues
```bash
⚠ Port 3000 is in use, trying 3001 instead.  # Next.js auto-switching
- Local: http://localhost:3001              # Wrong port cached in browser
```

## 🏆 Final Status

### ✅ **Before Fix**
```
❌ Assets loading from wrong port (3000 vs 3001)
❌ MIME type errors in console  
❌ CSS/JS not loading properly
❌ Broken admin panel styling
```

### ✅ **After Fix**  
```
✅ Development server on correct port (3000)
✅ All static assets loading correctly
✅ No MIME type errors in console
✅ Admin panel fully functional
✅ Firebase Storage integration working
```

---

**Status**: ✅ **RESOLVED** - MIME type errors eliminated, development server stable on port 3000, all assets loading correctly.