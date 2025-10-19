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
    // Verificar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'El archivo es demasiado grande. Máximo 50MB.' }
    }

    // Verificar tipo de archivo
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
    
    if (!isImage && !isVideo) {
      return { valid: false, error: 'Tipo de archivo no permitido. Solo imágenes (JPG, PNG, WebP) y videos (MP4, WebM, MOV).' }
    }

    return { valid: true }
  }

  /**
   * Sube un archivo a Firebase Storage
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
   * Sube múltiples archivos de forma paralela
   */
  static async uploadMultipleFiles(files: File[], folder: string = 'media'): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder))
    
    try {
      const results = await Promise.all(uploadPromises)
      console.log(`✅ ${results.length} archivos subidos exitosamente`)
      return results
    } catch (error) {
      console.error('❌ Error subiendo archivos múltiples:', error)
      throw error
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
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        video.currentTime = 1 // Capturar frame en segundo 1
      }

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0)
        const thumbnailDataURL = canvas.toDataURL('image/jpeg', 0.7)
        resolve(thumbnailDataURL)
      }

      video.onerror = () => {
        reject(new Error('Error cargando video para miniatura'))
      }

      video.src = URL.createObjectURL(file)
      video.load()
    })
  }

  /**
   * Redimensiona una imagen antes de subirla
   */
  static async resizeImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      if (!ctx) {
        reject(new Error('No se pudo crear contexto de canvas'))
        return
      }

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspecto
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convertir a blob y luego a File
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            reject(new Error('Error redimensionando imagen'))
          }
        }, file.type, quality)
      }

      img.onerror = () => {
        reject(new Error('Error cargando imagen'))
      }

      img.src = URL.createObjectURL(file)
    })
  }
}

export default FirebaseStorageManager