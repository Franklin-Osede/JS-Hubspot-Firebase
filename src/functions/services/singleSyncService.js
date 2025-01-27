const admin = require('firebase-admin');
const { Client } = require('@hubspot/api-client');
const config = require('../config');

console.log('Configuración de HubSpot:', {
  apiKey: config.hubspot.apiKey ? 'Presente' : 'No presente',
});

// Inicializar el cliente de HubSpot
const hubspotClient = new Client({
  accessToken: config.hubspot.apiKey,
});

/**
 * Renueva el Access Token usando el Refresh Token.
 * @returns {string} El nuevo Access Token.
 */
const refreshAccessToken = async () => {
  try {
    console.log('Intentando renovar el Access Token...');
    const response = await fetch('https://api.hubspot.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: config.hubspot.clientId,
        client_secret: config.hubspot.clientSecret,
        refresh_token: config.hubspot.refreshToken,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error al renovar el Access Token:', errorBody);
      throw new Error('Error al renovar el Access Token');
    }

    const data = await response.json();
    console.log('Nuevo Access Token obtenido:', data.access_token);

    // Actualizar el token en el cliente de HubSpot
    hubspotClient.setAccessToken(data.access_token);

    return data.access_token;
  } catch (error) {
    console.error('Error al renovar el Access Token:', error.message);
    throw error;
  }
};

/**
 * Sincroniza un usuario específico de HubSpot con Firebase.
 * @param {FirebaseFirestore.Firestore} db - Instancia de Firestore.
 * @param {string} email - Email del usuario a sincronizar.
 * @param {number} retryCount - Número de reintentos para evitar recursión infinita.
 */
const syncSingleUser = async (db, email, retryCount = 0) => {
  try {
    console.log('Access Token actual:', config.hubspot.apiKey);
    console.log('Iniciando búsqueda en HubSpot para:', email);

    // Buscar contacto por email en HubSpot
    const response = await hubspotClient.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: email,
            },
          ],
        },
      ],
      properties: ['email', 'id'], // Propiedades específicas que necesitas
    });

    // Verificar resultados
    if (!response.results || response.results.length === 0) {
      console.log('No se encontraron contactos para el email:', email);
      return {
        success: false,
        message: 'El contacto no existe en HubSpot',
      };
    }

    const contact = response.results[0];
    console.log('Contacto encontrado en HubSpot:', contact);

    // Verificar usuario en Firestore
    const snapshot = await db.collection('users').where('email', '==', email.toLowerCase()).get();

    if (!snapshot.empty) {
      const hubspotId = contact.id;
      await snapshot.docs[0].ref.update({
        hubspotId,
        lastSyncedWithHubspot: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Usuario sincronizado exitosamente en Firestore:', email);
      return {
        success: true,
        hubspotId,
        message: 'Usuario sincronizado exitosamente',
      };
    }

    console.log('Usuario no encontrado en Firestore para:', email);
    return {
      success: false,
      message: 'Usuario no encontrado en Firestore',
    };
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Access Token expirado. Intentando renovar...');

      // Limitar los reintentos para evitar recursión infinita
      if (retryCount >= 1) {
        console.error('Límite de reintentos alcanzado. Abortando.');
        return {
          success: false,
          message: 'Error al renovar el Access Token',
        };
      }

      // Renovar el Access Token
      const newAccessToken = await refreshAccessToken();
      hubspotClient.setAccessToken(newAccessToken); // Reconfigurar cliente
      return syncSingleUser(db, email, retryCount + 1); // Reintentar
    }

    console.error('Error al sincronizar usuario:', error.message);
    return {
      success: false,
      message: 'Error al sincronizar usuario',
      error: error.message,
    };
  }
};

module.exports = {
  syncSingleUser,
  singleSyncService: syncSingleUser, // Para mantener compatibilidad
};
