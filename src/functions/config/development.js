const dotenv = require('dotenv');

// Cargar variables de entorno desde .env
dotenv.config();

const developmentConfig = {
  firebase: {
    projectId: 'domoblock-devnew',
    useEmulator: true,
  },
  hubspot: {
    apiKey: process.env.HUBSPOT_API_KEY || 'test-key',
  },
};

module.exports = developmentConfig;