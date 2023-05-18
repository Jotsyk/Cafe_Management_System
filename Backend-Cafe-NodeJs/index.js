const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');
const CategoryRoute = require('./routes/category');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user', userRoute);  
app.use('/category',CategoryRoute);

module.exports = app;