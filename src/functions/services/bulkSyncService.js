const admin = require('firebase-admin');
const { Client } = require('@hubspot/api-client');
const config = require('../config');

// Inicializar el cliente de HubSpot
const hubspotClient = new Client({ accessToken: config.hubspot.apiKey });

/**
 * Sincroniza todos los usuarios de HubSpot con Firebase
 * @param {FirebaseFirestore.Firestore} db - Instancia de Firestore
 * @returns {Promise<{success: boolean, updatedCount?: number, error?: string}>}
 */
const syncAllUsers = async (db) => {
  try {
    const response = await hubspotClient.crm.contacts.basicApi.getPage(
      100,
      undefined,
      ['email', 'ID de registro']
    );
    let updatedCount = 0;

    for (const contact of response.results) {
      const email = contact.properties.email;
      const idRegistroHubspot = contact.properties['ID de registro'];

      if (email && idRegistroHubspot) {
        const snapshot = await db.collection('users')
          .where('email', '==', email.toLowerCase())
          .get();

        if (!snapshot.empty) {
          await snapshot.docs[0].ref.update({
            idRegistroHubspot,
            lastSyncedWithHubspot: admin.firestore.FieldValue.serverTimestamp()
          });
          updatedCount++;
        }
      }
    }

    return {
      success: true,
      updatedCount,
      processedCount: response.results.length,
      errorCount: response.results.length - updatedCount
    };
  } catch (error) {
    console.error('Error en sincronización masiva:', error.message);
    return {
      success: false,
      error: error.message,
      processedCount: 0,
      errorCount: 0
    };
  }
};

module.exports = {
  syncAllUsers,
  bulkSyncService: syncAllUsers // Alias para mantener compatibilidad
};