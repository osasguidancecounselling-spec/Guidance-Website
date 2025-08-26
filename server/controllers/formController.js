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

    // 1. Parse the file directly from the buffer in memory
    const { title, questions } = await parseDocx(req.file.buffer);

    // 2. Upload the original file buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'gcs_forms', resource_type: 'raw' }, // Use 'raw' for non-image files like docx
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const newForm = new Form({
      title,
      questions,
      fileUrl: uploadResult.secure_url,
      filePublicId: uploadResult.public_id,
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
    // This function should be adapted to return a buffer instead of a file path
    const { pdfBuffer, filename } = await generatePdf(form, answers, studentInfo);

    // Upload the generated PDF buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'gcs_submissions',
          public_id: filename,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(pdfBuffer);
    });

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

const getAllSubmissions = async (req, res) => {
  try {
    const { course, year, section } = req.query;

    // Build the aggregation pipeline
    const pipeline = [
      // 1. Populate student details
      {
        $lookup: {
          from: 'users', // The name of the User collection
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo',
        },
      },
      // 2. Deconstruct the studentInfo array
      { $unwind: '$studentInfo' },
      // 3. Build the match stage based on query params
      {
        $match: {
          ...(course && { 'studentInfo.course': course }),
          ...(year && { 'studentInfo.year': year }),
          ...(section && { 'studentInfo.section': section }),
        },
      },
      // 4. Populate form details
      {
        $lookup: {
          from: 'forms', // The name of the Form collection
          localField: 'form',
          foreignField: '_id',
          as: 'formInfo',
        },
      },
      { $unwind: '$formInfo' },
      // 5. Project the final shape to match what .populate() would do
      {
        $project: {
          _id: 1,
          pdfUrl: 1,
          createdAt: 1,
          student: '$studentInfo',
          form: '$formInfo',
        },
      },
      // 6. Sort by creation date
      { $sort: { createdAt: -1 } },
    ];

    const submissions = await FormSubmission.aggregate(pipeline);
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    res.status(500).json({ message: 'Server error while fetching submissions.' });
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
  getAllSubmissions,
};