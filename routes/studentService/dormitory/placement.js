const express = require("express");
const authentication = require('../../../middleware/authentication');
const connection = require("../../../dB/db");

const placement = express.Router();

placement.route("/")
.get(authentication.isStudentLoggedIn, (req , res)=> {
    let adr = req.userData.StudentID; // holds the current logged in student id, as a STRING
    let sql =  `select * from dormitory WHERE StudentD = "${adr}"`; // QUERY THE DATABASE FOR DORMITORY INFO USING THE STUDNENT ID
    connection.query(sql , (error , result) => {
        let r;
        if (result !==undefined && result.length > 0 ) {
            if (result[0].RequestStatus !== "denied"){
                if (result[0].RequestStatus == "approved"){ // FOR APPROVED DORMITORY APPLICATION
                    if(result[0].blockNumber == null || result[0].roomNumber == null){
                        r = null;
                    }else {
                    var sql1 = `select * from dormitory WHERE blockNumber = ${result[0].blockNumber} AND roomNumber = ${result[0].roomNumber}`;
                    connection.query(sql1, (error, result) => {
                    });
                        r = {
                            dormStatus: result[0].RequestStatus,
                            blockNumber: result[0].blockNumber,
                            roomNumber: result[0].roomNumber
                        };
                    }
                } else r = { dormStatus: result[0].RequestStatus }; // IF THE STATUS IS PENDING OR THE DORMITORY APPLICATION IS BEING PROCESSED
            }
            res.render("Dormitory/placement", {placement: r}); // IF DENIED, NULL IS PASSED TO THE OUTPUT .ejs  FILE
        }
        else res.render('Dormitory/placement' , {placement: null}); // IF NO APPLICATION INFORMATION EXIST NULL WILL BE PASSED TO THE OUTPUT
     });
});
module.exports = placement;