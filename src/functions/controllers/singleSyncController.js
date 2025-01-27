const admin = require('firebase-admin');
const { syncSingleUser } = require('../services/singleSyncService');

/**
 * Controlador para manejar la sincronización de un único usuario.
 */
const singleSyncController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El campo "email" es obligatorio.',
      });
    }

    const db = admin.firestore();
    const result = await syncSingleUser(db, email);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Sincronización exitosa.',
        hubspotId: result.hubspotId,
        idRegistroHubspot: result.idRegistroHubspot,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message || 'No se pudo sincronizar el usuario.',
      });
    }
  } catch (error) {
    console.error('Error en el controlador singleSyncController:', error);
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error inesperado durante la sincronización.',
      error: error.message,
    });
  }
};

module.exports = { singleSyncController };