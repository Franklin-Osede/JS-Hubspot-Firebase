const { singleSyncService } = require('../services/singleSyncService');

/**
 * Controlador para manejar la sincronización de un único usuario.
 * @param {Object} req - La solicitud HTTP.
 * @param {Object} res - La respuesta HTTP.
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

    // Llama al servicio para realizar la sincronización
    const result = await singleSyncService(email);

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
