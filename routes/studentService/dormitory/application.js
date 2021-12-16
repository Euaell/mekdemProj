const express = require("express");
const authentication = require('C:/Users/euael/OneDrive/Desktop/Software Eng/PROJECT/pull/New folder/middleware/authentication.js');
const connection = require("C:/Users/euael/OneDrive/Desktop/Software Eng/PROJECT/pull/New folder/dB/db");

const application = express.Router();
application.route("/")
.get(authentication.isStudentLoggedIn, (req , res)=> {
    res.render('Dormitory/Application', {msg: undefined});
})
.post(authentication.isStudentLoggedIn ,(req , res)=> {
    let adr = req.userData.StudentID;
    let bdr1 = req.body.dorm1;
    let bdr2 = req.body.dorm2;
    let bdr3 = req.body.dorm3;
    let sql = `UPDATE dormitoryreq 
    SET preferedComp1 = "${bdr1}", preferedComp2 = "${bdr2}", preferedComp3= "${bdr3}"
    WHERE StuduentD = "${adr}"`;
    connection.query(sql , (error , result) => {
        if (error) {
            console.error("error: " + error.message);
            res.render("/dormitory/Application", {msg: 1});
        }
        res.redirect("/dormitory/placement");
     });
});

module.exports = application;