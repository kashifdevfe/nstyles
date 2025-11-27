import jwt from 'jsonwebtoken';

// Helper function to get authenticated user from token
export const getUser = (token) => {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Middleware to authenticate requests
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || '';
    
    const user = getUser(token);
    if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    req.user = user;
    next();
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
    }
    next();
};

