const pubSubService = require('../services/pubSubService');
const admin = require('firebase-admin');

console.log("✅ backgroundSyncController.js cargado correctamente");

exports.startBackgroundSync = async (req, res) => {
  try {
    const { emails } = req.body;
    console.log('📥 Emails recibidos para sincronización en background:', emails);

    if (!emails || emails.length === 0) {
      return res.json({
        success: false,
        message: '⚠️ No se proporcionaron emails para sincronizar'
      });
    }

    console.log('🚀 Llamando a publishEmails() en Pub/Sub...');

    await pubSubService.publishEmails(emails);

    console.log('✅ publishEmails() ejecutado correctamente.');

    res.json({
      success: true,
      message: `Iniciada sincronización de ${emails.length} emails en background`,
      totalEmails: emails.length,
      estimatedTime: `${Math.ceil(emails.length / 400)} horas`
    });

  } catch (error) {
    console.error('❌ Error en startBackgroundSync:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sincronización en background',
      error: error.message
    });
  }
};
