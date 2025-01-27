const dotenv = require('dotenv');

// Cargar variables de entorno desde .env.production
dotenv.config({ path: '.env.production' });

const productionConfig = {
  firebase: {
    projectId: 'domoblock-devnew',
    useEmulator: false, // En producción, nunca usaremos el emulador
  },
  hubspot: {
    apiKey: process.env.HUBSPOT_API_KEY || '',
  },
};

module.exports = productionConfig;