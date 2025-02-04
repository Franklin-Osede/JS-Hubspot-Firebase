// singleSyncService.js
const admin = require('firebase-admin');
const { Client } = require('@hubspot/api-client');
const config = require('../config');

// Inicializar el cliente de HubSpot
const hubspotClient = new Client({
  accessToken: config.hubspot.apiKey
});

/**
 * Sincroniza un usuario específico de HubSpot con Firebase.
 * @param {FirebaseFirestore.Firestore} db - Instancia de Firestore.
 * @param {string} email - Email del usuario a sincronizar.
 */
const syncSingleUser = async (db, email) => {
  try {
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
      properties: ['email', 'id', 'ID de registro'],
    });

    if (!response.results || response.results.length === 0) {
      console.log('No se encontraron contactos para el email:', email);
      return {
        success: false,
        message: 'El contacto no existe en HubSpot',
      };
    }

    const contact = response.results[0];
    const snapshot = await db.collection('users')
      .where('email', '==', email.toLowerCase())
      .get();

    if (!snapshot.empty) {
      const hubspotId = contact.id;
      const idRegistroHubspot = contact.properties['ID de registro'];

      await snapshot.docs[0].ref.update({
        hubspotId,
        idRegistroHubspot,
        lastSyncedWithHubspot: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        hubspotId,
        message: 'Usuario sincronizado exitosamente',
      };
    }

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