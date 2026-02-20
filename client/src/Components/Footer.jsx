import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return toast.error("Please enter an email");
    if (!email.includes("@")) return toast.error("Invalid email");
    
    toast.success("Subscribed to QuantumLearn Newsletter!");
    setEmail("");
  };

  return (
    <footer style={{ 
        background: '#020617',
        color: '#94a3b8',
        padding: '80px 40px 20px 40px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: "'Inter', sans-serif",
        minHeight: '40vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }}>
      
      <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          width: '100%', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '40px' 
      }}>
        
        {/* Column 1: Brand */}
        <div>
            <h2 style={{ 
                color: 'white', 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                margin: '0 0 20px 0',
                background: 'linear-gradient(to right, #00d2d3, #2e86de)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                QuantumLearn.
            </h2>
            <p style={{ lineHeight: '1.6', maxWidth: '300px' }}>
                The world's first browser-based quantum simulation ecosystem. 
                Built for the next generation of researchers.
            </p>
        </div>

        {/* Column 2: Platform */}
        <div>
            <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '1.1rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Link to="/simulator" style={linkStyle}>Quantum Engine</Link>
                <Link to="/services" style={linkStyle}>Algorithm Library</Link>
                <Link to="/dashboard" style={linkStyle}>Cloud Dashboard</Link>
                <span style={{color: '#444', cursor: 'not-allowed'}}>API Access (Coming Soon)</span>
            </div>
        </div>

        {/* Column 3: Company */}
        <div>
            <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '1.1rem' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Link to="/about" style={linkStyle}>Our Story</Link>
                <a href="#" style={linkStyle}>Careers</a>
                <a href="#" style={linkStyle}>Brand Guidelines</a>
                <a href="#" style={linkStyle}>Contact Support</a>
            </div>
        </div>

        {/* Column 4: Newsletter */}
        <div>
            <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '1.1rem' }}>Stay Updated</h4>
            <p style={{ marginBottom: '15px' }}>Join 10,000+ developers building the future.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    style={{ 
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: '1px solid #333', 
                        background: '#1e293b', 
                        color: 'white',
                        width: '100%'
                    }} 
                />
                <button onClick={handleSubscribe} className="btn-neon" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>→</button>
            </div>
        </div>

      </div>

      <div style={{ 
          maxWidth: '1400px', 
          margin: '60px auto 0 auto', 
          width: '100%', 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
      }}>
        <div>© 2026 QuantumLearn Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={linkStyle}>Privacy Policy</a>
            <a href="#" style={linkStyle}>Terms of Service</a>
            <a href="#" style={linkStyle}>Cookies</a>
        </div>
      </div>
    </footer>
  );
};

const linkStyle = {
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.2s',
    cursor: 'pointer'
};

export default Footer;