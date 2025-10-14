import React from "react";
import Card from "../components/Card";
import Sidebar from "../components/Sidebar";
import "../styles/MainPage.css";

export default function SwipingPage({ isLoggedIn, sidebarOpen, setSidebarOpen }) {
    return (
        <div className="swipingPage">
            {/* Global Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
            />

            {/* Hamburger Menu */}
            <div
                className={`hamburger ${sidebarOpen ? "hidden" : ""}`}
                onClick={() => setSidebarOpen(true)}
            >
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            {/* Header */}
            <div className="upperBox">
                <h1 className="title">Tender</h1>
                <p className="subtitle">Swipe right to save, left to skip</p>
            </div>

            {/* Card container */}
            <div className="cardBox">
                <Card />
            </div>
        </div>
    );
}
