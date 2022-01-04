/* mysql connection setting 2018-10-08 */
var mysql = require('mysql');
var conn = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'admin',
	password: 'oqdb!!23',
	database: 'onquizdb'
});

module.exports = conn;