var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : 'classmysql.engr.oregonstate.edu',
  user : 'cs290_uchmanom',
  password : '8326',
  database : 'cs290_uchmanom',
  dateStrings : 'date'
});

module.exports.pool = pool;
