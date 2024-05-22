const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 0,
  queueLimit: 0,
});

console.log("Pool de connexions créé");

async function keepAlive(pool) {
  setInterval(async () => {
    try {
      await pool.query("SELECT 1");
      console.log("Database connection is alive");
    } catch (err) {
      console.error("Error during database keep-alive:", err);
    }
  }, 600000); // 10 minutes interval, adjust as needed
}

// Appelez keepAlive pour maintenir les connexions actives
keepAlive(pool);

module.exports = pool;
