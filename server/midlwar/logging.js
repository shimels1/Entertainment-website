function logging(req, res, next) {
  res.send("logging");
  next();
}

module.exports = logging;
