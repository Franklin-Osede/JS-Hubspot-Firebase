// config/development.js

const dotenv = require('dotenv');

// Cargar variables de entorno desde .env.development
dotenv.config({ path: '.env.development' });

// Validación inicial de configuración
if (!process.env.HUBSPOT_ACCESS_TOKEN) {
  console.warn('⚠️ HUBSPOT_ACCESS_TOKEN no está configurado en .env.development');
}

// Configuración para desarrollo
const developmentConfig = {
  // Configuración de Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'domoblock-devnew',
    useEmulator: true,
  },

  // Configuración de HubSpot
  hubspot: {
    apiKey: process.env.HUBSPOT_ACCESS_TOKEN
  }
};

// Log de verificación (opcional, puedes comentarlo en producción)
console.log('📝 Configuración cargada:', {
  environment: 'development',
  firebaseProject: developmentConfig.firebase.projectId,
  hubspotConfigured: !!developmentConfig.hubspot.apiKey
});

module.exports = developmentConfig;