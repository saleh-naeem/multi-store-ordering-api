const store = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json("not authorized");
  }

  if (req.user.role !== "store") {
    return res.status(403).json("store only");
  }

  next();
};

module.exports = store;