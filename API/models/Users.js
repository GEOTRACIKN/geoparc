const db = require("../database"); // Assurez-vous que ceci pointe vers votre objet de connexion à la base de données
const crypto = require("crypto");

const Users = {
  // Fonction pour récupérer tous les utilisateurs
  getAllUsers: (page, limit, callback) => {
    const params = [limit, page];
    const sql = `SELECT * FROM user LIMIT ${limit} OFFSET ${page}`;
    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération de tous les utilisateurs : " +
            err.message
        );
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },

  getUserform(userId, callback) {
    const query = 'SELECT * FROM user WHERE id_user = ?';

    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur :', err);
        return callback(err, null);
      } else {
        return callback(null, result[0]); // Renvoie le premier résultat (l'utilisateur avec l'ID correspondant)
      }
    });
  },

  getByUserId: (page, limit, id_user,sortColumn, sortOrder, callback) => {
    // const params = [limit, page];
    let sql = "";

    if (id_user == 1) {
        sql = `SELECT * FROM user WHERE intrash = 0  ORDER BY ${sortColumn} ${sortOrder}
        LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    } else {
      // sql= `SELECT *,user_user.id_user AS idManager, user.id_user AS idmanageduser FROM user INNER JOIN user_user ON user.id_user = user_user.id_manageduser AND user_user.id_user=${id_user} AND intrash = 0 ORDER BY user.id_user ASC LIMIT ${limit} OFFSET ${(page - 1) * limit}`
      sql = `SELECT * FROM user WHERE user.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user}) AND intrash = 0  ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    }

    db.query(sql, [id_user], callback);
},

// Retrieve all Vehicle User Id
getAll: (id_user, callback) => {
    let sql = "";

    if (id_user == 1) {
        sql = `SELECT COUNT(*) as total FROM user WHERE intrash = 0`;
    } else {
        sql = `SELECT COUNT(*) as total FROM user WHERE user.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user}) AND intrash = 0`;
    }

    db.query(sql, callback);
},


  getOptionsByUserId: (id_user, callback) => {

    
    // Si l'utilisateur est l'administrateur (ID 1), récupérez tous les utilisateurs
    if (id_user == 1) {
      const sql = ` SELECT id_user, nom_user, prenom_user   FROM user`;
      db.query(sql, callback);
    } else { 
      // Sinon, récupérez les options associées à l'ID utilisateur spécifique
      const sql = ` SELECT id_user, nom_user, prenom_user FROM user WHERE id_user = ${id_user} `;
      db.query(sql, callback);
    }
  },


  checkUsernameExists: (username, callback) => {
    const sql = "SELECT * FROM user WHERE username_user = ?";
    const params = [username];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de la vérification du nom d'utilisateur : " + err.message
        );
        return callback(err, null);
      }

      const usernameExists = result.rowCount > 0;
      callback(null, usernameExists);
    });
  },

  getRolesByUserId: (id_user, callback) => {
    // Si l'utilisateur est l'administrateur (ID 1), récupérez tous les utilisateurs
    if (id_user === "1") {
      const sql = `
        SELECT  id_role, nom_role
        FROM role
      `;
      db.query(sql, callback);
    } else {
      // Sinon, récupérez les options associées à l'ID utilisateur spécifique
      const sql = `
        SELECT  id_role, nom_role
        FROM role
        WHERE id_role != 1 AND  id_role != 2
      `;
      db.query(sql, callback);
    }
  },

  
  //  Fonction pour verifyUser
  verifyUser: (username, callback) => {
    const sql = 'SELECT * FROM user WHERE username_user = ?';
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification de l\'utilisateur : ' + err.message);
        callback(err, null);
      } else {
        callback(null, results.length > 0);
      }
    });
  },

  insertRelUserUser: (manager, usermanaged, callback) => {
    try {
      const sqlCheckRelationship = `
        SELECT COUNT(*) AS count
        FROM user_user
        WHERE id_user = ? AND id_manageduser = ?
      `;
  
      const params = [manager, usermanaged];
  
      db.query(sqlCheckRelationship, params, (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          const count = result[0].count;
  
          if (count === 0) {
            // Relationship does not exist, proceed to insert
            const sqlRelUserUser = `
              INSERT INTO user_user (id_user, id_manageduser)
              VALUES (?, ?)
            `;
  
            db.query(sqlRelUserUser, params, (err, result) => {
              if (err) {
                callback(err, null);
              } else {
                const relationId = result.insertId;
                callback(null, relationId);
              }
            });
          } else {
            // Relationship already exists, do nothing and return
            callback(null, 0);
          }
        }
      });
    } catch (err) {
      callback(err, null);
    }
  },
  
  addUser: (
    nom_user,
    prenom_user,
    password_user,
    email_user,
    username_user,
    wilaya,
    phone_user,
    userM,
    id_role,
    validite,
    callback
  ) => {
    const HashedPassord = crypto
      .createHash("sha512")
      .update(password_user)
      .digest("hex");
    const dateCreat = new Date().toISOString().slice(0, 19).replace("T", " ");
  
    try {
      const sqluser = `INSERT INTO user (nom_user, prenom_user, password_user, email_user, username_user, wilaya, phone_user, date_creation_user, id_role, validite)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
      const params = [
        nom_user,
        prenom_user,
        HashedPassord,
        email_user,
        username_user,
        wilaya,
        phone_user,
        dateCreat,
        id_role,
        validite
      ];
  
      db.query(sqluser, params, (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          const userId = result.insertId;
  
          // Insert a relationship where the user manages themselves in the user_user table
          Users.insertRelUserUser(userId, userId, (relErr, relationId) => {
            if (relErr) {
              callback(relErr, null);
            } else {
              // If the user has a manager (userM), also add the relationship with the manager
              if (userM) {
                Users.insertRelUserUser(userM, userId, (relErr, relationId) => {
                  if (relErr) {
                    callback(relErr, null);
                  } else {
                    callback(null, userId);
                  }
                });
              } else {
                callback(null, userId);
              }
            }
          });
        }
      });
    } catch (err) {
      callback(err, null);
    }
  },
  

  // Fonction pour mettre à jour un utilisateur

  updateRelUserUser: (manager, usermanaged, callback) => {
    try {
      const sqlUpdateRelUserUser = `
        UPDATE user_user
        SET id_user=?
        WHERE id_manageduser=?
      `;

      const params = [manager, usermanaged];

      db.query(sqlUpdateRelUserUser, params, (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      });
    } catch (err) {
      callback(err, null);
    }
  },

updateUser: (
  userId,
  nom_user,
  prenom_user,
  password_user,
  email_user,
  username_user,
  wilaya,
  phone_user,
  userM,
  id_role,
  validite,
  callback
) => {
  const HashedPassword = crypto
    .createHash("sha512")
    .update(password_user)
    .digest("hex");
  const dateUpdate = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const sqlUpdateUser = `
      UPDATE user
      SET nom_user=?, prenom_user=?, password_user=?, email_user=?, username_user=?,
          wilaya=?, phone_user=?, date_modification_user=? , id_role=?, validite=?
      WHERE id_user=?
    `;

    const params = [
      nom_user,
      prenom_user,
      HashedPassword,
      email_user,
      username_user,
      wilaya,
      phone_user,
      dateUpdate,
      id_role,
      validite,
      userId,
    ];

    db.query(sqlUpdateUser, params, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        // Si l'utilisateur est associé à un autre utilisateur, mettez à jour la relation
        if (userM) {
          Users.updateRelUserUser(userM, userId, (relErr, relationId) => {
            if (relErr) {
              callback(relErr, null);
            } else {
              callback(null, userId);
            }
          });
        } else {
          callback(null, userId);
        }
      }
    });
  } catch (err) {
    callback(err, null);
  }
},
// API delete logique model

softDeleteUser: (id_user, loggedInUserID, callback) => {
  const sql = 'UPDATE user SET intrash = ?, date_suppression_user = NOW() WHERE id_user = ?';
  db.query(sql, [loggedInUserID, id_user], callback);
},
// API restore model

restoreUser: (id_user, callback) => {
  const sql = 'UPDATE user SET intrash = 0 WHERE id_user = ?';
  db.query(sql, [id_user], callback);
},
// API getDeletedUsers model
getDeletedUsers: (page, limit, id_user, callback) => {
  const params = [limit, page];
  let sql = '';

  if (id_user == 1) {
    // Super admin condition
    sql = `SELECT id_user, username_user as name FROM user WHERE user.intrash != 0 ORDER BY user.id_user`;
  } else {
    // Other user condition
    sql = `SELECT id_user, username_user as name FROM user WHERE user.intrash = ${id_user} ORDER BY user.id_user`;
  }

  db.query(sql, params, callback);
},
// API model
getDeletedUsersCount: (id_user, callback) => {
  let sql = '';

  if (id_user == 1) {
    // Super admin condition
    sql = `SELECT COUNT(*) as total FROM user WHERE user.intrash != 0`;
  } else {
    // Other user condition
    sql = `SELECT COUNT(*) as total FROM user WHERE user.intrash != 0 AND user.intrash = ${id_user}`;
  }

  db.query(sql, callback);
},



updateUserAuthInfo: (id_user,last_auth_duration,last_auth, callback) => {
  try {
  
    // Update last_auth and increment nbre_auth for the specified id_user
    const updateQuery = `
      UPDATE log_auth_user
      SET last_auth = ?, nbre_auth = nbre_auth + 1, last_auth_duration = ?
      WHERE id_user = ?
    `;
    db.query(updateQuery, [last_auth, last_auth_duration,id_user], (err, result) => {

      if (err) {
    console.error("Error updating user auth info:", err.message);
    // Handle error
  } else {
    console.log(result.message); // Log success message
    // Handle success
  }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    callback(error, null);
  }
},

 logUserAction : (userID,operation, page, action,  timestamp, details, callback) => {
  const sql = `INSERT INTO log_users (id_user, operation_user, table_operation, type_operation, date_operation, info_operation) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [userID, operation, page, action, timestamp, details];

  db.query(sql, values, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
},

getUserName(userId, callback) {
  const query = 'SELECT nom_user, prenom_user, username_user FROM user WHERE id_user = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des détails de l\'utilisateur :', err);
      return callback(err, null);
    } else {
      return callback(null, result[0]); // Renvoie le premier résultat (l'utilisateur avec l'ID correspondant)
    }
  });
},




};





module.exports = Users;
