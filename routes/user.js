var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");
var bcrypt = require("bcrypt-nodejs")

router.get('/', function(req, res) {
    console.log('receiving data ...');
    console.log('query is ', req.query);

    var pool = database.getPool();

    let sql = 'CALL usp_User_Get(?,?,?)';
    let params = [req.query.UserId, req.query.RoleId, req.query.Username];
 
    pool.query(sql, params, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
            return
        }

        console.log(results[0]);
        res.json(helper.getResponseObject(results[0], 200, "OK"));
    });
});

router.post('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var pool = database.getPool();

    var passwordHash = bcrypt.hashSync(req.body.Password)

    let sql = 'CALL usp_User_Create(?,?,?,?,?,?,?,?)';
    let params = [
        req.body.RoleId, 
        req.body.Username,
        req.body.FirstName,
        req.body.LastName,
        req.body.Email,
        passwordHash,
        null,
        1
    ];
 
    pool.query(sql, params, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
            return
        }

        console.log(results[0][0]);
        res.json(helper.getResponseObject(results[0][0], 200, "OK"));
    });
});

router.put('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var pool = database.getPool();

    var passwordHash = req.body.Password == null ? null : bcrypt.hashSync(req.body.Password)

    let sql = 'CALL usp_User_Update(?,?,?,?,?,?,?,?)';
    let params = [
        req.body.UserId, 
        req.body.RoleId, 
        req.body.FirstName,
        req.body.LastName,
        req.body.Email,
        passwordHash,
        req.body.LastModifiedBy,
        req.body.Status
    ];
 
    pool.query(sql, params, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
            return
        }

        console.log(results[0]);
        res.json(helper.getResponseObject(results[0], 200, "OK"));
    });
});

module.exports = router;