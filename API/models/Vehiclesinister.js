const pool = require("../database");

const Vehiclesinister = {

   // Get total count of sinisters by user
getTotalCountByUser: async (id_user, searchTerm, searchType) => {
    try {
        let sql = `
            SELECT COUNT(s.id_sinistre) AS total_count
            FROM gp_sinister s
            LEFT JOIN gp_park p ON s.id_park = p.id_park
            LEFT JOIN gp_vehicles v ON s.id_vhc = v.id_vhc
            WHERE p.id_user = ? OR v.id_user = ?
        `;
        const params = [id_user, id_user];

        if (searchTerm && searchType) {
            sql += ` AND ${searchType} LIKE ?`;
            params.push(`%${searchTerm}%`);
        }

        const [results] = await pool.query(sql, params);
        return results[0].total_count;
    } catch (err) {
        console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
        throw new Error(`Erreur lors de la récupération du nombre de sinistres: ${err.message}`);
    }
},

// Get all sinisters by user with pagination and search
getAllSinistersByUser: async (id_user, page, limit, searchTerm, searchType) => {
    try {
        const offset = (page - 1) * limit;
        let sql = `
            SELECT 
                s.*, 
                p.nm_prk AS park_name, 
                v.license_vhc AS vehicle_license,
                d.last_name AS driver_last_name,
                d.first_name AS driver_first_name
            FROM gp_sinister s
            LEFT JOIN gp_park p ON s.id_park = p.id_park
            LEFT JOIN gp_vehicles v ON s.id_vhc = v.id_vhc
            LEFT JOIN gp_driver d ON v.id_driver = d.id_driver
            WHERE p.id_user = ? OR v.id_user = ?
        `;
        const params = [id_user, id_user];

        if (searchTerm && searchType) {
            sql += ` AND ${searchType} LIKE ?`;
            params.push(`%${searchTerm}%`);
        }

        sql += `LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [results] = await pool.query(sql, params);
        return results;
    } catch (err) {
        console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
        throw new Error(`Erreur lors de la récupération des sinistres: ${err.message}`);
    }
},

  
   getSinisterById : async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM gp_sinister WHERE IDsinistre = ?', [id]);
      return rows[0];
    } catch (err) {
      console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
      throw new Error(`Erreur lors de la récupération du sinistre: ${err.message}`);
    }
  }
}
  module.exports = Vehiclesinister;
