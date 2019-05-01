var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var sensorReadingRouter = require('./routes/sensor-reading');
var sensorRouter = require('./routes/sensor');
var airQualityRouter = require('./routes/air-quality');
var gasRouter = require('./routes/gas');
var boardRouter = require('./routes/board');
var locationRouter = require('./routes/location');
var userRouter = require('./routes/user');
var roleUser = require('./routes/role');

app.use('/SensorReading', sensorReadingRouter);
app.use('/Sensor', sensorRouter);
app.use('/AirQuality', airQualityRouter);
app.use('/Gas', gasRouter);
app.use('/Board', boardRouter);
app.use('/Location', locationRouter);
app.use('/User', userRouter);
app.use('/Role', roleUser);

app.listen(3000, () => {
 console.log("Server running on port 3000");
})

module.exports = app;