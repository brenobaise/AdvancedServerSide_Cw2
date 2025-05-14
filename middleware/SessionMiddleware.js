const validateSession = async (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: "Invalid User" });
  }
  next();
};

export default validateSession;
