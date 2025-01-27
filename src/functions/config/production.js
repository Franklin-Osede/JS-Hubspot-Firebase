const dotenv = require('dotenv');
const axios = require('axios');

// Cargar variables de entorno desde .env.production
dotenv.config({ path: '.env.production' });

let accessToken = process.env.HUBSPOT_API_KEY || ''; // Token inicial
const refreshToken = process.env.HUBSPOT_REFRESH_TOKEN; // Refresh Token

// Función para renovar el Access Token automáticamente
const refreshAccessToken = async () => {
  try {
    const response = await axios.post('https://api.hubspot.com/oauth/v1/token', null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        grant_type: 'refresh_token',
        client_id: '725d163d-287e-4f4a-97a7-13c818b16991', // Tu Client ID
        client_secret: 'a6722087-fdb3-4bc4-8225-400378d985b3', // Tu Client Secret
        refresh_token: refreshToken,
      },
    });

    accessToken = response.data.access_token; // Actualiza el token globalmente
    console.log('Nuevo Access Token obtenido (producción):', accessToken);

    return accessToken;
  } catch (error) {
    console.error('Error al renovar el Access Token:', error.response?.data || error.message);
    throw error;
  }
};

const productionConfig = {
  firebase: {
    projectId: 'domoblock-devnew',
    useEmulator: false, // En producción no usamos el emulador
  },
  hubspot: {
    get apiKey() {
      return accessToken; // Retorna siempre el Access Token actualizado
    },
    refreshAccessToken, // Exponer la función para renovar el token
  },
};

module.exports = productionConfig;
