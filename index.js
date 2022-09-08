 const express = require("express");
 const app = express();
 const bodyParser = require('body-parser')
 var jwt = require('jsonwebtoken');
 const auth = require("./auth2")
 const cors = require('cors')
 const router = require('./routes/routes');
 const session = require("express-session")
 const cookieParser = require('cookie-parser')
     //const verifys = require("./function");

 const mysql = require("mysql")
 const PORT = process.env.PORT || 4000;

 const bcrypt = require("bcrypt");


 const conn = require("./connection")









 app.use(cors({
     origin: ["http://localhost:3000"],
     methods: ["GET", "POST"],
     credentials: true
 }));
 app.use(express.json());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(cookieParser())


 app.use(session({
     key: "userId",
     resave: false,
     saveUninitialized: false,
     secret: "This is my website",
     cookie: {
         expires: 60 * 60 * 56000


     }



 }))


 app.get('/units', (req, res) => {
     conn.query(`select * from Units`, (err, result, fields) => {
         if (err) {
             res.json({ message: "There is an error in fetching data from the server" })
         } else {
             res.send(result)
         }
     })

 })

 app.post("/login", (req, res) => {

     console.log("Requesting information : " + req.body.name)
     conn.query(`select * from Users  where Name='${req.body.name}'`, (err, result, fields) => {
         if (err) {
             console.log(err);
         }
         if (result.length > 0) {
             //res.send("information is available")
             // console.log(req.body)
             // console.log(typeof req.body.password)
             console.log("the username exists")

             let password = req.body.password
                 //console.log(password)
             const password1 = result[0].pass
             const all = result
             password = String(password)
                 // console.log(password, password1)
             bcrypt.compare(password, password1, (err, result) => {


                 if (result) {
                     //
                     // res.send(all)
                     //  console.log(req.session)
                     console.log("password has been verified")








                     req.session.user = all
                     res.json({
                         verified: true,
                         message: "The user has been verified"
                     })


                 } else {
                     console.log("the password is incorrect")
                     res.json({
                         message: "passwords do not match",
                         verified: false
                     })
                 }







             })
         } else {
             res.json({ message: "username does not exist" })
             console.log("username does not exists")
         }










     })



 })

 app.get("/logged", (req, res) => {
     const dat = req.session.user
     console.log(dat)

     //console.log("x is " + x)
     if (req.session.user) {

         res.json({
                 user: req.session.user,
                 id: 6
             })
             //console.log(req.session.user)
     } else {
         console.log("there is no session that exists")
         console.log("there is no session that exists")
         res.json({ message: "there is no session" })
     }
 });


 app.get('/getid', (req, res) => {
     res.send(req.session.user)
     console.log(req.session.user)

 })

 app.post('/register', (req, res) => {
     console.log(req.body)

     conn.query(`select * from Users where email = '${req.body.email}'`, (err, results, fields) => {
         if (results.length > 0) {
             res.json({ message: "the user already exists" })
             console.log(results)
         } else {

             bcrypt.hash(req.body.password, 10, (err, hash) => {
                 if (err) {
                     res.json({ message: "there was an error in the creation of the user" })
                 } else {


                     conn.query(`insert into Users (Name,email, pass,gender,county)  VALUES('${req.body.name}','${req.body.email}', '${hash}','${req.body.gender}','${req.body.county}')`, (err, result, fields) => {
                         if (err) {
                             console.log("there was an error")
                         } else {
                             res.json({ message: "the user has been created successfully" })
                             console.log("the user has been created successfully")

                         }

                     })
                 }
             })
         }






     })
 })

 app.post('/book', (req, res) => {
     console.log(req.body)
     const { userId, courseId } = req.body;
     conn.query(`Insert into Booked (user_id,course_id)values(${userId},${courseId})`, (err, fields, result) => {
         if (err) {
             res.json({ message: "The Registration was unsucessfull" })
         } else {
             res.json({ message: "Registration successfully" })
         }
     })



 })
 app.post('/getunits', (req, res) => {
     conn.query(`SELECT  Units.Name,Units.fee,Booked.course_id 
     From Units 
     inner JOIN Booked  ON Booked.course_id =Units.id and Booked.course_id ='{req.body.id}'`, (err, result, fields) => {
         if (err) {
             (console.warn(err))
         } else {
             res.send(result)
         }

     })
 })

 app.get('/logout', (req, res) => {
     //res.session.destroy();
     res.clearCookie('userId')
 })

 app.get('/', (req, res) => {
     conn.query(`select * from Users`, (err, result, fields) => {
         if (err) {
             console.log("there was an error")

         } else {
             res.send(result)
         }
     })
 })




 app.listen(PORT, (err) => {
     if (err) throw err
     console.log(`Connection established on port : ${PORT}`)


 })