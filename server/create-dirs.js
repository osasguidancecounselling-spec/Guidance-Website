const fs = require('fs');
const path = require('path');

// Create necessary directories for the application
const directories = [
  'outputs/forms',
  'uploads',
  'submitted',
  'answered_pdfs'
];

console.log('Creating necessary directories...');

directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('Directory creation completed.');
