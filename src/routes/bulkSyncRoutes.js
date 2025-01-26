const express = require('express');
const { bulkSyncController } = require('../controllers/bulkSyncController');

const router = express.Router();

/**
 * Ruta para manejar la sincronización masiva de contactos con HubSpot.
 * Endpoint: /api/bulk-sync
 */
router.post('/bulk-sync', bulkSyncController);

module.exports = router;
