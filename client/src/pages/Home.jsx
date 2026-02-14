import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div style={{ 
      padding: '0 20px', // Small padding for mobile safety
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* 1. Background Orb (Responsive Size) */}
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

      {/* 2. Main Content */}
      <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '800px', width: '100%' }}>
        
        {/* Animated Title */}
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, type: 'spring' }}
          style={{ 
            fontSize: 'clamp(3rem, 8vw, 5rem)', // 📱 FIX: Scales text automatically
            margin: '0 0 20px 0', 
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px',
            lineHeight: 1.1
          }}
        >
          Master the <br />
          <span style={{ 
            background: 'linear-gradient(to right, #00d2d3, #48dbfb)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(0,210,211,0.4)'
          }}>Quantum Future</span>
        </motion.h1>
        
        {/* Animated Description */}
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5, duration: 1 }}
          style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: '#94a3b8', lineHeight: '1.6', marginBottom: '40px' }}
        >
          Build, visualize, and simulate quantum circuits in real-time. <br />
          No installation required. Just pure physics in your browser.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/simulator">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,210,211,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-neon" 
              style={{ padding: '15px 40px', fontSize: '18px', borderRadius: '50px' }}
            >
              Launch Simulator 🚀
            </motion.button>
          </Link>
          
          <Link to="/signup">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                padding: '15px 40px', fontSize: '18px', borderRadius: '50px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', cursor: 'pointer'
              }}
            >
              Join for Free
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;