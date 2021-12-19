const express = require("express");
const authentication = require('../../../middleware/authentication');
const connection = require("../../../dB/db");

const homeadr = express.Router();
homeadr.route("/")
.get(authentication.isStudentLoggedIn, (req , res)=> {
    res.render('costSharing/homeAddress'); // SENDS THE APPLICATION TO THE STUDENT TO BE FILLED
})
.post(authentication.isStudentLoggedIn, (req , res) => {
    // UPDATING THE COSTSHARING TABLE
    let sql = `UPDATE costsharing 
    SET City = "${req.body.city}", Subcity = "${req.body.scity}", Woreda = "${req.body.woreda}", HouseNo = "${req.body.hnum}"
    WHERE StudentCostSharing = "${req.userData.StudentID}"`;
    connection.query(sql, (error, result) => {
        if (error){
            return console.log(error.message);
        }   
        res.redirect("/home"); // REDIRECT TO HOMEPAGE AFTER FINISHED FILLING THE PAGE
    });
});

module.exports = homeadr;