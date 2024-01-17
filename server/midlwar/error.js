const winston = require("winston");
// require('winston-mongodb');

module.exports = function (err, req, res, next) {
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
    ],
  });
  logger.error(err.message, err);
  winston.error(err.message, err);
  res.status(500).send("Something failed.");
};
