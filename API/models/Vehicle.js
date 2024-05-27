const pool = require("../database");

const Vehicle = {
  // Retrieve all Vehiclecheck User Id
  getAllUserId: async (id_user, page, limit, sortColumn, sortOrder, searchColumn, searchValue) => {
    try {
      let sql;
      const offset = (page - 1) * limit;
      const params = [];

      if (id_user == 1) {
        sql = ` SELECT 
        gv.id_vhc,
        gv.type_vhc,
        gv.model_vhc,
        gv.license_vhc,
        gv.color_vhc,
        gv.cond_vhc,
        gv.id_driver,
        gd.first_name AS driver_first_name,
        gd.last_name AS driver_last_name
    FROM 
        gp_vehicles gv
    LEFT JOIN 
        gp_driver gd ON gv.id_driver = gd.id_driver
          WHERE 1=1`;
      } else {
        sql = ` SELECT 
        gv.id_vhc,
        gv.type_vhc,
        gv.model_vhc,
        gv.license_vhc,
        gv.color_vhc,
        gv.cond_vhc,
        gv.id_driver,
        gd.first_name AS driver_first_name,
        gd.last_name AS driver_last_name
    FROM 
        gp_vehicles gv
    LEFT JOIN 
        gp_driver gd ON gv.id_driver = gd.id_driver
        WHERE 
        gv.id_user = ?`;
          params.push(id_user);
        }
  
       /*  if (searchValue && searchColumn) {
          sql += ` AND ${searchColumn} LIKE ?`;
          params.push(`%${searchValue}%`);
        }
  
        sql += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), offset); */

        console.log('params',params)

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
};

module.exports = Vehicle;
