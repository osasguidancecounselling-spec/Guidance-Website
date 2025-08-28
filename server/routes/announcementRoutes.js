const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');

// Public routes
router.route('/').get(getAnnouncements);
router.route('/:id').get(getAnnouncement);

// Protected admin routes
router.route('/').post(protect, admin, createAnnouncement);
router.route('/:id').put(protect, admin, updateAnnouncement).delete(protect, admin, deleteAnnouncement);

module.exports = router;
