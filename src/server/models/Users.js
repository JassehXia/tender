const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // Profile info
    bio: { type: String, default: "" },
    profilePicture: { type: String, default: "" }, // URL to profile image
    location: { type: String, default: "" },
    favoriteCuisine: { type: String, default: "" },
    allergies: { type: [String], default: [] },

    // Food interaction data
    liked: { type: [String], default: [] },          // recipe IDs
    disliked: { type: [String], default: [] },       // recipe IDs
    cuisinesLiked: { type: [String], default: [] },
    savedRecipes: { type: [String], default: [] },

    // Social
    friends: { type: [String], default: [] },
    friendRequests: { type: [String], default: [] },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Automatically update 'updatedAt'
userSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
