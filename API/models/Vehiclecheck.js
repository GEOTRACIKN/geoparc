const pool = require("../database");

const Vehiclecheck = {
  // Retrieve all Vehiclecheck User Id
  getAllUserId: async (id_user, page, limit, searchTerm, searchType) => {
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

        if (searchTerm && searchType) {
          if (searchType === "checker") {
            sql += `
          AND (gp_verif_vehicule.checker) LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "Driver_out") {
            sql += `
          AND (gp_verif_vehicule.Driver_out LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "Driver_in") {
            sql += `
          AND (gp_verif_vehicule.Driver_in LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "license_vhc") {
            sql += `
          AND (gp_verif_vehicule.license_vhc LIKE '%${searchTerm}%')
        `;
          }
        }
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
        if (searchTerm && searchType) {
          if (searchType === "checker") {
            sql += `
          AND (gp_verif_vehicule.checker) LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "Driver_out") {
            sql += `
          AND (gp_verif_vehicule.Driver_out LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "Driver_in") {
            sql += `
          AND (gp_verif_vehicule.Driver_in LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "license_vhc") {
            sql += `
          AND (gp_verif_vehicule.license_vhc LIKE '%${searchTerm}%')
        `;
          }
        }
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
  getAll: async (id_user, searchTerm, searchType) => {
    try {
      let sql;
      const params = [];

      if (id_user == 1) {
        sql = `SELECT COUNT(*) as total FROM gp_verif_vehicule`;
        if (searchTerm && searchType) {
          if (searchType === "Verifier") {
            sql += `
          AND (gp_verif_vehicule.Verifier) LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "Driver_out") {
            sql += `
          AND (gp_verif_vehicule.Driver_out LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "Driver_in") {
            sql += `
          AND (gp_verif_vehicule.Driver_in LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "license_vhc") {
            sql += `
          AND (gp_verif_vehicule.license_vhc LIKE '%${searchTerm}%')
        `;
          }
        }
      } else {
        sql = `SELECT COUNT(*) as total FROM gp_verif_vehicule WHERE id_user = ?`;
        if (searchTerm && searchType) {
          if (searchType === "Verifier") {
            sql += `
          AND (gp_verif_vehicule.Verifier) LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "Driver_out") {
            sql += `
          AND (gp_verif_vehicule.Driver_out LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "Driver_in") {
            sql += `
          AND (gp_verif_vehicule.Driver_in LIKE '%${searchTerm}%')
        `;
          } else if (searchType === "license_vhc") {
            sql += `
          AND (gp_verif_vehicule.license_vhc LIKE '%${searchTerm}%')
        `;
          }
        }
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
