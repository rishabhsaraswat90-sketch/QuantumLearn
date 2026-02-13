import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

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
            body: JSON.stringify({ 
                email: credentials.email, 
                password: credentials.password 
            })
        });

        const json = await response.json();

        if (json.authToken) {
            // 1. Save Token
            localStorage.setItem('token', json.authToken);
            
            // 2. 👇 CRITICAL FIX: Tell Navbar to wake up and fetch data immediately
            window.dispatchEvent(new Event("userUpdated"));

            toast.success("Identity Verified. Welcome back.", {
                style: { background: '#0f172a', color: '#00d2d3', border: '1px solid #00d2d3' },
                icon: 'Fn'
            });
            navigate("/"); 
        } else {
            toast.error("Access Denied: Invalid Credentials");
        }
    } catch (error) {
        toast.error("System Error: Cannot connect to server");
    }
    setLoading(false);
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  return (
    <div style={{ 
      padding: '80px 40px 40px 40px',
      height: '90vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
      overflow: 'hidden'
    }}>
      
      {/* Background Decoration */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          border: '1px solid rgba(0, 210, 211, 0.05)',
          borderRadius: '50%',
          zIndex: 0
        }}
      />

      {/* The Glass Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel"
        style={{ 
          padding: '40px', 
          width: '100%', 
          maxWidth: '400px', 
          borderRadius: '20px',
          boxShadow: '0 0 40px rgba(0,0,0,0.5)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ 
                margin: 0, 
                fontSize: '2rem', 
                background: 'linear-gradient(to right, #fff, #94a3b8)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
            }}>
                System Login
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Enter your credentials to access the simulator</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#00d2d3', fontSize: '0.8rem', fontWeight: 'bold', marginLeft: '5px' }}>EMAIL ID</label>
            <input 
              type="email" 
              name="email" 
              onChange={onChange} 
              style={{ width: '100%', marginTop: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '5px' }} 
              placeholder="researcher@institute.edu"
              required 
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: '#00d2d3', fontSize: '0.8rem', fontWeight: 'bold', marginLeft: '5px' }}>Qm-KEY (PASSWORD)</label>
            <input 
              type="password" 
              name="password" 
              onChange={onChange} 
              style={{ width: '100%', marginTop: '5px', background: 'rgba(0,0,0,0.3)', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '5px' }} 
              placeholder="••••••••"
              required 
            />
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(0,210,211,0.4)' }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn-neon" 
            style={{ width: '100%', padding: '12px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Initialize Session →"}
          </motion.button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
            New Researcher? <Link to="/signup" style={{ color: '#00d2d3', textDecoration: 'none' }}>Register Protocol</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;