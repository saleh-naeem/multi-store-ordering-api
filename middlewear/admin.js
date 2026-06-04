const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json("not authorized");
  }

  if (req.user.role !== "admin") {
    return res.status(403).json("admin only");
  }

  next();
};

module.exports = admin;