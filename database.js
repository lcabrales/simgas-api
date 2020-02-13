var mysql = require('mysql');

var config = {
  host     : 'ls-0a970c2647a89a5a7897529e031b54e28ce81b26.cryas4khayxj.us-east-1.rds.amazonaws.com',
  user     : 'dbmasteruser',
  password : '>9Mh*|K7[3d<3mox^GTaN[ww[AoN-B~a',
  database : 'simgas'
}

const pool = mysql.createPool(config);

var getPool = function (){
  return pool
}

module.exports = {getPool};