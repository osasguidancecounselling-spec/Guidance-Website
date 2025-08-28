const path = require('path');
const Form = require('../models/Form');
const axios = require('axios');
const FormSubmission = require('../models/FormSubmission');
const User = require('../models/User');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const Appointment = require('../models/Appointment');
const { parseDocx, generatePdf } = require('../utils/formUtils');
const jszip = require('jszip');

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

const createFormFromBuilder = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Title and at least one question are required.' });
    }

    // The `filename` field is required and unique in the Form model.
    // We'll generate one for forms created via the builder.
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.builder`;

    const newForm = new Form({
      title,
      questions, // Frontend sends { question, type } which matches the model
      filename,
    });

    await newForm.save();
    res.status(201).json({ message: 'Form created successfully.', form: newForm });
  } catch (error) {
    console.error('Error creating form from builder:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A form with this name might already exist. Please try a different title.' });
    }
    res.status(500).json({ message: 'Server error during form creation.' });
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
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Fetch the user to get their name for the filename
    const user = await User.findById(req.user.id).select('name').lean();
    if (!user) {
      return res.status(404).json({ message: 'Submitting user not found.' });
    }

    const { answers, studentInfo } = req.body;
    // Generate a unique ID for this submission to ensure the filename is unique.
    const submissionId = new mongoose.Types.ObjectId();

    // The filename from generatePdf is no longer used; we create our own.
    const { pdfBuffer } = await generatePdf(form, answers, studentInfo, submissionId);

    // Create a descriptive and safe filename to prevent overwrites and be human-readable.
    const studentName = user.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const formTitle = form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const publicId = `${studentName}_${formTitle}_${submissionId}`;

    // Upload the generated PDF buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'gcs_submissions',
          public_id: publicId,
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
      _id: submissionId, // Use the pre-generated ID
      form: form._id,
      student: req.user.id,
      pdfUrl: uploadResult.secure_url,
      pdfPublicId: uploadResult.public_id,
    });
    await submission.save();

    res.status(201).json({ message: 'Form submitted successfully.', filename: `${publicId}.pdf` });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Server error during form submission.' });
  }
};

const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Delete the form template from Cloudinary
    if (form.filePublicId) {
      // Specify resource_type for raw files like .docx
      await cloudinary.uploader.destroy(form.filePublicId, { resource_type: 'raw' });
    }

    const submissions = await FormSubmission.find({ form: form._id });

    // Concurrently delete all submission PDFs from Cloudinary
    const deletePromises = submissions
      .filter(sub => sub.pdfPublicId)
      .map(sub => cloudinary.uploader.destroy(sub.pdfPublicId, { resource_type: 'raw' }));

    await Promise.all(deletePromises);

    await FormSubmission.deleteMany({ form: form._id });
    await Form.findByIdAndDelete(req.params.id);

    res.json({ message: 'Form and related submissions deleted.' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Server error while deleting form.' });
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

const getSubmissionsForCounselor = async (req, res) => {
  try {
    const counselorId = req.user._id;

    // Find all unique student IDs from appointments assigned to this counselor
    const appointments = await Appointment.find({ counselor: counselorId }).distinct('student');

    if (appointments.length === 0) {
      return res.json([]); // No students assigned, so no submissions to show
    }

    // Find all submissions from those students
    const submissions = await FormSubmission.find({ student: { $in: appointments } })
      .populate('student', 'name studentNumber course year section')
      .populate('form', 'title')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions for counselor:', error);
    res.status(500).json({ message: 'Server error while fetching submissions.' });
  }
};

const batchDownloadSubmissions = async (req, res) => {
  try {
    const { submissionIds } = req.body;

    if (!submissionIds || !Array.isArray(submissionIds) || submissionIds.length === 0) {
      return res.status(400).json({ message: 'Submission IDs are required.' });
    }

    // Fetch all submissions at once to get their PDF URLs and student/form info
    const submissions = await FormSubmission.find({
      _id: { $in: submissionIds },
    }).populate('student', 'name').populate('form', 'title');

    if (submissions.length === 0) {
      return res.status(404).json({ message: 'No valid submissions found.' });
    }

    const zip = new jszip();

    // Use Promise.all to fetch all PDFs from Cloudinary concurrently
    await Promise.all(
      submissions.map(async (sub) => {
        if (sub.pdfUrl && sub.student && sub.form) {
          try {
            const response = await axios.get(sub.pdfUrl, {
              responseType: 'arraybuffer',
            });
            // Sanitize filename to prevent issues
            const studentName = sub.student.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const formTitle = sub.form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filename = `${studentName}_${formTitle}_${sub._id}.pdf`;
            
            zip.file(filename, response.data);
          } catch (fetchError) {
            console.error(`Failed to fetch PDF for submission ${sub._id}:`, fetchError.message);
          }
        }
      })
    );

    // Check if any files were added to the zip before sending
    if (Object.keys(zip.files).length === 0) {
      return res.status(404).json({ message: 'Could not retrieve any of the selected submission files.' });
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="submissions.zip"');
    res.send(zipBuffer);
  } catch (error) {
    console.error('Error during batch download:', error);
    res.status(500).json({ message: 'Server error during batch download.' });
  }
};

module.exports = {
  createFormFromBuilder,
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
  batchDownloadSubmissions,
  getSubmissionsForCounselor,
};