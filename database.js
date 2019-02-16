var sql = require('mssql/msnodesqlv8');
var config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={MSI\\SQLEXPRESS};Database={SIMGAS};Trusted_Connection={yes};',
};
 
sql.on('error', err => {
    // ... error handler
    console.log(err);
})

module.exports = {config, sql};