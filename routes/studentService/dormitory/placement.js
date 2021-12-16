const express = require("express");
const authentication = require('C:/Users/euael/OneDrive/Desktop/Software Eng/PROJECT/pull/New folder/middleware/authentication.js');
const connection = require("C:/Users/euael/OneDrive/Desktop/Software Eng/PROJECT/pull/New folder/dB/db");

const placement = express.Router();

placement.route("/")
.get(authentication.isStudentLoggedIn, (req , res)=> {
    //req.userData.StudentID   holds the current logged in student id which is a string
    //req.userData.FullName    holds the current logged in student full name
    let adr = req.userData.StudentID;
    let sql =  `select * from dormitory WHERE StudentD = "${adr}"`;
    connection.query(sql , (error , result) => {
        let r;
        if (result !==undefined && result.length > 0 ) {
            const adr0 = result[0].blockNumber;
            const adr1 = result[0].roomNumber;
            const adr2 = result[0].RequestStatus;
            if (adr2 !== "denied"){
                if (adr2 == "approved"){
                    if(adr0 == null || adr1 == null){
                        r = null;
                    }else {
                    var sql0 = `select * from dormitory WHERE blockNumber = ${adr0} AND roomNumber = ${adr1}`;
                    connection.query(sql0, (error, result) => {
                        // var
                    });
                        r = {
                            dormStatus: adr2,
                            blockNumber: adr0,
                            roomNumber: adr1
                        };
                    }
                } else{
                    r = {
                        dormStatus: adr2
                    };
                }
            }
            // console.log(r);
            res.render("Dormitory/placement", {placement: r});
        }
        else 
        {
            res.render('Dormitory/placement' , {placement: null});
        }
     });
});
module.exports = placement;