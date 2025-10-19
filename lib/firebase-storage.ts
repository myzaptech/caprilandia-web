import { storage } from "./firebase"
import type { FirebaseStorage } from "firebase/storage"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

// Tipos de archivos permitidos
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export interface UploadResult {
  url: string
  type: 'image' | 'video'
  filename: string
  path: string
}

export class FirebaseStorageManager {
  
  /**
   * Verificar si Firebase Storage está configurado correctamente
   */
  static async checkStorageConnection(): Promise<boolean> {
    if (!storage) {
      console.warn('⚠️ Firebase Storage no está inicializado')
      return false
    }
    
    try {
      // Intentar crear una referencia simple para verificar conexión
      const testRef = ref(storage as FirebaseStorage, 'test-connection')
      console.log('✅ Firebase Storage conectado correctamente')
      return true
    } catch (error) {
      console.error('❌ Error de conexión a Firebase Storage:', error)
      return false
    }
  }
  
  /**
   * Valida si el archivo es permitido
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    // Validar tipo
    const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de archivo no permitido: ${file.type}. Tipos permitidos: ${allowedTypes.join(', ')}`
      }
    }
    
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo permitido: ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }
    }

    return { valid: true }
  }

  /**
   * Sube un archivo usando la API como fallback
   */
  static async uploadFile(file: File, folder: string = 'media'): Promise<UploadResult> {
    // Validar archivo
    const validation = this.validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // TEMPORAL: Usar API fallback directamente mientras se resuelve CORS
    console.log('🔄 Usando API fallback debido a CORS issues conocidos...')
    try {
      const fallbackResult = await this.uploadFileViaAPI(file, folder)
      console.log('✅ Archivo subido via API fallback')
      return fallbackResult
    } catch (apiError) {
      console.error('❌ Error en API fallback:', apiError)
      throw new Error(`Error subiendo archivo: ${apiError instanceof Error ? apiError.message : 'Error desconocido'}`)
    }
  }

  /**
   * Sube archivo usando API route como fallback cuando Firebase Storage falla
   */
  static async uploadFileViaAPI(file: File, folder: string = 'media'): Promise<UploadResult> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`API upload failed: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'API upload failed')
    }
    
    return {
      url: result.url,
      type: result.type,
      filename: result.filename,
      path: result.path
    }
  }

  /**
   * Elimina un archivo de Firebase Storage
   */
  static async deleteFile(filePath: string): Promise<void> {
    if (!storage) {
      throw new Error('Firebase Storage no está inicializado')
    }
    const storageInstance = storage as FirebaseStorage

    try {
      const storageRef = ref(storageInstance, filePath)
      await deleteObject(storageRef)
      console.log(`🗑️ Archivo eliminado: ${filePath}`)
    } catch (error) {
      console.error('❌ Error eliminando archivo:', error)
      throw new Error(`Error eliminando archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Genera una miniatura para videos (usando canvas)
   */
  static async generateVideoThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('No se pudo crear contexto de canvas'))
        return
      }

      video.onloadedmetadata = () => {
        // Configurar canvas con las dimensiones del video
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 360
        
        // Buscar frame al segundo 1 o 10% del video
        video.currentTime = Math.min(1, video.duration * 0.1)
      }
      
      video.onseeked = () => {
        // Dibujar frame actual en canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Convertir a base64
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
        resolve(thumbnail)
        
        // Limpiar
        URL.revokeObjectURL(video.src)
      }
      
      video.onerror = (error) => {
        console.error('❌ Error generando thumbnail:', error)
        reject(new Error('Error generando miniatura del video'))
      }
      
      // Cargar video
      video.src = URL.createObjectURL(file)
    })
  }

  /**
   * Redimensiona una imagen si es muy grande
   */
  static async resizeImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('No se pudo crear contexto de canvas'))
        return
      }

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
        
        // Configurar canvas
        canvas.width = width
        canvas.height = height
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir a blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Error convirtiendo imagen'))
          }
        }, file.type, 0.9)
      }
      
      img.onerror = () => {
        reject(new Error('Error cargando imagen'))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }
}