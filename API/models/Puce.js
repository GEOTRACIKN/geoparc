const db = require("../database");
const Puce = {

  // Retrieve all puce User Id
  getAllUserId: (page,limit,id_user,callback) => { 

    let  sql="";
    
    if (id_user === 1) {
        sql=`SELECT * FROM puce  ORDER BY puce.id_puce ASC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;   

    } else {
       sql=`SELECT * FROM puce WHERE puce.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})  ORDER BY puce.id_puce ASC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
      
    }
    
    
    db.query(sql,callback);
  },

   // Retrieve all puce User Id
  
// imported

getALLCount: (id_user,callback) => { 

   
  let sql = `SELECT * FROM puce`;

  if (id_user === 1) {
     sql=`SELECT COUNT(*) as totalpuces FROM puce`;  
  } else {
    sql=`SELECT COUNT(*) as totalpuces FROM puce WHERE puce.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})`;

  }

  db.query(sql,callback);
},

createSimcard: (groupData, callback) => {
  const { id_user, operateur_puce, numero_puce, type_puce,contrat_puce,serial_number,date_creation_carte_sim } =
    groupData;
  // const draft = 0; // Fixer la valeur de draft à 0

  const sql =
    "INSERT INTO puce (id_user, operateur_puce, numero_puce, type_puce,contrat_puce,serial_number,date_creation_carte_sim) VALUES (?,  ?, ?, ?,  ?, ?, ?)";

  db.query(
    sql,
    [id_user, operateur_puce, numero_puce, type_puce,contrat_puce,serial_number,date_creation_carte_sim],
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



// END Create

// Start Read



getSimcardsSort: (page, limit, id_user, sortColumn, sortOrder, callback) => {
  const params = [limit, page];
  let sql = "";

  if (id_user == 1) {
    sql = `
      SELECT * 
      FROM puce 
      WHERE draft = 0  
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  } else {
    sql = `
      SELECT *
      FROM puce 
      WHERE draft = 0 AND id_user = ${id_user} 
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération du groupe : " + err.message);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
},

getSimcards: (id_user, callback) => {
  let sql = "";

  if (id_user == 1) {
    sql = `
      SELECT * 
      FROM puce 
      WHERE draft = 0  
     `;
  } else {
    sql = `
      SELECT *
      FROM puce 
      WHERE draft = 0 AND id_user = ${id_user} 
     `;
  }

  db.query(sql, (err, results) => {
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

getDeletedSimcards: (id_user, callback) => {
  let sql = '';

  if (id_user == 1) {
    // Super admin condition
    sql = `SELECT * FROM puce WHERE draft != 0 ORDER BY puce.id_puce`;
  } else {
    // Other user condition
    sql = `SELECT * FROM puce WHERE draft = ${id_user}`;
  }

  db.query(sql, callback);
},



// Start GET Count



getDeletedSimcardsCount: (id_user, callback) => {
  let sql = '';

  if (id_user == 1) {
    // Super admin condition
    sql = `SELECT COUNT(*) as total FROM puce WHERE puce.draft != 0`;
  } else {
    // Other user condition
    sql = `SELECT COUNT(*) as total FROM puce WHERE puce.id_user = ${id_user} AND puce.draft != 0`;
  }

  db.query(sql, callback);
},


getALLCount: (id_user, callback) => {
    let sql = "";

    if (id_user == 1) {
      sql =
        "SELECT COUNT(*) as total FROM puce WHERE draft = 0";
    } else {
      sql = `SELECT COUNT(*) as total FROM puce WHERE draft = 0 AND id_user = ${id_user}`;
    }

    db.query(sql, callback);
},
// END GET Count
// End Read


// Start Update
updateSimcard: (id_puce, updatedData, callback) => {
  const { id_user, operateur_puce, numero_puce, type_puce,contrat_puce,serial_number,date_creation_carte_sim } = updatedData;
  const sql = 'UPDATE puce SET id_user = ?, operateur_puce = ?, numero_puce = ?, type_puce = ?, contrat_puce = ?, serial_number = ?, date_creation_carte_sim = ? WHERE id_puce = ?';


  db.query(sql, [id_user, operateur_puce, numero_puce, type_puce,contrat_puce,serial_number,date_creation_carte_sim, id_puce], (err, results) => {
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
softDeleteSimcard: (id_puce, loggedInUserID, callback) => {
  const sql =
    "UPDATE puce SET draft = ? WHERE id_puce = ?";
  db.query(sql, [loggedInUserID, id_puce], callback);
},


// Restore
restoreDeletedSimcards: (id_puce, callback) => {
  const sql = `UPDATE puce SET draft = 0 WHERE id_puce = ${id_puce}`;
  
  db.query(sql, (err, results) => {
      if (err) {
          console.error("Erreur lors de la restauration des groupes de véhicules supprimés : " + err.message);
          callback(err, null);
      } else {
          callback(null, results);
      }
  });
},
// imported


  // getById: (id_puce, callback) => {
  //   const sql = 'SELECT * FROM puce WHERE id_puce  = ?';
  //   db.query(sql, [id_puce], callback);
  // }, 
  
  // getByUserId: (page, limit, id_user, callback) => {
  //   const params = [limit, page];
  //   const sql =  `SELECT * FROM puce WHERE id_user = ? LIMIT ${limit} OFFSET ${page} `;
  //   db.query(sql, [id_user], callback);
  // },
 
  // // Ajouter un nouveau véhicule
  // add: (puceData, callback) => {
  //   const { name, brand, year, type } = puceData;
  //   const sql = 'INSERT INTO puce (name, brand, year, type) VALUES (?, ?, ?, ?)';
  //   db.query(sql, [name, brand, year, type], callback);
  // },

  // // Mettre à jour un véhicule
  // update: (id, puceData, callback) => {
  //   const { name, brand, year, type } = puceData;
  //   const sql = 'UPDATE puce SET name = ?, brand = ?, year = ?, type = ? WHERE id = ?';
  //   db.query(sql, [name, brand, year, type, id], callback);
  // },

  // // Supprimer un véhicule
  // delete: (id, callback) => { 
  //   const sql = 'DELETE FROM puce WHERE id = ?';
  //   db.query(sql, [id], callback);
  // },
};



module.exports = Puce;
