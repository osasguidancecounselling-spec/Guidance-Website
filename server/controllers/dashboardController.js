const FormSubmission = require('../models/FormSubmission');
const Appointment = require('../models/Appointment');
const Form = require('../models/Form');
const User = require('../models/User');

// A simple asyncHandler to wrap async functions and catch errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error(error); // Keep logging the error
    res.status(500).json({ message: 'Server error.' });
  });

// @desc    Get stats for the admin dashboard
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Use Promise.all for concurrent queries
  const [totalStudents, appointmentsToday, totalForms] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Appointment.countDocuments({ status: 'Scheduled', scheduledDateTime: { $gte: startOfToday, $lte: endOfToday } }),
    Form.countDocuments(),
  ]);

  res.json({ totalStudents, appointmentsToday, totalForms });
});

// @desc    Get stats for the counselor dashboard
// @route   GET /api/dashboard/counselor
// @access  Private/Counselor
const getCounselorDashboardStats = asyncHandler(async (req, res) => {
  const counselorId = req.user.id;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Note: The concept of "assigned students" is not yet in the User model.
  // This is a placeholder for when that relationship is defined.
  // For now, we'll count all students as a proxy.
  const [assignedStudents, appointmentsToday, upcomingAppointments] = await Promise.all([
    User.countDocuments({ role: 'student' }), // Placeholder logic
    Appointment.countDocuments({
      counselor: counselorId,
      status: 'Scheduled',
      scheduledDateTime: { $gte: startOfToday, $lte: endOfToday },
    }),
    Appointment.countDocuments({
      counselor: counselorId,
      status: 'Scheduled',
      scheduledDateTime: { $gte: new Date() },
    }),
  ]);

  res.json({ assignedStudents, appointmentsToday, upcomingAppointments });
});

// @desc    Get stats for the student dashboard
// @route   GET /api/dashboard/student
// @access  Private
const getStudentDashboardStats = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const completedForms = await FormSubmission.countDocuments({ student: studentId });
  const upcomingAppointments = await Appointment.countDocuments({ student: studentId, status: 'Scheduled', scheduledDateTime: { $gte: new Date() } });
  const totalForms = await Form.countDocuments();
  const pendingForms = totalForms - completedForms;

  // Placeholder for unread messages
  const unreadMessages = 0;

  res.json({ completedForms, upcomingAppointments, pendingForms, unreadMessages });
});

module.exports = { getStudentDashboardStats, getAdminDashboardStats, getCounselorDashboardStats };