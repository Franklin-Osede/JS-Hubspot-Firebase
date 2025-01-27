const admin = require('firebase-admin');
const { Client } = require('@hubspot/api-client');
const config = require('../config');

// Inicializar el cliente de HubSpot
const hubspotClient = new Client({ accessToken: config.hubspot.apiKey });

/**
 * Sincroniza un usuario específico de HubSpot con Firebase
 * @param {FirebaseFirestore.Firestore} db - Instancia de Firestore
 * @param {string} email - Email del usuario a sincronizar
 */
const syncSingleUser = async (db, email) => {
  try {
    const response = await hubspotClient.crm.contacts.basicApi.getPage(
      1,
      undefined,
      ['email', 'ID de registro']
    );

    const contact = response.results.find(
      (c) => c.properties.email?.toLowerCase() === email.toLowerCase()
    );

    if (!contact) {
      return {
        success: false,
        message: 'El contacto no existe en HubSpot'
      };
    }

    const snapshot = await db.collection('users')
      .where('email', '==', email.toLowerCase())
      .get();

    if (!snapshot.empty) {
      const idRegistroHubspot = contact.properties['ID de registro'];
      await snapshot.docs[0].ref.update({
        idRegistroHubspot,
        lastSyncedWithHubspot: admin.firestore.FieldValue.serverTimestamp()
      });

      return {
        success: true,
        idRegistroHubspot,
        hubspotId: contact.id
      };
    }

    return {
      success: false,
      message: 'Usuario no encontrado en Firestore'
    };
  } catch (error) {
    console.error('Error al sincronizar usuario:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  syncSingleUser,
  singleSyncService: syncSingleUser // Para mantener compatibilidad
};