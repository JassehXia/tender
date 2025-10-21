import React, { useEffect, useState, useContext, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/SavedFoodsPage.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function SavedFoodsPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [topCuisines, setTopCuisines] = useState([]);

    const recipesRef = useRef(null);
    const cuisinesRef = useRef(null);

    const handleNavigate = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch saved recipes
        fetch("http://localhost:5000/user/savedRecipes", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setSavedRecipes(data))
            .catch(err => console.error(err));

        // Fetch top cuisines
        fetch("http://localhost:5000/user/topCuisines", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setTopCuisines(data))
            .catch(err => console.error(err));
    }, []);

    // Lock vertical scroll while hovering horizontal scroll
    const handleWheel = (e, ref) => {
        if (ref.current) {
            ref.current.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    };

    return (
        <div className="savedFoodsPage">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
            />

            {/* Top Bar */}
            <div className="profileTopBar">
                <div className="menuIcon" onClick={() => setSidebarOpen(true)}>☰</div>
                <h1 className="appTitle">Tender</h1>
            </div>

            {/* Saved Recipes */}
            <div className="savedFoodsContainer">
                <div className="savedFoodsBox">
                    <h2 className="savedFoodsTitle">Saved Recipes</h2>
                    <div className="scrollContainer">
                        <button
                            className="scrollBtn left"
                            onClick={() => recipesRef.current.scrollBy({ left: -220, behavior: 'smooth' })}
                        >
                            ◀
                        </button>
                        <div className="savedFoodsScroll" ref={recipesRef}>
                            {savedRecipes.length === 0 ? (
                                <p className="emptyMessage">
                                    You haven’t saved any recipes yet — start swiping!
                                </p>
                            ) : (
                                savedRecipes.map((recipe) => (
                                    <div key={recipe._id} className="recipeCard">
                                        {recipe.image ? (
                                            <img
                                                src={recipe.image.startsWith("/uploads")
                                                    ? `http://localhost:5000${recipe.image}`
                                                    : recipe.image}
                                                alt={recipe.name}
                                                className="recipeCardImg"
                                            />
                                        ) : (
                                            <div className="recipePlaceholder">{recipe.name}</div>
                                        )}
                                        <p className="recipeName">{recipe.name}</p>
                                        <p className="recipeCuisine">{recipe.cuisines?.join(", ")}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <button
                            className="scrollBtn right"
                            onClick={() => recipesRef.current.scrollBy({ left: 220, behavior: 'smooth' })}
                        >
                            ▶
                        </button>
                    </div>
                </div>


                {/* Top Cuisines */}
                <div className="topCuisinesBox">
                    <h2 className="topCuisinesTitle">Top Cuisines</h2>
                    <div className="scrollContainer">
                        <button
                            className="scrollBtn left"
                            onClick={() => cuisinesRef.current.scrollBy({ left: -220, behavior: 'smooth' })}
                        >
                            ◀
                        </button>
                        <div className="topCuisinesScroll" ref={cuisinesRef}>
                            {topCuisines.length === 0 ? (
                                <p className="emptyMessage">No cuisines liked yet</p>
                            ) : (
                                topCuisines.map((cuisine, i) => (
                                    <div key={i} className="cuisineCard">
                                        <div className="cuisineBadge">{cuisine.count}</div>
                                        <p className="cuisineName">{cuisine.cuisine}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <button
                            className="scrollBtn right"
                            onClick={() => cuisinesRef.current.scrollBy({ left: 220, behavior: 'smooth' })}
                        >
                            ▶
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SavedFoodsPage;
