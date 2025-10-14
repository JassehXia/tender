import React, { useEffect, useState, useRef } from "react";
import { FaBars } from "react-icons/fa";
import "../styles/HomePage.css";

const HomePage = ({ isLoggedIn, setSidebarOpen }) => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [connections] = useState([
        { id: 1, name: "Alex", sharedFood: "Ramen", image: "🍜" },
        { id: 2, name: "Jamie", sharedFood: "Pizza", image: "🍕" },
        { id: 3, name: "Taylor", sharedFood: "Pasta", image: "🍝" },
    ]);

    const scrollRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:5000/getFoodFromDB")
            .then((res) => res.json())
            .then((data) => {
                const shuffled = data.sort(() => 0.5 - Math.random());
                setSavedRecipes(shuffled.slice(0, 4));
            })
            .catch((err) => console.error("Error fetching recipes:", err));
    }, []);

    const handleWheel = (e) => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    };

    return (
        <div className="homePage">
            {/* Top bar */}
            <div className="topBar">
                <FaBars
                    className="menuIcon"
                    onClick={() => setSidebarOpen(true)}
                />
                <h1 className="title">Tender</h1>
            </div>

            {/* Saved Recipes */}
            <div className="savedFoodsBox">
                <h2 className="savedFoodsTitle">Saved Recipes</h2>
                <div
                    className="savedFoodsScroll"
                    ref={scrollRef}
                    onWheel={handleWheel}
                >
                    {savedRecipes.map((recipe) => (
                        <div key={recipe._id} className="recipeCard">
                            <img src={recipe.image} alt={recipe.name} />
                            <p className="recipeName">{recipe.name}</p>
                        </div>
                    ))}

                    <div className="recipeCard viewMoreCard">
                        <p className="viewMoreText">View More</p>
                    </div>
                </div>
            </div>

            {/* Connections */}
            <div className="connectionsBox">
                <h2 className="connectionsTitle">Connections</h2>
                <div className="connections">
                    {connections.map((conn) => (
                        <div key={conn.id} className="connectionCard">
                            <p className="connectionEmoji">{conn.image}</p>
                            <p>
                                <strong>{conn.name}</strong>
                            </p>
                            <p>Shared: {conn.sharedFood}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
