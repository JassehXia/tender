import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfilePage.css";

export default function EditProfilePage() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        bio: "",
        profilePicture: "",
        location: "",
        favoriteCuisine: "",
        allergies: "",
    });
    const [isSaving, setIsSaving] = useState(false);
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
                if (res.ok) {
                    const u = data.user;
                    setUser(u);
                    setFormData({
                        username: u.username || "",
                        email: u.email || "",
                        bio: u.bio || "",
                        profilePicture: u.profilePicture || "",
                        location: u.location || "",
                        favoriteCuisine: u.favoriteCuisine || "",
                        allergies: (u.allergies || []).join(", "),
                    });
                } else {
                    console.error(data.error);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        if (!user?._id) return;
        setIsSaving(true);

        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...formData,
                allergies: formData.allergies
                    .split(",")
                    .map((a) => a.trim())
                    .filter(Boolean),
            };

            const res = await fetch(
                `http://localhost:5000/updateProfile/${user._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();
            if (res.ok) {
                alert("Profile updated successfully!");
                navigate("/profile");
            } else {
                alert(data.message || "Failed to update profile");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <div className="loading">Loading profile...</div>;

    return (
        <div className="editProfilePage">
            <div className="editProfileContainer">
                <h1 className="title">Edit Profile</h1>

                {/* Avatar Preview */}
                <div className="profileAvatarContainer">
                    <img
                        src={
                            formData.profilePicture
                                ? formData.profilePicture
                                : `https://ui-avatars.com/api/?name=${formData.username}&background=ff6b6b&color=fff&size=128`
                        }
                        alt="Profile Preview"
                        className="profileAvatarPreview"
                    />
                </div>

                <label>
                    Profile Picture URL:
                    <input
                        type="text"
                        name="profilePicture"
                        value={formData.profilePicture}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                </label>

                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Bio:
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                    />
                </label>

                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Favorite Cuisine:
                    <input
                        type="text"
                        name="favoriteCuisine"
                        value={formData.favoriteCuisine}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Allergies (comma separated):
                    <input
                        type="text"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                    />
                </label>

                <div className="buttons">
                    <button onClick={() => navigate("/profile")} className="cancelBtn">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="saveBtn"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
