const Appointment = require('../models/Appointment');
const User = require('../models/User');

// A simple asyncHandler to wrap async functions and catch errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  });

const createAppointment = asyncHandler(async (req, res) => {
  const { subject, description, preferredDate, preferredTime } = req.body;

  if (!subject || !description || !preferredDate || !preferredTime) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  const appointment = new Appointment({
    student: req.user.id,
    subject,
    description,
    preferredDate,
    preferredTime,
  });

  const createdAppointment = await appointment.save();

  // Populate the student details on the saved document
  await createdAppointment.populate('student', 'name studentNumber email');

  // Emit to both admins and counselors
  req.io.to('admin').emit('newAppointment', createdAppointment);
  req.io.to('counselor').emit('newAppointment', createdAppointment);

  res.status(201).json(createdAppointment);
});

const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('student', 'name studentNumber course')
    .sort({ createdAt: -1 });
  res.json(appointments);
});

const getMyAppointments = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === 'student') {
    query.student = req.user.id;
  } else if (req.user.role === 'counselor') {
    query.counselor = req.user.id;
  }

  const appointments = await Appointment.find(query)
    .populate('student', 'name studentNumber')
    .sort({ createdAt: -1 });
  res.json(appointments);
});

const updateAppointmentDetails = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
    .populate('student', 'name studentNumber');

  if (!updatedAppointment) {
    return res.status(404).json({ message: 'Appointment not found.' });
  }

  // Emit to admins, counselors, and the specific student
  const studentId = updatedAppointment.student._id.toString();
  req.io.to('admin').emit('appointmentUpdated', updatedAppointment);
  req.io.to('counselor').emit('appointmentUpdated', updatedAppointment);
  req.io.to(studentId).emit('appointmentUpdated', updatedAppointment);

  res.json(updatedAppointment);
});

// @desc    Get all users with the role of counselor
// @route   GET /api/appointments/counselors
// @access  Private/Admin
const getAvailableCounselors = asyncHandler(async (req, res) => {
  const counselors = await User.find({ role: 'counselor' }).select('id name');
  res.json(counselors);
});

module.exports = {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  updateAppointmentDetails,
  getAvailableCounselors,
};
