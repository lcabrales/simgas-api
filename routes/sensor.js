var express = require("express");
var router = express.Router();
var database = require("../database");
var helper = require("../helper");

router.get('/', function(req, res) {
    console.log('receiving data ...');
    console.log('query is ', req.query);

    var pool = database.getPool();

    pool.getConnection(function(error, connection) {
        if (error) {
            console.log(error);
            res.json(helper.getResponseObject(null, 500, "Un error ha ocurrido"))
            return
        }

        let sql = 'CALL usp_Sensor_Get(?,?)';
        let params = [req.query.SensorId, req.query.BoardId];
    
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
                            connection.query('CALL usp_Board_Get(?)', [element.BoardId], (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    return
                                }
    
                                element.Board = results[0][0]
                                delete element.BoardId

                                return resolve(results[0][0]);
                            })
                        } catch (err) {
                            return reject(err);
                        }
                    })
                )

                promises.push(
                    new Promise(function(resolve, reject) {
                        try {
                            connection.query('CALL usp_Gas_Get(?)', [element.GasId], (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    return
                                }
        
                                element.Gas = results[0][0]
                                delete element.GasId

                                return resolve(results[0][0]);
                            })
                        } catch (err) {
                            return reject(err);
                        }
                    })
                )

                element.LastSensorReading = null
                promises.push(
                    new Promise(function(resolve, reject) {
                        try {
                            connection.query('CALL usp_SensorReading_Get_Latest(?)', [element.SensorId], (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    return
                                }
        
                                element.LastSensorReading = results[0][0]

                                return resolve(results[0][0]);
                            })
                        } catch (err) {
                            return reject(err);
                        }
                    })
                )
            })

            Promise.all(promises).then(() => {
                promises = [];
                results[0].forEach(element => {
                    if (element.LastSensorReading){
                        promises.push(
                            new Promise(function(resolve, reject) {
                                try {
                                    connection.query('CALL usp_AirQuality_Get(?)', [element.LastSensorReading.AirQualityId], (error, results, fields) => {
                                        if (error) {
                                            console.log(error);
                                            return
                                        }
        
                                        element.LastSensorReading.AirQuality = results[0][0]
                                        delete element.LastSensorReading.AirQualityId
        
                                        return resolve(results[0][0]);
                                    })
                                } catch (err) {
                                    return reject(err);
                                }
                            })
                        )
                    }
                })

                Promise.all(promises).then(() => {
                    connection.release();
                
                    console.log(results[0])
                    res.json(helper.getResponseObject(results[0], 200, "OK"));
                });
            });  
        });
    });
});

router.post('/', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);

    var pool = database.getPool();

    let sql = 'CALL usp_Sensor_Create(?,?,?,?,?,?,?,?,?)';
    let params = [
        req.body.BoardId, 
        req.body.GasId,
        req.body.Name,
        req.body.ShortDescription,
        req.body.FullDescription,
        req.body.LoadResistance,
        req.body.ReceivedVolts,
        req.body.CreatedBy,
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