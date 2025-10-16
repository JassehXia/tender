import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/ProfilePage.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:5000/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) setUser(data.user);
                else console.error(data.error);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    const handleNavigate = (path) => {
        console.log(isLoggedIn);
        navigate(path);
    };

    if (!user) return <div className="loading">Loading profile...</div>;

    return (
        <div className="profilePage">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
            />

            <div className="profileTopBar">
                <div className="menuIcon" onClick={() => setSidebarOpen(true)}>☰</div>
                <h1 className="appTitle">Your Profile</h1>
            </div>

            <div className="profileContainer">
                <img
                    src={`https://ui-avatars.com/api/?name=${user.username}&background=ff6b6b&color=fff&size=128`}
                    alt="Profile Avatar"
                    className="profileAvatar"
                />
                <h2>{user.username}</h2>
                <p className="profileEmail">{user.email}</p>

                {/* Stats */}
                <div className="profileStats">
                    <div className="statCard">
                        <p className="statNumber">{user.friends.length}</p>
                        <p className="statLabel">Friends</p>
                    </div>
                    <div className="statCard">
                        <p className="statNumber">{user.liked.length}</p>
                        <p className="statLabel">Liked Recipes</p>
                    </div>
                </div>

                {/* Friends Scroll */}
                <div className="connectionsBox">
                    <h3 className="connectionsTitle">Friends</h3>
                    <div className="connectionsScroll">
                        {user.friends.length === 0 && (
                            <p className="emptyMessage">No friends yet</p>
                        )}
                        {user.friends.map((friend, i) => (
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
                </div>


                {/* Liked Recipes Scroll */}
                <div className="savedFoodsBox">
                    <h3 className="savedFoodsTitle">Liked Recipes</h3>
                    <div className="savedFoodsScroll">
                        {user.liked.length === 0 && (
                            <p className="emptyMessage">No liked recipes yet</p>
                        )}
                        {user.liked.map((recipe, i) => (
                            <div key={i} className="recipeCard">
                                {recipe.image ? (
                                    <img
                                        src={recipe.image}
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
                </div>


                <button className="editBtn"
                    onClick={() => handleNavigate("/edit-profile")}>Edit Profile</button>
            </div>
        </div>
    );
}
