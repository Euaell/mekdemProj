const express = require('express');
const jwt = require('jsonwebtoken');
const authentication = require('./middleware/authentication.js');
const cookieParser = require('cookie-parser');
const connection = require("./dB/db.js");

const council = require("./routes/council");
const accountInfo = require("./routes/studentService/costsharing/accountInfo");
const homeadr = require("./routes/studentService/costsharing/homeadr");
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
app.use("/council", council);

// Student service 
    // Cost sharing - accountInfo
app.use("/costSharing/accountInfo", accountInfo);
    // Cost sharing - home address
app.use("/costSharing/homeadr", homeadr);
// Dormitory placement
app.use("/dormitory/placement", studentServiceplacement);
//Dormitory Application
app.use("/dormitory/Application", studentServiceapplication);