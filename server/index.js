const express = require("express");
const winston = require('winston');
const app = express();

require("./startup/header")(app);
require("./startup/config")();
require("./startup/routes")(app);
app.enable('trust proxy')

var port = process.env.port || 30001;
app.listen(port, () => {
    console.log(`server port is running in ${port}`);
});
app.get('/', async(req, res) => {
    return res.status(200).send({ "ff": "hello" });
});

    console.log("ip : ")
const requestIp = require('request-ip');
app.use(requestIp.mw());
var useragent = require('express-useragent');
app.use(useragent.express());
const db = require("./startup/mysqlconnection");
app.get('/api/vv', async(req, res) => {
    const clientIp = requestIp.getClientIp(req); 
ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
        
    const chackTitle = await db.execute("select * from visitor where ip=? LIMIT 1", [clientIp]);
    if (chackTitle[0] != ""){
        const off = await db.execute("update visitor set visitNo=visitNo+1 where ip=? LIMIT 1", [clientIp]);
         
        return res.status(200).send({ "null": "null" });      }

    const sqlStatment =
        "INSERT INTO `tesfatube`.`visitor` (`ip`, `isMobile`, `isTablete`, `isDesktop`, `browser`, `version`, `os`, `platform`, `visitNo`) VALUES " +
        `(?,?,?,?,?,?,?,?,?)`;
    const postjob = await db.execute(sqlStatment, [ip, req.useragent.isMobile, req.useragent.isTablet
        , req.useragent.isDesktop, req.useragent.browser, req.useragent.version, req.useragent.os, req.useragent.platform,1]);
     
        return res.status(200).send({ "null": "null" });  
});
