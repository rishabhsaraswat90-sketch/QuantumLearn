import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);       // Profile Dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile Menu
  const dropdownRef = useRef(null);
  
  const [user, setUser] = useState({ name: "", avatar: "", role: "" });

  const fetchUserData = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;

    try {
      const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/getuser", {
        method: "POST",
        headers: { "auth-token": currentToken }
      });
      const json = await response.json();
      setUser(json);
    } catch (error) {
      console.error("Navbar fetch error", error);
    }
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
    setMobileOpen(false);
    setUser({ name: "", avatar: "", role: "" });
  };

  const token = localStorage.getItem('token');

  return (
    <>
      <style>
        {`
          /* --- DESKTOP STYLES (The Original Design) --- */
          .nav-container {
            position: fixed; top: 0; left: 0; width: 100%; padding: 20px 40px;
            display: flex; align-items: center; justify-content: space-between;
            z-index: 1000; backdrop-filter: blur(10px); background: rgba(15, 23, 42, 0.6);
            box-sizing: border-box; transition: all 0.3s ease;
          }

          .nav-logo {
            text-decoration: none; font-size: 26px; fontWeight: 900; letter-spacing: 1px;
            background: linear-gradient(to right, #00d2d3, #ff9ff3);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }

          .desktop-menu {
            display: flex; gap: 30px; align-items: center;
            background: rgba(255,255,255,0.03); padding: 12px 30px;
            border-radius: 50px; border: 1px solid rgba(255,255,255,0.05);
            backdrop-filter: blur(5px);
          }

          .nav-link { 
            color: #94a3b8; text-decoration: none; font-weight: 500; font-size: 15px; 
            transition: all 0.3s ease; position: relative; 
          }
          .nav-link:hover { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
          
          .hamburger { display: none; background: none; border: none; color: white; font-size: 28px; cursor: pointer; }

          /* --- MOBILE STYLES (Responsiveness) --- */
          @media (max-width: 900px) {
            .nav-container { padding: 15px 20px; }
            .desktop-menu { display: none; } /* Hide Pill Menu */
            .hamburger { display: block; }   /* Show Hamburger */
            .nav-logo { font-size: 22px; }
          }

          /* Mobile Dropdown Panel */
          .mobile-dropdown {
            position: fixed; top: 70px; left: 0; width: 100%;
            background: #0f172a; border-bottom: 1px solid rgba(255,255,255,0.1);
            padding: 20px; display: flex; flex-direction: column; gap: 20px;
            z-index: 999; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            animation: slideDown 0.3s ease-out;
          }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        `}
      </style>

      <nav className="nav-container">
        
        {/* 1. LOGO */}
        <Link to="/" className="nav-logo">QuantumLearn</Link>

        {/* 2. DESKTOP CENTER MENU (The Pill) */}
        <div className="desktop-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/services" className="nav-link">Services</Link>
          
          {token && (
            <>
              <div style={{ width: '1px', height: '15px', background: 'rgba(255,255,255,0.2)' }}></div>
              <Link to="/dashboard" className="nav-link" style={{ color: '#00d2d3' }}>Dashboard</Link>
              <Link to="/simulator" className="nav-link" style={{ color: '#ff9ff3' }}>Simulator</Link>
              
              {/* 👇 FIXED: Check for "Admin" (Capital A) OR "admin" (lowercase) */}
              {(user.role === "Admin" || user.role === "admin") && ( 
                <Link to="/admin" className="nav-link" style={{ color: '#ff4757', fontWeight: 'bold' }}>
                  Admin Panel
                </Link> 
              )}
            </>
          )}
        </div>

        {/* 3. RIGHT SIDE (Profile or Login) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* HAMBURGER BUTTON (Mobile Only) */}
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
             {mobileOpen ? "✕" : "☰"}
          </button>

          {!token ? (
            <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/login" className="nav-link desktop-only" style={{ marginRight: '10px', marginTop:'8px' }}>Login</Link>
                <Link to="/signup">
                    <button className="btn-neon" style={{ padding: '8px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold' }}>Get Started</button>
                </Link>
            </div>
          ) : (
            /* PROFILE CIRCLE */
            <div style={{ position: 'relative' }} ref={dropdownRef}>
               <button 
               key={user.avatar || 'default'} 
               onClick={() => setIsOpen(!isOpen)} 
               style={{ 
                width: '45px', height: '45px', borderRadius: '50%', 
                background: user.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, #00d2d3, #2e86de)', 
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px'
               }}>
                    {!user.avatar && (user.name ? user.name.charAt(0).toUpperCase() : "U")}
               </button>

               {/* DESKTOP DROPDOWN */}
               {isOpen && (
                   <div className="glass-panel" style={{ 
                       position: 'absolute', top: '60px', right: '0', width: '220px', padding: '10px', borderRadius: '15px', 
                       background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)'
                   }}>
                       <div style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: '12px' }}>
                           SIGNED IN AS <br/><span style={{ color: 'white', fontSize: '14px' }}>{user.name}</span>
                       </div>
                       <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>👤 My Profile</Link>
                       <Link to="/change-password" className="dropdown-item" onClick={() => setIsOpen(false)}>🔒 Change Password</Link>
                       <div className="dropdown-item" onClick={handleLogout} style={{ color: '#ff4757' }}>🚪 Logout</div>
                   </div>
               )}
            </div>
          )}
        </div>
      </nav>

      {/* 4. MOBILE MENU (Only visible on small screens) */}
      {mobileOpen && (
          <div className="mobile-dropdown">
              <Link to="/" onClick={() => setMobileOpen(false)} style={{color:'white', textDecoration:'none', fontSize:'18px'}}>Home</Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} style={{color:'white', textDecoration:'none', fontSize:'18px'}}>About</Link>
              <Link to="/services" onClick={() => setMobileOpen(false)} style={{color:'white', textDecoration:'none', fontSize:'18px'}}>Services</Link>
              
              {token && (
                <>
                    <hr style={{width:'100%', borderColor:'rgba(255,255,255,0.1)'}}/>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{color:'#00d2d3', textDecoration:'none', fontSize:'18px'}}>Dashboard</Link>
                    <Link to="/simulator" onClick={() => setMobileOpen(false)} style={{color:'#ff9ff3', textDecoration:'none', fontSize:'18px'}}>Simulator</Link>
                    {(user.role === "Admin" || user.role === "admin") && (
                        <Link to="/admin" onClick={() => setMobileOpen(false)} style={{color:'#ff4757', textDecoration:'none', fontSize:'18px'}}>Admin Panel</Link>
                    )}
                    <Link to="/profile" onClick={() => setMobileOpen(false)} style={{color:'white', textDecoration:'none', fontSize:'18px'}}>My Profile</Link>
                    <div onClick={handleLogout} style={{color:'#ff4757', cursor:'pointer', fontSize:'18px'}}>Logout</div>
                </>
              )}
              {!token && <Link to="/login" onClick={() => setMobileOpen(false)} style={{color:'white', textDecoration:'none', fontSize:'18px'}}>Login</Link>}
          </div>
      )}
    </>
  );
};

export default Navbar;