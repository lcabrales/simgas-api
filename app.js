var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var sensorReadingRouter = require('./routes/sensor-reading');
var sensorRouter = require('./routes/sensor');

app.use('/SensorReading', sensorReadingRouter);
app.use('/Sensor', sensorRouter);

app.listen(3000, () => {
 console.log("Server running on port 3000");
})

module.exports = app;