import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{
          width: '60px',
          height: '60px',
          border: '5px solid rgba(0, 210, 211, 0.2)',
          borderTop: '5px solid #00d2d3',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(0, 210, 211, 0.5)'
        }}
      />
    </div>
  );
};

export default Loader;