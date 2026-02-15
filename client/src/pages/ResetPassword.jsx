import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {}; // Get Proof

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) return toast.error("Passwords do not match");
    
    setLoading(true);
    try {
      const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: password })
      });
      const json = await response.json();
      
      if (json.success) {
        toast.success("Password Reset Successful! Login now.");
        navigate("/login");
      } else {
        toast.error(json.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Server Error");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '450px', borderRadius: '20px' }}>
        <h2 style={{ textAlign: 'center', color: '#00d2d3', marginBottom: '30px' }}>Set New Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#00d2d3', fontSize: '0.8rem', fontWeight: 'bold' }}>NEW PASSWORD</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', marginTop: '8px', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} required />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: '#00d2d3', fontSize: '0.8rem', fontWeight: 'bold' }}>CONFIRM PASSWORD</label>
            <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', marginTop: '8px', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} required />
          </div>
          <button type="submit" className="btn-neon" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;