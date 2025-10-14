const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getStats,
  getAlerts,
  getRecentMovements,
} = require('../controllers/dashboardController');

const router = express.Router();

// GET /api/dashboard/stats - Statistiques générales (auth)
router.get('/stats', auth, getStats);

// GET /api/dashboard/alerts - Alertes de stock faible (auth)
router.get('/alerts', auth, getAlerts);

// GET /api/dashboard/recent-movements - Mouvements récents (auth)
router.get('/recent-movements', auth, getRecentMovements);

module.exports = router;
