const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const config = require('../config/config');
const router = express.Router();

// Apply rate limiting to all auth routes
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
router.use(authLimiter);

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.JWT_SECRET, {
    expiresIn: '24h',
  });
};

router.post('/login', async (req, res) => {
  const { studentNumber, email, password } = req.body;

  try {
    if (!password || (!studentNumber && !email)) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }

    const query = studentNumber ? { studentNumber } : { email };
    const user = await User.findOne(query);

    if (user && (await user.matchPassword(password))) {
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentNumber: user.studentNumber,
      };

      res.json({
        message: 'Login successful',
        user: userData,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password, studentNumber, course, year, section, securityQuestions } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { studentNumber }] });

    if (userExists) {
      return res.status(409).json({ message: 'User with this email or student number already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      studentNumber,
      course,
      year,
      section,
      securityQuestions
    });

    if (user) {
      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/forgot-password/find-student', async (req, res) => {
  try {
    const { studentNumber } = req.body;
    const user = await User.findOne({ studentNumber, role: 'student' });

    if (!user) {
      return res.status(404).json({ message: 'Student number not found.' });
    }

    res.json({
      questions: {
        question1: user.securityQuestions.question1,
        question2: user.securityQuestions.question2,
        question3: user.securityQuestions.question3,
      }
    });
  } catch (error) {
    console.error('Find student error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/forgot-password/verify-answers', async (req, res) => {
  try {
    const { studentNumber, answers } = req.body;
    const user = await User.findOne({ studentNumber });

    if (!user) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Securely compare the provided answers with the stored hashes
    const isMatch = await user.matchSecurityAnswers(answers);

    if (isMatch) {
      const resetToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '10m' });
      res.json({ resetToken });
    } else {
      res.status(401).json({ message: 'One or more security answers are incorrect.' });
    }
  } catch (error) {
    console.error('Verify answers error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const decoded = jwt.verify(resetToken, config.JWT_SECRET);
    const user = await User.findById(decoded.id);
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token. Please start over.' });
  }
});

const { protect, admin } = require('../middleware/authMiddleware');

router.post('/reset-user-password', protect, admin, async (req, res) => {
  // The user ID to reset comes from the request body.
  // The admin performing the action is validated by the `protect` and `admin` middleware.
  const { userId, newPassword } = req.body;
  try {
    const userToReset = await User.findById(userId);

    if (!userToReset) {
      return res.status(404).json({ message: 'User not found.' });
    }

    userToReset.password = newPassword;
    await userToReset.save();

    res.json({ message: `Password for user ${userToReset.name} has been reset successfully.` });
  } catch (error) {
    console.error('Admin password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset.' });
  }
});

// @desc    Verify user token and get user data
// @route   GET /api/auth/verify
// @access  Private
router.get('/verify', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;