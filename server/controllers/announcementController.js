const Announcement = require('../models/Announcement');

// A simple asyncHandler to wrap async functions and catch errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  });

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json(announcements);
});

// @desc    Get a single announcement
// @route   GET /api/announcements/:id
// @access  Public
const getAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found' });
  }
  res.json(announcement);
});

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  
  const announcement = new Announcement({
    title,
    content
  });

  const createdAnnouncement = await announcement.save();
  res.status(201).json(createdAnnouncement);
});

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found' });
  }

  announcement.title = title || announcement.title;
  announcement.content = content || announcement.content;

  const updatedAnnouncement = await announcement.save();
  res.json(updatedAnnouncement);
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ message: 'Announcement not found' });
  }

  await Announcement.deleteOne({ _id: req.params.id });
  res.json({ message: 'Announcement removed' });
});

module.exports = {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
