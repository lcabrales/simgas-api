var mysql = require('mysql');

var config = {
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'simgas',
  connectionLimit : 1000
}

var getConnection = function (){
  return mysql.createConnection(config)
}

var getPool = function (){
  return mysql.createPool(config)
}

module.exports = {getConnection, getPool};