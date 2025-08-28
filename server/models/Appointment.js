const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    preferredDate: {
      type: Date,
      required: [true, 'Please add a preferred date'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Please add a preferred time'],
    },
    scheduledDateTime: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Scheduled', 'Cancelled', 'Completed', 'Rescheduled'],
      default: 'Pending',
    },
    counselorNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);