const express = require("express");
const authentication = require('../../../middleware/authentication');
const connection = require("../../../dB/db");

const accountInfo = express.Router();

accountInfo.route("/")
.get(authentication.isStudentLoggedIn, (req , res)=> {
    res.render('costSharing/accountInfo', {msg: false}); // SENDS THE ACCOUNT INFO PAGE TO BE FILLED
})
.post(authentication.isStudentLoggedIn, (req , res) => {
    let STUDID = req.userData.StudentID;
    let ACCINFO = req.body.accinfo;
    let FOODS = req.body.foods;
    let DO = req.body.dorms;
    let DBINFO; // VARIABLE TO BE SAVED TO DATABASE
    // CHECKS FOR PREFERED SERVICE
    if(FOODS == undefined && DO == undefined) DBINFO = "none";
    else if(FOODS != undefined && DO == undefined) DBINFO = "Food";
    else if(FOODS == undefined && DO != undefined) DBINFO = "Dorm";
    else DBINFO = "FoodAndDorm";
    let boolToBeSent = false;
    let sql = `INSERT INTO costsharing (StudentCostSharing, AccountNumber, ServiceChoice) VALUES ("${STUDID}", "${ACCINFO}", "${DBINFO}")`;
    connection.query(sql, (err, result) => {
        if(err) boolToBeSent = true;
    });
    res.render('costSharing/accountInfo', {msg: boolToBeSent});
});

module.exports = accountInfo;