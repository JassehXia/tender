import React from "react";
import CardStack from "../components/CardStack";
import Sidebar from "../components/Sidebar";
import "../styles/SwipingPage.css";

export default function SwipingPage({ isLoggedIn, sidebarOpen, setSidebarOpen }) {
    return (
        <div className="swipingPage">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
            />

            <div className="hamburger" onClick={() => setSidebarOpen(true)}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            <div className="upperBox">
                <h1 className="title">Tender</h1>
                <p className="subtitle">Swipe right to save, left to skip</p>
            </div>

            <CardStack />

            <div className="swipeHint">
                <p>← Swipe left | Swipe right →</p>
            </div>
        </div>
    );
}
