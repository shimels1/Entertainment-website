const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  var token = req.header("x-auth-token");
  if (!token) return res.status(401).send("token is not provided");

  try {
    token = jwt.verify(token, "pKey");
    req.user = token;
    next();
  } catch (err) {
    res.status(400).send("token is not valide");
  }
};
