var mysql = require('mysql2');

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "7Gb3Mkcj4A-",
    database: "eGts"
});


module.exports = pool.promise();
