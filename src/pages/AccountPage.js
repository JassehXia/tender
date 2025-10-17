import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import "../styles/AccountPage.css";

const AccountPage = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({
        username: "John Doe",
        email: "john@example.com",
    });

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        const fetchUser = async () => {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
            }
            setTimeout(() => setLoading(false), 400);
        };
        fetchUser();
    }, []);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

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
                localStorage.setItem("user", JSON.stringify(data.user));
                setIsLoggedIn(true);
                setUser(data.user);
                navigate("/");
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    if (loading) {
        return (
            <div className="accountPage placeholder">
                <Sidebar isOpen={false} onClose={() => { }} isLoggedIn={false} />
                <div className="accountTopBar">
                    <h1 className="appTitle">Tender</h1>
                </div>
                <div className="accountContainer">
                    <h2 className="placeholder">Welcome Back</h2>
                    <p className="subtitle">Loading your account...</p>
                    <div className="skeletonForm">
                        <div className="skeletonBox"></div>
                        <div className="skeletonBox"></div>
                        <div className="skeletonBox"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="accountPage">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
            />

            <div className="accountTopBar">
                <div className="menuIcon" onClick={() => setSidebarOpen(true)}>
                    ☰
                </div>
                <h1 className="appTitle">Tender</h1>
            </div>

            <div className="accountContainer">
                <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
                <p className="subtitle">
                    {isSignup
                        ? "Sign up to start exploring new recipes!"
                        : `Logged in as ${user.email}`}
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
