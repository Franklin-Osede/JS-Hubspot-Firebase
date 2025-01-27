const syncAllUsers = async () => {
  try {
    const response = await hubspotClient.crm.contacts.basicApi.getPage(100, undefined, ['email', 'ID de registro']);
    let updatedCount = 0;

    for (const contact of response.results) {
      const email = contact.properties.email;
      const idRegistroHubspot = contact.properties['ID de registro'];

      if (email && idRegistroHubspot) {
        const snapshot = await db.collection('users').where('email', '==', email.toLowerCase()).get();

        if (!snapshot.empty) {
          await snapshot.docs[0].ref.update({
            idRegistroHubspot,
            lastSyncedWithHubspot: admin.firestore.FieldValue.serverTimestamp()
          });
          updatedCount++;
        }
      }
    }

    return { success: true, updatedCount };
  } catch (error) {
    console.error('Error en sincronización masiva:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { syncAllUsers };
