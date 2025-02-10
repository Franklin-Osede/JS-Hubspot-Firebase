const express = require('express');
const { bulkSyncContacts } = require('../controllers/bulkSyncController');

const router = express.Router();

/**
 * Route to manage massive syncronization of contacts with Hubspot
 * Endpoint: /api/bulk-sync
 */
router.post('/', bulkSyncContacts);

module.exports = router;