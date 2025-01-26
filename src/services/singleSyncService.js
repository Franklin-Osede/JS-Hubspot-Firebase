çconst syncSingleUser = async (email) => {
  try {
    const response = await hubspotClient.crm.contacts.basicApi.getPage(1, undefined, ['email', 'ID de registro']);
    const contact = response.results.find((c) => c.properties.email === email.toLowerCase());

    if (!contact) {
      throw new Error('El contacto no existe en HubSpot');
    }

    const snapshot = await db.collection('users').where('email', '==', email.toLowerCase()).get();
    if (!snapshot.empty) {
      await snapshot.docs[0].ref.update({
        idRegistroHubspot: contact.properties['ID de registro'],
        lastSyncedWithHubspot: admin.firestore.FieldValue.serverTimestamp()
      });
      return { success: true };
    }
    return { success: false, message: 'Usuario no encontrado en Firestore' };
  } catch (error) {
    console.error('Error al sincronizar usuario:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { syncSingleUser };
