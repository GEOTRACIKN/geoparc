const pool = require("../database");

const Vehiclesinister = {



// Get total count of sinisters by user
getAllSinistersByUser: async (id_user, page, limit, searchTerm, searchType) => {
    try {
        const offset = (page - 1) * limit;
        let sql = `
            SELECT 
                s.*, 
                p.nom_groupe AS park_name, 
                v.immatriculation_vehicule AS vehicle_license
            FROM gp_sinister s
            LEFT JOIN vehicule_groupe p ON s.id_groupe = p.id_groupe
            LEFT JOIN vehicule v ON s.id_vehicule = v.id_vehicule
            WHERE (p.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=?) OR v.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=?))
            AND s.draft = 0
        `;
        const params = [id_user, id_user];

        if (searchTerm && searchType) {
            sql += ` AND ${searchType} LIKE ?`;
            params.push(`%${searchTerm}%`);
        }

        sql += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [results] = await pool.query(sql, params);
        return results;
    } catch (err) {
        console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
        throw new Error(`Erreur lors de la récupération des sinistres: ${err.message}`);
    }
},

// Get total count of sinisters by user with pagination and search
getTotalCountByUser: async (id_user, searchTerm, searchType) => {
    try {
        let sql = `
            SELECT COUNT(*) AS total_count
            FROM gp_sinister s
            LEFT JOIN groupe p ON s.id_groupe = p.id_groupe
            LEFT JOIN vehicule v ON s.id_vehicule = v.id_vehicule
            WHERE (p.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=?) OR v.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=?))
            AND s.draft = 0
        `;
        const params = [id_user, id_user];

        if (searchTerm && searchType) {
            sql += ` AND ${searchType} LIKE ?`;
            params.push(`%${searchTerm}%`);
        }

        const [results] = await pool.query(sql, params);
        return results;
    } catch (err) {
        console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
        throw new Error(`Erreur lors de la récupération des sinistres: ${err.message}`);
    }
},
getVehiclesByUser: async (id_user) => {
    try {
        const query = `
            SELECT id_vehicule, id_groupe, immatriculation_vehicule 
            FROM vehicule
            WHERE id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=?)
            AND draft = 0
        `;
        const [results] = await pool.query(query, [id_user]);
        return results;
    } catch (err) {
        console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
        throw new Error(`Erreur lors de la récupération des véhicules: ${err.message}`);
    }
},



  
   getSinisterById : async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM gp_sinister WHERE id_sinistre = ?', [id]);
      return rows[0];
    } catch (err) {
      console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
      throw new Error(`Erreur lors de la récupération du sinistre: ${err.message}`);
    }
  },
  

  addSinister: async (sinister) => {
    try {
        const query = `
            INSERT INTO gp_sinister (
                id_vehicule, 
                id_groupe, 
                driver_name,
                sinister_cost, 
                sinister_type, 
                sinister_detail, 
                sinister_datetime, 
                sinister_location, 
                sinister_report, 
                circumstances, 
                damage_caused, 
                driver_name_2, 
                vehicle_registration_2, 
                expertise_date, 
                expertise_cost, 
                proforma_number, 
                expert_name, 
                doc_transmitted, 
                amortization_time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            sinister.id_vehicule,
            sinister.id_groupe,
            sinister.driver_name,
            sinister.sinister_cost,
            sinister.sinister_type,
            sinister.sinister_detail,
            sinister.sinister_datetime,
            sinister.sinister_location,
            sinister.sinister_report,
            sinister.circumstances,
            sinister.damage_caused,
            sinister.driver_name_2,
            sinister.vehicle_registration_2,
            sinister.expertise_date,
            sinister.expertise_cost,
            sinister.proforma_number,
            sinister.expert_name,
            sinister.doc_transmitted,
            sinister.amortization_time
        ];

        const [result] = await pool.query(query, values);
        return result;
    } catch (err) {
        console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
        throw new Error(`Erreur lors de l'ajout du sinistre: ${err.message}`);
    }
},

deleteSinister: async (id_sinistre, id_user) => {
    try {
        const query = `
            UPDATE gp_sinister
            SET draft = ?
            WHERE id_sinistre = ?
        `;
        const [result] = await pool.query(query, [id_user, id_sinistre]);
        return result.affectedRows;
    } catch (err) {
        console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
        throw new Error(`Erreur lors de la suppression du sinistre: ${err.message}`);
    }
},
  
}
  module.exports = Vehiclesinister;
