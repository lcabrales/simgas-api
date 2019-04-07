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
    var globalPool;

    sql.connect(config).then(pool => {
        globalPool = pool
        return pool.request()
        .input('SensorId', sql.UniqueIdentifier, query.SensorId)
        .input('BoardId', sql.UniqueIdentifier, query.BoardId)
        .execute('usp_Sensor_Get')
    }).then(result => {
        globalResult = result

        var promises = [];

        result.recordset.forEach(element => {
            element.LastSensorReading = null
            promises.push(globalPool.request()
                .input('SensorId', sql.UniqueIdentifier, element.SensorId)
                .execute('usp_SensorReading_Get_Latest')
                .then(result => {
                    element.LastSensorReading = result.recordset[0]
                }).catch(err => {
                    console(err)
                })
            )
        })

        Promise.all(promises).then(() => {
            sql.close()
        
            // console.log(result)
            res.json(helper.getResponseObject(result.recordset, 200, "OK"));
        });  
    })
    // .then(result => {
    //     sql.close()
        
    //     // console.log(result)
    //     res.json(helper.getResponseObject(result.recordset, 200, "OK"));
    // })
    .catch(err => {
        sql.close();

        console.log(err);
        res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
    })
});

router.post('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var body = req.body;

    sql.connect(config).then(pool => {
        return pool.request()
        .input('BoardId', sql.UniqueIdentifier, body.BoardId)
        .input('GasId', sql.UniqueIdentifier, body.GasId)
        .input('Name', sql.VarChar, body.Name)
        .input('ShortDescription', sql.VarChar, body.ShortDescription)
        .input('FullDescription', sql.VarChar, body.FullDescription)
        .input('LoadResistance', sql.Decimal, body.LoadResistance)
        .input('ReceivedVolts', sql.Decimal, body.ReceivedVolts)
        .input('CreatedBy', sql.UniqueIdentifier, body.CreatedBy)
        .input('Status', sql.Bit, body.Status)
        .execute('usp_Sensor_Create')
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