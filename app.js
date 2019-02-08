var express = require("express");
var app = express();

var tediousExpress = require('express4-tedious');
var app = express();

var sql = require('mssql/msnodesqlv8');
var config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client XX.0};Server=MSI\\SQLEXPRESS};Database={SIMGAS};Trusted_Connection={yes};',
};

sql.connect(config)
.then(function() {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
})
.catch(function(err) {
    res.json(["Tony","Lisa","Michael","Ginger","Food", "BAD"]);
});

// app.use(function (req, res, next) {
//     req.sql = tediousExpress(connection);
//     next();
// });

app.get('/Users', function (req, res) {
    req.sql("select * from Users for json path")
        .into(res, '{}');
 });

app.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
   });

app.listen(3000, () => {
 console.log("Server running on port 3000");
})