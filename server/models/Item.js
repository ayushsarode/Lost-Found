const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    phone: {  // Add the phone field
        type: String,
        required: true, // Set to false if not mandatory
    },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
