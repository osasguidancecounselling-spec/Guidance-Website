const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SecurityQuestionSchema = new mongoose.Schema({
  question1: { type: String, default: "What was your first pet's name?" },
  answer1: { type: String, required: true },
  question2: { type: String, default: "What is your favorite food?" },
  answer2: { type: String, required: true },
  question3: { type: String, default: "What city were you born in?" },
  answer3: { type: String, required: true },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentNumber: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls
  role: {
    type: String,
    enum: ['student', 'counselor', 'admin'],
    default: 'student',
  },
  course: { type: String },
  year: { type: String },
  section: { type: String },
  securityQuestions: {
    type: SecurityQuestionSchema,
    required: function() { return this.role === 'student'; }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password for login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);