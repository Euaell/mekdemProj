const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const authentication = require('./middleware/authentication.js');
const cookieParser = require('cookie-parser');
const connection = require("./dB/db.js");
const studentServiceplacement = require("./routes/studentService/dormitory/placement");
const studentServiceapplication = require("./routes/studentService/dormitory/application");

const app = express();
app.set('view engine' ,  'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));

app.listen(3000 , ()=>console.log("server running on port 3000"));
//ROUTES AND CONTROLLERS

//login 
app.get('/login' , (req , res)=> {
    res.render('login' , {error: false });
});
app.post('/login' , (req , res) => { 
     let sql = `select * from student where studentId = "${req.body.username}" and password = "${req.body.password}"  `;
     connection.query(sql , (error , result) => {
      if (result !==undefined && result.length > 0 ) {
          const token = jwt.sign({
              StudentID : result[0].StudentID , 
              FullName: result[0].FullName
            },
            'SECRETKEY', {
              expiresIn: '7d'
            });
            
            res.cookie('jwt' , token , {httpOnly:true , maxAge:3600*1000});
            res.redirect('/home')
    
      } else {
          res.render('login', {error:true });
       }
   });
});

app.get('/home' , authentication.isStudentLoggedIn ,(req , res)=> {
    console.log(req.userData);
    res.render('home', { student: req.userData });
});



//council  - 
app.get('/council' , authentication.isStudentLoggedIn ,(req , res)=> {
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

// Student service
    // Cost sharing - accountInfo
const accountInfo = require("./routes/studentService/costsharing/accountInfo");
app.use("/costSharing/accountInfo", accountInfo);

// Student service
    // Cost sharing - accountInfo
app.get('/costSharing/accountInfo', authentication.isStudentLoggedIn, (req , res)=> {
    res.render('costSharing/accountInfo', {msg: false});
});
app.post('/costSharing/accountInfo', authentication.isStudentLoggedIn, (req , res) => {
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

    // Cost sharing - home address
app.get('/costSharing/homeadr', authentication.isStudentLoggedIn, (req , res)=> {
    res.render('costSharing/homeAddress');
});
app.post('/costSharing/homeadr', authentication.isStudentLoggedIn, (req , res) => {
    let sql = `select * from student`;
    connection.query(sql, (error, result) => {
        if (error){
            return console.log(error.message);
        }   
    });
});

// Dormitory placement
app.use("/dormitory/placement", studentServiceplacement);
//Dormitory Application
app.use("/dormitory/Application", studentServiceapplication);
// app.get('/dormitory/Application', authentication.isStudentLoggedIn, (req , res)=> {
//     res.render('Dormitory/Application');
// });
// app.post('/dormitory/Application', authentication.isStudentLoggedIn ,(req , res)=> {
//     let adr = req.userData.StudentID;
//     let bdr1 = req.body.dorm1;
//     let bdr2 = req.body.dorm2;
//     let bdr3 = req.body.dorm3;
//     let sql = `INSERT INTO dormitoryreq (StuduentD, preferedComp1 , preferedComp2, preferedComp3) VALUES ("${req.userData.StudentID}", "${bdr1}", "${bdr2}", "${bdr3}")`;
//     connection.query(sql , (error , result) => {
//         if (error) {
//             return console.error("error: " + error.message);
//         }
//         res.redirect("/dormitory/placement");
//      });
// });