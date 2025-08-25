const Appointment = require('../models/Appointment');
const User = require('../models/User');

const createAppointment = async (req, res) => {
  const { subject, description, preferredDate } = req.body;

  if (!subject || !description || !preferredDate) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const appointment = new Appointment({
      student: req.user.id,
      subject,
      description,
      preferredDate,
    });

    const createdAppointment = await appointment.save();

    const populatedAppointment = await Appointment.findById(createdAppointment._id).populate('student', 'name studentNumber email');

    req.io.emit('newAppointment', populatedAppointment);

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating appointment.' });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).populate('student', 'name studentNumber email');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching appointments.' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user._id })
      .populate('student', 'name studentNumber email')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching appointments.' });
  }
};

const updateAppointment = async (req, res) => {
  const { status, adminNotes } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });

    appointment.status = status || appointment.status;
    appointment.adminNotes = adminNotes || appointment.adminNotes;

    const updatedAppointment = await appointment.save();

    const populatedAppointment = await Appointment.findById(updatedAppointment._id).populate('student', 'name studentNumber email');
    req.io.emit('appointmentUpdated', populatedAppointment);

    res.json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating appointment.' });
  }
};

module.exports = { createAppointment, getAllAppointments, getMyAppointments, updateAppointment };
