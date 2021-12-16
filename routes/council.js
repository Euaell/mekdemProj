const express = require("express");
const authentication = require("../middleware/authentication");
const connection = require("../dB/db");

const council = express.Router();

council.route("/")
.get(authentication.isStudentLoggedIn ,(req , res)=> {
    //req.userData.StudentID   holds the current logged in student id which is a string
    //req.userData.FullName    holds the current logged in student full name
    let sql =  `select * from council`;
    connection.query(sql, (error, result) => {
        if (result !==undefined && result.length > 0 ) {
        res.render('council', {council: result});
        } else {
            res.render('council', {council:0});
        }
     });
});

module.exports = council;