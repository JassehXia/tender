import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import "../styles/MainPage.css";

export default function Card() {
  const [currentFood, setCurrentFood] = useState(null);
  const [foodDescription, setFoodDescription] = useState(null);
  const [foodImage, setFoodImage] = useState(null);
  const [swipeDir, setSwipeDir] = useState(null);

  // Fetch a random food from backend
  const fetchRandomFood = async () => {
    try {
      const response = await fetch("http://localhost:5000/getRandomFood");
      const data = await response.json();
      setCurrentFood(data.name); // adjust key based on DB schema
      setFoodDescription(data.description);
      setFoodImage(data.image);
    } catch (err) {
      console.error("Failed to fetch random food:", err);
      setCurrentFood("Error fetching food");
    }
  };

  useEffect(() => {
    fetchRandomFood(); // Load first food when component mounts
  }, []);

  const handleSwipe = (dir) => {
    setSwipeDir(dir);

    // after animation ends, load a new food
    setTimeout(() => {
      fetchRandomFood();
      setSwipeDir(null);
    }, 400); // match CSS transition
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  if (!currentFood) return <div className="card loading">Loading...</div>;

  return (
    <div
      {...handlers}
      className={`card ${swipeDir === "left" ? "swipe-left" : ""} ${swipeDir === "right" ? "swipe-right" : ""
        }`}
    >
      <h2 className="cardTitle">{currentFood}</h2>
      <img className="cardImage" src={foodImage} alt={currentFood} />
      <p className="cardDescription">{foodDescription}</p>

    </div>
  );
}
