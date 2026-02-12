import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const services = [
    { title: "Quantum Simulator", icon: "⚛️", desc: "Real-time visualization of quantum gates and state vectors." },
    { title: "Cloud Storage", icon: "☁️", desc: "Save your circuits to our secure database and access them anywhere." },
    { title: "Algorithm Library", icon: "Dg", desc: "Pre-built templates for Grover's and Shor's algorithms (Coming Soon)." }
];

const Services = () => {
  return (
    <div style={{ padding: '80px 20px', color: 'white' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '60px', color: '#00d2d3' }}>Our Ecosystem</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
        {services.map((s, i) => (
            <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="glass-panel"
                style={{ padding: '30px', width: '300px', borderRadius: '15px', textAlign: 'center' }}
            >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{s.icon}</div>
                <h3 style={{ marginBottom: '15px' }}>{s.title}</h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{s.desc}</p>
            </motion.div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <Link to="/signup">
            <button className="btn-neon">Start Building Today</button>
        </Link>
      </div>
    </div>
  );
};

export default Services;