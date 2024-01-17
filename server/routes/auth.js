const express = require("express");
const bcryptjs = require("bcryptjs");
const db = require("../startup/mysqlconnection");
const route = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const b = require("bcryptjs");
const rateLimit = require("express-rate-limit");

route.post("/login", async (req, res) => {
  const fname = req.body.fname;
  var lname = req.body.lname;
  var name = req.body.name;
  var email = req.body.email;
  var photoUrl = req.body.photoUrl;

  try {
    const user = await db.execute("select * from user where email=? limit 1", [
      email,
    ]);

    if (user[0] != "") {
      let user2 = {
        fname: user[0][0].fname,
        lname: user[0][0].lname,
        email: user[0][0].email,
        photourl: user[0][0].photoUrl,
      };
      let sign = jsonwebtoken.sign(user2, "pKey", { expiresIn: "200d" });
      return res.send({ token: sign });
      // return res.header("x-auth-token", sign).send(user2);
    } else {
      const sqlStatment =
        "INSERT INTO `tesfatube`.`user` (`fname`, `lname`, `name`, `email`, `photoUrl`) VALUES  (?,?,?,?,?)";
      const insertCustomer = await db.execute(sqlStatment, [
        fname,
        lname,
        name,
        email,
        photoUrl,
      ]);
      let user2 = {
        fname: fname,
        lname: lname,
        email: email,
        photourl: photoUrl,
      };
      let sign = jsonwebtoken.sign(user2, "pKey", { expiresIn: "200d" });
      return res.send({ token: sign });
      // return res.header("x-auth-token", sign).send(user2);
    }
  } catch (err) {
    console.log(err);
    return res.send("something error");
  }
});

const createStaffLogLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 30, // start blocking after 5 requests
  message: "Too many Login sent from this IP, please try again after an hour",
});

route.post("/staffLogin", createStaffLogLimiter, async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  try {
    const user = await db.execute(
      "select * from staff where email=?  limit 1",
      [email]
    );
    if (user[0] != "") {
      let comp = await b.compare(password, user[0][0].password);
      if (!comp) return res.send({ error: `email or password is not correct` });
      let user2 = {
        fname: user[0][0].fname,
        lname: user[0][0].lname,
        userName: user[0][0].userName,
        email: user[0][0].email,
        phone: user[0][0].phone,
        role: user[0][0].role,
      };
      let sign = jsonwebtoken.sign(user2, "pKey", { expiresIn: "200d" });
      return res.send({ token: sign });
      // return res.header("x-auth-token", sign).send(user2);
    } else {
      return res.send({ error: "user name or password is not working!" });
    }
  } catch (err) {
    console.log(err);
    return res.send({ error: "something error" });
  }
});

module.exports = route;
