const express = require('express');
const { bulkSyncContacts } = require('../controllers/bulkSyncController');

const router = express.Router();

/**
 * Ruta para manejar la sincronización masiva de contactos con HubSpot.
 * Endpoint: /api/bulk-sync
 */
router.post('/', bulkSyncContacts);  // Cambiado de '/bulk-sync' a '/'

module.exports = router;