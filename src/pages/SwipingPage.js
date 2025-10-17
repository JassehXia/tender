import React from "react";
import CardStack from "../components/CardStack";
import Sidebar from "../components/Sidebar";
import "../styles/SwipingPage.css";

export default function SwipingPage({ isLoggedIn, sidebarOpen, setSidebarOpen }) {
    return (

        <div className="swipingPage">
            {/* Top bar */}
            <div className="swipeTopBar">
                <div className="menuIcon" onClick={() => setSidebarOpen(true)}>
                    ☰
                </div>
                <h1 className="appTitle">Tender</h1>
            </div>

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
            />



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
