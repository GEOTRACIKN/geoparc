const pool = require("../database");

const Vehiclecheck = {
  // Retrieve all Vehiclecheck User Id
  getAllUserId: async (id_user, page, limit) => {
    try {
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
      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération des véhicules vérifiés: ${err.message}`
      );
    }
  },

  // Retrieve all COUNT Vehiclecheck User Id
  getAll: async (id_user) => {
    try {
      let sql;
      const params = [];

      if (id_user == 1) {
        sql = `SELECT COUNT(*) as total FROM gp_verif_vehicule`;
      } else {
        sql = `SELECT COUNT(*) as total FROM gp_verif_vehicule WHERE id_user = ?`;
        params.push(id_user);
      }

      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      throw new Error(
        `Erreur lors de la récupération du nombre total de véhicules vérifiés: ${err.message}`
      );
    }
  },
};

module.exports = Vehiclecheck;
