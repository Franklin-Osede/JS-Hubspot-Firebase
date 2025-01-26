const dotenv = require('dotenv');

// Cargar variables de entorno desde .env
dotenv.config();

const developmentConfig = {
  firebase: {
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    useEmulator: process.env.USE_FIREBASE_EMULATOR === 'true',
  },
  hubspot: {
    apiKey: process.env.HUBSPOT_API_KEY,
  },
};

module.exports = developmentConfig;
