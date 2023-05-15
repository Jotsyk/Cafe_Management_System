const sql = require("mssql");
const express = require("express");
const app = express();
const connection = require('./connection');
//const Connection = require('tedious').Connection;
//const Request = require('tedious').Request;

app.use(express.json());

app.get("/api/user/:id",function(req,res){
    sql
    .connect(connection)
    .then((pool) => {
        return pool.request().input("id", sql.Int, parseInt(req.params.id)).execute("GetUser");
    })
    .then((result) => {
        console.log(result.recordset[0]);
        res.status(200).json({
            result: result.recordset[0],
        })
        sql.close();
    })
    .catch((err) => {
        console.log(err.message);
        sql.close();
    });
});


app.listen(3000,() => {
    console.log("listening");
})
