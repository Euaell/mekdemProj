const express = require("express");

const accountInfo = express.Router();

accountInfo.route("/")
.get(authentication.isStudentLoggedIn, (req , res)=> {
    res.render('costSharing/accountInfo', {msg: false});
})
.post(authentication.isStudentLoggedIn, (req , res) => {
    let adr = req.userData.StudentID;
    let adr1 = req.body.accinfo;
    let adr3 = req.body.foods;
    let adr4 = req.body.dorms;
    let adr5;
    if(adr3 == undefined && adr4 == undefined) adr5 = "none";
    else if(adr3 != undefined && adr4 == undefined) adr5 = "Food";
    else if(adr3 == undefined && adr4 != undefined) adr5 = "Dorm";
    else adr5 = "FoodAndDorm";
    console.log(adr5);
    let x = false;
    let sql = `INSERT INTO costsharing (StudentCostSharing, AccountNumber, ServiceChoice) VALUES ("${adr}", "${adr1}", "${adr5}")`;
    connection.query(sql, (err, result) => {
        if(err) x = true;

    });
    res.render('costSharing/accountInfo', {msg: x});
});

module.exports = accountInfo;