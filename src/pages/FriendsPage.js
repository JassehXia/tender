import React, { useEffect, useState, useRef } from "react";
import { FaBars } from "react-icons/fa";
import "../styles/FriendsPage.css";

const FriendsPage = ({ setSidebarOpen }) => {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const scrollRef = useRef(null);

    const token = localStorage.getItem("token");

    // Fetch friends
    const fetchFriends = async () => {
        try {
            const res = await fetch("http://localhost:5000/user/friends", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setFriends(data);
        } catch (err) {
            console.error("Failed to fetch friends", err);
        }
    };

    // Fetch friend requests
    const fetchRequests = async () => {
        try {
            const res = await fetch("http://localhost:5000/user/friends/requests", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchFriends();
            fetchRequests();
        }
    }, []);

    const handleFriendAction = async (action, userId) => {
        try {
            const method = action === "remove" ? "POST" : "POST"; // all endpoints use POST now
            const endpointMap = {
                accept: "accept",
                decline: "decline",
                send: "send",
                remove: "remove",
            };

            const res = await fetch(`http://localhost:5000/user/friends/${endpointMap[action]}/${userId}`, {
                method,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Friend action failed");
            fetchFriends();
            fetchRequests();
            setSearchResults([]);
        } catch (err) {
            console.error("Friend action error:", err.message);
        }
    };

    // Search users
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        try {
            const res = await fetch(`http://localhost:5000/user/search?query=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Search failed");
            const data = await res.json();
            setSearchResults(data);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    // Horizontal scroll
    const handleWheel = (e) => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    };

    return (
        <div className="friendsPage">

            {/* Top bar */}
            <div className="profileTopBar">
                <div className="menuIcon" onClick={() => setSidebarOpen(true)}>
                    <FaBars />
                </div>
                <h1 className="appTitle">Tender</h1>
            </div>

            <div className="savedFoodsContainer">
                {/* Search bar, friend requests, and friends lists go here */}
            </div>


            {/* Search Bar */}
            <form className="searchContainer" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="primaryBtn">Search</button>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="friendsList">
                    {searchResults.map((user) => (
                        <div key={user._id} className="friendCard">
                            <div className="friendInfo">
                                <div className="friendAvatar">{user.image || "👤"}</div>
                                <div className="friendName">{user.username}</div>
                            </div>
                            <div className="friendActions">
                                <button
                                    className="primaryBtn acceptBtn"
                                    onClick={() => handleFriendAction("send", user._id)}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Friend Requests */}
            <h2>Pending Requests</h2>
            {requests.length === 0 ? (
                <p className="emptyMessage">No pending friend requests.</p>
            ) : (
                <div className="friendsList">
                    {requests.map((user) => (
                        <div key={user._id} className="friendCard">
                            <div className="friendInfo">
                                <div className="friendAvatar">{user.image || "👤"}</div>
                                <div className="friendName">{user.username}</div>
                            </div>
                            <div className="friendActions">
                                <button
                                    className="primaryBtn acceptBtn"
                                    onClick={() => handleFriendAction("accept", user._id)}
                                >
                                    Accept
                                </button>
                                <button
                                    className="primaryBtn declineBtn"
                                    onClick={() => handleFriendAction("decline", user._id)}
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Friends */}
            <h2>Your Friends</h2>
            {friends.length === 0 ? (
                <p className="emptyMessage">You have no friends yet.</p>
            ) : (
                <div className="friendsList" ref={scrollRef} onWheel={handleWheel}>
                    {friends.map((friend) => (
                        <div key={friend._id} className="friendCard">
                            <div className="friendInfo">
                                <div className="friendAvatar">{friend.image || "👤"}</div>
                                <div className="friendName">{friend.username}</div>
                            </div>
                            <div className="friendActions">
                                <button
                                    className="primaryBtn removeBtn"
                                    onClick={() => handleFriendAction("remove", friend._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendsPage;
