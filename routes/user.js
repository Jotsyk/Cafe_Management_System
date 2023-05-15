const express = require('express');
const connection = require('../connection');
const router = express.Router();
var Request = require('tedious').Request;

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/signup', (req, res) => {
    let user = req.body;
    query = "SELECT * FROM [cafenodejs].[dbo].[user] where [email]='" + [user.email] + "'"

    request = new Request(query, function (err, rowCount, rows) {
        if (!err) {
            if (rowCount <= 0) {
                console.log(rowCount);
                query = "INSERT INTO [cafenodejs].[dbo].[user] ([name],[contactNumber],[email],[password],[status],[role]) VALUES('" + [user.name] + "','" + [user.contactNumber] + "','" + [user.email] + "','" + [user.password] + "','false','user')"
                request = new Request(query, function (err, rowCount, rows) {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully registered !" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                });
                connection.execSql(request);
            }
            else {
                return res.status(500).json({ message: "User already exists !" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    });
    connection.execSql(request);
})


router.post('/login', (req, res) => {
    let user = req.body;
    const allRows = [];
    query = "select email as email,password,role,status from [cafenodejs].[dbo].[user] where email='" + [user.email] + "' ";
    //console.log('query',query);
    request = new Request(query, function (err, rowCount, rows) {
        //   console.log(rows.);
        if (err) {
            return res.status(500).json(err);
        }
        // else {
        //     return res.status(500).json(err);
        // }
    })
        .on('row', function (columns) {
            //console.log('columns',columns);
            columns.forEach(function (column) {
                const row = [];
                row.push({
                    colName: column.metadata.colName,
                    value: column.value
                    // toString: () => column.value 
                });
                allRows.push(row);
            });
        })
        .on('doneInProc', function (rowCount, more, rows) {
            // console.log('allrows',allRows);
            //console.log('rows',allRows[0]); // not empty
            //console.log('rows1',allRows[0][0].value); // not empty
            //console.log(user.password); // not empty
            if (rowCount < 0 || user.password != allRows[1][0].value) {
                return res.status(401).json({ message: "Incorrect Username or password" });
            } else if (allRows[3][0].value == 'false') {
                return res.status(401).json({ message: "Wait for Admin Approval.." });
            } else if (allRows[1][0].value == user.password) {
                const response = { email: allRows[0][0].value, role: allRows[2][0].value }
                const accessToken = jwt.sign(response, process.env.Access_Token, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken });
            } else {
                return res.status(400).json({ message: "Something went wrong. Please try again later." });
            }
        });
    connection.execSql(request);
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotpassword', (req, res) => {
    const user = req.body;
    query = "select email,password from [cafenodejs].[dbo].[user] where email='" + [user.email] + "'";

    request = new Request(query, function (err, rowCount, rows) {
        if (err) {
            return res.status(500).json(err);
        }
    })
        .on('row', function (columns) {
            columns.forEach(function (column) {
                const row = [];
                row.push({
                    colName: column.metadata.colName,
                    value: column.value
                    // toString: () => column.value 
                });
                allRows.push(row);
            });
        })
        .on('doneInProc', function (rowCount, more, rows) {
            if (rowCount < 0) {
                return res.status(200).json({ message: "Password sent successfully to your email." });
            } else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: allRows[0][0].value,
                    subject: 'Password by Cafe Management System',
                    html: '<p><b>Your Ligin details for Cafe Management System</b><br><b>Email: </b>' + allRows[0][0].value + '<br><b>assword: </b>' + allRows[1][0].value + '<br><a href="http://localhost:4200/user/login">Click here to login</a></p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.status(200).json({ message: "Password sent successfully to your email." });
            }
        });

    connection.execSql(request);
})

router.get('/get', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const allRows = [];
    var query = "select id,name,email,contactNumber,status from [cafenodejs].[dbo].[user] where role='user'";

    request = new Request(query, function (err, rowCount, rows) {
        if (err) {
            return res.status(200).json(err);
        }
    })
        .on('row', function (columns) {
            //console.log('columns', columns);
            columns.forEach(function (column) {
                const row = [];
                row.push({
                    colName: column.metadata.colName,
                    value: column.value
                    // toString: () => column.value 
                });
                allRows.push(row);
            });
        })
        .on('doneInProc', function (rowCount, more, rows) {
            console.log('rows', allRows);
            return res.status(200).json(allRows);
        });
    connection.execSql(request);
})

router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "update [cafenodejs].[dbo].[user] set status='"+ user.status +"' where id='"+ user.id +"'";

    request = new Request(query,function(err,rowCount,rows) {
        if(!err){
            if(rowCount == 0) {
                return res.status(404).json({ message: "User id does not exist" });
            } 

            return res.status(200).json({ message: "User Updated successfully" });

        } else {
            return res.status(500).json(err);  
        }
    });
    connection.execSql(request);
})

router.get('/checkToken', auth.authenticationToken, (req, res) => {
    return res.status(200).json({ message: "true" });
})

router.post('/changePassword', auth.authenticationToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;
    const allRows = [];
    var query = "select * from [cafenodejs].[dbo].[user] where email='"+ user.email +"' and password='"+ user.password +"'"

    request = new Request(query,function(err,rowCount,rows){
        if(err){
            return res.status(500).json(err);
        }
    })
    .on('row',function(columns){
        console.log('columns', columns);
        columns.forEach(function (column) {
            const row = [];
            row.push({
                colName: column.metadata.colName,
                value: column.value
                // toString: () => column.value 
            });
            allRows.push(row);
        });
    })
    .on('doneInProc',function(rowCount,more,rows) {
        if (rowCount < 0) {
            return res.status(400).json({ message: "Incorrrect Old Password" }); 
        } else if (allRows[1][0].value == user.oldPassword) {
            if(!err) {
                return res.status(200).json({ message: "Password Updated Successfully." });
            } else {
                return res.status(500).json(err);
            }
        } else {
            return res.status(400).json({ message: "Something went wrong. Please try again later." });
        }
    });
    connection.execSql(request);
    // connection.query(query, [email, user.oldPassword], (err, results) => {
    //     if (!err) {
    //         if (results.length <= 0) {
    //             return res.status(400).json({ message: "Incorrrect Old Password" });
    //         } else if (results[0].password == user.oldPassword) {
    //             if (!err) {
    //                 return res.status(200).json({ message: "Passwird Updated Successfully." });
    //             } else {
    //                 return res.status(500).json(err);
    //             }
    //         } else {
    //             return res.status(400).json({ message: "Something went wrong. Please try again later" });
    //         }
    //     } else {
    //         return res.status(500).json(err);
    //     }
    // })
})


module.exports = router;