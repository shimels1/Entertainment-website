const express = require("express");
const route = express.Router();
const db = require("../startup/mysqlconnection");
const Joi = require("joi");
const async = require("../midlwar/async");
const rateLimit = require("express-rate-limit");

route.get("/feedback", async (req, res) => {
  const feedback = await db.execute(
    "select * from feedback ORDER BY date DESC"
  );
  if (feedback[0] === null)
    return res.status(404).send("there is no feedback yet");
  return res.status(200).send(feedback[0]);
});

const createMessageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // start blocking after 5 requests
  message:
    "Too many Messages sent from this IP, please try again after an hour",
});
route.post(
  "/sendMessage",
  createMessageLimiter,
  async(async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const date = new Date();

    const { error } = validate(name, email, message);
    if (error) return res.send({ message: error.details[0].message });

    const sqlStatment =
      "INSERT INTO `tesfatube`.`messge` (`name`, `email`, `message`, `date`)VALUES (?,?,?,?)";
    const feedback = await db.execute(sqlStatment, [
      name,
      email,
      message,
      date,
    ]);
    return res.send({ message: true });
  })
);

route.get(
  "/getMessage/:page/:itemPerPage",
  async(async (req, res) => {
    let TOTAL_VIDEO_ITEM = await db.execute(
      `SELECT COUNT(idmessge) AS TOTAL_VIDEO_ITEM FROM messge`
    );
    TOTAL_VIDEO_ITEM = TOTAL_VIDEO_ITEM[0][0]["TOTAL_VIDEO_ITEM"];
    const page = +req.params.page || 1;
    let ITEM_PER_PAGE = +req.params.itemPerPage || 1;
    if (TOTAL_VIDEO_ITEM < ITEM_PER_PAGE) {
      ITEM_PER_PAGE = TOTAL_VIDEO_ITEM;
    }
    const skip = (page - 1) * ITEM_PER_PAGE;
    const message = await db.execute(
      `SELECT * FROM messge  ORDER BY date DESC limit ${skip},${ITEM_PER_PAGE} `
    );
    const response = {
      message: message[0],
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

function validate(name, email, message) {
  const schema = {
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(3).max(255).required().email(),
    message: Joi.string().min(3).required(),
  };
  return Joi.validate({ name: name, email: email, message: message }, schema);
}

module.exports = route;
