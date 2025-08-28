const express = require('express');
const Student = require('../models/Student');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', course, year, section } = req.query;
    
    const query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by course, year, section
    if (course) query.course = course;
    if (year) query.year = year;
    if (section) query.section = section;

    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res) => {
  try {
    const { name, email, studentNumber, course, year, section } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ email }, { studentNumber }] 
    });

    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email or student number already exists' });
    }

    const student = await Student.create({
      name,
      email,
      studentNumber,
      course,
      year,
      section
    });

    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    const { name, email, studentNumber, course, year, section } = req.body;

    // Check if email or student number already exists for other students
    const existingStudent = await Student.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { $or: [{ email }, { studentNumber }] }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({ message: 'Email or student number already in use by another student' });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, studentNumber, course, year, section },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get student statistics
// @route   GET /api/students/stats/summary
// @access  Private/Admin
const getStudentStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const studentsByCourse = await Student.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } }
    ]);
    const studentsByYear = await Student.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } }
    ]);

    res.json({
      totalStudents,
      studentsByCourse,
      studentsByYear
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Routes
router.get('/', protect, admin, getStudents);
router.get('/:id', protect, admin, getStudent);
router.post('/', protect, admin, createStudent);
router.put('/:id', protect, admin, updateStudent);
router.delete('/:id', protect, admin, deleteStudent);
router.get('/stats/summary', protect, admin, getStudentStats);

module.exports = router;
