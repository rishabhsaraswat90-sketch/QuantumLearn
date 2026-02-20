import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = async (credentialResponse) => {
    try {
        const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: credentialResponse.credential })
        });
        const json = await response.json();
        if (json.success) {
            localStorage.setItem('token', json.authToken);
            window.dispatchEvent(new Event("userUpdated")); 
            toast.success("Identity Created via Google Protocol");
            navigate("/");
        } else toast.error("Google Registration Failed");
    } catch (error) {
        toast.error("Server Error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
        toast.error("Invalid Email Format");
        setLoading(false); return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(credentials.password)) {
        toast.error("Weak Password: Use 8+ chars, 1 number, 1 symbol (!@#$)");
        setLoading(false); return;
    }
    
    try {
      const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      const json = await response.json();
      if (json.success) {
        toast.success("Code Sent! Check your Email to activate.");
        navigate("/verify-email", { state: { email: credentials.email } });
      } else toast.error(json.error || "Registration Failed");
    } catch (error) {
        toast.error("Server Error");
    }
    setLoading(false);
  }

  const onChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    // 👇 FIX: Same block layout structure to allow mobile scrolling
    <div style={{ paddingTop: '120px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px', minHeight: '100vh', background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)', overflowX: 'hidden', position: 'relative' }}>
      
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '900px', border: '1px dashed rgba(0, 210, 211, 0.1)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ margin: '0 auto', padding: '40px 20px', width: '100%', maxWidth: '450px', borderRadius: '20px', boxShadow: '0 0 50px rgba(0,0,0,0.6)', position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: 0, fontSize: '2rem', background: 'linear-gradient(to right, #00d2d3, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>New Researcher</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Join the QuantumLearn Network</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <GoogleLogin onSuccess={handleGoogleSignup} onError={() => toast.error("Registration Failed")} text="signup_with" theme="filled_black" shape="pill" width="300" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#64748b', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>OR<div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>FULL DESIGNATION</label>
            <input type="text" name="name" onChange={onChange} style={inputStyle} placeholder="Dr. Heisenberg" required />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>EMAIL PROTOCOL</label>
            <input type="email" name="email" onChange={onChange} style={inputStyle} placeholder="user@lab.com" required />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>SECURE KEY</label>
            <input type="password" name="password" onChange={onChange} style={inputStyle} placeholder="••••••••" required />
            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '5px' }}>*Must include 8+ chars, number & symbol.</div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-neon" style={{ width: '100%', padding: '15px', borderRadius:'8px' }} disabled={loading}>
            {loading ? "Registering..." : "Initialize Profile"}
          </motion.button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
            Already have clearance? <Link to="/login" style={{ color: '#00d2d3', fontWeight: 'bold' }}>Access Terminal</Link>
        </div>
      </motion.div>
    </div>
  );
}

const labelStyle = { color: '#00d2d3', fontSize: '0.75rem', fontWeight: 'bold', marginLeft: '5px' };
const inputStyle = { width: '100%', marginTop: '8px', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', color: 'white', boxSizing: 'border-box' };

export default Signup;