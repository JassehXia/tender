const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/Users");
const Food = require("../models/Food"); // 👈 make sure this is imported
const jwt = require("jsonwebtoken");

// ------------------- Multer Setup ------------------- //
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) =>
        Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname),
});
const upload = multer({ storage });

// ------------------- JWT Middleware ------------------- //
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.userId = decoded.id;
        next();
    });
};

// ------------------- GET /user/profile ------------------- //
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// ------------------- PUT /user/update ------------------- //
router.put("/update", verifyToken, upload.single("image"), async (req, res) => {
    try {
        const { username, bio } = req.body;
        const updates = { username, bio };

        if (req.file) {
            // Save relative path for frontend use
            updates.image = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select("-password");

        res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error updating profile." });
    }
});

// ------------------- POST /user/saveRecipe/:foodId ------------------- //
router.post("/saveRecipe/:foodId", verifyToken, async (req, res) => {
    try {
        const { foodId } = req.params;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Find the food (for cuisine info)
        const food = await Food.findById(foodId);
        if (!food) return res.status(404).json({ error: "Food not found" });

        // Prevent duplicates
        if (user.savedRecipes.includes(foodId)) {
            return res.status(400).json({ message: "Recipe already saved" });
        }

        // Save recipe
        user.savedRecipes.push(foodId);

        // Increment cuisine counters
        if (food.cuisines && food.cuisines.length > 0) {
            food.cuisines.forEach(cuisine => {
                const currentCount = user.cuisineLikes.get(cuisine) || 0;
                user.cuisineLikes.set(cuisine, currentCount + 1);
            });
        }

        await user.save();

        res.json({
            message: "Recipe saved successfully",
            savedRecipes: user.savedRecipes,
            cuisineLikes: Object.fromEntries(user.cuisineLikes)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save recipe" });
    }
});

// ------------------- GET /user/savedRecipes ------------------- //
router.get("/savedRecipes", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("savedRecipes");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user.savedRecipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch saved recipes" });
    }
});

// ------------------- DELETE /user/removeRecipe/:foodId ------------------- //
router.delete("/removeRecipe/:foodId", verifyToken, async (req, res) => {
    try {
        const { foodId } = req.params;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Find the food (for cuisine info)
        const food = await Food.findById(foodId);
        if (!food) return res.status(404).json({ error: "Food not found" });

        // Prevent duplicates
        if (!user.savedRecipes.includes(foodId)) {
            return res.status(400).json({ message: "Recipe not saved" });
        }

        // Remove recipe (compare ObjectIds as strings)
        user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== foodId);


        // Decrement cuisine counters
        if (food.cuisines && food.cuisines.length > 0) {
            food.cuisines.forEach(cuisine => {
                const currentCount = user.cuisineLikes.get(cuisine) || 0;
                user.cuisineLikes.set(cuisine, currentCount - 1);
            });
        }

        await user.save();

        res.json({
            message: "Recipe removed successfully",
            savedRecipes: user.savedRecipes,
            cuisineLikes: Object.fromEntries(user.cuisineLikes)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to remove recipe" });
    }
});

// ------------------- GET /user/topCuisines ------------------- //
router.get("/topCuisines", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const cuisineData = Object.fromEntries(user.cuisineLikes);
        const sorted = Object.entries(cuisineData)
            .sort((a, b) => b[1] - a[1])
            .map(([cuisine, count]) => ({ cuisine, count }));

        res.json(sorted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch cuisines" });
    }
});

// ------------------- GET /user/savedRecipes ------------------- //
router.get("/savedRecipes", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("savedRecipes");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user.savedRecipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch saved recipes" });
    }
});

// ------------------- Friending System ------------------- //

// Send Friend Request
router.post("/friends/request/:id", verifyToken, async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.id;

        if (senderId === receiverId)
            return res.status(400).json({ error: "Cannot send a friend request to yourself" });

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!receiver) return res.status(404).json({ error: "User not found" });

        if (receiver.friendRequests.includes(senderId))
            return res.status(400).json({ error: "Friend request already sent" });

        if (receiver.friends.includes(senderId))
            return res.status(400).json({ error: "Already friends" });

        receiver.friendRequests.push(senderId);
        await receiver.save();

        res.json({ message: "Friend request sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send friend request" });
    }
});

// Accept Friend Request
router.post("/friends/accept/:id", verifyToken, async (req, res) => {
    try {
        const receiverId = req.userId;
        const senderId = req.params.id;

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender)
            return res.status(404).json({ error: "User not found" });

        if (!receiver.friendRequests.includes(senderId))
            return res.status(400).json({ error: "No pending friend request from this user" });

        // Remove request
        receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);

        // Add each other as friends
        if (!receiver.friends.includes(senderId)) receiver.friends.push(senderId);
        if (!sender.friends.includes(receiverId)) sender.friends.push(receiverId);

        await receiver.save();
        await sender.save();

        res.json({ message: "Friend request accepted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to accept friend request" });
    }
});

// Decline Friend Request
router.post("/friends/decline/:id", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const requesterId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Remove the request if it exists
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);

        await user.save();

        res.json({ message: "Friend request declined successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to decline friend request" });
    }
});

// Remove Friend
router.delete("/friends/remove/:id", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const friendId = req.params.id;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend)
            return res.status(404).json({ error: "User not found" });

        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        res.json({ message: "Friend removed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to remove friend" });
    }
});

// Get Friends List
router.get("/friends", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("friends", "username email image");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user.friends);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch friends" });
    }
});

// Get Pending Friend Requests
router.get("/friends/requests", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("friendRequests", "username email image");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user.friendRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch friend requests" });
    }
});

// Search Users by Username
router.get("/search", verifyToken, async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ error: "Query is required" });

        const users = await User.find({
            username: { $regex: query, $options: "i" }
        }).select("username image");

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to search users" });
    }
});




module.exports = router;
