import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div style={{ color: 'white', overflowX: 'hidden' }}>
      
      {/* SECTION 1: HERO (100vh) */}
      <section style={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          position: 'relative',
          background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
      }}>
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', padding: '20px' }}
        >
            <h1 style={{ 
                fontSize: '6rem', 
                fontWeight: '900', 
                lineHeight: '1',
                marginBottom: '20px',
                background: 'linear-gradient(to bottom, #fff, #94a3b8)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent'
            }}>
                WE ARE <br />
                <span style={{ color: '#00d2d3', WebkitTextFillColor: '#00d2d3' }}>QUANTUM.</span>
            </h1>
            <p style={{ fontSize: '1.5rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                Bridging the gap between classical developers and quantum supremacy.
            </p>
        </motion.div>
      </section>

      {/* SECTION 2: THE VISION (Min 80vh) */}
      <section style={{ 
          minHeight: '80vh', 
          background: '#020617', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '100px 20px'
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            
            {/* Left: Huge Number */}
            <motion.div 
                initial={{ x: -100, opacity: 0 }} 
                whileInView={{ x: 0, opacity: 1 }} 
                viewport={{ once: true }}
                style={{ fontSize: '15rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.05)', lineHeight: 0.8 }}
            >
                01
            </motion.div>

            {/* Right: Text */}
            <motion.div
                initial={{ x: 100, opacity: 0 }} 
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
            >
                <h2 style={{ fontSize: '3rem', marginBottom: '30px', color: '#fff' }}>The Mission</h2>
                <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#94a3b8', marginBottom: '20px' }}>
                    Quantum computing has always been locked behind the doors of massive research labs and billion-dollar corporations.
                </p>
                <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#94a3b8' }}>
                    We built <strong>QuantumLearn</strong> to give every student, developer, and dreamer a personal quantum computer right in their browser. No installation. No cost. Just physics.
                </p>
            </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;