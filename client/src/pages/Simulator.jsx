import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Simulator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Logic State (Untouched) ---
  const [circuit, setCircuit] = useState(location.state?.circuitData || [[], []]); 
  const [circuitId, setCircuitId] = useState(location.state?.id || null); 
  const [projectTitle, setProjectTitle] = useState(location.state?.title || ""); 
  const [results, setResults] = useState(null);     
  const [loading, setLoading] = useState(false);

  const addQubit = () => {
    if (circuit.length >= 5) return toast.error("Max 5 Qubits allowed in Demo Mode");
    setCircuit([...circuit, []]);
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
        // Format data for Recharts
        const chartData = json.results.map(r => ({
            state: `|${r.state}⟩`,
            probability: parseFloat((r.probability * 100).toFixed(2))
        }));
        setResults(chartData);
        toast.success("Simulation Complete", { icon: '⚡' });
      } else toast.error("Simulation Failed");
    } catch (error) {
      toast.error("Server Connection Error");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Login to Save Circuits");

    let title = projectTitle;
    if (!circuitId) {
        title = prompt("Project Name:");
        if (!title) return; 
        setProjectTitle(title);
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

  // --- Custom Tooltip for the Chart ---
  const CustomTooltip = ({ active, payload, label }) => {
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
      <div className="glass-panel" style={{ padding: '20px 30px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
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
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} style={{ ...btnStyle, background: '#00d2d3', color: '#0f172a', fontWeight: 'bold' }}>
                {circuitId ? "💾 Update Project" : "💾 Save Project"}
            </motion.button>
        </div>
      </div>

      {/* Circuit Canvas */}
      <div className="glass-panel" style={{ padding: '40px 20px', borderRadius: '15px', overflowX: 'auto', marginBottom: '30px', minHeight: '300px' }}>
        {circuit.map((qubitLine, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '35px', position: 'relative' }}>
            
            {/* Qubit Node */}
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#0f172a', border: '2px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#94a3b8', zIndex: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                |q{index}⟩
            </div>
            
            {/* Quantum Wire */}
            <div style={{ position: 'absolute', left: '60px', right: '20px', top: '50%', height: '2px', background: '#334155', zIndex: 0 }}></div>

            {/* Gates */}
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

              {/* Action Toolbar for this Qubit */}
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '5px', borderRadius: '8px', border: '1px solid #334155' }}>
                 <button onClick={() => addGate(index, 'H')} style={gateBtnStyle}>H</button>
                 <button onClick={() => addGate(index, 'X')} style={gateBtnStyle}>X</button>
                 <button onClick={() => addGate(index, 'Z')} style={gateBtnStyle}>Z</button>
                 {qubitLine.length > 0 && <button onClick={() => removeGate(index)} style={{...gateBtnStyle, color: '#ff4757', borderColor: 'rgba(255, 71, 87, 0.3)'}}>⌫</button>}
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

      {/* Professional Results Visualization */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '40px', borderRadius: '15px' }}>
          <div style={{ marginBottom: '30px', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#f8fafc' }}>Measurement Probabilities</h3>
            <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Ideal simulation results (shots = ∞)</p>
          </div>
          
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <XAxis dataKey="state" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} dy={10} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `${val}%`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="probability" radius={[4, 4, 0, 0]} animationDuration={1500}>
                        {results.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.probability > 0 ? '#00d2d3' : '#334155'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Reusable inline styles
const btnStyle = { padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: '0.2s' };
const gateBtnStyle = { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', fontSize: '0.9rem', transition: '0.2s' };

export default Simulator;