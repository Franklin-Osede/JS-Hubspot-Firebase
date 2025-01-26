// Importa los servicios necesarios y Firebase admin
const { bulkSyncService } = require('../services/bulkSyncService');
const { db } = require('../config/firebase');

/**
 * Controlador para sincronizar contactos de HubSpot en lotes con Firebase
 */
exports.bulkSyncContacts = async (req, res) => {
  try {
    // Llama al servicio de sincronización en lotes
    const { processedCount, errorCount } = await bulkSyncService();

    // Devuelve una respuesta de éxito con las estadísticas
    res.status(200).json({
      success: true,
      message: 'Bulk sync completed successfully',
      processedCount,
      errorCount
    });
  } catch (error) {
    console.error('Error during bulk sync:', error.message);
    res.status(500).json({
      success: false,
      message: 'Bulk sync failed',
      error: error.message
    });
  }
};
