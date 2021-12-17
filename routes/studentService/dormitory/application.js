const express = require("express");
const authentication = require('../../../middleware/authentication');
const connection = require("../../../dB/db");

const application = express.Router();
application.route("/")
.get(authentication.isStudentLoggedIn, (req , res)=> {
    res.render('Dormitory/Application', {msg: undefined});
})
.post(authentication.isStudentLoggedIn, (req, res) => {
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
    sql = `UPDATE dormitory SET RequestStatus = "pending"`;
    connection.query(sql, (error, result) => {
        if(error) return console.log(error.message);
    })
});

module.exports = application;