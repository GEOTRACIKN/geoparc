
const db = require("../database");
const GroupDevice = {
  // Start Create
  createGroup: (groupData, callback) => {
    const { id_user, nom_groupe, description_groupe, date_update } =
      groupData;

    const sql =
      "INSERT INTO `groupe` (id_user, nom_groupe, description_groupe, date_update) VALUES ( ?, ?, ?,?)";

      db.query(
        sql,
        [id_user, nom_groupe, description_groupe, date_update],
        (err, results) => {
          if (err) {
            console.error("Erreur SQL lors de la création du groupe : " + err.message);
            callback(err, null);
          } else {
            callback(null, results.insertId);
          }
        }
      );      
  },


  // END Create


// Start Read
getAllGroups: function (page, limit, id_user, sortColumn, sortOrder, searchValue, searchColumn, callback) {
  let sql = '';
  let params = [];

  if (id_user == 1) {
    sql = `SELECT * FROM groupe WHERE intrash = 0`;
  } else {
    sql = `SELECT * FROM groupe WHERE intrash = 0 AND id_user = ?`;
    params.push(id_user);
  }

  if (searchValue != null && searchColumn != null && searchValue != "") {
    sql += ` AND ${searchColumn} LIKE ?`;
    params.push(`%${searchValue}%`);
  }

  sql += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(limit, (page - 1) * limit);

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération du groupe : " + err.message);
      return callback(err, null);
    } else {
      return callback(null, results);
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
  
  // Start Get Count
  getALLCount: (id_user, searchValue, searchColumn, callback) => {
    let sql = "";
    let params = [];
    if (id_user == 1) {
      sql =
        "SELECT COUNT(*) as total FROM groupe WHERE intrash = 0";
    } else {
      sql = `SELECT COUNT(*) as total FROM groupe WHERE intrash = 0 AND id_user = ?`;
      params.push(id_user);
    }
    if (searchValue != null && searchColumn != null && searchValue != "") {
      sql += ` AND ${searchColumn} LIKE ?`;
      params.push(`%${searchValue}%`);
    }
    db.query(sql,params, callback);
},


  // END Get Count

  getDateForGroupIds: (id_groupes, callback) => {
    const sql = `SELECT id_groupe, nom_groupe, description_groupe, date_update FROM groupe WHERE intrash = 0 AND id_groupe IN (?)`;
    db.query(sql, [id_groupes], callback);
},




// END Read


// Start Update
updateGroup: (id_groupe, updatedData, callback) => {
  const { nom_groupe, id_user, description_groupe, date_update } = updatedData;
  const sql = 'UPDATE groupe SET nom_groupe = ?, id_user = ?, description_groupe = ?, date_update = ? WHERE id_groupe = ?';


  db.query(sql, [nom_groupe, id_user, description_groupe, date_update, id_groupe], (err, results) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du groupe : ' + err.message);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
},

// ENd Update

// Start Delete

getDeletedGroupCount: (id_user, callback) => {
  let sql = '';

  if (id_user == 1) {
    // Super admin condition
    sql = `SELECT COUNT(*) as total FROM groupe WHERE groupe.intrash != 0`;
  } else {
    // Other user condition
    sql = `SELECT COUNT(*) as total FROM groupe WHERE groupe.intrash != 0 AND groupe.intrash = ${id_user}`;
  }

  db.query(sql, callback);
},


softDeleteGroup: (id_groupe, loggedInUserID, callback) => {
  const sql =
  "UPDATE groupe SET intrash = ? WHERE id_groupe = ?";
  db.query(sql, [loggedInUserID, id_groupe], callback);
},


getDeletedGroupsDevices: (id_user, callback) => {
  let sql = '';

  if (id_user == 1) {
    // Super admin condition
    sql = `SELECT * FROM groupe WHERE intrash != 0 ORDER BY groupe.id_groupe`;
  } else {
    // Other user condition
    sql = `SELECT * FROM groupe WHERE intrash = ${id_user}`;
  }

  db.query(sql, callback);
},


 // Restore
restoreDeletedGroupsVehicule: (id_groupe, callback) => {
  const sql = `UPDATE groupe SET intrash = 0 WHERE id_groupe = ${id_groupe}`;
  
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
}

module.exports =GroupDevice