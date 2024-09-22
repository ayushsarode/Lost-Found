const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder to store images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

// Configure multer
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Images only!'));
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
            image: req.file ? req.file.path : null, // Save image path if uploaded
            phone,
        });
        const item = await newItem.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find().populate('user', ['name', 'email']);
        res.json(items);
    } catch (error) {
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
        res.status(500).json({ error: 'Server error' });
    }
};

// Export the upload middleware for use in routes
exports.upload = upload;
