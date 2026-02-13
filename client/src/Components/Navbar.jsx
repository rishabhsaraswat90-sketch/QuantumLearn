import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Profile Dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile Menu
  const dropdownRef = useRef(null);
  const [user, setUser] = useState({ name: "", avatar: "" });

  const fetchUserData = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;
    try {
      const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/getuser", {
        method: "POST", headers: { "auth-token": currentToken }
      });
      const json = await response.json();
      setUser(json);
    } catch (error) { console.error("Navbar fetch error", error); }
  };

  useEffect(() => {
    fetchUserData();
    const handleUserUpdate = () => fetchUserData();
    window.addEventListener("userUpdated", handleUserUpdate);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    toast.success("Logged out successfully");
    navigate('/login');
    setIsOpen(false);
    setMobileMenuOpen(false);
    setUser({ name: "", avatar: "" });
  };

  const token = localStorage.getItem('token');

  return (
    <>
      <style>
        {`
          .nav-container { display: flex; align-items: center; justify-content: space-between; width: 100%; }
          .desktop-links { display: flex; gap: 30px; align-items: center; background: rgba(255,255,255,0.03); padding: 12px 30px; borderRadius: 50px; border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(5px); }
          .mobile-menu-btn { display: none; background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
          
          @media (max-width: 900px) {
            .desktop-links { display: none; }
            .mobile-menu-btn { display: block; }
          }

          /* Mobile Menu Overlay */
          .mobile-menu {
            position: fixed; top: 80px; left: 0; width: 100%; background: #0f172a; border-bottom: 1px solid rgba(255,255,255,0.1);
            padding: 20px; display: flex; flexDirection: column; gap: 15px; z-index: 999;
            animation: slideDown 0.3s ease-out;
          }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        `}
      </style>

      <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '15px 20px', zIndex: 1000, backdropFilter: 'blur(10px)', background: 'rgba(15, 23, 42, 0.8)', boxSizing: 'border-box' }}>
        <div className="nav-container">
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', fontSize: '22px', fontWeight: '900', background: 'linear-gradient(to right, #00d2d3, #ff9ff3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              QuantumLearn
            </Link>

            {/* Desktop Links */}
            <div className="desktop-links">
              <Link to="/" className="nav-link" style={{color:'#94a3b8', textDecoration:'none'}}>Home</Link>
              <Link to="/about" className="nav-link" style={{color:'#94a3b8', textDecoration:'none'}}>About</Link>
              <Link to="/services" className="nav-link" style={{color:'#94a3b8', textDecoration:'none'}}>Services</Link>
              {token && (
                <>
                  <span style={{color:'rgba(255,255,255,0.2)'}}>|</span>
                  <Link to="/dashboard" style={{ color: '#00d2d3', textDecoration:'none' }}>Dashboard</Link>
                  <Link to="/simulator" style={{ color: '#ff9ff3', textDecoration:'none' }}>Simulator</Link>
                  {user.role === "Admin" && <Link to="/admin" style={{ color: '#ff4757', fontWeight:'bold', textDecoration:'none' }}>Admin</Link>}
                </>
              )}
            </div>

            {/* Right Side: Profile or Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {!token ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link to="/login" style={{color:'#94a3b8', textDecoration:'none', marginTop:'8px'}}>Login</Link>
                        <Link to="/signup"><button className="btn-neon" style={{padding: '8px 15px', fontSize:'12px'}}>Get Started</button></Link>
                    </div>
                ) : (
                    <button 
                        key={user.avatar || 'default'}
                        onClick={() => setIsOpen(!isOpen)}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', background: user.avatar ? `url(${user.avatar})` : '#00d2d3', backgroundSize: 'cover', border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                    />
                )}
                
                {/* Hamburger Icon */}
                <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? "✕" : "☰"}
                </button>
            </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
            <div className="mobile-menu">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{color:'white', textDecoration:'none', fontSize:'18px'}}>Home</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{color:'white', textDecoration:'none', fontSize:'18px'}}>About</Link>
                <Link to="/services" onClick={() => setMobileMenuOpen(false)} style={{color:'white', textDecoration:'none', fontSize:'18px'}}>Services</Link>
                {token && (
                    <>
                        <hr style={{width:'100%', borderColor:'rgba(255,255,255,0.1)'}}/>
                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{color:'#00d2d3', textDecoration:'none', fontSize:'18px'}}>Dashboard</Link>
                        <Link to="/simulator" onClick={() => setMobileMenuOpen(false)} style={{color:'#ff9ff3', textDecoration:'none', fontSize:'18px'}}>Simulator</Link>
                        {user.role === "Admin" && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{color:'#ff4757', textDecoration:'none', fontSize:'18px'}}>Admin Panel</Link>}
                    </>
                )}
            </div>
        )}

        {/* PROFILE DROPDOWN (Keep existing logic) */}
        {isOpen && token && (
            <div className="glass-panel" ref={dropdownRef} style={{ position: 'absolute', top: '70px', right: '20px', width: '200px', padding: '15px', borderRadius: '15px', zIndex: 1001, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/profile" onClick={() => setIsOpen(false)} style={{color:'white', textDecoration:'none'}}>👤 My Profile</Link>
                <Link to="/change-password" onClick={() => setIsOpen(false)} style={{color:'white', textDecoration:'none'}}>🔒 Change Password</Link>
                <div onClick={handleLogout} style={{color:'#ff4757', cursor:'pointer'}}>🚪 Logout</div>
            </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;