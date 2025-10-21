import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePage from '../pages/ProfilePage';
import "../styles/Sidebar.css";
import { AuthContext } from "../context/AuthContext"; // ✅ import context

const Sidebar = ({ isOpen, onClose, isLoggedIn }) => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext); // ✅ get from context

    const handleNavigate = (path) => {
        console.log(isLoggedIn);
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // ✅ clear token
        setIsLoggedIn(false); // ✅ update global state
        onClose();
        navigate("/account"); // ✅ send back to login
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebarContent">
                {/* Close button */}
                <button className="closeBtn" onClick={onClose}>
                    ✕
                </button>

                {/* Menu items */}
                <ul className="sidebarMenu">
                    <li onClick={() => handleNavigate("/")}>🏠 Home</li>
                    <li onClick={() => handleNavigate(isLoggedIn ? "/profile" : "/account")}>
                        {isLoggedIn ? "👤 Profile" : "👤 Login"}</li>
                    {isLoggedIn && (
                        <li onClick={() => handleNavigate("/saved-foods")}>📖 Saved Foods</li>
                    )}
                    <li onClick={() => handleNavigate("/explore")}>🍽️ Explore</li>
                    <li onClick={() => handleNavigate("/friends")}>👥 Friends</li>
                    <li onClick={() => handleNavigate("/settings")}>⚙️ Settings</li>
                    {isLoggedIn && (
                        <li onClick={handleLogout}>🚪 Logout</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;