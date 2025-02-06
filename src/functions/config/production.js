const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno desde .env.production
const envPath = path.resolve(__dirname, '../.env.production');
console.log('🔍 Buscando archivo .env.production en:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error cargando .env.production:', result.error);
} else {
  console.log('✅ Archivo .env.production cargado correctamente');
}

console.log('🔑 HUBSPOT_ACCESS_TOKEN:', process.env.HUBSPOT_ACCESS_TOKEN ? 'Presente' : 'No presente');

const productionConfig = {
  firebase: {
    projectId: process.env.PROJECT_ID || 'domoblock-dapp',
    credential: {
      type: process.env.TYPE,
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: process.env.AUTH_URI,
      token_uri: process.env.TOKEN_URI,
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.CLIENT_CERT_URL
    },
    useEmulator: false
  },
  hubspot: {
    apiKey: process.env.HUBSPOT_ACCESS_TOKEN
  }
};

if (!productionConfig.hubspot.apiKey) {
  console.error('❌ Token de HubSpot no encontrado en la configuración');
} else {
  console.log('✅ Token de HubSpot configurado correctamente');
}

module.exports = productionConfig;