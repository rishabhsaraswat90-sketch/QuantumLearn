const express = require('express');
const router = express.Router();
const QuantumCircuit = require('quantum-circuit');
const Circuit = require('../models/Circuit'); // Import Model
const fetchuser = require('../middleware/fetchuser'); // Import Middleware

// ROUTE 1: Run Simulation (Public - No login needed to just run)
router.post('/run', async (req, res) => {
    // ... (Keep your existing RUN logic here, same as before) ...
    // If you deleted it, paste the RUN logic from the previous step here.
    try {
        const { circuitData } = req.body;
        const numQubits = circuitData.length;
        const circuit = new QuantumCircuit(numQubits);
        circuitData.forEach((row, qubitIndex) => {
            row.forEach((gate, timeStep) => {
                if (gate && gate !== 'I') circuit.addGate(gate.toLowerCase(), timeStep, qubitIndex);
            });
        });
        circuit.run();
        const probabilities = circuit.probabilities();
        const results = probabilities.map((prob, i) => {
             const binary = i.toString(2).padStart(numQubits, '0');
             return { state: binary, probability: prob };
        }).filter(r => r.probability > 0);
        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, error: "Calculation Failed" });
    }
});

// ROUTE 2: Save Circuit (Login Required)
router.post('/save', fetchuser, async (req, res) => {
    try {
        const { title, circuitData } = req.body;

        // Create a new Circuit linked to the user
        const circuit = new Circuit({
            title,
            circuitData,
            user: req.user.id
        });

        const savedCircuit = await circuit.save();
        res.json(savedCircuit);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// ROUTE 3: Get All Saved Circuits (Login Required)
router.get('/fetchall', fetchuser, async (req, res) => {
    try {
        // Find circuits where 'user' matches the logged-in ID
        const circuits = await Circuit.find({ user: req.user.id });
        res.json(circuits);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// ROUTE 4: Delete a Circuit (DELETE /api/simulation/delete/:id)
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        let circuit = await Circuit.findById(req.params.id);
        if (!circuit) { return res.status(404).send("Not Found"); }

        // Verify ownership
        if (circuit.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        circuit = await Circuit.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Circuit has been deleted", circuit: circuit });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 5: Update a Circuit (PUT /api/simulation/update/:id)
router.put('/update/:id', fetchuser, async (req, res) => {
    try {
        const { title, circuitData } = req.body;
        
        const newCircuit = {};
        if (title) { newCircuit.title = title; }
        if (circuitData) { newCircuit.circuitData = circuitData; }

        let circuit = await Circuit.findById(req.params.id);
        if (!circuit) { return res.status(404).send("Not Found"); }

        if (circuit.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        circuit = await Circuit.findByIdAndUpdate(req.params.id, { $set: newCircuit }, { new: true });
        res.json({ circuit });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;