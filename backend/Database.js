const mysql = require('mysql2');
require('dotenv').config();

export const db = mysql.createPool(process.env.DATABASE_URL);


db.connect((err) => {
    if (err) {
        console.log("Database connection failed", err);
    } else {
        console.log("Database connected successfully.");
    }
});

module.exports = db;
