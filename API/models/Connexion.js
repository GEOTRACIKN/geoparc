const db = require("../database"); // Assurez-vous que ceci pointe vers votre objet de connexion à la base de données
const Connexion = {
    getAllConn: (page, limit, userId, callback) => {
        
        let query = "";
        if (userId == 1) {
            query = `SELECT log_auth_user.idlogauth, log_auth_user.id_user, log_auth_user.nbre_auth, log_auth_user.last_auth, log_auth_user.last_auth_duration, user.nom_user, user.prenom_user
                FROM log_auth_user
                JOIN user ON log_auth_user.id_user = user.id_user
                ORDER BY log_auth_user.last_auth DESC
                LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
        } else {
            query = `SELECT log_auth_user.idlogauth, log_auth_user.id_user, log_auth_user.nbre_auth, log_auth_user.last_auth, log_auth_user.last_auth_duration, user.nom_user, user.prenom_user
                FROM log_auth_user
                JOIN user ON log_auth_user.id_user = user.id_user
                WHERE log_auth_user.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user = ${userId})
                ORDER BY log_auth_user.last_auth DESC
                LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
        }
        
        db.query(query, callback);
    },

    
    allConnCount:  (userId, callback) => {
        let countQuery = "";

        // Count query to get total number of records
        if (userId == 1) {
            countQuery = `SELECT COUNT(*) AS total FROM log_auth_user`;
        } else {
            countQuery = `SELECT COUNT(*) AS total FROM log_auth_user WHERE log_auth_user.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user = ${userId})`;
        }

        // Execute count query
        db.query(countQuery, callback); // Pass the callback directly to db.query
    },

    getHisory: (page, limit, userId, callback) => {
        let query = "";
        if (userId == 1) {
            query = `SELECT log_users.idlog, log_users.id_user, log_users.operation_user, log_users.table_operation, log_users.type_operation,log_users.date_operation,
            log_users.info_operation, user.nom_user, user.prenom_user
                FROM log_users
                JOIN user ON log_users.id_user = user.id_user
                ORDER BY log_users.date_operation DESC
                LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
        } else {
            query = `SELECT log_users.idlog, log_users.id_user, log_users.operation_user, log_users.table_operation, log_users.type_operation,log_users.date_operation,
            log_users.info_operation, user.nom_user, user.prenom_user
                FROM log_users
                JOIN user ON log_users.id_user = user.id_user
                WHERE log_users.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user = ${userId})
                ORDER BY log_users.date_operation DESC
                LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
        }
        
        db.query(query, callback);
    },

    
    HistoryCount:  (userId, callback) => {
        let countQuery = "";

        // Count query to get total number of records
        if (userId == 1) {
            countQuery = `SELECT COUNT(*) AS total FROM log_users`;
        } else {
            countQuery = `SELECT COUNT(*) AS total FROM log_users WHERE log_users.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user = ${userId})`;
        }

        // Execute count query
        db.query(countQuery, callback); // Pass the callback directly to db.query
    },
    
    


};

module.exports= Connexion;


