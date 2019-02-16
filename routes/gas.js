var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");

var sql = database.sql;
var config = database.config;

router.get('/', function(req, res) {
    console.log('receiving data ...');
    console.log('query is ', req.query);

    var query = req.query;

    sql.connect(config).then(pool => {
        return pool.request()
        .input('GasId', sql.UniqueIdentifier, query.GasId)
        .execute('usp_Gas_Get')
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

module.exports = router;