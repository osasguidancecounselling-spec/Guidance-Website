const FormSubmission = require('../models/FormSubmission');
const Appointment = require('../models/Appointment');
const Form = require('../models/Form');

// @desc    Get stats for the student dashboard
// @route   GET /api/dashboard/student
// @access  Private
const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    const completedForms = await FormSubmission.countDocuments({ student: studentId });
    const upcomingAppointments = await Appointment.countDocuments({ student: studentId, status: 'Scheduled', scheduledDateTime: { $gte: new Date() } });
    const totalForms = await Form.countDocuments();
    const pendingForms = totalForms - completedForms;

    // Placeholder for unread messages
    const unreadMessages = 0;

    res.json({ completedForms, upcomingAppointments, pendingForms, unreadMessages });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard stats.' });
  }
};

module.exports = { getStudentDashboardStats };