import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import "../styles/SwipingPage.css";

export default function Card() {
  const [currentFood, setCurrentFood] = useState(null);
  const [foodDescription, setFoodDescription] = useState(null);
  const [foodImage, setFoodImage] = useState(null);
  const [swipeDir, setSwipeDir] = useState(null);

  const fetchRandomFood = async () => {
    try {
      const response = await fetch("http://localhost:5000/getRandomFood");
      const data = await response.json();
      setCurrentFood(data.name);
      setFoodDescription(data.description);
      setFoodImage(data.image);
    } catch (err) {
      console.error("Failed to fetch food:", err);
      setCurrentFood("Error fetching food");
    }
  };

  useEffect(() => {
    fetchRandomFood();
  }, []);

  const handleSwipe = (dir) => {
    setSwipeDir(dir);
    setTimeout(() => {
      fetchRandomFood();
      setSwipeDir(null);
    }, 300);
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
      {foodImage && <img src={foodImage} alt={currentFood} className="cardImage" />}
      <h2 className="cardTitle">{currentFood}</h2>
      <p className="cardDescription">
        {foodDescription.split(" ").slice(0, 20).join(" ")}
        {foodDescription.split(" ").length > 20 ? "..." : ""}
      </p>
    </div>
  );
}
