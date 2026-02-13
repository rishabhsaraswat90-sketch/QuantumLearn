import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // State for User Data
  const [user, setUser] = useState({ name: "", avatar: "" });

  // 1. ROBUST FETCH FUNCTION
  // We read the token INSIDE the function to ensure it's always fresh
  const fetchUserData = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;

    try {
      console.log("Navbar: Fetching latest user data..."); // Debug Log
      const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/getuser", {
        method: "POST",
        headers: { "auth-token": currentToken }
      });
      const json = await response.json();
      
      // Update state with fresh data
      setUser(json);
      console.log("Navbar: User updated", json.name);
    } catch (error) {
      console.error("Navbar fetch error", error);
    }
  };

  // 2. EVENT LISTENER SETUP
  useEffect(() => {
    // A. Fetch immediately on mount
    fetchUserData();

    // B. Create a specific handler for the event
    const handleUserUpdate = () => {
      console.log("Navbar: Received 'userUpdated' event!");
      fetchUserData();
    };

    // C. Listen for the event (Dispatched by Profile.jsx)
    window.addEventListener("userUpdated", handleUserUpdate);
    document.addEventListener("mousedown", handleClickOutside);

    // D. Cleanup listeners when component updates/unmounts
    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array ensures this listener sticks around

  // Close dropdown if clicked outside
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
    setUser({ name: "", avatar: "" }); // Clear state
  };

  // Get Token for conditional rendering of links
  const token = localStorage.getItem('token');

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
                
               <button onClick={() => setIsOpen(!isOpen)} 
               style={{ 
                width: '45px', height: '45px', borderRadius: '50%', 
                // 3. CORRECT CSS SYNTAX (No Quotes)
                background: user.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, #00d2d3, #2e86de)', 
                backgroundSize: 'cover', backgroundPosition: 'center',
                border: '2px solid rgba(255,255,255,0.2)', 
                color: 'white', fontWeight: 'bold', fontSize: '18px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0,210,211,0.3)'
                }}
                >
                    {!user.avatar && (user.name ? user.name.charAt(0).toUpperCase() : "U")}
                </button>

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