const db = require("../database");

const Role = {
  // Retrieve all Role User Id
  getAllUserId: (id_user, page, limit) => {
    return new Promise((resolve, reject) => {
      let sql;
      const offset = (page - 1) * limit;
      const params = [];
      if (id_user == 1) {
        sql = `SELECT 
        id_verif,
        Creation_date,
        checker,
        Driver_out,
        Driver_in,
        license_vhc,
        maintenance 
        FROM gp_verif_vehicule 
        ORDER BY gp_verif_vehicule.Creation_date ASC 
        LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));
      } else {
        sql = `SELECT 
        id_verif,
        Creation_date,
        checker,
        Driver_out,
        Driver_in,
        license_vhc,
        maintenance 
        FROM gp_verif_vehicule 
        WHERE id_user = ? 
        ORDER BY gp_verif_vehicule.Creation_date ASC 
        LIMIT ? OFFSET ?`;
        params.push(id_user, parseInt(limit), parseInt(offset));
      }

      db.query(sql, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  // Retrieve all COUNT Role User Id
  getAll: (id_user) => {
    return new Promise((resolve, reject) => {
      let sql;

      if (id_user == 1) {
        sql = `SELECT COUNT(*) as total FROM gp_verif_vehicule `;
      } else {
        sql = `SELECT COUNT(*) as total FROM gp_verif_vehicule WHERE id_user = ?`;
      }

      db.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },
};

module.exports = Role;
