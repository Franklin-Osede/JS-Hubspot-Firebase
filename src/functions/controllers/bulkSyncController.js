const admin = require('firebase-admin');
const { syncAllUsers } = require('../services/bulkSyncService');

exports.bulkSyncContacts = async (req, res) => {
  try {
    const { emails } = req.body;
    console.log('Emails recibidos para sincronización:', emails);

    const db = admin.firestore();
    const result = await syncAllUsers(db, emails);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Bulk sync completed successfully',
        processedCount: result.processedCount,
        updatedCount: result.updatedCount,
        errorCount: result.errorCount
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error during bulk sync:', error.message);
    res.status(500).json({
      success: false,
      message: 'Bulk sync failed',
      error: error.message
    });
  }
};