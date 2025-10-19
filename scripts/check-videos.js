const fs = require('fs');
const path = require('path');

async function checkVideoStatus() {
  try {
    console.log('🎬 Verificando estado de videos...\n');
    
    // 1. Verificar videos físicos
    const videosDir = path.join(__dirname, '..', 'public', 'uploads', 'videos');
    const videoFiles = fs.readdirSync(videosDir);
    
    console.log('📁 Videos físicos encontrados:');
    videoFiles.forEach((file, index) => {
      const filePath = path.join(videosDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   ${index + 1}. ${file} (${sizeKB} KB)`);
    });
    
    // 2. Verificar contenido en Firebase
    console.log('\n🔥 Obteniendo contenido de Firebase...');
    const response = await fetch('http://localhost:3000/api/content');
    
    if (response.ok) {
      const result = await response.json();
      const rooms = result.data.rooms?.rooms || [];
      
      console.log('\n🏠 Videos en habitaciones:');
      rooms.forEach((room, index) => {
        const videos = room.media?.filter(m => m.type === 'video') || [];
        console.log(`   ${index + 1}. ${room.name}:`);
        if (videos.length === 0) {
          console.log(`      ❌ Sin videos`);
        } else {
          videos.forEach((video, vIndex) => {
            const url = video.url || '(Sin URL)';
            const status = url && url !== '' ? '✅' : '❌';
            console.log(`      ${status} Video ${vIndex + 1}: ${url}`);
          });
        }
      });
      
      // 3. Verificar accesibilidad de videos
      console.log('\n🌐 Verificando accesibilidad de videos...');
      let accessibleCount = 0;
      const totalVideos = rooms.reduce((acc, room) => {
        return acc + (room.media?.filter(m => m.type === 'video').length || 0);
      }, 0);
      
      for (const room of rooms) {
        const videos = room.media?.filter(m => m.type === 'video') || [];
        for (const video of videos) {
          if (video.url && video.url.startsWith('/uploads/')) {
            try {
              const testResponse = await fetch(`http://localhost:3000${video.url}`, { method: 'HEAD' });
              if (testResponse.ok) {
                console.log(`   ✅ Accesible: ${video.url}`);
                accessibleCount++;
              } else {
                console.log(`   ❌ No accesible (${testResponse.status}): ${video.url}`);
              }
            } catch (error) {
              console.log(`   ❌ Error verificando: ${video.url}`);
            }
          } else if (video.url && (video.url.includes('youtube') || video.url.includes('youtu.be'))) {
            console.log(`   🌐 YouTube: ${video.url}`);
            accessibleCount++;
          }
        }
      }
      
      console.log(`\n📊 Resumen:`);
      console.log(`   📁 Videos físicos: ${videoFiles.length}`);
      console.log(`   🏠 Videos en contenido: ${totalVideos}`);
      console.log(`   ✅ Videos accesibles: ${accessibleCount}`);
      
      if (accessibleCount === totalVideos && totalVideos > 0) {
        console.log(`\n🎉 ¡Todos los videos están funcionando correctamente!`);
      } else if (totalVideos === 0) {
        console.log(`\n⚠️ No hay videos configurados en el contenido.`);
      } else {
        console.log(`\n⚠️ Algunos videos pueden tener problemas.`);
      }
      
    } else {
      console.log('❌ Error obteniendo contenido de Firebase');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkVideoStatus();