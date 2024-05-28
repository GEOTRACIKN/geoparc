const pool = require("../database");

const Vehicle = {
  /**
 * Récupère une liste de véhicules avec des informations sur le conducteur.
 * 
 * @async
 * @function getAllUserId
 * @param {number} id_user - L'ID de l'utilisateur effectuant la requête. Si id_user est 1, tous les véhicules sont retournés.
 * @param {number} page - Le numéro de la page pour la pagination.
 * @param {number} limit - Le nombre maximum de résultats par page.
 * @param {string} sortColumn - La colonne par laquelle les résultats doivent être triés.
 * @param {string} sortOrder - L'ordre de tri ('ASC' pour ascendant, 'DESC' pour descendant).
 * @param {string} [searchColumn] - La colonne à utiliser pour la recherche.
 * @param {string} [searchValue] - La valeur à rechercher dans la colonne spécifiée.
 * @returns {Promise<Array>} Une promesse qui résout avec un tableau des résultats.
 * @throws {Error} Si une erreur se produit lors de l'exécution de la requête SQL.
 * 
 * @example
 * const results = await getAllUserId(1, 1, 10, 'type_vhc', 'ASC', 'model_vhc', 'Sedan');
 * console.log(results);
 */
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
  
        if (searchValue && searchColumn) {
          sql += ` AND ${searchColumn} LIKE ?`;
          params.push(`%${searchValue}%`);
        }
  
        sql += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), offset);

        console.log('params',params)

      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error(
        `Erreur lors de l'exécution de la requête SQL: ${err.message}`
      );
      throw new Error(
        `Erreur lors de la récupération des véhicules: ${err.message}`
      );
    }
  },


/**
 * Récupère le nombre total de véhicules pour un utilisateur donné.
 * 
 * @async
 * @function getAll
 * @param {number} id_user - L'ID de l'utilisateur effectuant la requête. Si id_user est 1, le nombre total de tous les véhicules est retourné.
 * @param {string} [searchTerm] - La valeur à rechercher dans la colonne spécifiée.
 * @param {string} [searchType] - La colonne à utiliser pour la recherche.
 * @returns {Promise<Array>} Une promesse qui résout avec un tableau contenant le nombre total de véhicules.
 * @throws {Error} Si une erreur se produit lors de l'exécution de la requête SQL.
 * 
 * @example
 * const result = await getAll(1, 'Sedan', 'model_vhc');
 * console.log(result); // [{ total: 42 }]
 */
  getAll: async (id_user, searchTerm, searchType) => {
    try {
      let sql;
      const params = [];

      if (id_user == 1) {
        sql = `SELECT COUNT(*) as total FROM gp_vehicles WHERE 1=1`;
      } else {
        sql = `SELECT COUNT(*) as total FROM gp_vehicles WHERE id_user = ?`;
        params.push(id_user);
      }

      if (searchTerm && searchType) {
        sql += ` AND ${searchType} LIKE ?`;
        params.push(`%${searchTerm}%`);
      }

      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error(`Erreur lors de l'exécution de la requête SQL: ${err.message}`);
      throw new Error(`Erreur lors de la récupération du nombre total de véhicules: ${err.message}`);
    }
  },


  
};

module.exports = Vehicle;
