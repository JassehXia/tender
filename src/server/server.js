const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const Food = require("./models/Food");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded images

// Auth & User routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Fetch all foods
app.get("/getFoodFromDB", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch foods" });
  }
});

// Fetch a single random food (for swiping)
app.get("/getRandomFood", async (req, res) => {
  try {
    const count = await Food.countDocuments();
    if (count === 0) return res.status(404).json({ error: "No foods found" });

    const randomIndex = Math.floor(Math.random() * count);
    const randomFood = await Food.findOne().skip(randomIndex);
    res.json(randomFood);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch random food" });
  }
});

// Fetch random recipes by cuisine (placeholder)
app.get("/fetchRandomRecipes/:cuisine", async (req, res) => {
  const { cuisine } = req.params;
  try {
    // TODO: call Spoonacular API or another recipe source here
    res.json({ message: `Random recipes for ${cuisine} would go here` });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
