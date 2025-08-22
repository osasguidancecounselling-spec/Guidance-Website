const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getStudentDashboardStats } = require('../controllers/dashboardController');

router.get('/student', protect, getStudentDashboardStats);

module.exports = router;