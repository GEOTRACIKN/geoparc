const pool = require("../database");

const Vehiclecheck = {
  // Retrieve all Vehiclecheck User Id
  getAllGeopUserID: async (id_user, page, limit, searchTerm, searchType) => {
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
          WHERE 1=1`;
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
          WHERE id_user = ?`;
        params.push(id_user);
      }

      if (searchTerm && searchType) {
        sql += ` AND ${searchType} LIKE ?`;
        params.push(`%${searchTerm}%`);
      }

      sql += ` ORDER BY gp_verif_vehicule.Creation_date ASC LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));


      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error(
        `Erreur lors de l'exécution de la requête SQL: ${err.message}`
      );
      throw new Error(
        `Erreur lors de la récupération des véhicules vérifiés: ${err.message}`
      );
    }
  },

  // Retrieve all COUNT Vehiclecheck User Id
  getAll: async (id_user, searchTerm, searchType) => {
    try {
      let sql;
      const params = [];

      if (id_user == 1) {
        sql = `SELECT COUNT(*) as total FROM gp_verif_vehicule WHERE 1=1`;
      } else {
        sql = `SELECT COUNT(*) as total FROM gp_verif_vehicule WHERE id_user = ?`;
        params.push(id_user);
      }

      if (searchTerm && searchType) {
        sql += ` AND ${searchType} LIKE ?`;
        params.push(`%${searchTerm}%`);
      }


      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error(
        `Erreur lors de l'exécution de la requête SQL: ${err.message}`
      );
      throw new Error(
        `Erreur lors de la récupération du nombre total de véhicules vérifiés: ${err.message}`
      );
    }
  },

  



};

module.exports = Vehiclecheck;
