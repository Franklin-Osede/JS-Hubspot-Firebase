const admin = require('firebase-admin');
const { syncAllUsers } = require('../services/bulkSyncService');

exports.bulkSyncContacts = async (req, res) => {
  try {
    // Extraer los emails correctamente
    const emails = Array.isArray(req.body)
      ? req.body.map(entry => entry.Email).filter(email => typeof email === "string")
      : [];

    if (emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: emails must be an array and cannot be empty."
      });
    }

    console.log('Emails recibidos para sincronización:', emails);

    const db = admin.firestore();
    const result = await syncAllUsers(db, emails);

    if (result.success !== false) {
      res.status(200).json({
        success: true,
        message: 'Bulk sync completed successfully',
        processedCount: result.processedCount || 0,
        updatedCount: result.updatedCount || 0,
        errorCount: result.errorCount || 0
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Bulk sync failed',
        error: result.error || 'Unknown error',
        processedCount: result.processedCount || 0,
        updatedCount: result.updatedCount || 0,
        errorCount: result.errorCount || 0
      });
    }
  } catch (error) {
    console.error('Error during bulk sync:', error.message);
    res.status(500).json({
      success: false,
      message: 'Bulk sync failed',
      error: error.message,
      processedCount: 0,
      updatedCount: 0,
      errorCount: 0
    });
  }
};
