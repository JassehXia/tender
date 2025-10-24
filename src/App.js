import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import SwipingPage from "./pages/SwipingPage"; // ✅ import it
import Sidebar from "./components/Sidebar";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import SavedFoodsPage from "./pages/SavedFoodsPage";
import FriendsPage from "./pages/FriendsPage";
import { AuthContext } from "./context/AuthContext"; // ✅ import contex

function App() {
  const { isLoggedIn } = useContext(AuthContext); // ✅ get global login state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div classname="accountPage fadeIn">
      <Router>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isLoggedIn={isLoggedIn}
        />

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isLoggedIn={isLoggedIn}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/account"
            element={
              <AccountPage
                isLoggedIn={isLoggedIn}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          <Route
            path="/profile"
            element={
              <ProfilePage
                isLoggedIn={isLoggedIn}
                setSidebarOpen={setSidebarOpen} />
            }
          />
          <Route
            path="edit-profile" element={
              <EditProfilePage
                isLoggedIn={isLoggedIn}
                setSidebarOpen={setSidebarOpen} />}
          />

          <Route
            path="/explore"
            element={
              <SwipingPage
                isLoggedIn={isLoggedIn}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/saved-foods"
            element={
              <SavedFoodsPage
                isLoggedIn={isLoggedIn}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/friends"
            element={
              <FriendsPage
                isLoggedIn={isLoggedIn}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
