import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import BlochSphere from '../Components/BlochSphere';

// --- Custom Tooltip Component ---
const GateTooltip = ({ text, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
        style={{ position: 'relative', display: 'inline-block' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
            style={{ 
              position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
              marginBottom: '10px', padding: '6px 12px', background: '#0f172a', 
              border: '1px solid #00d2d3', color: '#00d2d3', fontSize: '0.75rem', fontWeight: 'bold',
              borderRadius: '6px', whiteSpace: 'nowrap', zIndex: 50,
              boxShadow: '0 4px 10px rgba(0,210,211,0.2)', pointerEvents: 'none'
            }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Simulator Component ---
const Simulator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [circuit, setCircuit] = useState(location.state?.circuitData || [[], []]); 
  const [circuitId, setCircuitId] = useState(location.state?.id || null); 
  const [projectTitle, setProjectTitle] = useState(location.state?.title || ""); 
  const [results, setResults] = useState(null);
  const [blochAngles, setBlochAngles] = useState({ theta: 0, phi: 0 });     
  const [loading, setLoading] = useState(false);

  // States for the Custom Save Modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  const addQubit = () => {
    if (circuit.length >= 5) return toast.error("Max 5 Qubits allowed in Demo Mode");
    setCircuit([...circuit, []]);
  };

  const removeQubit = (index) => {
    if (circuit.length <= 2) return toast.error("Minimum 2 Qubits required");
    const newCircuit = [...circuit];
    newCircuit.splice(index, 1);
    setCircuit(newCircuit);
  };
  
  const addGate = (qubitIndex, gateName) => {
    const newCircuit = [...circuit];
    newCircuit[qubitIndex].push(gateName);
    setCircuit(newCircuit);
  };

  const removeGate = (qubitIndex) => {
    const newCircuit = [...circuit];
    newCircuit[qubitIndex].pop();
    setCircuit(newCircuit);
  }

  const runSimulation = async () => {
    setLoading(true);
    setResults(null);
    try {
      const response = await fetch("https://quantumlearn-api.onrender.com/api/simulation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circuitData: circuit })
      });
      const json = await response.json();
      if (json.success) {
        const chartData = json.results.map(r => ({
            state: `|${r.state}⟩`,
            probability: parseFloat((r.probability * 100).toFixed(2)),
            rawState: r.state
        }));
        setResults(chartData);

        let prob1 = 0;
        chartData.forEach(r => {
            if (r.rawState[0] === '1') {
                prob1 += (r.probability / 100);
            }
        });
        
        const theta = 2 * Math.asin(Math.sqrt(prob1));
        const phi = 0; 
        
        setBlochAngles({ theta, phi });
        toast.success("Simulation Complete", { icon: '⚡' });
      } else {
        toast.error("Simulation Failed");
      }
    } catch (error) {
      toast.error("Server Connection Error");
    }
    setLoading(false);
  };

  const handleSave = async (isModalSubmit = false) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Login to Save Circuits");

    let title = projectTitle;
    
    if (!circuitId && !isModalSubmit) {
        setShowSaveModal(true);
        return; 
    }
    
    if (isModalSubmit) {
        if (!tempTitle) return toast.error("Project name required");
        title = tempTitle;
        setProjectTitle(title);
        setShowSaveModal(false);
    }

    try {
      const url = circuitId ? `https://quantumlearn-api.onrender.com/api/simulation/update/${circuitId}` : `https://quantumlearn-api.onrender.com/api/simulation/save`;
      const method = circuitId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify({ title, circuitData: circuit })
      });
      const json = await response.json();
      
      if (json._id || json.circuit) {
        if (!circuitId) setCircuitId(json._id); 
        toast.success(circuitId ? "Project Updated" : "Project Saved to Cloud ☁️");
      } else toast.error("Save Failed");
    } catch (error) {
      toast.error("Server Error");
    }
  };

  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#0f172a', border: '1px solid #00d2d3', padding: '10px', borderRadius: '8px', color: '#fff' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>State: {label}</p>
          <p style={{ margin: 0, color: '#00d2d3' }}>Probability: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '100px 20px 40px 20px', maxWidth: '1200px', margin: '0 auto', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '20px 30px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', background: 'linear-gradient(to right, #00d2d3, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {projectTitle ? projectTitle : "Quantum Workspace"}
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Visual Circuit Composer & Simulator</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addQubit} style={{ ...btnStyle, background: 'rgba(255,255,255,0.05)', border: '1px solid #334155' }}>
                + Add Qubit
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSave(false)} style={{ ...btnStyle, background: '#00d2d3', color: '#0f172a', fontWeight: 'bold' }}>
                {circuitId ? "💾 Update Project" : "💾 Save Project"}
            </motion.button>
        </div>
      </div>

      {/* Circuit Canvas */}
      <div className="glass-panel" style={{ padding: '40px 20px', borderRadius: '15px', overflowX: 'auto', marginBottom: '30px', minHeight: '300px' }}>
        {circuit.map((qubitLine, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '35px', position: 'relative' }}>
            
            <div style={{ minWidth: '60px', height: '60px', borderRadius: '12px', background: '#0f172a', border: '2px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#94a3b8', zIndex: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                |q{index}⟩
            </div>
            
            <div style={{ position: 'absolute', left: '60px', right: '20px', top: '50%', height: '2px', background: '#334155', zIndex: 0 }}></div>

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', zIndex: 1, gap: '15px', minWidth: '100px' }}>
              <AnimatePresence>
                {qubitLine.map((gate, gIndex) => (
                  <motion.div 
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                      key={gIndex} 
                      style={{ width: '50px', height: '50px', background: 'rgba(0, 210, 211, 0.1)', border: '1px solid #00d2d3', color: '#00d2d3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '8px', backdropFilter: 'blur(5px)', boxShadow: '0 0 15px rgba(0,210,211,0.2)' }}
                  >
                    {gate}
                  </motion.div>
                ))}
              </AnimatePresence>

              <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '5px', borderRadius: '8px', border: '1px solid #334155' }}>
                 <GateTooltip text="Hadamard Gate (Superposition)">
                    <button onClick={() => addGate(index, 'H')} style={gateBtnStyle}>H</button>
                 </GateTooltip>
                 
                 <GateTooltip text="Pauli-X Gate (NOT/Flip)">
                    <button onClick={() => addGate(index, 'X')} style={gateBtnStyle}>X</button>
                 </GateTooltip>
                 
                 <GateTooltip text="Pauli-Z Gate (Phase Flip)">
                    <button onClick={() => addGate(index, 'Z')} style={gateBtnStyle}>Z</button>
                 </GateTooltip>
                 
                 {qubitLine.length > 0 && (
                    <GateTooltip text="Remove Last Gate">
                        <button onClick={() => removeGate(index)} style={{...gateBtnStyle, color: '#ff4757', borderColor: 'rgba(255, 71, 87, 0.3)'}}>⌫</button>
                    </GateTooltip>
                 )}
                 
                 {circuit.length > 2 && (
                    <GateTooltip text="Delete Qubit Line">
                        <button onClick={() => removeQubit(index)} style={{...gateBtnStyle, color: '#ff4757', marginLeft: '10px'}}>🗑️</button>
                    </GateTooltip>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Execute Button */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,210,211,0.5)' }} whileTap={{ scale: 0.98 }}
            onClick={runSimulation} className="btn-neon" disabled={loading}
            style={{ padding: '18px 60px', fontSize: '1.2rem', borderRadius: '30px', letterSpacing: '1px' }}
        >
          {loading ? "COMPUTING STATE VECTOR..." : "EXECUTE CIRCUIT"}
        </motion.button>
      </div>

      {/* RESPONSIVE 3D VISUALIZATION GRID */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="results-grid">
          
          {/* Panel 1: Probability Chart */}
          <div className="result-card">
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#f8fafc' }}>Measurement Probabilities</h3>
              <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Full System State</p>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <XAxis dataKey="state" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} dy={10} />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `${val}%`} />
                      <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="probability" radius={[4, 4, 0, 0]} animationDuration={1500}>
                          {results.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.probability > 0 ? '#00d2d3' : '#334155'} />
                          ))}
                      </Bar>
                  </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Panel 2: 3D Bloch Sphere */}
          <div className="result-card">
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#f8fafc' }}>Bloch Sphere</h3>
              <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Estimated State vector for Qubit 0</p>
            </div>
            <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BlochSphere theta={blochAngles.theta} phi={blochAngles.phi} />
            </div>
          </div>

        </motion.div>
      )}

      {/* Custom Save Modal */}
      {showSaveModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#00d2d3' }}>Save Project</h3>
                <input 
                    type="text" 
                    placeholder="Enter project name..." 
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', color: 'white', borderRadius: '8px', marginBottom: '20px', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowSaveModal(false)} style={{ ...btnStyle, background: 'transparent', border: '1px solid #334155' }}>Cancel</button>
                    <button onClick={() => handleSave(true)} style={{ ...btnStyle, background: '#00d2d3', color: '#0f172a', fontWeight: 'bold' }}>Save</button>
                </div>
            </motion.div>
        </div>
      )}
    </div>
  );
};

// --- Reusable Styles ---
const btnStyle = { padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: '0.2s' };
const gateBtnStyle = { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', fontSize: '0.9rem', transition: '0.2s' };

// 👇 CRITICAL: This is what Vercel needs to build successfully
export default Simulator;