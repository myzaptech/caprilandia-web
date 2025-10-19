const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const fs = require('fs');
const path = require('path');

async function uploadContentToFirebase() {
  try {
    // Verificar si ya hay una app inicializada
    if (getApps().length === 0) {
      // Usar variables de entorno para Firebase
      initializeApp({
        projectId: 'caprilandia-hostal'
      });
    }

    const db = getFirestore();
    
    console.log('📁 Leyendo archivo local content.json...');
    
    const contentPath = path.join(__dirname, '..', 'data', 'content.json');
    
    if (!fs.existsSync(contentPath)) {
      console.error('❌ No se encontró content.json. Ejecuta primero: node scripts/create-content.js');
      return;
    }
    
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    console.log('🔍 Verificando datos de video en archivo local...');
    
    // Buscar habitaciones con videos
    const rooms = contentData.rooms?.rooms || [];
    rooms.forEach((room, roomIndex) => {
      const videos = room.media?.filter(m => m.type === 'video') || [];
      if (videos.length > 0) {
        console.log(`🎥 Habitación "${room.name}" tiene ${videos.length} videos:`);
        videos.forEach((video, videoIndex) => {
          console.log(`   Video ${videoIndex + 1}: ${video.url}`);
        });
      }
    });
    
    console.log('🔥 Subiendo contenido a Firebase...');
    
    // Subir a Firestore
    await db.collection('content').doc('main').set(contentData);
    
    console.log('✅ Contenido subido exitosamente a Firebase!');
    console.log('🎬 Los videos deberían funcionar ahora');
    console.log('🔄 Recarga la página web para ver los cambios');
    
  } catch (error) {
    console.error('❌ Error subiendo contenido:', error.message);
    
    if (error.message.includes('Could not load the default credentials')) {
      console.log('💡 Soluciones posibles:');
      console.log('   1. Instalar Google Cloud CLI: https://cloud.google.com/sdk/docs/install');
      console.log('   2. Ejecutar: gcloud auth application-default login');
      console.log('   3. O usar variables de entorno GOOGLE_APPLICATION_CREDENTIALS');
    }
  } finally {
    process.exit(0);
  }
}

uploadContentToFirebase();