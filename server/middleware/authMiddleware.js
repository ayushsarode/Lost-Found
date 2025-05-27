const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');
  
  console.log('Auth middleware - received token:', token);

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Extract token from "Bearer <token>" format
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    console.log('Extracted token:', actualToken);

    // Verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};