require('dotenv').config();
const mysql = require('mysql');
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: process.env.DBPW,
    database: process.env.DBDATABASE,
    port: '3305',
});

module.exports = db;
