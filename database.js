var mysql = require('mysql');

var config = {
  host     : 'ls-7f09f4cf79d05140044e361231125e68f520b9bd.cryas4khayxj.us-east-1.rds.amazonaws.com',
  user     : 'dbmasteruser',
  password : 'l+zM6;!Wt(Q]b7zyI[sPjKEFOCj*GU4o',
  database : 'simgas',
  // connectionLimit : 1000
}

var getConnection = function (){
  return mysql.createConnection(config)
}

var getPool = function (){
  return mysql.createPool(config)
}

module.exports = {getConnection, getPool};