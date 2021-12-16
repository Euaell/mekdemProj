const express = require("express");
const authentication = require('C:/Users/euael/OneDrive/Desktop/Software Eng/PROJECT/pull/New folder/middleware/authentication.js');
const connection = require("C:/Users/euael/OneDrive/Desktop/Software Eng/PROJECT/pull/New folder/dB/db");

const application = express.Router();
application.route("/")
.get(authentication.isStudentLoggedIn, (req , res)=> {
    res.render('Dormitory/Application');
})
.post(authentication.isStudentLoggedIn ,(req , res)=> {
    let adr = req.userData.StudentID;
    let bdr1 = req.body.dorm1;
    let bdr2 = req.body.dorm2;
    let bdr3 = req.body.dorm3;
    let sql = `INSERT INTO dormitoryreq (StuduentD, preferedComp1 , preferedComp2, preferedComp3) VALUES ("${req.userData.StudentID}", "${bdr1}", "${bdr2}", "${bdr3}")`;
    connection.query(sql , (error , result) => {
        if (error) {
            return console.error("error: " + error.message);
        }
        res.redirect("/dormitory/placement");
     });
});

module.exports = application;