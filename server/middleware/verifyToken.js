const jwt = require('jsonwebtoken');
const userModel = require('../model/dbStructure');

// Function to verify tokens
const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return reject({ status: 401, message: 'Token expired' });
                }
                return reject({ status: 401, message: 'Invalid token' });
            }
            resolve(decoded);
        });
    });
};

// Middleware to check if the user is an admin
module.exports.isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split('')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access token not provided' });
        }

        // Verify access token
        const decoded = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: 'Unauthorized: Invalid or expired access token' });
        }

        // Fetch user from database
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: User is not an admin' });
        }

        req.user = user;
        return next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error.message);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
};
