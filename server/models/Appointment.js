const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);