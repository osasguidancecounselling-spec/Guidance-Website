const fs = require('fs');
const path = require('path');
const Form = require('../models/Form');
const axios = require('axios');
const FormSubmission = require('../models/FormSubmission');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { parseDocx, generatePdf } = require('../utils/formUtils');

const uploadForm = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // The file is at a URL. Download it to a buffer to be parsed.
    const response = await axios.get(req.file.path, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(response.data, 'binary');

    // Pass the buffer to the parsing utility.
    // Note: Ensure your `parseDocx` utility can handle a buffer.
    const { title, questions } = await parseDocx(fileBuffer);
    const newForm = new Form({
      title,
      questions,
      // Save Cloudinary URL and public ID (filename)
      fileUrl: req.file.path, 
      filePublicId: req.file.filename,
    });
    await newForm.save();
    res.status(201).json({ message: 'Form uploaded and parsed successfully.', form: newForm });
  } catch (error) {
    console.error('Error uploading form:', error);
    res.status(500).json({ message: 'Server error during form upload.' });
  }
};

const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find({}, 'title');
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const submitForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const { answers, studentInfo } = req.body;
    // This function now returns a local path to the generated PDF
    const { pdfPath, filename } = await generatePdf(form, answers, studentInfo);

    // Upload the generated PDF to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      folder: 'gcs_submissions',
      public_id: filename,
    });

    // Clean up the local temporary PDF file
    fs.unlinkSync(pdfPath);

    const submission = new FormSubmission({
      form: form._id,
      student: req.user.id,
      pdfUrl: uploadResult.secure_url,
      pdfPublicId: uploadResult.public_id,
    });
    await submission.save();

    res.status(201).json({ message: 'Form submitted successfully.', filename });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Server error during form submission.' });
  }
};

const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // Delete the form template from Cloudinary
    if (form.filePublicId) {
      await cloudinary.uploader.destroy(form.filePublicId);
    } 

    const submissions = await FormSubmission.find({ form: form._id });
    for (const sub of submissions) {
      // Delete each submission PDF from Cloudinary
      if (sub.pdfPublicId) await cloudinary.uploader.destroy(sub.pdfPublicId);
    }
    await FormSubmission.deleteMany({ form: form._id });
    await Form.findByIdAndDelete(req.params.id);

    res.json({ message: 'Form and related submissions deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubmissionsForForm = async (req, res) => {
  try {
    const submissions = await FormSubmission.find({ form: req.params.id })
      .populate('student', 'name studentNumber')
      .lean();
    // The pdfUrl from Cloudinary is already in each submission document.
    // No mapping is needed.
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await FormSubmission.find({ student: req.user.id })
      .populate('form', 'title')
      .lean();
    // The pdfUrl is already correct, so we can send the documents directly.
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get unique filter options for form submissions
// @route   GET /api/forms/filter-options
// @access  Private/Admin
const getFormFilterOptions = async (req, res) => {
  try {
    // Fetch distinct, non-null/empty values and sort them
    const courses = await User.distinct('course', { course: { $ne: null, $ne: '' } });
    const years = await User.distinct('year', { year: { $ne: null, $ne: '' } });
    const sections = await User.distinct('section', { section: { $ne: null, $ne: '' } });

    res.json({
      courses: courses.sort(),
      years: years.sort(),
      sections: sections.sort(),
    });
  } catch (error) {
    console.error('Error fetching form filter options:', error);
    res.status(500).json({ message: 'Server error while fetching filter options.' });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id)
      .populate('student', 'name email course year section') // Get student details
      .populate('form', 'title questions'); // Get the original form questions

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission by ID:', error);
    res.status(500).json({ message: 'Server error while fetching submission.' });
  }
};

module.exports = {
  uploadForm,
  getAllForms,
  getFormById,
  submitForm,
  deleteForm,
  getSubmissionsForForm,
  getMySubmissions,
  getFormFilterOptions,
  getSubmissionById,
};