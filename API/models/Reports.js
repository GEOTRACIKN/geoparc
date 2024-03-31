const db = require("../database");

const Rapports = {
 getReportsByUserId: async (
    page,
    limit,
    id_user,
    sortColumn,
    sortOrder,
    searchTerm,
    searchOption,
    callback
  ) => {
    let sql = "";
  
    if (id_user == 1) {
      sql = `
      SELECT DISTINCT
      repport.id_report,
      repport.turn_report,
      repport.date_creation,
      repport.id_user,
      repport.type_report,
      user.nom_user,
      user.prenom_user,
      repport.date_debut,
      repport.date_fin,
      repport.PSN,
      repport.id_dispositif,
      vehicule.immatriculation_vehicule,
      vehicule.id_dispositif,
      repport.state_report
      FROM repport
      LEFT JOIN user ON repport.id_user = user.id_user
      LEFT JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif
      AND repport.id_dispositif != 0
      AND repport.type_report IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '45')
      WHERE 1=1`;
    } else {
      sql = `
      SELECT DISTINCT
      repport.id_report,
      repport.turn_report,
      repport.date_creation,
      repport.id_user,
      repport.type_report,
      user.nom_user,
      user.prenom_user,
      repport.date_debut,
      repport.date_fin,
      repport.PSN,
      repport.id_dispositif,
      vehicule.immatriculation_vehicule,
      vehicule.id_dispositif,
      repport.state_report
      FROM repport
      LEFT JOIN user ON repport.id_user = user.id_user
      LEFT JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif
      WHERE repport.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})
      AND repport.id_dispositif != 0
      AND repport.type_report IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '45')
      AND 1=1`;
    }
  
    if (searchTerm) {
      // Modifier la clause WHERE pour inclure le champ de recherche sélectionné
      if (searchOption === "vehicule") {
        sql += ` AND vehicule.immatriculation_vehicule LIKE '%${searchTerm}%'`;
      } else if (searchOption === "user") {
        sql += ` AND (user.nom_user LIKE '%${searchTerm}%' OR user.prenom_user LIKE '%${searchTerm}%')`;
      } else if (searchOption === "turn") {
        sql += ` AND (repport.turn_report LIKE '%${searchTerm}%')`;
      }
    }
  
    sql += `
      GROUP BY repport.id_dispositif, repport.turn_report 
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT ${limit} OFFSET ${(page - 1) * limit};
    `;
  
    db.query(sql, [id_user], callback);
  },
   

  getAll: (id_user, callback) => {
    let sql = "";

    if (id_user == 1) {
      sql = `SELECT COUNT(DISTINCT repport.turn_report) as total FROM repport
          LEFT JOIN user ON repport.id_user = user.id_user
          LEFT JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif
          AND repport.id_dispositif != 0
          `;
    } else {
      sql = `SELECT COUNT(DISTINCT repport.turn_report) as total FROM repport
          LEFT JOIN user ON repport.id_user = user.id_user
          LEFT JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif
          WHERE repport.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})
          AND repport.id_dispositif != 0`;
    }

    db.query(sql, callback);
  },

  getReportsByTurn: async (turn_report, callback) => {
    let sql = `
      SELECT
      
      repport.turn_report,
        repport.id_report,
        repport.type_report,
        repport.state_report,
        repport.id_dispositif
      FROM repport
      WHERE repport.turn_report = ?;
      `;

    db.query(sql, [turn_report], callback);
  },

  getReportsByTurnAndDispositif: (turn_report, id_dispositif) => {
    return new Promise((resolve, reject) => {
      const selectSql = "SELECT * FROM repport WHERE turn_report=? AND id_dispositif=?";
      db.query(selectSql, [turn_report, id_dispositif], (err, results) => {
        if (err) {
          reject("Une erreur s'est produite lors de la récupération des rapports.");
        } else {
          resolve(results || []);
        }
      });

    });
  },

  
  deleteReport: (id_report,id_dispositif, turn_report ) => {
    return new Promise((resolve, reject) => {
      const deleteSql = "DELETE FROM repport WHERE id_report=?";
      db.query(deleteSql, [id_report, id_dispositif , turn_report], (err, result) => {
        if (err) {
          reject("Une erreur s'est produite lors de la suppression du rapport.");
        } else {
          resolve(result.affectedRows === 1);
        }
      });
    });
  },
  
  deleteReportDatas: (id_report, id_dispositif , turn_report) => {
    return new Promise((resolve, reject) => {
      const deleteSql = "DELETE FROM repport_datas WHERE id_repport=?";
      db.query(deleteSql, [id_report, id_dispositif , turn_report], (err, result) => {
        if (err) {
          reject("Une erreur s'est produite lors de la suppression des données du rapport.");
        } else {
          resolve(result.affectedRows);
        }
      });
    });
  },
  
};

module.exports = Rapports;
