const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Item = require('../models/Item');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
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

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Only JPEG, JPG, and PNG images are allowed!'));
    }
  }
});

// Handle posting an item with image upload
exports.postItem = async (req, res) => {
  const { title, description, status, phone } = req.body;
  
  try {
    const newItem = new Item({
      title,
      description,
      status,
      user: req.user.id,
      image: req.file ? req.file.path : null, // Cloudinary URL
      imagePublicId: req.file ? req.file.filename : null, // Store public_id for deletion
      phone,
    });
    
    const item = await newItem.save();
    res.json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    
    // If there was an error and an image was uploaded, delete it from Cloudinary
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
      }
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('user', ['name', 'email']);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', ['name', 'email']);
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete item (with image cleanup)
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    
    // Check if user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Delete image from Cloudinary if it exists
    if (item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
      }
    }
    
    await Item.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Item removed' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update item (with optional image update)
exports.updateItem = async (req, res) => {
  const { title, description, status, phone } = req.body;
  
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    
    // Check if user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // If new image is uploaded, delete old image from Cloudinary
    if (req.file && item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (deleteError) {
        console.error('Error deleting old image from Cloudinary:', deleteError);
      }
    }
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        phone,
        ...(req.file && {
          image: req.file.path,
          imagePublicId: req.file.filename
        })
      },
      { new: true }
    ).populate('user', ['name', 'email']);
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    
    // If there was an error and a new image was uploaded, delete it from Cloudinary
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (deleteError) {
        console.error('Error deleting new image from Cloudinary:', deleteError);
      }
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// Export the upload middleware for use in routes
exports.upload = upload;