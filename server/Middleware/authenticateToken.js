const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied: No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Access Denied: Token expired.' });
      }
      return res.status(403).json({ success: false, message: 'Access Denied: Invalid token.' });
    }
    req.user = user; // Attach user payload (id, role) to request
    next();
  });
};
