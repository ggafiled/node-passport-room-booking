var mysql = require('mysql');
var util = require('util');
var dbconnection = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'room_booking',
    debug: false
});
dbconnection.on('connection', function (connection) {
    console.log('DB Connection established');
    connection.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });

});

dbconnection.query = util.promisify(dbconnection.query)

module.exports = dbconnection;