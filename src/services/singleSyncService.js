const { db } = require('../config/firebase');
const hubspotClient = require('../config/hubspot');

/**
 * Sincroniza un único contacto desde HubSpot con Firebase.
 * @param {string} email - El email del contacto a sincronizar.
 * @returns {Promise<object>} - Resultado de la sincronización.
 */
const singleSyncService = async (email) => {
  try {
    // Buscar el contacto en HubSpot usando el email
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
    });

    if (response.total === 0) {
      return { success: false, message: 'No se encontró el contacto en HubSpot.' };
    }

    const hubspotContact = response.results[0];

    // Buscar el usuario en Firebase
    const snapshot = await db
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .get();

    if (snapshot.empty) {
      return { success: false, message: 'No se encontró el usuario en Firebase.' };
    }

    // Actualizar el documento del usuario en Firebase con la información de HubSpot
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      hubspotId: hubspotContact.id,
      registrationCode: hubspotContact.properties['ID de registro'],
      lastSynced: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Sincronización completada con éxito.',
      hubspotId: hubspotContact.id,
      firebaseUserId: userDoc.id,
    };
  } catch (error) {
    return { success: false, message: 'Error durante la sincronización.', error: error.message };
  }
};

module.exports = { singleSyncService };
