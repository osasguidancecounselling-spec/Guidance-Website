const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentNumber: { type: String, required: true, unique: true },
  course: { type: String },
  year: { type: String },
  section: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Student model
module.exports = mongoose.model('Student', StudentSchema);
