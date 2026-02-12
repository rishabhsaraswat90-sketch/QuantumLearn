import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Signup = () => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- 1. VALIDATION ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
        toast.error("Invalid Email Format");
        setLoading(false);
        return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(credentials.password)) {
        toast.error("Weak Password: Use 8+ chars, 1 number, 1 symbol (!@#$)");
        setLoading(false);
        return;
    }
    
    // --- 2. API CALL ---
    try {
      const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: credentials.name, 
          email: credentials.email, 
          password: credentials.password 
        })
      });
  
      const json = await response.json();
  
      if (json.authToken) {
        localStorage.setItem('token', json.authToken);
        toast.success("Identity Created. Welcome to the Network.", { icon: 'Fn' });
        navigate("/"); 
      } else {
        toast.error(json.error || "Registration Failed");
      }
    } catch (error) {
      toast.error("Server Error");
    }
    setLoading(false);
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  return (
    <div style={{ 
      padding: '40px 40px 40px 40px',
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
      overflow: 'hidden'
    }}>
      
      {/* Background Decoration (Same as Login) */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          width: '900px',
          height: '900px',
          border: '1px dashed rgba(0, 210, 211, 0.1)',
          borderRadius: '50%',
          zIndex: 0
        }}
      />

      {/* The Glass Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel"
        style={{ 
          padding: '40px', 
          width: '100%', 
          maxWidth: '450px', 
          borderRadius: '20px',
          boxShadow: '0 0 50px rgba(0,0,0,0.6)',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ 
                margin: 0, 
                fontSize: '2rem', 
                background: 'linear-gradient(to right, #00d2d3, #fff)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
            }}>
                New Researcher
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Join the QuantumLearn Network</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Name Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>FULL DESIGNATION (NAME)</label>
            <input type="text" name="name" onChange={onChange} style={inputStyle} placeholder="Dr. Heisenberg" required />
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>EMAIL PROTOCOL</label>
            <input type="email" name="email" onChange={onChange} style={inputStyle} placeholder="user@lab.com" required />
          </div>
          
          {/* Password Input */}
          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>SECURE KEY</label>
            <input type="password" name="password" onChange={onChange} style={inputStyle} placeholder="••••••••" required />
            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '5px' }}>
              *Must include 8+ chars, number & symbol.
            </div>
          </div>
          
          {/* Submit Button */}
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,210,211,0.3)' }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn-neon" 
            style={{ width: '100%', padding: '15px', fontSize: '1rem', cursor: 'pointer' }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Initialize Profile"}
          </motion.button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
            Already have clearance? <Link to="/login" style={{ color: '#00d2d3', textDecoration: 'none', fontWeight: 'bold' }}>Access Terminal</Link>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable Styles
const labelStyle = { 
    color: '#00d2d3', 
    fontSize: '0.75rem', 
    fontWeight: 'bold', 
    marginLeft: '5px', 
    letterSpacing: '1px' 
};

const inputStyle = { 
    width: '100%', 
    marginTop: '8px', 
    padding: '12px', 
    background: 'rgba(15, 23, 42, 0.6)', 
    border: '1px solid #334155', 
    borderRadius: '8px', 
    color: 'white', 
    outline: 'none',
    fontFamily: 'monospace' // Makes it look techy
};

export default Signup;