const express = require("express");
const Joi = require("joi");
const db = require("../startup/mysqlconnection");
const route = express.Router();

route.get("/getAllEditorialPick", async (req, res) => {
  const video = await db.execute("SELECT * FROM `editorialpick`");
  if (video[0] == "") return res.status(200).send("there is no video yet..");
  return res.status(200).send(video[0]);
});

route.post("/postVideo/", async (req, res) => {
  const videoId = req.body.videoId;
  const userId = req.body.userId;

  if (!(userId && videoId)) return res.send("there is null value in the list.");

  const video2 = await db.execute(
    "SELECT * FROM `editorialpick` where videoid=?",
    [videoId]
  );
  if (video2[0] != "")
    return res.status(200).send("this video is alredy in the list.");

  const sqlStatment =
    "INSERT INTO `tesfatube`.`editorialpick` ( `videoid`, `uid`) VALUES  " +
    `(?,?)`;
  const video = await db.execute(sqlStatment, [videoId, userId]);
  res.send("video posted success.");
});

////////////delete video
route.delete("/delete/:id", async (req, res) => {
  const video = await db.execute(
    `SELECT * FROM editorialpick where ideditorialPick=? LIMIT 1`,
    [req.params.id]
  );
  if (video[0] == "") return res.send("video in this id is not found");
  var gen = await db.execute(
    `delete from editorialpick where ideditorialPick=${req.params.id} LIMIT 1`
  );
  res.send("video delete succes");
});

function validate(title, url) {
  const schema = {
    title: Joi.string().min(6).max(255).required(),
    url: Joy.string().min(6).max(1000).required(),
  };
  return Joi.validate({ title: title, url: url }, schema);
}
module.exports = route;
