var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");

var sql = database.sql;
var config = database.config;

router.get('/SensorId/:SensorId', function(req, res) {
    console.log('receiving data ...');
    console.log('query is ', req.query);

    var query = req.query;

    sql.connect(config).then(pool => {
        globalPool = pool
        return pool.request()
        .input('SensorId', sql.UniqueIdentifier, req.params.SensorId)
        .input('StartDate', sql.DateTime, query.StartDate)
        .input('EndDate', sql.DateTime, query.EndDate)
        .execute('usp_SensorReading_Get')
    }).then(result => {
        var promises = [];
        result.recordset.forEach(element => {
            promises.push(globalPool.request()
                    .input('AirQualityId', sql.UniqueIdentifier, element.AirQualityId)
                    .execute('usp_AirQuality_Get')
                    .then(result => {
                        element.AirQuality = result.recordset[0]
                        delete element.AirQualityId
                    }).catch(err => {
                        console.log(err)
                    })
                )
        })

        Promise.all(promises).then(() => {
            sql.close()
        
            console.log(result)
            res.json(helper.getResponseObject(result.recordset, 200, "OK"));
        });
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

    sql.connect(config).then(pool => {
        return pool.request()
        .input('SensorId', sql.UniqueIdentifier, body.SensorId)
        .input('ReadingVolts', sql.Decimal, body.ReadingVolts)
        .input('SensorResistance', sql.Decimal, body.SensorResistance)
        .input('KnownConcentrationSensorResistance', sql.Decimal, body.KnownConcentrationSensorResistance)
        .input('GasPpm', sql.Decimal, body.GasPpm)
        .execute('usp_SensorReading_Create')
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

router.get('/Daily/SensorId/:SensorId', function(req, res) {
    console.log('receiving data ...');
    console.log('query is ', req.query);

    var query = req.query;

    sql.connect(config).then(pool => {
        globalPool = pool
        return pool.request()
        .input('SensorId', sql.UniqueIdentifier, req.params.SensorId)
        .input('StartDate', sql.DateTime, query.StartDate)
        .input('EndDate', sql.DateTime, query.EndDate)
        .execute('usp_SensorReading_GetDailyAverage')
    }).then(result => {
        var promises = [];

        var SensorId = req.params.SensorId
        var SensorObject = null;

        promises.push(globalPool.request()
                .input('SensorId', sql.UniqueIdentifier, SensorId)
                .execute('usp_Sensor_Get')
                .then(result => {
                    SensorObject = result.recordset[0]
                }).catch(err => {
                    console.log(err)
                })
            )

        result.recordset.forEach(element => {
            promises.push(globalPool.request()
                    .input('AirQualityId', sql.UniqueIdentifier, element.AirQualityId)
                    .execute('usp_AirQuality_Get')
                    .then(result => {
                        element.AirQuality = result.recordset[0]
                        delete element.AirQualityId
                    }).catch(err => {
                        console.log(err)
                    })
                )
        })
        
        Promise.all(promises).then(() => {
            sql.close()        

            var responseData = {
                Sensor: SensorObject,
                DailyAverages: result.recordset
            }

            console.log(responseData)
            res.json(helper.getResponseObject(responseData, 200, "OK"));
        });
    }).catch(err => {
        sql.close();

        console.log(err);
        res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
    })
});

module.exports = router;