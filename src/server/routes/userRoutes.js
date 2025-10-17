const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/Users");
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

module.exports = router;
