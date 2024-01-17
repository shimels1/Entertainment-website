const express = require("express");
const Joy = require("joi");
const db = require("../startup/mysqlconnection");
const route = express.Router();

const asyncMidlware = require("../midlwar/async");
var fetchVideoInfo = require("youtube-info");

route.get(
  "/category/:cat/:page/:itemPerPage/:passVideoId",
  asyncMidlware(async (req, res) => {
    let passVideoId = req.params.passVideoId;

    let TOTAL_VIDEO_ITEM = await db.execute(
      `SELECT COUNT(idvideo) AS TOTAL_VIDEO_ITEM FROM video 
    where status='on' && category=? && idvideo!=?`,
      [req.params.cat, passVideoId]
    );
    TOTAL_VIDEO_ITEM = TOTAL_VIDEO_ITEM[0][0]["TOTAL_VIDEO_ITEM"];

    const page = +req.params.page || 1;
    let ITEM_PER_PAGE = +req.params.itemPerPage || 1;
    if (TOTAL_VIDEO_ITEM < ITEM_PER_PAGE) {
      ITEM_PER_PAGE = TOTAL_VIDEO_ITEM;
    }
    const skip = (page - 1) * ITEM_PER_PAGE;
    const video = await db.execute(
      `SELECT * FROM video  where status='on' && category=? && idvideo!=? 
        ORDER BY date DESC limit ${skip},${ITEM_PER_PAGE} `,
      [req.params.cat, passVideoId]
    );

    const response = {
      video: video[0],
      currentPage: page,
      totalVideo: TOTAL_VIDEO_ITEM,
      hasNextPage: ITEM_PER_PAGE * page < TOTAL_VIDEO_ITEM,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(TOTAL_VIDEO_ITEM / ITEM_PER_PAGE),
    };
    return res.status(200).send(response);
  })
);

route.get(
  "/countCategory/:cat",
  asyncMidlware(async (req, res) => {
    let TOTAL_VIDEO_ITEM = await db.execute(
      `SELECT COUNT(idvideo) AS TOTAL_VIDEO_ITEM FROM video 
    where status='on' && category=? `,
      [req.params.cat]
    );
    TOTAL_VIDEO_ITEM = TOTAL_VIDEO_ITEM[0][0]["TOTAL_VIDEO_ITEM"];

    return res.status(200).send({ result: TOTAL_VIDEO_ITEM });
  })
);
route.get(
  "/countCategoryEP",
  asyncMidlware(async (req, res) => {
    let TOTAL_VIDEO_ITEM = await db.execute(
      `SELECT COUNT(idvideo) AS TOTAL_VIDEO_ITEM FROM video 
    where status='on' && isEditorialPick='true' `,
      []
    );
    TOTAL_VIDEO_ITEM = TOTAL_VIDEO_ITEM[0][0]["TOTAL_VIDEO_ITEM"];

    return res.status(200).send({ result: TOTAL_VIDEO_ITEM });
  })
);

route.get(
  "/getEditorialPike/:page/:itemPerPage/:passVideoId",
  asyncMidlware(async (req, res) => {
    let passVideoId = req.params.passVideoId;

    let TOTAL_VIDEO_ITEM = await db.execute(
      `SELECT COUNT(idvideo) AS TOTAL_VIDEO_ITEM FROM video 
    where status='on' &&  idvideo!=? && isEditorialPick='true'`,
      [passVideoId]
    );
    TOTAL_VIDEO_ITEM = TOTAL_VIDEO_ITEM[0][0]["TOTAL_VIDEO_ITEM"];

    const page = +req.params.page || 1;
    let ITEM_PER_PAGE = +req.params.itemPerPage || 1;
    if (TOTAL_VIDEO_ITEM < ITEM_PER_PAGE) {
      ITEM_PER_PAGE = TOTAL_VIDEO_ITEM;
    }
    const skip = (page - 1) * ITEM_PER_PAGE;
    const video = await db.execute(
      `SELECT * FROM video  where status='on'  && idvideo!=? && isEditorialPick='true'
        ORDER BY date DESC limit ${skip},${ITEM_PER_PAGE} `,
      [passVideoId]
    );

    const response = {
      video: video[0],
      currentPage: page,
      totalVideo: TOTAL_VIDEO_ITEM,
      hasNextPage: ITEM_PER_PAGE * page < TOTAL_VIDEO_ITEM,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(TOTAL_VIDEO_ITEM / ITEM_PER_PAGE),
    };
    return res.status(200).send(response);
  })
);

route.get("/adminGetAllVideo/:page/:itemPerPage", async (req, res) => {
  let TOTAL_VIDEO_ITEM = await db.execute(
    `SELECT COUNT(idvideo) AS TOTAL_VIDEO_ITEM FROM video`
  );
  TOTAL_VIDEO_ITEM = TOTAL_VIDEO_ITEM[0][0]["TOTAL_VIDEO_ITEM"];
  const page = +req.params.page || 1;
  let ITEM_PER_PAGE = +req.params.itemPerPage || 1;
  if (TOTAL_VIDEO_ITEM < ITEM_PER_PAGE) {
    ITEM_PER_PAGE = TOTAL_VIDEO_ITEM;
  }
  const skip = (page - 1) * ITEM_PER_PAGE;
  const video = await db.execute(
    `SELECT * FROM video  ORDER BY date DESC limit ${skip},${ITEM_PER_PAGE} `
  );
  const response = {
    video: video[0],
    currentPage: page,
    totalVideo: TOTAL_VIDEO_ITEM,
    hasNextPage: ITEM_PER_PAGE * page < TOTAL_VIDEO_ITEM,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(TOTAL_VIDEO_ITEM / ITEM_PER_PAGE),
  };
  return res.status(200).send(response);
});

route.get("/getVideoInformation/:id", async (req, res) => {
  const id = req.params.id;
  var data = "";
  try {
    await fetchVideoInfo(id).then(function (videoInfo) {
      data = videoInfo;
    });
  } catch (err) {}

  return res.status(200).send({ info: data });
});

route.get("/getAll", async (req, res) => {
  const video = await db.execute(
    " SELECT * FROM `video` where status='on' ORDER BY 'date' ASC "
  );
  // pool.releaseConnection(db);
  return res.status(200).send(video[0]);
});

route.get("/getOne/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.send({ error: "Video id is invalid." });
  const video = await db.execute(
    " SELECT * FROM `video` where status='on' && idvideo=? limit 1",
    [id]
  );
  if (!video[0][0])
    return res.send({ error: "video is not found in the given id" });
  return res.status(200).send(video[0][0]);
});

route.get("/adminGetAll", async (req, res) => {
  const video = await db.execute(" SELECT * FROM `video` ORDER BY 'date' ASC ");
  return res.status(200).send(video[0]);
});

// update video discription

route.put("/updateDiscription/", async (req, res) => {
  const discription = req.body.discription;
  const vid = req.body.vid;
  const video = await db.execute(
    `SELECT * FROM video where idvideo=? LIMIT 1`,
    [vid]
  );
  if (video[0] == "") return res.send({ message: "video id is not found" });

  const on = await db.execute(
    "update video set discription=? where idvideo=? LIMIT 1",
    [discription, vid]
  );
  return res.status(200).send({ message: "true" });
});

// new post

route.post("/post/", async (req, res) => {
  const title = req.body.title;
  const catagory = req.body.catagory;
  const date = new Date();
  const discription = req.body.discription;
  const uid = req.body.uid;

  const vid = req.body.vid;
  var data = "";
  try {
    await fetchVideoInfo(vid).then(function (videoInfo) {
      data = videoInfo;
    });
  } catch (err) {
    console.log("error fatching the id");
  }
  if (!(title || catagory || discription || uid))
    return res.send({ message: "some field is not legal." });

  const chackTitle = await db.execute(
    "select * from video where title=? LIMIT 1",
    [title]
  );
  if (chackTitle[0] != "")
    return res.send({ message: "title is aleredy exist." });

  const sqlStatment =
    "INSERT INTO `video` (`title`, `date`, `category`, `discription`, `url`, `status`,`image`, `uid`) VALUES " +
    `(?,?,?,?,?,?,?,?)`;
  const postjob = await db.execute(sqlStatment, [
    title,
    date,
    catagory,
    discription,
    "null",
    "on",
    data.thumbnailUrl,
    uid,
  ]);
  return res.status(200).send({ message: "true" });
});

////////////delete
route.delete("/delete/:id", async (req, res) => {
  const video = await db.execute(
    `SELECT * FROM video where idvideo=? LIMIT 1`,
    [req.params.id]
  );
  if (video[0] == "") return res.send({ message: "video id is not found" });

  var gen = await db.execute(`delete from video where idvideo=? LIMIT 1`, [
    req.params.id,
  ]);
  var gen = await db.execute(`delete from videolike where videoid=? LIMIT 1`, [
    req.params.id,
  ]);
  var gen = await db.execute(`delete from videodislike where vid=? LIMIT 1`, [
    req.params.id,
  ]);
  var gen = await db.execute(`delete from comment where videoid=? LIMIT 1`, [
    req.params.id,
  ]);
  return res.send({ message: "video delete success" });
});

////////change status
route.put("/changeStatus/:id", async (req, res) => {
  const video = await db.execute(
    "select * from video where idvideo=? LIMIT 1",
    [req.params.id]
  );
  if (video[0] == "")
    return res.status(200).send({ message: "there is no video in this id" });
  if (video[0][0]["status"] == "on") {
    const off = await db.execute(
      "update video set status='off' where idvideo=? LIMIT 1",
      [req.params.id]
    );
    return res.status(200).send({ message: "video is deactivated" });
  } else {
    const on = await db.execute(
      "update video set status='on' where idvideo=? LIMIT 1",
      [req.params.id]
    );
    return res.status(200).send({ message: "video is activated" });
  }
});

////////editorial pick switcher
route.put("/editorialPickSwitcher/:id", async (req, res) => {
  const video = await db.execute(
    "select * from video where idvideo=? LIMIT 1",
    [req.params.id]
  );
  if (video[0] == "")
    return res.status(200).send({ message: "there is no video in this id" });
  if (video[0][0]["isEditorialPick"] == "true") {
    const off = await db.execute(
      "update video set isEditorialPick='false' where idvideo=? LIMIT 1",
      [req.params.id]
    );
    return res.status(200).send({ message: "false" });
  } else {
    const on = await db.execute(
      "update video set isEditorialPick='true' where idvideo=? LIMIT 1",
      [req.params.id]
    );
    return res.status(200).send({ message: "true" });
  }
});

//////// like video
route.post("/like/:vid/:email", async (req, res) => {
  var video = await db.execute("select * from user where email=? LIMIT 1", [
    req.params.email,
  ]);
  if (video[0] == "")
    return res.status(200).send({ message: "there is no user in this email" });

  var video = await db.execute("select * from video where idvideo=? LIMIT 1", [
    req.params.vid,
  ]);
  if (video[0] == "")
    return res.status(200).send({ message: "there is no video in this id" });

  var video = await db.execute(
    "select * from videolike where videoid=?  and email=? LIMIT 1",
    [req.params.vid, req.params.email]
  );
  if (video[0] != "") {
    var gen = await db.execute(
      `delete from videolike where  videoid=?  and email=? LIMIT 1`,
      [req.params.vid, req.params.email]
    );
    return res.status(200).send({ message: "true" });
  }
  var video = await db.execute(
    "select * from videodislike where vid=?  and email=? LIMIT 1",
    [req.params.vid, req.params.email]
  );
  if (video[0] != "") {
    var gen = await db.execute(
      `delete from videodislike where  vid=?  and email=? LIMIT 1`,
      [req.params.vid, req.params.email]
    );
  }
  var sqlStatment =
    "INSERT INTO `tesfatube`.`videolike` ( `email`, `videoid`) VALUES " +
    `(?,?)`;
  var likeVideo = await db.execute(sqlStatment, [
    req.params.email,
    req.params.vid,
  ]);
  return res.status(200).send({ message: "true" });
});

//////// dislike video
route.post("/dislike/:vid/:email", async (req, res) => {
  var video = await db.execute("select * from user where email=? LIMIT 1", [
    req.params.email,
  ]);
  if (video[0] == "")
    return res.status(200).send({ message: "there is no user in this id" });

  var video = await db.execute("select * from video where idvideo=? LIMIT 1", [
    req.params.vid,
  ]);
  if (video[0] == "")
    return res.status(200).send({ message: "there is no video in this id" });

  var video = await db.execute(
    "select * from videodislike where vid=?  and email=? LIMIT 1",
    [req.params.vid, req.params.email]
  );
  if (video[0] != "") {
    var gen = await db.execute(
      `delete from videodislike where  vid=?  and email=? LIMIT 1`,
      [req.params.vid, req.params.email]
    );
    return res.status(200).send({ message: "true" });
  }
  var video = await db.execute(
    "select * from videolike where videoid=?  and email=? LIMIT 1",
    [req.params.vid, req.params.email]
  );
  if (video[0] != "") {
    var gen = await db.execute(
      `delete from videolike where  videoid=?  and email=? LIMIT 1`,
      [req.params.vid, req.params.email]
    );
  }
  var sqlStatment =
    "INSERT INTO `videodislike` ( `email`, `vid`) VALUES " + `(?,?)`;
  var likeVideo = await db.execute(sqlStatment, [
    req.params.email,
    req.params.vid,
  ]);
  return res.status(200).send({ message: "true" });
});

//////// count like video
route.get("/like/:vid/:email", async (req, res) => {
  userLike = false;

  if (req.params.email) {
    let haveOne = await db.execute(
      `SELECT COUNT(videoid) AS TOTAL_VIDEO_ITEM FROM videolike where videoid=? && email=?`,
      [req.params.vid, req.params.email]
    );
    if (haveOne[0][0]["TOTAL_VIDEO_ITEM"] != "") {
      userLike = true;
    }
  }
  var video = await db.execute("select * from video where idvideo=? LIMIT 1", [
    req.params.vid,
  ]);
  if (video[0] == "")
    return res.status(200).send({ message: "there is no video in this id" });

  let TOTAL_VIDEO_ITEM = await db.execute(
    `SELECT COUNT(videoid) AS TOTAL_VIDEO_ITEM FROM videolike where videoid=?`,
    [req.params.vid]
  );
  TOTAL_VIDEO_ITEM = TOTAL_VIDEO_ITEM[0][0]["TOTAL_VIDEO_ITEM"];

  return res.status(200).send({ like: TOTAL_VIDEO_ITEM, userLike: userLike });
});

//////// count dislike video
route.get("/dislike/:vid/:email", async (req, res) => {
  userDisLike = false;

  if (req.params.email) {
    let haveOne = await db.execute(
      `SELECT COUNT(vid) AS TOTAL_VIDEO_ITEM FROM videodislike where vid=? && email=?`,
      [req.params.vid, req.params.email]
    );
    if (haveOne[0][0]["TOTAL_VIDEO_ITEM"] != "") {
      userDisLike = true;
    }
  }
  var video = await db.execute("select * from video where idvideo=? LIMIT 1", [
    req.params.vid,
  ]);
  if (video[0] == "")
    return res.status(200).send({ message: "there is no video in this id" });

  let TOTAL_VIDEO_ITEM = await db.execute(
    `SELECT COUNT(idvideodislike) AS TOTAL_VIDEO_ITEM FROM videodislike where vid=?`,
    [req.params.vid]
  );
  TOTAL_VIDEO_ITEM = TOTAL_VIDEO_ITEM[0][0]["TOTAL_VIDEO_ITEM"];
  return res
    .status(200)
    .send({ like: TOTAL_VIDEO_ITEM, userDisLike: userDisLike });
});

function validate(title, url) {
  const schema = {
    title: Joy.string().min(6).max(255).required(),
  };
  return Joy.validate({ title: title }, schema);
}
module.exports = route;
