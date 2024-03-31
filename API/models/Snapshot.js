const db = require("../database");
const Snapshot = {
  getALLCount: (id_user, callback) => {
    let sql = `SELECT * FROM snapshot`;

    if (id_user === 1) {
      sql = `SELECT COUNT(*) as totalsnapshots FROM snapshot`;
    } else {
      sql = `SELECT COUNT(*) as totalsnapshots FROM snapshot WHERE snapshot.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})`;
    }

    db.query(sql, callback);
  },
  getSnapshotsSort: (page, limit, id_user, sortColumn, sortOrder, callback) => {
    const params = [limit, page];
    let sql = "";

    if (id_user == 1) {
      sql = `
      SELECT snapshot.id_snapshot, snapshot.id_dashcam, snapshot.type_snapshot, snapshot.location, dispositif.psn_dispositif, snapshot.immatriculation, conducteur.nom_conducteur, conducteur.prenom_conducteur, user.id_user AS user_id, user.nom_user AS user_nom, user.prenom_user AS user_prenom, snapshot.date_creation, snapshot.date_snapshot FROM snapshot JOIN dispositif ON snapshot.id_dispositif = dispositif.id_dispositif JOIN conducteur ON snapshot.id_conducteur = conducteur.id_conducteur JOIN user ON snapshot.id_user = user.id_user WHERE draft = 0  
        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    } else {
      sql = `SELECT 
      snapshot.id_snapshot, 
      snapshot.id_dashcam, 
      snapshot.type_snapshot, 
      snapshot.location, 
      dispositif.psn_dispositif, 
      snapshot.immatriculation, 
      conducteur.nom_conducteur, 
      conducteur.prenom_conducteur, 
      user.id_user AS user_id, 
      user.nom_user AS user_nom, 
      user.prenom_user AS user_prenom, 
      snapshot.date_creation, 
      snapshot.date_snapshot 
  FROM 
      snapshot 
  JOIN 
      dispositif ON snapshot.id_dispositif = dispositif.id_dispositif 
  JOIN 
      conducteur ON snapshot.id_conducteur = conducteur.id_conducteur 
  JOIN 
      user ON snapshot.id_user = user.id_user 
  WHERE 
      draft = 0 AND snapshot.id_user = ${id_user} 
  ORDER BY 
      ${sortColumn} ${sortOrder} 
  LIMIT 
      ${limit} OFFSET ${(page - 1) * limit};
  `;
    }

    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération du groupe : " + err.message
        );
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },
};

module.exports = Snapshot;
