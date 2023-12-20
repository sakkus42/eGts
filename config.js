var mysql = require('mysql2');

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "eGts"
});


module.exports = pool.promise();
