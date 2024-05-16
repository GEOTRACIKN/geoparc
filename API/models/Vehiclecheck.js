const db = require("../database");

const Vehiclecheck = {
    
  // Retrieve all Vehiclecheck User Id
  getAllUserId: (page, limit, id_user, callback) => {
    let sql;

    if (id_user == 1) {
      sql = ``;
    } else {
      sql = ``;
    }
    console.log(sql);
    db.query(sql, callback);
  },

  // Retrieve all COUNT Vehiclecheck User Id
  getAll: (id_user, callback) => {
    let sql;

    if (id_user == 1) {
      sql = `SELECT COUNT(*) as total `;
    } else {
      sql = `SELECT COUNT(*) as total FROM `;
    }

    db.query(sql, callback);
  },
};

module.exports = Vehiclecheck;
