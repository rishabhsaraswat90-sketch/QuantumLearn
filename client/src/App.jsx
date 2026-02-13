import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer"; // <--- Import Footer

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Simulator from "./pages/Simulator";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About"; // <--- Import About
import Services from "./pages/Services"; // <--- Import Services
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-dark)",
        }}
      >
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
        <Footer /> {/* <--- Added Footer at the bottom */}
      </div>
    </Router>
  );
}

export default App;
