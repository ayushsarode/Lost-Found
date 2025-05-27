// uploadMiddleware.js
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Validate Cloudinary configuration
if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
  console.error('Missing Cloudinary configuration. Please check your environment variables.');
  console.error('Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

cloudinary.config(cloudinaryConfig);

// Set up Cloudinary storage for multer
let storage;
try {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'lost-found-items', // Folder in Cloudinary
      allowed_formats: ['jpeg', 'jpg', 'png'],
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' }, // Resize large images
        { quality: 'auto' } // Optimize quality
      ]
    },
  });
} catch (error) {
  console.error('Error setting up Cloudinary storage:', error);
  // Fallback to memory storage if Cloudinary fails
  storage = multer.memoryStorage();
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Only JPEG, JPG, and PNG images are allowed!'));
    }
  }
});

module.exports = upload;