const pool = require("../database");

const Vehiclesinister = {

   // Get total count of sinisters by user
   getAllSinistersByUser: async (id_user, page, limit, searchTerm, searchType) => {
    try {
        const offset = (page - 1) * limit;
        let sql = `
            SELECT 
                s.*, 
                p.nm_prk AS park_name, 
                v.license_vhc AS vehicle_license,
                CONCAT(d.first_name, ' ', d.last_name) AS driver_name
            FROM gp_sinister s
            LEFT JOIN gp_park p ON s.id_park = p.id_park
            LEFT JOIN gp_vehicles v ON s.id_vhc = v.id_vhc
            LEFT JOIN gp_driver d ON v.id_driver = d.id_driver
            WHERE (p.id_user = ? OR v.id_user = ?)
        `;
        const params = [id_user, id_user];

        if (searchTerm && searchType) {
            if (searchType === 'driver_name') {
                sql += ` AND CONCAT(d.first_name, ' ', d.last_name) LIKE ?`;
            } else {
                sql += ` AND ${searchType} LIKE ?`;
            }
            params.push(`%${searchTerm}%`);
        }

        sql += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        console.log("Executing SQL:", sql); // Debugging statement
        console.log("With parameters:", params); // Debugging statement

        const [results] = await pool.query(sql, params);
        return results;
    } catch (err) {
        console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
        throw new Error(`Erreur lors de la récupération des sinistres: ${err.message}`);
    }
},

// Get all sinisters by user with pagination and search
getTotalCountByUser: async (id_user, searchTerm, searchType) => {
    try {
     
        let sql = `
            SELECT COUNT(*) AS total_count
            FROM gp_sinister s
            LEFT JOIN gp_park p ON s.id_park = p.id_park
            LEFT JOIN gp_vehicles v ON s.id_vhc = v.id_vhc
            LEFT JOIN gp_driver d ON v.id_driver = d.id_driver
            WHERE (p.id_user = ? OR v.id_user = ?)
        `;
        const params = [id_user, id_user];

        if (searchTerm && searchType) {
            if (searchType === 'driver_name') {
                sql += ` AND CONCAT(d.first_name, ' ', d.last_name) LIKE ?`;
            } else {
                sql += ` AND ${searchType} LIKE ?`;
            }
            params.push(`%${searchTerm}%`);
        }

        // console.log("Executing SQL:", sql); // Debugging statement
        // console.log("With parameters:", params); // Debugging statement

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
