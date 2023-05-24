const express = require('express');
const connection = require('../connection');
const router = express.Router();
var Request = require('tedious').Request;

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    query =  "insert into [cafenodejs].[dbo].[Product] ([name],categoryID,description,status) values('"+ product.name +"','"+ product.categoryid +"','"+ product.description +"',true)"

    request = new Request(query, function(err,rowCount,rows){
        if(!err){
            return res.status(200).json({message:"Product Added Successfully"});
        } else{
            return res.status(500).json(err);
        }
    });
    connection.execSql(request);
})


router.get('/get',auth.authenticationToken,(req,res,next)=>{
    const allRows = [];
    var query = "select * from [cafenodejs].[dbo].[product] as p Inner Join category as c where p.categoryID = c.id";
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


router.get('/getByCategory/:id',auth.authenticationToken,(req,res,next)=>{
    let product = req.params.id;
    var query = "select id,name from [cafenodejs].[dbo].[product] where categoryID = '"+ product.id +"' and status = 'true'";
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


router.get('/getById/:id',auth.authenticationToken,(req,res,next)=>{
    let id = req.params.id;
    var query = "select id,name,description,price from [cafenodejs].[dbo].[product] where ID = '"+ id +"'";
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
    var query = "update [cafenodejs].[dbo].[Product] set name='"+ product.name +"', categoryid='"+ product.categoryid +"',description='"+ product.description +"',price='"+ product.price +"' where id='"+ product.id +"'";

    request = new Request(query, function(err,rowCount,rows){
        if(!err){
            if(rowCount == 0){
                return res.status(404).json({message:"Product Does Not Exist!!!"});
            }
            else{
                return res.status(200).json({ message: "Product Updated successfully" });
            }
        } else {
            return res.status(500).json(err);  
        }
    });
    connection.execSql(request);
})

router.delete('/delete/:id',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    let id = req.params.id;
    var query = "delete from [cafenodejs].[dbo].[Product] where id = '"+ id +"'";

    request = new Request(query, function(err,rowCount,rows){
        if(!err){
            if(rowCount == 0){
                return res.status(404).json({message:"Product ID does not found!!!"});
            }
            else{
                return res.status(200).json({ message: "Product Deleted successfully" });
            }
        } else {
            return res.status(500).json(err);  
        }
    });
    connection.execSql(request);
})

router.patch('/updateStatus',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var query = "update [cafenodejs].[dbo].[Product] set status='"+ product.status +"' where id='"+ product.id +"'";

    request = new Request(query, function(err,rowCount,rows){
        if(!err){
            if(rowCount == 0){
                return res.status(404).json({message:"Product Does Not Exist!!!"});
            }
            else{
                return res.status(200).json({ message: "Product Updated successfully" });
            }
        } else {
            return res.status(500).json(err);  
        }
    });
    connection.execSql(request);
})




module.exports = router;
