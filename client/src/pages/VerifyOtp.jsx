import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email from previous page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const json = await response.json();
      
      if (json.success) {
        toast.success("Identity Verified!");
        // Pass both Email AND OTP to the reset page as "Proof"
        navigate("/reset-password", { state: { email: email, otp: otp } });
      } else {
        toast.error("Invalid Code. Please try again.");
      }
    } catch (error) {
      toast.error("Server Error");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)' }}>
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '450px', borderRadius: '20px' }}>
        <h2 style={{ textAlign: 'center', color: '#00d2d3', marginBottom: '10px' }}>Security Check</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '30px' }}>
          Enter the 6-digit code sent to <br/><span style={{color: 'white'}}>{email}</span>
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
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;