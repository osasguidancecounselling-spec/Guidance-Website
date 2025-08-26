const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  updateAppointment,
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Student creates an appointment
router.route('/').post(protect, createAppointment);

// Admin gets all appointments
router.route('/').get(protect, admin, getAllAppointments);

// Student gets their own appointments
router.route('/my').get(protect, getMyAppointments);

// Admin updates an appointment
router.route('/:id').put(protect, admin, updateAppointment);

module.exports = router;