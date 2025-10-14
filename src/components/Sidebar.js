import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose, isLoggedIn }) => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
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
                    <li
                        onClick={() =>
                            handleNavigate(isLoggedIn ? "/account" : "/account")
                        }
                    >
                        👤 Account
                    </li>
                    <li onClick={() => handleNavigate("/explore")}>🍽️ Explore</li>
                    <li onClick={() => handleNavigate("/friends")}>👥 Friends</li>
                    <li onClick={() => handleNavigate("/settings")}>⚙️ Settings</li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
