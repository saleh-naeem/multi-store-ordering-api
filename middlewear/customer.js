const customer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json("not authorized");
  }

  if (req.user.role !== "customer") {
    return res.status(403).json("customer only");
  }

  next();
};

module.exports = customer;