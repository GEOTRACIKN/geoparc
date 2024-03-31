const db = require("../database");
const LogPositions = {

  
  searchByLicensePlate: (userID, query) => {
    return new Promise((resolve, reject) => {
      console.log(`Début de searchByLicensePlate avec userID: ${userID} et query: ${query}`);
  
      let sql;
      let params;
  
      if (userID == 1) {
        sql = `SELECT immatriculation_vehicule, PSN FROM vehicule WHERE immatriculation_vehicule LIKE ?`;
        params = [`%${query}%`];
      } else {
        sql = `SELECT immatriculation_vehicule, PSN FROM vehicule 
               WHERE vehicule.id_user IN 
               (SELECT id_manageduser FROM user_user WHERE user_user.id_user = ?) 
               AND immatriculation_vehicule LIKE ?`;
        params = [userID, `%${query}%`];
      }
  
      console.log(`Requête SQL générée: ${sql}`);
      console.log(`Paramètres de la requête: ${params}`);
  
      db.query(sql, params, (err, results) => {
        if (err) {
          console.error(`Erreur lors de l'exécution de la requête SQL:`, err);
          reject(err);
        } else {
          console.log(`Résultats obtenus:`, results);
          resolve(results.length ? results : []);
        }
      });
    });
  },
  filterRapports: (PSN, startDate, endDate,page,limit)  => {
    return new Promise((resolve, reject) => {
      let sql;
      let params;
      const offset = (page - 1) * limit;
      const limitValue = parseInt(limit, 10); // 10 est la base de conversion décimale

      sql = `
        SELECT TIMESTAMP, GUS, SOG, LAT, LON, ENGINESTAT, GSMLVL, RELAYSTAT 
        FROM hello_record 
        WHERE PSN = ? 
        AND TIMESTAMP BETWEEN ? AND ?
        ORDER BY TIMESTAMP ASC LIMIT ? OFFSET ?`;
  
      params = [PSN, startDate, endDate, limitValue, offset];
  
      console.log(`Requête SQL générée: ${sql}`);
      console.log(`Paramètres de la requête: ${params}`);
  
      db.query(sql, params, (err, results) => {
        if (err) {
          console.error(`Erreur lors de l'exécution de la requête SQL:`, err);
          reject(err);
        } else {
          console.log(`Résultats obtenus:`, results);
          resolve(results.length ? results : []);
        }
      });
    });
  },
  
};

module.exports = LogPositions;
