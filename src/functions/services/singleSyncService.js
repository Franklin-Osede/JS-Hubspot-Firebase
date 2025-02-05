const admin = require('firebase-admin');
const { Client } = require('@hubspot/api-client');
const config = require('../config');

console.log('Configuración de HubSpot:', {
  apiKey: config.hubspot.apiKey ? 'Presente' : 'No presente'
});

// Inicializar el cliente de HubSpot
const hubspotClient = new Client({
  accessToken: config.hubspot.apiKey
});

const syncSingleUser = async (db, email) => {
  try {
    console.log('Access Token actual:', config.hubspot.apiKey);
    console.log('Iniciando búsqueda en HubSpot para:', email);

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
      properties: ['email', 'id'],
    });

    if (!response.results || response.results.length === 0) {
      console.log('No se encontraron contactos para el email:', email);
      return {
        success: false,
        message: 'El contacto no existe en HubSpot',
      };
    }

    const contact = response.results[0];
    console.log('Contacto encontrado en HubSpot:', contact);

    const snapshot = await db.collection('users')
      .where('email', '==', email.toLowerCase())
      .get();

    if (!snapshot.empty) {
      const hubspotId = contact.id;
      await snapshot.docs[0].ref.update({
        hubspotId,
        lastSyncedWithHubspot: new Date().toISOString(),
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
    console.error('Error al sincronizar usuario:', error);
    return {
      success: false,
      message: 'Error al sincronizar usuario',
      error: error.message,
    };
  }
};

module.exports = {
  syncSingleUser,
  singleSyncService: syncSingleUser,
};