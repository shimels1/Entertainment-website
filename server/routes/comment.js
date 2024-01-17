const express = require("express");
const Joi = require("joi");
const db = require("../startup/mysqlconnection");
const route = express.Router();
const rateLimit = require("express-rate-limit");

route.get("/getComment/:vid/:filter/:page/:itemPerPage", async (req, res) => {
  if (req.params.filter != "ASC" && req.params.filter != "DESC")
    return res
      .status(200)
      .send({
        message: `there is error in filtering ${
          req.params.filter != "ASC"
        } , req.params.filter != "DESC"`,
      });

  let TOTAL_VIDEO_ITEM = await db.execute(
    `SELECT COUNT(videoId) AS TOTAL_VIDEO_ITEM FROM comment where videoId=?`,
    [req.params.vid]
  );
  TOTAL_VIDEO_ITEM = TOTAL_VIDEO_ITEM[0][0]["TOTAL_VIDEO_ITEM"];

  const page = +req.params.page || 1;
  let ITEM_PER_PAGE = +req.params.itemPerPage || 1;
  if (TOTAL_VIDEO_ITEM < ITEM_PER_PAGE) {
    ITEM_PER_PAGE = TOTAL_VIDEO_ITEM;
  }
  const skip = (page - 1) * ITEM_PER_PAGE;
  const comment = await db.execute(
    `SELECT * FROM comment where videoId=? ORDER BY date ${req.params.filter} limit ${skip},${ITEM_PER_PAGE}`,
    [req.params.vid]
  );
  if (comment[0] == "")
    return res.status(200).send({ message: "there is no comment yet..." });

  const response = {
    comment: comment[0],
    currentPage: page,
    totalComment: TOTAL_VIDEO_ITEM,
    hasNextPage: ITEM_PER_PAGE * page < TOTAL_VIDEO_ITEM,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(TOTAL_VIDEO_ITEM / ITEM_PER_PAGE),
  };
  return res.status(200).send(response);
});
route.get("/getReComment/:vid", async (req, res) => {
  const comment = await db.execute(
    "SELECT * FROM `recomment` where commentId=? ORDER BY date desc ",
    [req.params.vid]
  );
  if (comment[0] == "")
    return res.status(200).send({ message: "there is no comment yet..." });
  return res.status(200).send(comment[0]);
});

const createMessageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 20, // start blocking after 5 requests
  message:
    "Too many comments sent from this IP, please try again after an hour",
});

route.post("/postComment/", createMessageLimiter, async (req, res) => {
  const videoid = req.body.videoid;
  const email = req.body.email;
  const date = new Date();
  const comment = req.body.comment;

  const { error } = validateComment(email, videoid, comment);
  if (error) return res.send(error.details[0].message);

  const sqlStatment =
    "INSERT INTO `tesfatube`.`comment` (`videoid`, `email`, `comment`, `date`) VALUES " +
    `(?,?,?,?)`;
  const comment2 = await db.execute(sqlStatment, [
    videoid,
    email,
    comment,
    date,
  ]);
  return res.send({ message: "comment posted success." });
});

route.post("/postReComment/", async (req, res) => {
  const videoid = req.body.videoid;
  const email = req.body.email;
  const date = new Date();
  const comment = req.body.comment;

  const { error } = validateComment(email, videoid, comment);
  if (error) return res.send(error.details[0].message);

  if (!(email && videoid && comment))
    return res.send("there is null value in the list.");

  const sqlStatment =
    "INSERT INTO `tesfatube`.`recomment` (`videoid`, `email`, `comment`, `date`) VALUES " +
    `(?,?,?,?)`;
  const comment2 = await db.execute(sqlStatment, [
    videoid,
    email,
    comment,
    date,
  ]);
  return res.send("ReComment posted success.");
});

////////////delete comment
route.delete("/deleteComment/:id", async (req, res) => {
  const comment = await db.execute(
    `SELECT * FROM comment where idcomment=${req.params.id} LIMIT 1`
  );
  if (comment[0] == "") return res.send("comment id is not found");
  S;
  var gen = await db.execute(
    `delete from comment where idcomment=${req.params.id} LIMIT 1`
  );
  return res.send("comment delete succes");
});
////////////delete re comment
route.delete("/deleteReComment/:id", async (req, res) => {
  const recomment = await db.execute(
    `SELECT * FROM recomment where idrecomment=${req.params.id} LIMIT 1`
  );
  if (recomment[0] == "") return res.send("recomment id is not found");

  var gen = await db.execute(
    `delete from recomment where idrecomment=${req.params.id} LIMIT 1`
  );
  return res.send("recomment delete succes");
});

////////like comment
route.post("/like/:cid/:email", async (req, res) => {
  /////////user id must be get from header
  try {
    var video = await db.execute("select * from user where email=? LIMIT 1", [
      req.params.email,
    ]);
    if (video[0] == "")
      return res
        .status(200)
        .send({ message: "there is no user in this email" });

    var video = await db.execute(
      "select * from comment where idcomment=? LIMIT 1",
      [req.params.cid]
    );
    if (video[0] == "")
      return res
        .status(200)
        .send({ message: "there is no comment in this id" });

    var video = await db.execute(
      "select * from commentlike where cid=?  and email=? LIMIT 1",
      [req.params.cid, req.params.email]
    );
    if (video[0] != "") {
      var gen = await db.execute(
        `delete from commentlike where  cid=?  and email=? LIMIT 1`,
        [req.params.cid, req.params.email]
      );
      return res.status(200).send({ message: "true" });
    }
    var sqlStatment =
      "INSERT INTO `tesfatube`.`commentlike` ( `email`, `cid`) VALUES " +
      `(?,?)`;
    var likeVideo = await db.execute(sqlStatment, [
      req.params.email,
      req.params.cid,
    ]);
    return res.status(200).send({ message: "true" });
  } catch (err) {
    console.log(err);
  }
});
////////like recomment
route.put("/likeReComment/:id", async (req, res) => {
  try {
    const comment = await db.execute(
      "select * from recomment where idrecomment=? LIMIT 1",
      [req.params.id]
    );
    if (comment[0] == "")
      return res.status(404).send("there is no recomment in this id");
    var like = comment[0][0]["like"] + 1;
    const off = await db.execute(
      "UPDATE `tesfatube`.`recomment` SET `like` = ? WHERE (`idrecomment` = ?)",
      [like, req.params.id]
    );
    return res.status(200).send(`liked success ${like}`);
  } catch (err) {
    console.log(err);
  }
});

// ////////////count comment
route.get("/count/:vid", async (req, res) => {
  const comment = await db.execute("SELECT * FROM `comment` where videoId=? ", [
    req.params.vid,
  ]);
  if (comment[0] == "")
    return res.status(200).send({ message: "there is no comment yet..." });
  // console.log(comment[0][0]).like;

  let TOTAL_COMMENT_ITEM = await db.execute(
    `SELECT COUNT(idcomment) AS TOTAL_COMMENT_ITEM FROM comment where videoid=? `,
    [req.params.vid]
  );
  TOTAL_COMMENT_ITEM = TOTAL_COMMENT_ITEM[0][0]["TOTAL_COMMENT_ITEM"];

  return res.status(200).send({ numOfComment: TOTAL_COMMENT_ITEM });
});

//////// like video
route.get("/countlike/:cid/:email", async (req, res) => {
  userLike = false;
  if (req.params.email) {
    let haveOne = await db.execute(
      `SELECT COUNT(cid) AS TOTAL_VIDEO_ITEM FROM commentlike where cid=? && email=?`,
      [req.params.cid, req.params.email]
    );
    if (haveOne[0][0]["TOTAL_VIDEO_ITEM"] != "") {
      userLike = true;
    }
  }

  var video = await db.execute(
    "select * from comment where idcomment=? LIMIT 1",
    [req.params.cid]
  );
  if (video[0] == "")
    return res.status(200).send({ message: "there is no comment in this id" });

  let TOTAL_VIDEO_ITEM = await db.execute(
    `SELECT COUNT(idcommentlike) AS TOTAL_VIDEO_ITEM FROM commentlike where cid=?`,
    [req.params.cid]
  );
  TOTAL_VIDEO_ITEM = TOTAL_VIDEO_ITEM[0][0]["TOTAL_VIDEO_ITEM"];

  return res.status(200).send({ like: TOTAL_VIDEO_ITEM, userLike: userLike });
});

// function validate(title, url) {
//     const schema = {
//         title: Joi.string().min(6).max(255).required(),
//         url: Joy.string().min(6).max(1000).required(),
//     }
//     return Joi.validate({ title: title, url: url }, schema);
// }

function validateComment(email, videoid, comment) {
  const schema = {
    email: Joi.string().email().min(6).max(155).required(),
    videoid: Joi.string().max(155).required(),
    comment: Joi.string().min(3).max(3000).required(),
  };
  return Joi.validate(
    { email: email, videoid: videoid, comment: comment },
    schema
  );
}
module.exports = route;
