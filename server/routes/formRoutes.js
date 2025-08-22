const express = require('express');
const router = express.Router();
const {
  uploadForm,
  getAllForms,
  getFormById,
  submitForm,
  deleteForm,
  getSubmissionsForForm,
  getMySubmissions,
} = require('../controllers/formController');
const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getAllForms);

router.route('/upload')
  .post(protect, admin, upload.single('formDocx'), uploadForm);

router.route('/submissions/my').get(protect, getMySubmissions);

router.route('/:id').get(protect, getFormById).delete(protect, admin, deleteForm);
router.route('/:id/submit').post(protect, submitForm);
router.route('/:id/submissions').get(protect, admin, getSubmissionsForForm);

module.exports = router;