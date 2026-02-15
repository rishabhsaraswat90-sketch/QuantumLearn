import React from "react";
// 👇 Remove 'BrowserRouter as Router'
import { Routes, Route } from "react-router-dom"; 
// 👇 Remove Toaster (It is already in main.jsx)

// Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer"; 

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Simulator from "./pages/Simulator";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About"; 
import Services from "./pages/Services"; 
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    // ❌ REMOVED <Router> wrapper here
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-dark)",
      }}
    >
      {/* ❌ REMOVED <Toaster /> here (It's already in main.jsx) */}
      
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
      
      <Footer /> 
    </div>
    // ❌ REMOVED </Router> wrapper here
  );
}

export default App;