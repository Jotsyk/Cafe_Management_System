const express = require('express');
const connection = require('../connection');
const router = express.Router();
var Request = require('tedious').Request;

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


router.post('/add',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    let category = req.body;
    query =  "insert into [cafenodejs].[dbo].[category] ([name]) values('"+ category.name +"')"

    request = new Request(query, function(err,rowCount,rows){
        if(!err){
            return res.status(200).json({message:"Category Added Successfully"});
        } else{
            return res.status(500).json(err);
        }
    });
    connection.execSql(request);
})

router.get('/get',auth.authenticationToken,(req,res,next)=>{
    const allRows = [];
    var query = "select * from [cafenodejs].[dbo].[category] order by name";
    request = new Request(query, function(err,rowCount,rows){
        if(err){
            return res.status(500).json(err);
        }
    })
    .on('row', function (columns) {
       // console.log('columns', columns);
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

router.patch('/update',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var query = "update [cafenodejs].[dbo].[category] set name='"+ product.name +"' where id='"+ product.id +"'";

    request = new Request(query, function(err,rowCount,rows){
        if(!err){
            if(rowCount == 0){
                return res.status(404).json({message:"Product Does Not Exist!!!"});
            }
            else{
                return res.status(200).json({ message: "User Updated successfully" });
            }
        } else {
            return res.status(500).json(err);  
        }
    });
    connection.execSql(request);
})

module.exports = router;