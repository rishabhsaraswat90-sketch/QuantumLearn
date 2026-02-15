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
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-dark)",
      }}
    >
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      
      <Footer /> 
    </div>
  );
}

export default App;