var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var sql = require('mssql/msnodesqlv8');
var config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={MSI\\SQLEXPRESS};Database={SIMGAS};Trusted_Connection={yes};',
};
 
sql.on('error', err => {
    // ... error handler
    console.log(err);
})

app.get('/Users', function (req, res) {
    sql.connect(config).then(pool => {
        return pool.request()
        .execute('usp_User_Get')
    }).then(result => {
        console.log(result)
        res.json(result);
    }).catch(err => {
        console.log(err);
    })
 });

 app.post('/SensorReading', function(req, res) {
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
        .input('CreatedBy', sql.UniqueIdentifier, body.CreatedBy)
        .execute('usp_SensorReading_Create')
    }).then(result => {
        console.log(result)
        res.json(result);
    }).catch(err => {
        console.log(err);
    })
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
})