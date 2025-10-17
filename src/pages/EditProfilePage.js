import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import "../styles/EditProfilePage.css";

const EditProfilePage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        bio: "",
        image: "",
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                    setFormData({
                        username: data.username,
                        bio: data.bio || "",
                        image: data.image || "",
                    });
                } else {
                    console.error(data.error);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Handle text input changes
    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle profile picture changes
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setFormData({ ...formData, image: file });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const formDataToSend = new FormData();
        formDataToSend.append("username", formData.username);
        formDataToSend.append("bio", formData.bio);
        if (formData.image instanceof File) {
            formDataToSend.append("image", formData.image);
        }

        try {
            const res = await fetch("http://localhost:5000/user/update", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // NOTE: Do NOT set Content-Type; browser handles it
                },
                body: formDataToSend,
            });

            const data = await res.json();
            if (res.ok) {
                alert("Profile updated successfully!");
                setUser(data.user);
                setPreviewImage(null); // Reset preview after save
            } else {
                alert(data.error || "Error updating profile.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Network/server error occurred.");
        }
    };

    if (loading)
        return (
            <div className="editProfilePage">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="editProfileTopBar">
                    <div className="menuIcon" onClick={() => setSidebarOpen(true)}>
                        ☰
                    </div>
                    <h1 className="appTitle">Tender</h1>
                </div>
                <div className="loading">Loading...</div>
            </div>
        );

    return (
        <div className="editProfilePage">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isLoggedIn={isLoggedIn}
            />

            <div className="editProfileTopBar">
                <div className="menuIcon" onClick={() => setSidebarOpen(true)}>
                    ☰
                </div>
                <h1 className="appTitle">Tender</h1>
            </div>

            <div className="editProfileContainer">
                <h2>Edit Profile</h2>

                <form onSubmit={handleSubmit} className="editProfileForm">
                    <div className="imageUploadSection">
                        <img
                            src={
                                previewImage || formData.image || "/logo192.png"
                            }
                            alt="Profile Preview"
                            className="profileImagePreview"
                        />
                        <label className="uploadBtn">
                            Change Picture
                            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                        </label>
                    </div>

                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="readonlyInput"
                    />

                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Tell us a little about yourself..."
                    />

                    <button type="submit" className="primaryBtn">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
