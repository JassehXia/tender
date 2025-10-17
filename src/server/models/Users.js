const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: { type: [String], default: [] },
    friendRequests: { type: [String], default: [] },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    liked: { type: [String], default: [] },
    cuisinesLiked: { type: [String], default: [] }
});

module.exports = mongoose.model('User', userSchema);
