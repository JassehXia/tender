import React, { useState } from "react";
import "../styles/AccountPage.css";
import Sidebar from "../components/Sidebar";

const AccountPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            console.log("Creating account:", formData);
            // signup logic here
        } else {
            console.log("Logging in:", formData);
            // login logic here
        }
    };

    return (
        <div className="accountPage">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoggedIn={false}
            />

            {/* Top bar */}
            <div className="accountTopBar">
                <div className="menuIcon" onClick={() => setSidebarOpen(true)}>
                    ☰
                </div>
                <h1 className="appTitle">Tender</h1>
            </div>

            {/* Form container */}
            <div className="accountContainer">
                <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
                <p className="subtitle">
                    {isSignup
                        ? "Sign up to start exploring new recipes!"
                        : "Log in to access your saved dishes."}
                </p>

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="primaryBtn">
                        {isSignup ? "Sign Up" : "Log In"}
                    </button>
                </form>

                <p className="toggleText">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span onClick={() => setIsSignup(!isSignup)}>
                        {isSignup ? "Log in" : "Sign up"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AccountPage;
