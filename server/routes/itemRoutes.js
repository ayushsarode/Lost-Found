const express = require('express');
const router = express.Router();
const { postItem, getItems, getItemById, upload } = require('../controllers/itemController');
const auth = require('../middleware/authMiddleware');

// @route POST /api/items
router.post('/', auth, upload.single('image'), postItem);

// @route GET /api/items
router.get('/', getItems);

// @route GET /api/items/:id
router.get('/:id', getItemById);

module.exports = router;
