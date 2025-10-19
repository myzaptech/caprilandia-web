// Test Firebase Storage configuration
const admin = require('firebase-admin');

// Firebase Admin SDK configuration
const serviceAccount = {
  type: "service_account",
  project_id: "carilandia-base",
  private_key_id: "your_private_key_id",
  private_key: "-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-xxxxx@carilandia-base.iam.gserviceaccount.com",
  client_id: "your_client_id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40carilandia-base.iam.gserviceaccount.com"
};

try {
  // Inicializar Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "carilandia-base.firebasestorage.app"
  });

  console.log('✅ Firebase Admin SDK inicializado correctamente');
  
  // Verificar Storage bucket
  const bucket = admin.storage().bucket();
  console.log(`📦 Storage bucket configurado: ${bucket.name}`);
  
  // Test de conexión
  bucket.getMetadata().then(() => {
    console.log('✅ Conexión a Firebase Storage exitosa');
  }).catch((error) => {
    console.error('❌ Error conectando a Firebase Storage:', error.message);
  });

} catch (error) {
  console.error('❌ Error inicializando Firebase Admin:', error.message);
}