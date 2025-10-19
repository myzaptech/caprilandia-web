// Script para probar la API de limpieza manualmente
const testCleanup = async () => {
  console.log('🧪 Testing cleanup API...')
  
  try {
    const response = await fetch('http://localhost:3000/api/cleanup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        cleanupAll: false,
        specificUrls: [
          '/uploads/images/1760910730291_i39grg9i7.png',
          '/uploads/images/1760910971555_yo7ny8tge.png'
        ]
      })
    })

    console.log('Response status:', response.status)
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ API Response:', JSON.stringify(result, null, 2))
    } else {
      const error = await response.text()
      console.log('❌ API Error:', error)
    }
  } catch (error) {
    console.error('❌ Network Error:', error)
  }
}

// También probar limpieza completa
const testFullCleanup = async () => {
  console.log('🧪 Testing full cleanup API...')
  
  try {
    const response = await fetch('http://localhost:3000/api/cleanup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        cleanupAll: true
      })
    })

    console.log('Response status:', response.status)
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Full Cleanup Response:', JSON.stringify(result, null, 2))
    } else {
      const error = await response.text()
      console.log('❌ Full Cleanup Error:', error)
    }
  } catch (error) {
    console.error('❌ Network Error:', error)
  }
}

// Ejecutar tests
testCleanup().then(() => {
  console.log('\n' + '='.repeat(50) + '\n')
  return testFullCleanup()
})