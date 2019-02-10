var express = require("express");
var app = express();

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

app.listen(3000, () => {
 console.log("Server running on port 3000");
})