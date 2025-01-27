const dotenv = require('dotenv');

// Cargar variables de entorno desde .env.production
dotenv.config();

const productionConfig = {
  firebase: {
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    useEmulator: false, // En producción, nunca usaremos el emulador
  },
  hubspot: {
    apiKey: process.env.HUBSPOT_API_KEY,
  },
};

module.exports = productionConfig;
