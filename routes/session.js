var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");
var bcrypt = require("bcrypt-nodejs")

router.post('/login', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var pool = database.getPool();

    let sql = 'CALL usp_User_Login(?)';
    let params = [req.body.Username];
 
    pool.query(sql, params, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
            return
        }

        console.log(results[0]);

        if (results.length == 0 || results[0].lenght == 0 || !results[0][0]) {
            res.json(helper.getResponseObject(null, 400, "User does not exist"))
            return;
        }

        var passwordHash = results[0][0].Password;
        var success = bcrypt.compareSync(req.body.Password, passwordHash)

        if (!success) {
            res.json(helper.getResponseObject(null, 401, "Invalid credentials"))
            return;
        }

        let sql = 'CALL usp_User_Get(?,?,?)';
        let params = [null, null, req.body.Username];

        pool.query(sql, params, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
                return
            }
    
            res.json(helper.getResponseObject(results[0][0], 200, "OK"));
        });
    });
});

module.exports = router;