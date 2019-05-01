var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");
var bcrypt = require("bcrypt-nodejs")

var sql = database.sql;
var config = database.config;

router.post('/login', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var body = req.body;
    var globalPool;

    sql.connect(config).then(pool => {
        globalPool = pool
        
        return pool.request()
        .input('Username', sql.NVarChar, body.Username)
        .execute('usp_User_Login')
    }).then(result => {
        if (result.recordset.length == 0) {
            res.json(helper.getResponseObject(null, 400, "User does not exist"))
            return;
        }

        var passwordHash = result.recordset[0].Password;
        var success = bcrypt.compareSync(body.Password, passwordHash)

        if (!success) {
            sql.close();
            res.json(helper.getResponseObject(null, 400, "Invalid credentials"))
            return;
        }

        var promises = [];
        var user;

        promises.push(globalPool.request()
            .input('Username', sql.UniqueIdentifier, body.Username)
            .execute('usp_User_Get')
            .then(result => {
                user = result.recordset[0]
            }).catch(err => {
                console(err)
            })
        )

        Promise.all(promises).then(() => {
            sql.close();
            console.log(user)
            res.json(helper.getResponseObject(user, 200, "OK"));
        });  
    }).catch(err => {
        sql.close();

        console.log(err);
        res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"));
    })
});

module.exports = router;