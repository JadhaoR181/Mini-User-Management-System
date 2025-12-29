const { verifyToken } = require('../utils/auth');

//JWT token authentication middleware
const authenticateToken = (req, res, next) => {
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.'
            });
        }

        const decoded = verifyToken(token);

        if(!decoded) {
            return res.status(403).json({
                success: false,
                error: 'Invalid or expired token.'
            });
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error during authentication'
        });
    }
};

//user role-based authorization middleware
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        try{
            if(!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated.'
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied. Insufficient permissions.'
                });
            }

            next();
        }
        catch (error) {
            console.error('Authorization error: ', error);
            return res.status(500).json({
                success: false,
                error: 'Server error during authorization'
            });
        }
    };
};

module.exports = {
    authenticateToken,
    authorizeRole
};