// Usage: authorize("admin") or authorize("doctor", "admin")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' not authorized.`,
      });
    }

    next();
  };
};

module.exports = { authorize };