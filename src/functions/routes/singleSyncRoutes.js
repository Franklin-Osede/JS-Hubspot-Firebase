const express = require('express');
const router = express.Router();
const { singleSyncController } = require('../controllers/singleSyncController');

router.post('/', singleSyncController);

module.exports = router;