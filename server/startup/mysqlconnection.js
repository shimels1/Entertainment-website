const sql = require("mysql2");
const con = sql
  .createPool({
    host: "localhost",
    user: "root",
    database: "tesfa",
    password: "1234"
  })
  .promise();
module.exports = con;
