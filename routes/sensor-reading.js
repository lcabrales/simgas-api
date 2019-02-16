var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");

var sql = database.sql;
var config = database.config;

router.post('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var body = req.body;

    sql.connect(config).then(pool => {
        return pool.request()
        .input('SensorId', sql.UniqueIdentifier, body.SensorId)
        .input('ReadingVolts', sql.Decimal, body.ReadingVolts)
        .input('SensorResistance', sql.Decimal, body.SensorResistance)
        .input('KnownConcentrationSensorResistance', sql.Decimal, body.KnownConcentrationSensorResistance)
        .input('GasPpm', sql.Decimal, body.GasPpm)
        .execute('usp_SensorReading_Create')
    }).then(result => {
        console.log(result)
        res.json(helper.getResponseObject(result.recordset[0], 200, "OK"));
    }).catch(err => {
        console.log(err);
        res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
    })
});

module.exports = router;