var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");

router.get('/SensorId/:SensorId', function(req, res) {
    console.log('receiving data ...');
    console.log('query is ', req.query);

    var pool = database.getPool();

    pool.getConnection(function(error, connection) {
        if (error) {
            console.log(error);
            res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
            return
        }
        
        let sql = 'CALL usp_SensorReading_Get(?,?,?,?,?)';
        let params = [
            req.params.SensorId, 
            req.query.StartDate, 
            req.query.EndDate, 
            req.query.PageNumber, 
            req.query.PageSize
        ];
    
        connection.query(sql, params, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
                return
            }

            var promises = [];

            results[0].forEach(element => {
                promises.push(
                    new Promise(function(resolve, reject) {
                        try {
                            connection.query('CALL usp_AirQuality_Get(?,?)', [element.AirQualityId, null], (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    return
                                }
    
                                element.AirQuality = results[0][0]
                                delete element.AirQualityId

                                return resolve(results[0][0]);
                            })
                        } catch (err) {
                            return reject(err);
                        }
                    })
                )
            })
    
            Promise.all(promises).then(() => {
                connection.release()
            
                console.log(results[0])
                res.json(helper.getResponseObject(results[0], 200, "OK"));
            });
        });  
    });
});

router.post('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var pool = database.getPool();

    let sql = 'CALL usp_SensorReading_Create(?,?,?,?,?)';
    let params = [
        req.body.SensorId, 
        req.body.ReadingVolts,
        req.body.SensorResistance,
        req.body.KnownConcentrationSensorResistance,
        req.body.GasPpm
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

router.get('/Daily/SensorId/:SensorId', function(req, res) {
    console.log('receiving data ...');
    console.log('query is ', req.query);

    var pool = database.getPool();

    pool.getConnection(function(error, connection) {
        if (error) {
            console.log(error);
            res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
            return
        }

        let sql = 'CALL usp_SensorReading_GetDailyAverage(?,?,?)';
        let params = [req.params.SensorId, req.query.StartDate, req.query.EndDate];
    
        connection.query(sql, params, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
                return
            }

            var promises = [];

            var SensorId = req.params.SensorId
            var SensorObject = null;

            promises.push(
                new Promise(function(resolve, reject) {
                    try {
                        connection.query('CALL usp_Sensor_Get(?,?)', [SensorId, null], (error, results, fields) => {
                            if (error) {
                                console.log(error);
                                return
                            }

                            SensorObject = results[0][0]

                            return resolve(results[0][0]);
                        })
                    } catch (err) {
                        return reject(err);
                    }
                })
            )

            results[0].forEach(element => {
                promises.push(
                    new Promise(function(resolve, reject) {
                        try {
                            connection.query('CALL usp_AirQuality_Get(?,?)', [element.AirQualityId, null], (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    return
                                }
    
                                element.AirQuality = results[0][0]
                                delete element.AirQualityId
    
                                return resolve(results[0][0]);
                            })
                        } catch (err) {
                            return reject(err);
                        }
                    })
                )
            })
            
            Promise.all(promises).then(() => {
                connection.release()       

                var responseData = {
                    Sensor: SensorObject,
                    DailyAverages: results[0]
                }

                console.log(responseData)
                res.json(helper.getResponseObject(responseData, 200, "OK"));
            });
        });  
    });
});

module.exports = router;