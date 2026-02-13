import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwords.newPassword !== passwords.confirmPassword) {
        toast.error("New passwords do not match");
        setLoading(false);
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch("https://quantumlearn-api.onrender.com/api/auth/changepassword", {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify({ 
                currentPassword: passwords.currentPassword, 
                newPassword: passwords.newPassword 
            })
        });

        const json = await response.json();

        if (json.success) {
            toast.success("Password Updated! Please login again.");
            localStorage.removeItem('token');
            window.dispatchEvent(new Event("userUpdated")); // Update Navbar
            navigate("/login");
        } else {
            toast.error(json.error || "Failed to update password");
        }
    } catch (error) {
        toast.error("Server Error");
    }
    setLoading(false);
  }

  const onChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  }

  return (
    <div style={{ padding: '100px 20px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '500px', padding: '40px', borderRadius: '20px' }}
      >
        <h2 style={{ color: '#00d2d3', marginBottom: '20px', textAlign: 'center' }}>Change Password</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Current Password</label>
                <input type="password" name="currentPassword" onChange={onChange} style={inputStyle} required />
            </div>
            
            <div>
                <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>New Password</label>
                <input type="password" name="newPassword" onChange={onChange} style={inputStyle} required />
            </div>

            <div>
                <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Confirm New Password</label>
                <input type="password" name="confirmPassword" onChange={onChange} style={inputStyle} required />
            </div>

            <button type="submit" className="btn-neon" disabled={loading} style={{ padding: '12px', marginTop: '10px' }}>
                {loading ? "Updating..." : "Update Password"}
            </button>
        </form>
      </motion.div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '8px', color: 'white', marginTop: '5px' };

export default ChangePassword;