const db = require("../database");
const GroupVehicule = {
  // Start Create
  createGroup: (groupData, callback) => {
    const { id_user, nom_groupe, color_groupe, date_creation_groupe } =
      groupData;
    // const draft_groupe = 0; // Fixer la valeur de draft_groupe à 0
    const sql =
      "INSERT INTO vehicule_groupe (id_user, nom_groupe, color_groupe, date_creation_groupe) VALUES (?,  ?, ?, ?)";

    db.query(
      sql,
      [id_user, nom_groupe, color_groupe, date_creation_groupe],
      (err, results) => {
        if (err) {
          console.error(
            "Erreur lors de la création du groupe : " + err.message
          );
          callback(err, null);
        } else {
          callback(null, results.insertId); // Renvoie l'ID du groupe nouvellement créé
        }
      }
    );
  },


  duplicateGroup: (id_groupe, callback) => {
    // Récupérer les données du groupe à dupliquer
    const sqlSelect = "SELECT * FROM vehicule_groupe WHERE id_groupe = ?";
    db.query(sqlSelect, [id_groupe], (selectErr, selectResults) => {
        if (selectErr) {
            console.error("Erreur lors de la récupération du groupe à dupliquer : " + selectErr.message);
            callback(selectErr, null);
        } else {
            // Dupliquer le groupe en ajoutant "(001)" au nom
            const originalGroup = selectResults[0];
            const duplicatedGroupName = `${originalGroup.nom_groupe} 001`;

            // Insérer le nouveau groupe duplicat
            const sqlInsert = "INSERT INTO vehicule_groupe (id_user, nom_groupe, color_groupe, date_creation_groupe) VALUES (?, ?, ?, ?)";
            db.query(sqlInsert, [originalGroup.id_user, duplicatedGroupName, originalGroup.color_groupe, originalGroup.date_creation_groupe], (insertErr, insertResults) => {
                if (insertErr) {
                    console.error("Erreur lors de la duplication du groupe : " + insertErr.message);
                    callback(insertErr, null);
                } else {
                    callback(null, insertResults.insertId); // Renvoie l'ID du nouveau groupe créé
                }
            });
        }
    });
  },
// END Create

// Start Read

  getGroupVehiculeANDCountVehicule: (page, limit, id_user, callback) =>{

    let sql = "";
    if (id_user == 1) {
      sql = `SELECT *, (SELECT COUNT(*) FROM vehicule WHERE vehicule.draft = 0 AND vehicule.id_groupe = vehicule_groupe.id_groupe) as totalVehicles FROM vehicule_groupe WHERE draft_groupe = 0  ORDER BY vehicule_groupe.id_groupe ASC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
      db.query(sql, (err, results) => {
        if (err) {
          console.error(
            "Erreur lors de la récupération du groupe : " + err.message
          );
          callback(err, null);
        } else {
          callback(null, results);
        }
      });
    } else {
      sql = `SELECT *, (SELECT COUNT(*) FROM vehicule WHERE vehicule.draft = 0 AND vehicule.id_groupe = vehicule_groupe.id_groupe) as totalVehicles FROM vehicule_groupe WHERE draft_groupe = 0 AND id_user = ${id_user} ORDER BY vehicule_groupe.id_groupe ASC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
      db.query(sql, (err, results) => {
        if (err) {
          console.error(
            "Erreur lors de la récupération du groupe :" + err.message
          );
          callback(err, null);
        } else {
          callback(null, results);
        }
      });
    }
  },

  getGroupVehiculeANDCountVehiculeSort: (page, limit, id_user,  sortOrder,sortColumn, searchColumn, searchValue, callback) => {
    let sql = "";
    const params = [];

    if (id_user == 1) {
      sql = `
        SELECT *, 
          (SELECT COUNT(*) FROM vehicule WHERE vehicule.draft = 0 AND vehicule.id_groupe = vehicule_groupe.id_groupe) as totalVehicles 
        FROM vehicule_groupe 
        WHERE draft_groupe = 0`;
    } else {
      sql = `
        SELECT *, 
          (SELECT COUNT(*) FROM vehicule WHERE vehicule.draft = 0 AND vehicule.id_groupe = vehicule_groupe.id_groupe) as totalVehicles 
        FROM vehicule_groupe 
        WHERE draft_groupe = 0 AND id_user = ?`;
        params.push(id_user);
    }

    if (searchValue != null && searchColumn != null && searchValue != "") {
      sql += ` AND ${searchColumn} LIKE ?`;
      params.push(`%${searchValue}%`);
    }

    sql += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération du groupe : " + err.message);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
},


  
  getOptionsByUserId: (id_user, callback) => {
    // Si l'utilisateur est l'administrateur (ID 1), récupérez tous les utilisateurs
    if (id_user === "1") {
      const sql = `
        SELECT id_user, nom_user, prenom_user
        FROM user
        `;
      db.query(sql, callback);
    } else {
      // Sinon, récupérez les options associées à l'ID utilisateur spécifique
      const sql = `
        SELECT id_user, nom_user, prenom_user
        FROM user
        WHERE id_user = ${db.escape(id_user)}
      `;
      db.query(sql, callback);
    }
  },


  getGroupsByUserId: (id_user, callback) => {

    let sql;
   
    if (id_user === 1) {
      sql = 'SELECT vehicule_groupe.id_groupe, vehicule_groupe.nom_groupe FROM vehicule_groupe';
    } else {
      sql = `
        SELECT vehicule_groupe.id_groupe, vehicule_groupe.nom_groupe  FROM vehicule_groupe
        WHERE vehicule_groupe.id_user IN (
          SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user} 
        )
      `;
    }

    db.query(sql, callback);

  },

  getDeletedGroupsVehicule: (id_user, callback) => {
    let sql = '';
  
    if (id_user == 1) {
      // Super admin condition
      sql = `SELECT * FROM vehicule_groupe WHERE draft_groupe != 0 ORDER BY vehicule_groupe.id_groupe`;
    } else {
      // Other user condition
      sql = `SELECT * FROM vehicule_groupe WHERE draft_groupe = ${id_user}`;
    }
  
    db.query(sql, callback);
  },
  
  getDateForGroupIds: (id_groupes, callback) => {
    const sql = `
      SELECT vehicule_groupe.nom_groupe, vehicule_groupe.color_groupe, 
            (SELECT COUNT(*) 
              FROM vehicule 
              WHERE vehicule.draft = 0 AND vehicule.id_groupe = vehicule_groupe.id_groupe) as totalVehicles,  vehicule_groupe.date_creation_groupe
      FROM vehicule_groupe 
      WHERE vehicule_groupe.draft_groupe = 0 AND vehicule_groupe.id_groupe IN (?);
    `;
    db.query(sql, [id_groupes], callback);
  },
  
  

  getDeletedGroupCount: (id_user, callback) => {
    let sql = '';
  
    if (id_user == 1) {
      // Super admin condition
      sql = `SELECT COUNT(*) as total FROM vehicule_groupe WHERE vehicule_groupe.draft_groupe != 0`;
    } else {
      // Other user condition
      sql = `SELECT COUNT(*) as total FROM vehicule_groupe WHERE vehicule_groupe.draft_groupe != 0 AND vehicule_groupe.draft_groupe = ${id_user}`;
    }
  
    db.query(sql, callback);
  },


  getALLCount: (id_user, searchValue, searchColumn, callback) => {
      let sql = "";
      let params = [];
      if (id_user == 1) {
        sql =
          "SELECT COUNT(*) as total FROM vehicule_groupe WHERE draft_groupe = 0";
      } else {
        sql = `SELECT COUNT(*) as total FROM vehicule_groupe WHERE draft_groupe = 0 AND id_user = ?`;
        params.push(id_user);
      }

      if (searchValue != null && searchColumn != null) {
        sql += ` AND ${searchColumn} LIKE ?`;
        params.push(`%${searchValue}%`);
      }
  
      db.query(sql, params,callback);
  },
  getALL: (id_user, callback) => {
      let sql = "";
  
      if (id_user == 1) {
        sql =
          "SELECT vehicule_groupe.id_groupe, vehicule_groupe.nom_groupe, vehicule_groupe.color_groupe, vehicule_groupe.date_creation_groupe FROM vehicule_groupe WHERE draft_groupe = 0";
      } else {
        sql = `SELECT vehicule_groupe.id_groupe, vehicule_groupe.nom_groupe, vehicule_groupe.color_groupe, vehicule_groupe.date_creation_groupe FROM vehicule_groupe WHERE draft_groupe = 0 AND id_user = ${id_user}`;
      }
  
      db.query(sql, callback);
  },
  // END GET Count
// End Read


// Start Update
  updateGroup: (id_groupe, updatedData, callback) => {
    const { nom_groupe, id_user, color_groupe } = updatedData;
    const sql = 'UPDATE vehicule_groupe SET nom_groupe = ?, id_user = ?, color_groupe = ? WHERE id_groupe = ?';
  
  
    db.query(sql, [nom_groupe, id_user, color_groupe, id_groupe], (err, results) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du groupe : ' + err.message);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },

// END Update


// Start Delete
  softDeleteGroup: (id_groupe, loggedInUserID, callback) => {
    const sql =
      "UPDATE vehicule_groupe SET draft_groupe = ? WHERE id_groupe = ?";
    db.query(sql, [loggedInUserID, id_groupe], callback);
  },


  // Restore
  restoreDeletedGroupsVehicule: (id_groupe, callback) => {
    const sql = `UPDATE vehicule_groupe SET draft_groupe = 0 WHERE id_groupe = ${id_groupe}`;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erreur lors de la restauration des groupes de véhicules supprimés : " + err.message);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
  },

// END Delete
};

module.exports = GroupVehicule;
