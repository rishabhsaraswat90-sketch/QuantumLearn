import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Components/Loader'; // <--- Import the Loader

const Dashboard = () => {
    const [circuits, setCircuits] = useState([]);
    const [loading, setLoading] = useState(true); // <--- New Loading State

    useEffect(() => {
        const fetchCircuits = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Fake delay to show off the loader (Remove setTimeout in production if you want)
                setTimeout(async () => {
                    const response = await fetch("http://localhost:5000/api/simulation/fetchall", {
                        method: "GET",
                        headers: {
                            "auth-token": token
                        }
                    });
                    
                    const json = await response.json();

                    if (Array.isArray(json)) {
                        setCircuits(json);
                    } else {
                        setCircuits([]); 
                    }
                    setLoading(false); // <--- Stop Loading
                }, 800); // 0.8 second delay for smooth effect

            } catch (error) {
                console.error("Fetch error:", error);
                setLoading(false);
            }
        };

        fetchCircuits();
    }, []);

    // <--- Show Loader if loading is true
    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ padding: '120px 40px 40px 40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <h2 style={{ color: '#00d2d3', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                My Saved Projects
            </h2>
            
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
                    <div key={circuit._id} className="glass-panel" style={{ 
                        padding: '20px', 
                        borderRadius: '12px', 
                        transition: '0.3s',
                        cursor: 'pointer'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>{circuit.title}</h3>
                        <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '15px' }}>
                            Created: {new Date(circuit.date).toLocaleDateString()}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ 
                                background: 'rgba(0, 210, 211, 0.1)', padding: '5px 10px', 
                                borderRadius: '15px', fontSize: '12px', color: '#00d2d3' 
                            }}>
                                {circuit.circuitData ? circuit.circuitData.length : 0} Qubits
                            </span>
                            <button style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer' }}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <Link to="/simulator">
                    <button className="btn-neon" style={{ padding: '12px 30px' }}>
                        + New Project
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;