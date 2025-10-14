import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import SwipingPage from "./pages/SwipingPage"; // ✅ import it
import Sidebar from "./components/Sidebar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
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
              setIsLoggedIn={setIsLoggedIn}
              setSidebarOpen={setSidebarOpen}
            />
          }
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
      </Routes>
    </Router>
  );
}

export default App;
