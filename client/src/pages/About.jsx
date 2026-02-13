import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div style={{ color: 'white', overflowX: 'hidden' }}>
      
      {/* HERO SECTION */}
      <section style={{ 
          minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', padding: '100px 20px'
      }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} style={{ textAlign: 'center' }}>
            <h1 style={{ 
                fontSize: 'clamp(3rem, 15vw, 6rem)', // Responsive Text
                fontWeight: '900', lineHeight: '1', marginBottom: '20px',
                background: 'linear-gradient(to bottom, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
                WE ARE <br /> <span style={{ color: '#00d2d3', WebkitTextFillColor: '#00d2d3' }}>QUANTUM.</span>
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                Bridging the gap between classical developers and quantum supremacy.
            </p>
        </motion.div>
      </section>

      {/* MISSION SECTION */}
      <section style={{ background: '#020617', padding: '80px 20px' }}>
        <div style={{ 
            maxWidth: '1200px', margin: '0 auto', 
            display: 'flex', flexWrap: 'wrap', // 👇 Allows stacking on mobile
            gap: '40px', alignItems: 'center', justifyContent: 'center' 
        }}>
            
            <motion.div 
                initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} 
                style={{ fontSize: 'clamp(8rem, 20vw, 15rem)', fontWeight: 'bold', color: 'rgba(255,255,255,0.05)', lineHeight: 0.8 }}
            >
                01
            </motion.div>

            <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} style={{ maxWidth: '600px' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '30px', color: '#fff' }}>The Mission</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#94a3b8', marginBottom: '20px' }}>
                    Quantum computing has always been locked behind the doors of massive research labs.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#94a3b8' }}>
                    We built <strong>QuantumLearn</strong> to give every student, developer, and dreamer a personal quantum computer right in their browser.
                </p>
            </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;