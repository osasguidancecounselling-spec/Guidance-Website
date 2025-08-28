const Resource = require('../models/Resource');

// A simple asyncHandler to wrap async functions and catch errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  });

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private/Admin
const getResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  res.json(resources);
});

// @desc    Get a single resource
// @route   GET /api/resources/:id
// @access  Private/Admin
const getResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }
  res.json(resource);
});

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = asyncHandler(async (req, res) => {
  const { title, description, fileType, filePath } = req.body;
  
  const resource = new Resource({
    title,
    description,
    fileType,
    filePath
  });

  const createdResource = await resource.save();
  res.status(201).json(createdResource);
});

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = asyncHandler(async (req, res) => {
  const { title, description, fileType, filePath } = req.body;
  
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resource.title = title || resource.title;
  resource.description = description || resource.description;
  resource.fileType = fileType || resource.fileType;
  resource.filePath = filePath || resource.filePath;

  const updatedResource = await resource.save();
  res.json(updatedResource);
});

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  await Resource.deleteOne({ _id: req.params.id });
  res.json({ message: 'Resource removed' });
});

module.exports = {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource
};
