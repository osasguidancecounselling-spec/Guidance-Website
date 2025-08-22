const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gcs_form_templates', // Folder name in Cloudinary
    allowed_formats: ['docx'],
    // public_id can be used to set a custom filename
    public_id: (req, file) => {
      const originalName = file.originalname.split('.').slice(0, -1).join('.');
      return `${originalName}-${Date.now()}`;
    },
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
