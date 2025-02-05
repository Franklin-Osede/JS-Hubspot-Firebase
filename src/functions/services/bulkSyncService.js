// bulkSyncService.js
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

const syncAllUsers = async (db, emails) => {
  try {
    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    console.log('Access Token actual:', config.hubspot.apiKey);
    console.log('Iniciando sincronización bulk para emails:', emails);

    // Procesar cada email de la lista
    for (const email of emails) {
      try {
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

        processedCount++;

        if (!response.results || response.results.length === 0) {
          console.log(`No se encontró contacto para el email: ${email}`);
          errorCount++;
          continue;
        }

        const contact = response.results[0];
        console.log(`Contacto encontrado en HubSpot para ${email}:`, contact);

        const snapshot = await db.collection('users')
          .where('email', '==', email.toLowerCase())
          .get();

        if (!snapshot.empty) {
          const hubspotId = contact.id;
          await snapshot.docs[0].ref.update({
            hubspotId,
            lastSyncedWithHubspot: new Date().toISOString(),
          });

          console.log(`Usuario sincronizado exitosamente: ${email}`);
          updatedCount++;
        } else {
          console.log(`Usuario no encontrado en Firestore: ${email}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error procesando email ${email}:`, error);
        errorCount++;
      }
    }

    return {
      success: true,
      updatedCount,
      processedCount,
      errorCount,
      message: `Sincronización completada - Actualizados: ${updatedCount}, Errores: ${errorCount}, Total procesados: ${processedCount}`
    };

  } catch (error) {
    console.error('Error en sincronización masiva:', error);
    return {
      success: false,
      error: error.message,
      processedCount,
      updatedCount,
      errorCount
    };
  }
};

module.exports = {
  syncAllUsers,
  bulkSyncService: syncAllUsers
};