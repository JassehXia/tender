const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    cuisines: {
        type: [String],
        required: false,
    },
    liked: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Food', foodSchema);

