const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  updateAppointmentDetails,
  getAvailableCounselors,
} = require('../controllers/appointmentController');
const { protect, admin, counselor } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(protect, createAppointment) // Student creates an appointment
  .get(protect, admin, getAllAppointments); // Admin gets all appointments

// Get all users with counselor role (for assignment dropdown)
router.get('/counselors', protect, admin, getAvailableCounselors);

// Student or Counselor gets their own appointments
router.get('/my', protect, getMyAppointments);

// Admin or Counselor updates an appointment (status, assignment, notes)
// The `counselor` middleware allows both counselors and admins.
router.put('/:id', protect, counselor, updateAppointmentDetails);

module.exports = router;