import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const navigate = useNavigate();

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      try {
        // 1. Get Users
        const userRes = await fetch("https://quantumlearn-api.onrender.com/api/admin/users", {
          headers: { "auth-token": token }
        });
        
        // Security Check: If server says "Access Denied", kick them out
        if (userRes.status === 403) {
            toast.error("Access Denied: Admins Only");
            navigate('/');
            return;
        }
        
        const userData = await userRes.json();
        setUsers(userData);

        // 2. Get Circuits
        const circuitRes = await fetch("https://quantumlearn-api.onrender.com/api/admin/circuits", {
          headers: { "auth-token": token }
        });
        const circuitData = await circuitRes.json();
        setCircuits(circuitData);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [navigate]);

  const deleteUser = async (id) => {
    if(!window.confirm("Are you sure? This will delete the user and ALL their projects.")) return;

    const token = localStorage.getItem('token');
    await fetch(`https://quantumlearn-api.onrender.com/api/admin/user/${id}`, {
        method: 'DELETE',
        headers: { "auth-token": token }
    });
    
    // Remove from UI instantly
    setUsers(users.filter(user => user._id !== id));
    toast.success("User Terminated");
  };

  return (
    <div style={{ padding: '120px 40px 40px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#00d2d3', marginBottom: '30px', textShadow: '0 0 10px rgba(0,210,211,0.5)' }}>
        🛡️ Admin Control Center
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* SECTION 1: USER MANAGEMENT */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
          <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>User Database ({users.length})</h3>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {users.map(user => (
              <div key={user._id} style={itemStyle}>
                <div>
                  <div style={{ fontWeight: 'bold', color: user.role === 'admin' ? '#ff9ff3' : 'white' }}>
                    {user.name} {user.role === 'admin' && '👑'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>{user.email}</div>
                </div>
                {user.role !== 'admin' && (
                    <button onClick={() => deleteUser(user._id)} style={deleteBtnStyle}>Remove</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: CONTENT MONITORING */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
          <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>Global Projects ({circuits.length})</h3>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {circuits.map(circuit => (
              <div key={circuit._id} style={itemStyle}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{circuit.title}</div>
                  <div style={{ fontSize: '12px', color: '#00d2d3' }}>
                    By: {circuit.user ? circuit.user.name : "Unknown"}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>
                    {new Date(circuit.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// Styles
const itemStyle = {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '10px', 
    borderBottom: '1px solid rgba(255,255,255,0.05)'
};

const deleteBtnStyle = {
    background: '#ff4757',
    border: 'none',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px'
};

export default AdminPanel;