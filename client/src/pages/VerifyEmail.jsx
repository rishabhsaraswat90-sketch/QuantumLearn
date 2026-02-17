import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email from Signup page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/verifysignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const json = await response.json();
      
      if (json.success) {
        // Login Successful
        localStorage.setItem('token', json.authToken);
        window.dispatchEvent(new Event("userUpdated"));
        toast.success("Account Verified & Logged In!");
        navigate("/");
      } else {
        toast.error(json.error || "Verification Failed");
      }
    } catch (error) {
      toast.error("Server Error");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '450px', borderRadius: '20px' }}>
        <h2 style={{ textAlign: 'center', color: '#00d2d3', marginBottom: '10px' }}>Activate Account</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '30px' }}>
          We sent a code to <br/><span style={{color: 'white'}}>{email}</span>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
            <input 
              type="text" 
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)} 
              style={{ 
                width: '200px', padding: '15px', fontSize: '24px', textAlign: 'center', letterSpacing: '10px',
                background: 'rgba(15, 23, 42, 0.6)', border: '2px solid #00d2d3', color: 'white', borderRadius: '8px' 
              }} 
              placeholder="000000"
              required 
            />
          </div>
          <button type="submit" className="btn-neon" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? "Activating..." : "Activate & Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;