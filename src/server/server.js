const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db');
const Food = require('./models/Food');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
connectDB();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});



// Fetch all foods
app.get('/getFoodFromDB', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

// Fetch recipes from Spoonacular and store (by cuisine)
app.get('/fetchRandomRecipes/:cuisine', async (req, res) => {
  const { cuisine } = req.params;

  try {
    // 1️⃣ Fetch a larger batch from Spoonacular so we can randomize
    const response = await axios.get(
      'https://api.spoonacular.com/recipes/complexSearch',
      {
        params: {
          apiKey: process.env.SPOON_URI,
          cuisine,
          number: 50, // fetch more so we can pick random 10
          addRecipeInformation: true,
        },
      }
    );

    const recipes = response.data.results || [];
    if (!recipes.length) {
      return res.status(404).json({ message: `No recipes found for cuisine: ${cuisine}` });
    }

    // 2️⃣ Shuffle the recipes to randomize
    const shuffled = recipes.sort(() => Math.random() - 0.5);

    // 3️⃣ Take first 10 from shuffled
    const selectedRecipes = shuffled.slice(0, 10);

    const savedRecipes = [];

    for (const r of selectedRecipes) {
      const exists = await Food.findOne({ name: r.title });
      if (!exists) {
        const newFood = new Food({
          name: r.title,
          image: r.image,
          description: r.summary
            ? r.summary.replace(/<[^>]*>?/gm, '')
            : 'No description available',
          cuisines: r.cuisines && r.cuisines.length > 0
            ? r.cuisines.map(c => c.toLowerCase())
            : [cuisine.toLowerCase()],
        });
        await newFood.save();
        savedRecipes.push(newFood);
      }
    }

    res.json({
      message: `Randomized fetch: tried 10 recipes, saved ${savedRecipes.length} new ones`,
      savedRecipes,
    });

  } catch (error) {
    console.error('Error fetching recipes:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch and save recipes', details: error.message });
  }
});



// Get a random food, optionally filtered by cuisine
app.get("/getRandomFood", async (req, res) => {
  try {
    const cuisine = req.query.cuisine?.toLowerCase();

    let foods;
    if (cuisine) {
      foods = await Food.find({ cuisines: { $in: [cuisine] } });
      if (!foods.length) {
        return res.status(404).json({ message: `No recipes found in DB for cuisine: ${cuisine}` });
      }
    } else {
      foods = await Food.find();
      if (!foods.length) {
        return res.status(404).json({ message: "No foods found in database" });
      }
    }

    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    res.json(randomFood);

  } catch (error) {
    console.error("Error fetching random food:", error.message);
    res.status(500).json({ error: "Failed to fetch random food" });
  }
});




