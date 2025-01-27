const express = require('express');
const router = express.Router();
const { singleSyncController } = require('../controllers/singleSyncController');

// Ruta para sincronizar un único usuario basado en su email
router.post('/single-sync', singleSyncController);

module.exports = router;
