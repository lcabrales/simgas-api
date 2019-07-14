var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");
var bcrypt = require("bcrypt-nodejs")

router.get('/', function(req, res) {
    console.log('receiving data ...');
    console.log('query is ', req.query);

    var connection = database.getConnection();

    let sql = 'CALL usp_User_Get(?,?)';
    let params = [req.query.UserId, req.query.RoleId];
 
    connection.query(sql, params, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
            return
        }

        console.log(results[0]);
        res.json(helper.getResponseObject(results[0], 200, "OK"));
    });
    
    connection.end();
});

router.post('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var connection = database.getConnection();

    var passwordHash = bcrypt.hashSync(req.body.Password)

    let sql = 'CALL usp_User_Create(?,?,?,?,?,?)';
    let params = [
        req.body.RoleId, 
        req.body.Username,
        req.body.FirstName,
        req.body.LastName,
        req.body.Email,
        passwordHash
    ];
 
    connection.query(sql, params, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
            return
        }

        console.log(results[0]);
        res.json(helper.getResponseObject(results[0], 200, "OK"));
    });
    
    connection.end();
});

router.put('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var connection = database.getConnection();

    var passwordHash = req.body.Password == null ? null : bcrypt.hashSync(req.body.Password)

    let sql = 'CALL usp_User_Update(?,?,?,?,?,?,?)';
    let params = [
        req.body.UserId, 
        req.body.RoleId, 
        req.body.FirstName,
        req.body.LastName,
        req.body.Email,
        passwordHash,
        req.body.LastModifiedBy
    ];
 
    connection.query(sql, params, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
            return
        }

        console.log(results[0]);
        res.json(helper.getResponseObject(results[0], 200, "OK"));
    });
    
    connection.end();
});

module.exports = router;