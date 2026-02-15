import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const json = await response.json();
      
      if (json.success) {
        toast.success("OTP Sent to your Email!");
        // Pass the email to the next page so the user doesn't have to type it again
        navigate("/verify-otp", { state: { email: email } });
      } else {
        toast.error(json.error || "User not found");
      }
    } catch (error) {
      toast.error("Server Error");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '450px', borderRadius: '20px' }}>
        <h2 style={{ textAlign: 'center', color: '#00d2d3', marginBottom: '20px' }}>Recovery Protocol</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '30px', fontSize: '0.9rem' }}>
          Enter your registered email ID. We will send you a verification code.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: '#00d2d3', fontSize: '0.8rem', fontWeight: 'bold' }}>EMAIL ID</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              style={{ width: '100%', marginTop: '8px', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} 
              placeholder="researcher@institute.edu"
              required 
            />
          </div>
          <button type="submit" className="btn-neon" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? "Sending Code..." : "Send Verification Code"}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'none' }}>← Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;