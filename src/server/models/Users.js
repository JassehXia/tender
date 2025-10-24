// models/Users.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    cuisinesLiked: { type: [String], default: [] },

    // 👇 New field for saved recipes
    savedRecipes: { type: [mongoose.Schema.Types.ObjectId], ref: 'Food', default: [] },
    cuisineLikes: {
        type: Map,
        of: Number,
        default: {},
    },


});

module.exports = mongoose.model('User', userSchema);
