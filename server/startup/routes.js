const error = require("../midlwar/error");
const user = require("../routes/Users");
const auth = require("../routes/auth");
const video = require("../routes/video");
const comment = require("../routes/comment");
const topVideo = require("../routes/topVideo");
const other = require("../routes/other");
var bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const path = require("path");
const helmet = require("helmet");

const fileStorage = multer.diskStorage({
  destination: (req, file, cd) =>
    cd(null, "/angularProjects/tesfaTubeBackend/images"),
  filename: (req, file, cd) => {
    date =
      new Date().getDate().toString() +
      new Date().getMonth().toString() +
      new Date().getFullYear().toString() +
      new Date().getTime().toString();
    cd(null, date + "-" + file.originalname);
  },
});

const multerFilter = (req, file, cb) => {
  if (
    path.extname(file.originalname) === ".png" ||
    path.extname(file.originalname) === ".jpg" ||
    path.extname(file.originalname) === ".jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// auth gurd is not specify for all routs (dont forgat bro)
module.exports = function (app) {
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use("/images", express.static("images"));
  app.use(
    multer({ storage: fileStorage, fileFilter: multerFilter }).single("image")
  );
  app.use("/api/user", user);
  app.use("/api/video", video);
  app.use("/api/auth", auth);
  app.use("/api/comment", comment);
  app.use("/api/topVideo", topVideo);
  app.use("/api/other", other);
  // app.use('/api/customer', customer);
  // app.use(error);
};
