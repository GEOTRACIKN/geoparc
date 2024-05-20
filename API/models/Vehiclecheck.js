const db = require("../database");

const Vehiclecheck = {

  // Retrieve all Vehiclecheck User Id
  getAllUserId: (page, limit, id_user, callback) => {
    let sql;

    if (id_user == 1) {
      sql = `SELECT 
      id_verif,
      Creation_date,checker,
      Driver_out,
      Driver_in,
      license_vhc,
      maintenance FROM gp_verif_vehicule 
      ASC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    } else {
      sql = `SELECT 
      id_verif,
      Creation_date,
      checker,
      Driver_out,
      Driver_in,
      license_vhc,
      maintenance FROM gp_verif_vehicule 
      WHERE id_user = ? 
      ASC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    }
    console.log(sql);
    db.query(sql, callback);
  },

  // Retrieve all COUNT Vehiclecheck User Id
  getAll: (id_user, callback) => {
    let sql;

    if (id_user == 1) {
      sql = `SELECT COUNT(*) as total FROM gp_verif_vehicule `;
    } else {
      sql = `SELECT COUNT(*) as total FROM gp_verif_vehicule WHERE id_user = ?`;
    }

    db.query(sql, callback);
  },
};

module.exports = Vehiclecheck;
