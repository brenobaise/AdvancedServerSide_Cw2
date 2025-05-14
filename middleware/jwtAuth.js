import { verifyToken } from '../config/jwt.js';

const authenticateJWT = (req, res, next) => {
    // Extract token from cookies
    let token = req.cookies ? req.cookies.jwt : null;

    // case where there is no token
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // decode and check
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    // Attach the decoded user info to the request object for later use
    req.user = decoded;
    next();
};

export default authenticateJWT;
