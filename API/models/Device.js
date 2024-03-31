const db = require("../database");
const Device = {
  // Retrieve all Device User Id
  getAllUserId: (page, limit, id_user, callback) => {
    let sql = "";

    if (id_user == 1) {
      sql = `SELECT dispositif.*, IFNULL(puce.serial_number, 'none') AS serial_number, IFNULL(puce.operateur_puce, 'none') AS operateur_puce, IFNULL(groupe.nom_groupe, 'none') AS nom_groupe FROM dispositif LEFT JOIN puce ON dispositif.id_puce = puce.id_puce LEFT JOIN groupe ON dispositif.id_groupe_disp = groupe.id_groupe LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    } else {
      sql = `SELECT dispositif.*, IFNULL(puce.serial_number, 'none') AS serial_number, IFNULL(puce.operateur_puce, 'none') AS operateur_puce, IFNULL(groupe.nom_groupe, 'none') AS nom_groupe FROM dispositif LEFT JOIN puce ON dispositif.id_puce = puce.id_puce LEFT JOIN groupe ON dispositif.id_groupe_disp = groupe.id_groupe WHERE dispositif.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user}) LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    }

    console.log(sql);
    db.query(sql, callback); 
  },

  // Retrieve all Device User Id
  getAll: (id_user, callback) => {
    let sql = ``;

    if (id_user == 1) {
      sql = `SELECT COUNT(*) as total FROM dispositif`;
    } else {
      sql = `SELECT COUNT(*) as total FROM dispositif WHERE dispositif.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})`;
    }

    db.query(sql, callback);
  },


 

  // Retrieve all Device User search
  getAllUserSearch: (page, limit, id_user,search,type, callback) => {
    let sql = "";
     
    if (id_user == 1) {
      sql = `SELECT * FROM dispositif WHERE psn_dispositif LIKE '${search}%' LIMIT ${limit} OFFSET ${  (page - 1) * limit }`;
    } else {  
      sql = `SELECT * FROM dispositif WHERE  psn_dispositif LIKE '${search}%' AND dispositif.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})  LIMIT ${limit} OFFSET ${ (page - 1) * limit}`;
    }

    console.log(sql);
    db.query(sql, callback);
  },
 
  // Retrieve all Device User search total 
  getAllSearch: (id_user,search,type ,callback) => { 
    let sql = ``;
 
    if (id_user == 1) {
      sql = `SELECT COUNT(*) as total FROM dispositif WHERE psn_dispositif LIKE '${search}%'`;
    } else {
      sql = `SELECT COUNT(*) as total FROM dispositif  WHERE psn_dispositif LIKE '${search}%' AND dispositif.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})`;
    }
    console.log(sql); 
    db.query(sql, callback);
  },



  // Récupérer un dispositif par son ID
  getById: (id_device, callback) => {
    const sql = `SELECT
                    dispositif.id_dispositif,
                    dispositif.psn_dispositif,
                    vehicule.id_user,
                    vehicule.id_vehicule,
                    vehicule.immatriculation_vehicule, 
                    dispositif.id_puce,
                    dispositif.id_groupe_disp
                FROM
                    dispositif
                LEFT JOIN
                    vehicule ON vehicule.id_dispositif = dispositif.id_dispositif
                WHERE
                    dispositif.id_dispositif = ?`;
    db.query(sql, [id_device], callback);
  },

  updateVehiculeDeviceRelation: ( 
    id_old_Vehicle,
    id_new_device,
    id_new_vehicle,
    callback
  ) => {
    if (id_old_Vehicle != 0) {
      const sqlOld = "UPDATE vehicule SET id_dispositif=? WHERE id_vehicule=?";
      db.query(sqlOld, [0, id_old_Vehicle]);
    }

    console.log(
      `UPDATE vehicule SET id_dispositif=${id_new_device} WHERE id_vehicule=${id_new_vehicle}`
    );

    const sql = `UPDATE vehicule SET id_dispositif=${id_new_device} WHERE id_vehicule=${id_new_vehicle}`;
    db.query(sql, callback);
  },

  updateDeviceUserRelation: (id_new_device, id_user_vehicle,  id_puce, id_groupe_disp, callback) => {
    const sql = "UPDATE dispositif SET id_user=?, id_puce=?, id_groupe_disp=?  WHERE id_dispositif=?"; 
   
    console.log(`UPDATE dispositif SET id_user=${id_user_vehicle}, id_puce=${id_puce}, id_groupe_disp=${id_groupe_disp}  WHERE id_dispositif=${id_new_device}`)
 
    db.query(sql, [id_user_vehicle,  ,id_puce,id_groupe_disp,id_new_device], callback);    
  },

  insertHistoryVehiculeDevice: (i_vehicule, id_device, callback) => {
    const today = new Date().toISOString().slice(0, 19).replace("T", " ");
    const sql = `INSERT INTO historique_vehicule_dispositif (id_vehicule, id_dispositif, date_creation_relation) VALUES (?, ?, ?)`;
    db.query(sql, [i_vehicule, id_device, today], callback);
  },
};

module.exports = Device;
