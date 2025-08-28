const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true },   // e.g., "17:00"
  isAvailable: { type: Boolean, default: true },
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  // Using a unique key to ensure there's only one settings document for the application
  key: {
    type: String,
    default: 'global_settings',
    unique: true,
    required: true,
  },
  availability: [availabilitySchema],
});

module.exports = mongoose.model('Setting', settingsSchema);