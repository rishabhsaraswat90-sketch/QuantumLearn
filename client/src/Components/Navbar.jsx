import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 
  const [isOpen, setIsOpen] = useState(false); // Dropdown State
  const dropdownRef = useRef(null); // To detect clicks outside
  
  // NEW: State for User Data
  const [user, setUser] = useState({ name: "", avatar: "" });

  // NEW: Fetch User Data Logic
  const fetchUserData = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:5000/api/auth/getuser", {
        method: "POST",
        headers: { "auth-token": token }
      });
      const json = await response.json();
      setUser(json);
    } catch (error) {
      console.error("Navbar fetch error", error);
    }
  };

 // Fetch on mount AND listen for "userUpdated" events
  useEffect(() => {
    fetchUserData(); // Fetch immediately on load

    // Listen for our custom event (triggered by Profile.jsx)
    window.addEventListener("userUpdated", fetchUserData);
    
    // Also Close dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the listener when component unmounts
      window.removeEventListener("userUpdated", fetchUserData);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    toast.success("Logged out successfully");
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <>
      <style>
        {`
          .nav-link { color: #94a3b8; text-decoration: none; font-weight: 500; font-size: 15px; transition: all 0.3s ease; position: relative; }
          .nav-link:hover { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
          .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -5px; left: 50%; background: #00d2d3; transition: all 0.3s ease; transform: translateX(-50%); }
          .nav-link:hover::after { width: 100%; }
          
          .dropdown-item { padding: 10px 15px; color: #ccc; text-decoration: none; display: block; font-size: 14px; transition: 0.2s; border-radius: 8px; cursor: pointer; }
          .dropdown-item:hover { background: rgba(0, 210, 211, 0.1); color: #00d2d3; }
        `}
      </style>

      <nav style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', padding: '20px 40px', 
        display: 'flex', alignItems: 'center', zIndex: 1000, 
       backdropFilter: 'blur(5px)', 
        boxSizing: 'border-box'
      }}>
        
        {/* LEFT: Logo */}
        <div style={{ flex: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', fontSize: '26px', fontWeight: '900', background: 'linear-gradient(to right, #00d2d3, #ff9ff3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '1px' }}>
              QuantumLearn
            </Link>
        </div>

        {/* CENTER: Links */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 30px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/services" className="nav-link">Services</Link>
          {token && (
            <>
              <div style={{ width: '1px', height: '15px', background: 'rgba(255,255,255,0.2)' }}></div>
              <Link to="/dashboard" className="nav-link" style={{ color: '#00d2d3' }}>Dashboard</Link>
              <Link to="/simulator" className="nav-link" style={{ color: '#ff9ff3' }}>Simulator</Link>
            </>
          )}
        </div>

        {/* RIGHT: Profile / Actions */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '15px', alignItems: 'center' }}>
          {!token ? (
            <>
              <Link to="/login" className="nav-link" style={{ marginRight: '10px' }}>Login</Link>
              <Link to="/signup">
                <button className="btn-neon" style={{ padding: '10px 25px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold' }}>Get Started</button>
              </Link>
            </>
          ) : (
            // --- PROFILE DROPDOWN ---
            <div style={{ position: 'relative' }} ref={dropdownRef}>
                
                {/* 1. The Avatar Button (UPDATED PART) */}
               <button  onClick={() => setIsOpen(!isOpen)} 
               style={{ 
                width: '45px', height: '45px', borderRadius: '50%', 
                 // 👇 UPDATE THIS LINE (Added quotes inside url('...'))
                background: user.avatar ? `url('${user.avatar}')` : 'linear-gradient(135deg, #00d2d3, #2e86de)', 
              backgroundSize: 'cover', backgroundPosition: 'center',
               border: '2px solid rgba(255,255,255,0.2)', 
               // ... rest of styles
                        color: 'white', fontWeight: 'bold', fontSize: '18px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(0,210,211,0.3)'
                    }}
                >
                    {/* If NO avatar, show the first letter of name. If avatar exists, show nothing */}
                    {!user.avatar && (user.name ? user.name.charAt(0).toUpperCase() : "U")}
                </button>

                {/* 2. The Dropdown Menu */}
                {isOpen && (
                    <div className="glass-panel" style={{ 
                        position: 'absolute', top: '60px', right: '0', width: '220px', 
                        padding: '10px', borderRadius: '15px', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        background: 'rgba(15, 23, 42, 0.95)',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        display: 'flex', flexDirection: 'column', gap: '5px'
                    }}>
                        <div style={{ padding: '10px 15px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '5px', color: '#64748b', fontSize: '12px' }}>
                            SIGNED IN AS <br/>
                            <span style={{ color: 'white', fontSize: '14px' }}>{user.name || "User"}</span>
                        </div>

                        <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
                            👤 My Profile
                        </Link>
                        
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '5px 0' }}></div>
                        
                        <div className="dropdown-item" onClick={handleLogout} style={{ color: '#ff4757' }}>
                            🚪 Logout
                        </div>
                    </div>
                )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;