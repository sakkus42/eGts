var mysql = require('mysql2');

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "eGts"
});


module.exports = pool.promise();
