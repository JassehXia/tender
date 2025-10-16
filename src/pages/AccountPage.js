import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import "../styles/AccountPage.css";

const AccountPage = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    // Handle form input changes
    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle login/signup form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignup ? "/auth/signup" : "/auth/login";

        try {
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user)); // ✅ save user
                setIsLoggedIn(true);
                console.log("Success:", data.user);
                navigate("/"); // Redirect to home page
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div className="accountPage">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
            />

            {/* Top Bar */}
            <div className="accountTopBar">
                <div className="menuIcon" onClick={() => setSidebarOpen(true)}>
                    ☰
                </div>
                <h1 className="appTitle">Tender</h1>
            </div>

            {/* Form Container */}
            <div className="accountContainer">
                <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
                <p className="subtitle">
                    {isSignup
                        ? "Sign up to start exploring new recipes!"
                        : "Log in to access your saved dishes."}
                </p>

                <form onSubmit={handleSubmit} className="accountForm">
                    {isSignup && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
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
