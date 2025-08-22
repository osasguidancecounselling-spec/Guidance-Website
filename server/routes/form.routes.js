const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  uploadForm,
  getAllForms,
  getFormById,
  submitForm,
  deleteForm,
  getSubmissionsForForm,
  getMySubmissions,
  getFormFilterOptions,
  getSubmissionById,
} = require('../controllers/formController');

// === Admin Routes (Protected by admin middleware) ===

// Upload a new .docx form template
router.post('/upload', protect, admin, upload.single('formFile'), uploadForm);

// Delete a form template and all its submissions
router.delete('/:id', protect, admin, deleteForm);

// Get all submissions for a specific form (for admin view)
router.get('/:id/submissions', protect, admin, getSubmissionsForForm);

// Get unique filter options for the submissions table
router.get('/filter-options', protect, admin, getFormFilterOptions);

// Get a single submission by its ID for the detailed viewer
router.get('/submissions/:id', protect, admin, getSubmissionById);


// === Student & General Routes (Protected by standard login) ===

// Get a list of all available forms (e.g., for a dropdown)
router.get('/', protect, getAllForms);

// Get the full details (questions) of a single form to be filled out
router.get('/:id', protect, getFormById);

// Submit answers to a form
router.post('/:id/submit', protect, submitForm);

// Get all submissions made by the currently logged-in student
router.get('/my-submissions', protect, getMySubmissions);

module.exports = router;