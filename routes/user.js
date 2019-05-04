var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");
var bcrypt = require("bcrypt-nodejs")

var sql = database.sql;
var config = database.config;

router.get('/', function(req, res) {
    console.log('receiving data ...');
    console.log('query is ', req.query);

    var query = req.query;

    sql.connect(config).then(pool => {
        return pool.request()
        .input('UserId', sql.UniqueIdentifier, query.UserId)
        .input('RoleId', sql.UniqueIdentifier, query.RoleId)
        .execute('usp_User_Get')
    }).then(result => {
        sql.close();

        console.log(result)
        res.json(helper.getResponseObject(result.recordset, 200, "OK"));
    }).catch(err => {
        sql.close();

        console.log(err);
        res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
    })
});

router.post('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var body = req.body;

    var passwordHash = bcrypt.hashSync(body.Password)

    sql.connect(config).then(pool => {
        return pool.request()
        .input('RoleId', sql.UniqueIdentifier, body.RoleId)
        .input('Username', sql.NVarChar, body.Username)
        .input('FirstName', sql.NVarChar, body.FirstName)
        .input('LastName', sql.NVarChar, body.LastName)
        .input('Email', sql.NVarChar, body.Email)
        .input('Password', sql.NVarChar, passwordHash)
        .execute('usp_User_Create')
    }).then(result => {
        sql.close();

        console.log(result)
        res.json(helper.getResponseObject(result.recordset[0], 200, "OK"));
    }).catch(err => {
        sql.close();

        console.log(err);
        res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"));
    })
});

router.put('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var body = req.body;

    var passwordHash = body.Password == null ? null : bcrypt.hashSync(body.Password)

    sql.connect(config).then(pool => {
        return pool.request()
        .input('UserId', sql.UniqueIdentifier, body.UserId)
        .input('RoleId', sql.UniqueIdentifier, body.RoleId)
        .input('FirstName', sql.NVarChar, body.FirstName)
        .input('LastName', sql.NVarChar, body.LastName)
        .input('Email', sql.NVarChar, body.Email)
        .input('Password', sql.NVarChar, passwordHash)
        .input('LastModifiedBy', sql.NVarChar, body.LastModifiedBy)
        .execute('usp_User_Update')
    }).then(result => {
        sql.close();

        console.log(result)
        res.json(helper.getResponseObject(result.recordset[0], 200, "OK"));
    }).catch(err => {
        sql.close();

        console.log(err);
        res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"));
    })
});

module.exports = router;