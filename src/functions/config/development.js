const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno desde .env.development
const envPath = path.resolve(__dirname, '../.env.development');
console.log('🔍 Buscando archivo .env en:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error cargando .env:', result.error);
} else {
  console.log('✅ Archivo .env cargado correctamente');
}

console.log('🔑 HUBSPOT_ACCESS_TOKEN:', process.env.HUBSPOT_ACCESS_TOKEN ? 'Presente' : 'No presente');

const developmentConfig = {
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'domoblock-devnew',
    useEmulator: true,
  },
  hubspot: {
    apiKey: process.env.HUBSPOT_ACCESS_TOKEN
  }
};

if (!developmentConfig.hubspot.apiKey) {
  console.error('❌ Token de HubSpot no encontrado en la configuración');
} else {
  console.log('✅ Token de HubSpot configurado correctamente');
}

module.exports = developmentConfig;