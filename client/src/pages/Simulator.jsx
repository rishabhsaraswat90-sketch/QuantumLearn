import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom'; // Add these

const Simulator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 👇 NEW: Check if we received data from the Dashboard
  const [circuit, setCircuit] = useState(location.state?.circuitData || [[], []]); 
  const [circuitId, setCircuitId] = useState(location.state?.id || null); // Tracks if this is an existing project
  const [projectTitle, setProjectTitle] = useState(location.state?.title || ""); 

  const [results, setResults] = useState(null);     
  const [loading, setLoading] = useState(false);

  const addQubit = () => {
    if (circuit.length >= 5) {
        toast.error("Max 5 Qubits allowed in Demo Mode");
        return;
    }
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
        setResults(json.results);
        toast.success("Simulation Complete", { icon: '⚡' });
      } else {
        toast.error("Simulation Failed");
      }
    } catch (error) {
      toast.error("Server Connection Error");
    }
    setLoading(false);
  };

  // 👇 NEW: Save OR Update Logic
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Login to Save Circuits");
      return;
    }

    // If it's a new project, ask for a name. Otherwise, keep current name.
    let title = projectTitle;
    if (!circuitId) {
        title = prompt("Project Name:");
        if (!title) return; // User cancelled
        setProjectTitle(title);
    }

    try {
      // Determine URL and Method based on if we have an ID
      const url = circuitId 
        ? `https://quantumlearn-api.onrender.com/api/simulation/update/${circuitId}` 
        : `https://quantumlearn-api.onrender.com/api/simulation/save`;
      
      const method = circuitId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({ title, circuitData: circuit })
      });

      const json = await response.json();
      
      // If saving a new circuit, grab the new ID so future saves act as updates
      if (json._id || json.circuit) {
        if (!circuitId) setCircuitId(json._id); 
        toast.success(circuitId ? "Project Updated" : "Project Saved to Cloud ☁️");
      } else {
        toast.error("Save Failed");
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  return (
    <div style={{ padding: '120px 40px 40px 40px', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, background: 'linear-gradient(to right, #00d2d3, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {projectTitle ? `Editing: ${projectTitle}` : "Quantum Circuit Engine"}
        </h2>
        <div>
            <button onClick={addQubit} className="btn-neon" style={{ marginRight: '15px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid #444' }}>
                + Add Qubit
            </button>
            {/* 👇 Updated button to trigger handleSave */}
            <button onClick={handleSave} className="btn-neon" style={{ background: '#ffc107', color: 'black' }}>
                {circuitId ? "💾 Update Project" : "💾 Save New Project"}
            </button>
        </div>
      </div>

      {/* --- CIRCUIT CANVAS --- */}
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '20px', minHeight: '300px', overflowX: 'auto', marginBottom: '30px' }}>
        {circuit.map((qubitLine, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
            
            <div style={{ 
                width: '50px', height: '50px', borderRadius: '50%', 
                background: '#0f172a', border: '2px solid #00d2d3', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', color: '#00d2d3', zIndex: 2
            }}>
                q{index}
            </div>
            
            <div style={{ position: 'absolute', left: '50px', right: 0, top: '50%', height: '2px', background: 'rgba(255,255,255,0.2)', zIndex: 0 }}></div>

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', zIndex: 1, gap: '15px' }}>
              {qubitLine.map((gate, gIndex) => (
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} key={gIndex} 
                    style={{ 
                        width: '50px', height: '50px', background: 'rgba(0, 210, 211, 0.1)', border: '1px solid #00d2d3', color: '#00d2d3',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', borderRadius: '8px',
                        backdropFilter: 'blur(5px)', boxShadow: '0 0 15px rgba(0,210,211,0.2)'
                    }}
                >
                  {gate}
                </motion.div>
              ))}
              <div style={{ opacity: 0.5, transition: '0.3s', display: 'flex', gap: '5px' }} className="gate-options">
                 <button onClick={() => addGate(index, 'H')} style={miniBtn}>H</button>
                 <button onClick={() => addGate(index, 'X')} style={miniBtn}>X</button>
                 <button onClick={() => addGate(index, 'Z')} style={miniBtn}>Z</button>
                 {qubitLine.length > 0 && <button onClick={() => removeGate(index)} style={{...miniBtn, color: 'red', borderColor: 'red'}}>×</button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={runSimulation} 
            className="btn-neon" 
            style={{ padding: '15px 50px', fontSize: '1.2rem', boxShadow: '0 0 30px rgba(0,210,211,0.4)' }}
        >
          {loading ? "Computing Wavefunction..." : "▶ Run Simulation"}
        </motion.button>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ marginTop: '40px', padding: '30px', borderRadius: '15px' }}>
          <h3 style={{ color: '#aaa', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Probability Distribution</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '30px', alignItems: 'flex-end', height: '200px' }}>
            {results.map((res, i) => (
              <div key={i} style={{ textAlign: 'center', width: '60px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>{(res.probability * 100).toFixed(1)}%</div>
                <motion.div 
                    initial={{ height: 0 }} animate={{ height: `${res.probability * 100}%` }} transition={{ duration: 1, type: 'spring' }}
                    style={{ width: '100%', background: 'linear-gradient(to top, #00d2d3, #2e86de)', borderRadius: '5px 5px 0 0', boxShadow: '0 0 20px rgba(0,210,211,0.4)' }}
                />
                <div style={{ marginTop: '10px', color: '#aaa', fontFamily: 'monospace', fontSize: '1.2rem' }}>|{res.state}⟩</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const miniBtn = { background: 'transparent', border: '1px solid #555', color: '#aaa', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '5px' };

export default Simulator;