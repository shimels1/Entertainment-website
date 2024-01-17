const express = require("express");
const bcryptjs = require("bcryptjs");
const db = require("../startup/mysqlconnection");
const route = express.Router();
const jsonwebtoken = require("jsonwebtoken")

route.post("/addUser/", async(req, res) => {
    try {
        const fname = req.body.fname;
        const lname = req.body.lname;
        const userName = req.body.userName;
        const email = req.body.email;
        const phone = req.body.phone;
        var password = req.body.password;
        const role = req.body.role;
        const status = 'on';
        const joinDate = new Date();

        const checkEmail = await db.execute("select * from staff where email=? || phone=? || userName=?", [email, phone, userName]);
        if (checkEmail[0] != "") return res.send({ "message": "email/phone/userName adress is alredy exist" });

        const salt = await bcryptjs.genSalt(10);
        password = await bcryptjs.hash(password, salt);

        const sqlStatment = "INSERT INTO `staff`( `fname`, `lname`, `userName`, `email`,`phone`,`password`, `role`, `status`, `joinDate`) values (?,?,?,?,?,?,?,?,?)";
        const insertCustomer = await db.execute(sqlStatment, [fname, lname, userName, email, phone, password, role, status, joinDate]);

        let user = {
            'name': userName,
            'email': email,
            'role': role
        };

        let sign = jsonwebtoken.sign(user, "pKey");
        return res.send({ "message": "true" });
    } catch (err) {
        return res.send({ "message": "server error" });
    }
});

route.get("/getAll", async(req, res) => {
    try {
        const user = await db.execute("select * from staff");
        if (user[0] === "") return res.status(200).send({ "message": "there is no user yet" });
        return res.status(200).send(user[0]);
    } catch (err) {
        console.log(err);
        return res.status(200).send({ "message": "there are unknown problem" + err });
    }
})

route.get("/getuser/:email", async(req, res) => {

    if (!req.params.email) return res.send("email require.")
    try {
        const user = await db.execute("select * from user where email=? limit 1", [req.params.email]);
        if (user[0] === "") return res.status(200).send({ "message": "there is no user yet" });
        return res.status(200).send(user[0][0]);
    } catch (err) {
        console.log(err);
        return res.status(200).send({ "message": "there are unknown problem" });
    }
})
route.get("/getStaffUser/:email", async(req, res) => {

    if (!req.params.email) return res.send("email require.")
    try {
        const user = await db.execute("select * from staff where email=? limit 1", [req.params.email]);
        if (user[0] === "") return res.status(200).send({ "message": "there is no user yet" });

        var user2 = {
            'fname': user[0][0].fname,
            'lname': user[0][0].lname,
            'userName': user[0][0].userName,
            'email': user[0][0].email,
            'phone': user[0][0].phone,
            'role': user[0][0].role,
            'status': user[0][0].status,
            'joinDate': user[0][0].joinDate
        };
        return res.status(200).send(user2);
    } catch (err) {
        console.log(err);
        return res.status(200).send({ "message": "there are unknown problem" });
    }
})


route.put("/changeStatus/:email", async(req, res) => {
    const user = await db.execute("select * from staff where email=? LIMIT 1", [req.params.email]);
    if (user[0] == "") return res.send({ "message": "there is no user in this email" });
    if (user[0][0]["status"] == "on") {
        const off = await db.execute("update staff set status='off' where email=? LIMIT 1", [req.params.email]);
        return res.status(200).send({ "message": "user account is diactivated" });
    } else {
        const off = await db.execute("update staff set status='on' where email=? LIMIT 1", [req.params.email]);
        return res.status(200).send({ "message": "user account is activated" });
    }
})

route.put("/resitePass/:email", async(req, res) => {
    const user = await db.execute("select * from staff where email=? LIMIT 1", [req.params.email]);
    if (user[0] == "") return res.status(200).send({ "message": "there is no user in this email" });
    const salt = await bcryptjs.genSalt(10);
    var password = await bcryptjs.hash("123", salt);
    const off = await db.execute("update staff set password=? where email=? LIMIT 1", [password, req.params.email]);
    return res.status(200).send({ "message": "user password is resated" });
});

module.exports = route;