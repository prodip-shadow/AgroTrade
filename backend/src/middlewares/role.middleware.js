// Middleware to restrict route access based on user role(s)
const allowRoles = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map((role) => String(role).toLowerCase());

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const userRole = String(req.user.role).toLowerCase();

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: Insufficient role permissions.',
      });
    }

    next();
  };
};

module.exports = {
  allowRoles,
};
