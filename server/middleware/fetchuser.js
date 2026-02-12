const jwt = require('jsonwebtoken');
const JWT_SECRET = 'QuantumSecretKey2026'; // Must match your auth.js key

const fetchuser = (req, res, next) => {
    // 1. Get the token from the header
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Access Denied. No Token." });
    }

    try {
        // 2. Verify the token
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next(); // Allow the request to continue
    } catch (error) {
        res.status(401).send({ error: "Invalid Token" });
    }
}

module.exports = fetchuser;