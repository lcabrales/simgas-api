var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");

router.get('/', function(req, res) {
    console.log('receiving data ...');
    console.log('query is ', req.query);

    var pool = database.getPool();

    let sql = 'CALL usp_AirQuality_Get(?)';
    let params = [req.query.AirQualityId];
 
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