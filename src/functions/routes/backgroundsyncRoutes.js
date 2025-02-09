const express = require('express');
const router = express.Router();
const { startBackgroundSync } = require('../controllers/backgroundSyncController');

router.post('/', startBackgroundSync);

router.get('/status/:syncId', async (req, res) => {
  try {
    const { syncId } = req.params;
    res.json({
      message: 'Status check not implemented yet'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;