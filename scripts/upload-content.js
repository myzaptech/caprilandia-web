const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Verificar si ya está inicializado Firebase
if (!admin.apps.length) {
  // Inicializar Firebase Admin con variables de entorno
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || 'caprilandia-hostal'
  });
}

const db = admin.firestore();

async function uploadContentToFirebase() {
  try {
    console.log('📁 Leyendo archivo local content.json...');
    
    const contentPath = path.join(__dirname, 'data', 'content.json');
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
    
    await db.collection('content').doc('main').set(contentData);
    
    console.log('✅ Contenido subido exitosamente a Firebase!');
    console.log('🎬 Los videos deberían funcionar ahora');
    
  } catch (error) {
    console.error('❌ Error subiendo contenido:', error);
  } finally {
    process.exit(0);
  }
}

uploadContentToFirebase();