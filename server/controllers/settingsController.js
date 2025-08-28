const Setting = require('../models/Setting');

const defaultAvailability = [
  { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
  { day: 'Saturday', startTime: '09:00', endTime: '12:00', isAvailable: false },
  { day: 'Sunday', startTime: '09:00', endTime: '12:00', isAvailable: false },
];

// @desc    Get availability settings
// @route   GET /api/settings/availability
// @access  Private/Admin
const getAvailability = async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: 'global_settings' });
    if (!settings) {
      // If no settings exist, create and return a default one.
      settings = await Setting.create({ key: 'global_settings', availability: defaultAvailability });
    }
    res.json(settings.availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Server error while fetching availability.' });
  }
};

// @desc    Update availability settings
// @route   PUT /api/settings/availability
// @access  Private/Admin
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const settings = await Setting.findOneAndUpdate(
      { key: 'global_settings' },
      { availability },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings.availability);
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Server error while updating availability.' });
  }
};

module.exports = {
  getAvailability,
  updateAvailability,
};