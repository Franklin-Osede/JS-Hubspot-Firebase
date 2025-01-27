const admin = require('firebase-admin');
const { Client } = require('@hubspot/api-client');
const config = require('../config');

// Log para debug de configuración
console.log('Configuración de HubSpot:', {
  apiKey: config.hubspot.apiKey ? 'Presente' : 'No presente'
});

// Inicializar el cliente de HubSpot
const hubspotClient = new Client({
  accessToken: config.hubspot.apiKey
});

/**
 * Sincroniza un usuario específico de HubSpot con Firebase
 * @param {FirebaseFirestore.Firestore} db - Instancia de Firestore
 * @param {string} email - Email del usuario a sincronizar
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
              value: email
            }
          ]
        }
      ],
      properties: ['email', 'id'] // Propiedades específicas que necesitas
    });

    // Verificar resultados
    if (!response.results || response.results.length === 0) {
      return {
        success: false,
        message: 'El contacto no existe en HubSpot'
      };
    }

    const contact = response.results[0];
    console.log('Contacto encontrado en HubSpot:', contact);

    // Verificar usuario en Firestore
    const snapshot = await db.collection('users')
      .where('email', '==', email.toLowerCase())
      .get();

    if (!snapshot.empty) {
      const hubspotId = contact.id;
      await snapshot.docs[0].ref.update({
        hubspotId,
        lastSyncedWithHubspot: admin.firestore.FieldValue.serverTimestamp()
      });

      return {
        success: true,
        hubspotId,
        message: 'Usuario sincronizado exitosamente'
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
