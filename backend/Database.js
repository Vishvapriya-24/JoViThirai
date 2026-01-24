const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool(process.env.DATABASE_URL);

db.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Database connected successfully.");
    connection.release();
  }
});

module.exports = db;
