require('dotenv').config()
const { response } = require('express');
const jwt = require('jsonwebtoken');

function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null)
        return res.sendStatus(401);

    jwt.verify(token, process.env.Access_Token, (err, response) => {
        if (err)
            return res.sendStatus(403);
        res.locals = response;
        next()
    })
}

module.exports = { authenticationToken: authenticationToken }