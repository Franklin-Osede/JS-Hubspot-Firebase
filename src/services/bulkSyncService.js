// Importa el cliente de HubSpot y Firebase
const { hubspotClient } = require('../config/hubspot');
const { db } = require('../config/firebase');

/**
 * Servicio para realizar la sincronización en lotes (bulk sync) de contactos desde HubSpot a Firebase.
 */
exports.bulkSyncService = async () => {
  let processedCount = 0;
  let errorCount = 0;
  let after = null; // Variable para paginación en HubSpot

  try {
    do {
      // Llama a la API de HubSpot para obtener los contactos en lotes de 25
      const response = await hubspotClient.crm.contacts.basicApi.getPage(25, after, ['email', 'ID de registro']);

      for (const contact of response.results) {
        if (contact.properties.email) {
          try {
            // Busca al usuario en Firebase basado en el email
            const snapshot = await db.collection('users')
              .where('email', '==', contact.properties.email.toLowerCase())
              .get();

            if (!snapshot.empty) {
              // Actualiza el documento con el ID de registro de HubSpot
              await snapshot.docs[0].ref.update({
                hubspotId: contact.id,
                idRegistroHubspot: contact.properties['ID de registro'],
                lastSyncedWithHubspot: new Date() // Fecha de última sincronización
              });
              processedCount++;
            } else {
              console.log(`Email no encontrado en Firebase: ${contact.properties.email}`);
              errorCount++;
            }
          } catch (error) {
            console.error(`Error al procesar el email ${contact.properties.email}:`, error.message);
            errorCount++;
          }
        }
      }

      // Actualiza el cursor para la siguiente página
      after = response.paging?.next?.after;
    } while (after);

    return { processedCount, errorCount };
  } catch (error) {
    console.error('Error en la sincronización en lotes:', error.message);
    throw new Error('Error en la sincronización en lotes');
  }
};
