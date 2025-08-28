const express = require('express');
const router = express.Router();
const { getAvailability, updateAvailability } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes here are prefixed with /api/settings
router.route('/availability')
  .get(protect, admin, getAvailability)
  .put(protect, admin, updateAvailability);

module.exports = router;