const mysql = require('mysql2');
require('dotenv').config(); 

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


connection.connect(err => {
    if(err) {
        console.error('Erreur de connexion à la base de données: ' + err.stack);
        return;
    }
    console.log('Connecté à la base de données avec l\'ID ' + connection.threadId);
});

function keepAlive() {
    setInterval(() => {
        connection.query('SELECT 1', (err, results) => {
            if (err) {
                console.error('Error during database keep-alive:', err);
            } else {
                console.log('Database connection is alive');
            }
        });
    }, 600000); // 1 minute interval, adjust as needed
}

// Start the keep-alive function
keepAlive();

global.db = connection;
module.exports = connection;