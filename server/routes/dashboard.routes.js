const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getStudentDashboardStats,
  getAdminDashboardStats,
} = require('../controllers/dashboardController');

router.get('/student', protect, getStudentDashboardStats);
router.get('/stats', protect, admin, getAdminDashboardStats);

module.exports = router;