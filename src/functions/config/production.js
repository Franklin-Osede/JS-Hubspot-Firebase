// config/production.js

const dotenv = require('dotenv');

// Cargar variables de entorno desde .env.production
dotenv.config({ path: '.env.production' });

// Validación inicial de configuración
if (!process.env.HUBSPOT_ACCESS_TOKEN) {
  console.warn('⚠️ HUBSPOT_ACCESS_TOKEN no está configurado en .env.production');
}

// Configuración para producción
const productionConfig = {
  // Configuración de Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'domoblock-devnew',
    useEmulator: false, // En producción no usamos el emulador
  },

  // Configuración de HubSpot
  hubspot: {
    apiKey: process.env.HUBSPOT_ACCESS_TOKEN
  }
};

// Log de verificación (solo al inicio)
console.log('🚀 Configuración de producción cargada:', {
  environment: 'production',
  firebaseProject: productionConfig.firebase.projectId,
  hubspotConfigured: !!productionConfig.hubspot.apiKey
});

module.exports = productionConfig;