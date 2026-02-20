import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader'; 
import { toast } from 'react-hot-toast'; // Need toast for notifications

const Dashboard = () => {
    const [circuits, setCircuits] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Add navigate

    useEffect(() => {
        const fetchCircuits = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch("https://quantumlearn-api.onrender.com/api/simulation/fetchall", {
                    method: "GET",
                    headers: { "auth-token": token }
                });
                const json = await response.json();
                if (Array.isArray(json)) setCircuits(json);
                else setCircuits([]); 
                setLoading(false); 
            } catch (error) {
                console.error("Fetch error:", error);
                setLoading(false);
            }
        };
        fetchCircuits();
    }, []);

    // 👇 NEW: Delete Function
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Stops the card from being clicked when you click delete
        
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://quantumlearn-api.onrender.com/api/simulation/delete/${id}`, {
                method: "DELETE",
                headers: { "auth-token": localStorage.getItem('token') }
            });
            if (response.ok) {
                // Instantly remove from screen
                setCircuits(circuits.filter(circuit => circuit._id !== id));
                toast.success("Project Deleted");
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("Server Error");
        }
    };

    if (loading) return <Loader />;

    return (
        <div style={{ padding: '120px 40px 40px 40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <h2 style={{ color: '#00d2d3', borderBottom: '1px solid #333', paddingBottom: '10px' }}>My Saved Projects</h2>
            
            {circuits.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
                    <p>No saved projects yet.</p>
                    <Link to="/simulator">
                        <button className="btn-neon">Create Your First Circuit</button>
                    </Link>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {circuits.map((circuit) => (
                    // 👇 NEW: Clickable Card to Load Project
                    <div 
                        key={circuit._id} 
                        className="glass-panel" 
                        onClick={() => navigate('/simulator', { state: { circuitData: circuit.circuitData, title: circuit.title, id: circuit._id } })}
                        style={{ padding: '20px', borderRadius: '12px', transition: '0.3s', cursor: 'pointer' }}
                    >
                        <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>{circuit.title}</h3>
                        <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '15px' }}>
                            Created: {new Date(circuit.date).toLocaleDateString()}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ background: 'rgba(0, 210, 211, 0.1)', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', color: '#00d2d3' }}>
                                {circuit.circuitData ? circuit.circuitData.length : 0} Qubits
                            </span>
                            {/* 👇 NEW: Wired Delete Button */}
                            <button 
                                onClick={(e) => handleDelete(circuit._id, e)} 
                                style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <Link to="/simulator">
                    <button className="btn-neon" style={{ padding: '12px 30px' }}>+ New Project</button>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;