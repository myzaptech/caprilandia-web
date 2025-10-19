const fs = require('fs');
const path = require('path');

async function uploadContentViaAPI() {
  try {
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
    
    console.log('🔥 Subiendo contenido a Firebase vía API...');
    
    const response = await fetch('http://localhost:3000/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: contentData })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Contenido subido exitosamente a Firebase!');
      console.log('🎬 Los videos deberían funcionar ahora');
      console.log('🔄 Recarga la página web para ver los cambios');
    } else {
      const error = await response.text();
      console.error('❌ Error subiendo contenido:', error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo: npm run dev');
  }
}

uploadContentViaAPI();