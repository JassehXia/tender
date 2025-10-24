import React, { useEffect, useState, useContext, use } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/ProfilePage.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProfilePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:5000/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok || res.status === 200) {
                    console.log("Fetched user data:", data);
                    setUser(data);
                } else {
                    console.error(data.error);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);

    if (!user) return <div className="loading">Loading profile...</div>;

    return (
        <div className="profilePage">
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


            {/* Profile Info */}
            <div className="profileContainer">
                <img
                    src={user.image ? `http://localhost:5000${user.image}` : `/default-profile.png`}
                    alt="Profile"
                    className="profileAvatar"
                />
                <h2>{user.username}</h2>
                <p className="profileEmail">{user.email}</p>

                {/* Stats */}
                <div className="profileStats">
                    <div className="statCard">
                        <p className="statNumber">{user.friends?.length || 0}</p>
                        <p className="statLabel">Friends</p>
                    </div>
                    <div className="statCard">
                        <p className="statNumber">{user.savedRecipes?.length || 0}</p>
                        <p className="statLabel">Liked Recipes</p>
                    </div>
                </div>


                {/* Friends Scroll */}
                <div className="connectionsScroll">
                    {(!user.friends || user.friends.length === 0) && (
                        <p className="emptyMessage">No friends yet</p>
                    )}
                    {user.friends?.map((friend, i) => (
                        <div key={i} className="connectionCard">
                            <img
                                src={`https://ui-avatars.com/api/?name=${friend}&background=ff6b6b&color=fff&size=64`}
                                alt={friend}
                                className="connectionAvatar"
                            />
                            <p className="connectionName">{friend}</p>
                        </div>
                    ))}
                </div>


                {/* Liked Recipes Scroll */}
                <div className="savedFoodsScroll">
                    {(!user.liked || user.liked.length === 0) && (
                        <p className="emptyMessage">No liked recipes yet</p>
                    )}
                    {user.liked?.map((recipe, i) => (
                        <div key={i} className="recipeCard">
                            {recipe.image ? (
                                <img
                                    src={recipe.image.startsWith("/uploads")
                                        ? `http://localhost:5000${recipe.image}`
                                        : recipe.image
                                    }
                                    alt={recipe.name}
                                    className="recipeCardImg"
                                />
                            ) : (
                                <div className="recipePlaceholder">{recipe.name}</div>
                            )}
                            <p className="recipeName">{recipe.name}</p>
                            <p className="recipeCuisine">{recipe.cuisine}</p>
                        </div>
                    ))}
                </div>


                <button
                    className="editBtn"
                    onClick={() => handleNavigate("/edit-profile")}
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
}
