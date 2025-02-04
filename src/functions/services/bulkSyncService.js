// bulkSyncService.js
const admin = require('firebase-admin');
const { Client } = require('@hubspot/api-client');
const config = require('../config');

// Usar el mismo cliente de HubSpot
const hubspotClient = new Client({
  accessToken: config.hubspot.apiKey
});

const syncAllUsers = async (db) => {
  try {
    let after;
    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    do {
      const response = await hubspotClient.crm.contacts.basicApi.getPage(
        100,
        after,
        ['email', 'id', 'ID de registro']
      );

      for (const contact of response.results) {
        processedCount++;
        const email = contact.properties.email;
        const idRegistroHubspot = contact.properties['ID de registro'];
        const hubspotId = contact.id;

        if (email && idRegistroHubspot) {
          try {
            const snapshot = await db.collection('users')
              .where('email', '==', email.toLowerCase())
              .get();

            if (!snapshot.empty) {
              await snapshot.docs[0].ref.update({
                hubspotId,
                idRegistroHubspot,
                lastSyncedWithHubspot: admin.firestore.FieldValue.serverTimestamp()
              });
              updatedCount++;
            }
          } catch (error) {
            console.error(`Error actualizando usuario ${email}:`, error);
            errorCount++;
          }
        }
      }

      after = response.paging?.next?.after;

    } while (after);

    return {
      success: true,
      updatedCount,
      processedCount,
      errorCount
    };
  } catch (error) {
    console.error('Error en sincronización masiva:', error);
    return {
      success: false,
      error: error.message,
      processedCount,
      errorCount: 0
    };
  }
};

module.exports = {
  syncAllUsers,
  bulkSyncService: syncAllUsers
};