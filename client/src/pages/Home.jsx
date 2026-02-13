import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
      overflow: 'hidden', position: 'relative',
      padding: '80px 20px' // Responsive padding
    }}>
      
      {/* Background Orb - Responsive Size */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 180, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          width: 'min(600px, 90vw)', height: 'min(600px, 90vw)', // Stays within screen width
          background: 'radial-gradient(circle, rgba(0,210,211,0.15) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%', zIndex: 0, filter: 'blur(40px)'
        }}
      />

      <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '800px', width: '100%' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', // 📱 MAGIC LINE: Scales text automatically
            margin: '0 0 20px 0', fontWeight: '800', lineHeight: '1.2',
            background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)', 
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}
        >
          Master the <br />
          <span style={{ background: 'linear-gradient(to right, #00d2d3, #48dbfb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Quantum Future
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: '#94a3b8', lineHeight: '1.6', marginBottom: '40px', padding: '0 10px' }}
        >
          Build, visualize, and simulate quantum circuits in real-time. <br />
          No installation required. Just pure physics in your browser.
        </motion.p>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/simulator">
            <button className="btn-neon" style={{ padding: '15px 40px', fontSize: '18px', borderRadius: '50px' }}>Launch Simulator 🚀</button>
          </Link>
          <Link to="/signup">
            <button style={{ padding: '15px 40px', fontSize: '18px', borderRadius: '50px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}>Join for Free</button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;