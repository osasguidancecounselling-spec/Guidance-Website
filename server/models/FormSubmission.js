const mongoose = require('mongoose');

const FormSubmissionSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pdfPath: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('FormSubmission', FormSubmissionSchema);