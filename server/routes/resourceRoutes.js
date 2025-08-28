const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');

// Protect routes with middleware
router.route('/').get(protect, admin, getResources).post(protect, admin, createResource);
router.route('/:id').get(protect, admin, getResource).put(protect, admin, updateResource).delete(protect, admin, deleteResource);

module.exports = router;
