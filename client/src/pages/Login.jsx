import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();

        if (json.authToken) {
            localStorage.setItem('token', json.authToken);
            window.dispatchEvent(new Event("userUpdated")); 
            toast.success("Identity Verified. Welcome back.");
            navigate("/"); 
        } else {
            toast.error("Access Denied: Invalid Credentials");
        }
    } catch (error) {
        toast.error("System Error: Cannot connect to server");
    }
    setLoading(false);
  }

  const handleGoogleLogin = async (credentialResponse) => {
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
            toast.success("Google Login Successful");
            navigate("/");
        } else toast.error("Google Login Failed");
    } catch (error) {
        toast.error("Server Error");
    }
  };

  const onChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    // 👇 FIX: minHeight instead of height, overflowX hidden but allows vertical scroll, responsive padding
    <div style={{ padding: '80px 20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)', overflowX: 'hidden' }}>
      
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', width: '800px', height: '800px', border: '1px solid rgba(0, 210, 211, 0.05)', borderRadius: '50%', zIndex: 0 }} />

      {/* 👇 FIX: Card padding reduced for mobile */}
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '40px 20px', width: '100%', maxWidth: '400px', borderRadius: '20px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 30px 0', fontSize: '2rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            System Login
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', minHeight: '40px' }}>
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Login Failed")} theme="filled_black" shape="pill" width="300" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#64748b', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>OR<div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#00d2d3', fontSize: '0.8rem', fontWeight: 'bold' }}>EMAIL ID</label>
            <input type="email" name="email" onChange={onChange} style={{ width: '100%', marginTop: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid #334155', color:'white', padding:'12px', borderRadius: '8px', boxSizing: 'border-box' }} required />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#00d2d3', fontSize: '0.8rem', fontWeight: 'bold' }}>Qm-KEY (PASSWORD)</label>
            <input type="password" name="password" onChange={onChange} style={{ width: '100%', marginTop: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid #334155', color:'white', padding:'12px', borderRadius: '8px', boxSizing: 'border-box' }} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
            <Link to="/forgot-password" style={{ color: '#00d2d3', fontSize: '0.8rem', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>
          <button type="submit" className="btn-neon" style={{ width: '100%', padding: '15px', borderRadius: '8px' }} disabled={loading}>
            {loading ? "Authenticating..." : "Initialize Session →"}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/signup" style={{ color: '#00d2d3' }}>Register Protocol</Link>
        </div>
      </motion.div>
    </div>
  );
}
export default Login;