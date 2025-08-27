const Appointment = require('../models/Appointment');
const User = require('../models/User');

const createAppointment = async (req, res) => {
  const { subject, description, preferredDate, preferredTime } = req.body;

  if (!subject || !description || !preferredDate || !preferredTime) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
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

    // Emit only to the 'admin' room
    req.io.to('admin').emit('newAppointment', createdAppointment);

    res.status(201).json(createdAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error while creating appointment.' });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('student', 'name studentNumber email course year section')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching appointments.' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user.id })
      .populate('student', 'name studentNumber email course year section')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments.' });
  }
};

const updateAppointment = async (req, res) => {
  const { status, adminNotes, scheduledDateTime } = req.body;
  const updateData = {};
  if (status) updateData.status = status;
  if (adminNotes) updateData.adminNotes = adminNotes;
  if (scheduledDateTime) updateData.scheduledDateTime = scheduledDateTime;

  try {
    // Use findByIdAndUpdate for a single, efficient database operation
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('student', 'name studentNumber email');

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Emit to admins and the specific student involved in the appointment
    const studentId = updatedAppointment.student._id.toString();
    req.io.to('admin').emit('appointmentUpdated', updatedAppointment);
    req.io.to(studentId).emit('appointmentUpdated', updatedAppointment);

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error while updating appointment.' });
  }
};

module.exports = { createAppointment, getAllAppointments, getMyAppointments, updateAppointment };