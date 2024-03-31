const db = require("../database");

const Driver = {
  // Fonction pour récupérer tous les conducteurs
  getAllDrivers: (page, limit, callback) => {
    const params = [limit, page];
    const sql = `SELECT * FROM conducteur LIMIT ${limit} OFFSET ${page}`;
    db.query(sql, callback);
  },

  // Fonction de recherche des conducteurs avec pagination
  getDriversByUserId: (
    page,
    limit,
    id_user,
    searchTerm,
    searchType,
    callback
  ) => {
    const offset = (page - 1) * limit;
    let sql = `
       SELECT conducteur.*, user.nom_user, tag.tag
      FROM conducteur
      LEFT JOIN user ON conducteur.id_user = user.id_user
      LEFT JOIN tag ON conducteur.id_tag = tag.id_tag
      WHERE conducteur.id_user IN (
          SELECT id_manageduser
          FROM user_user
          WHERE user_user.id_user = ${id_user}
      )
      AND conducteur.intrash = 0
      `;

    if (searchTerm && searchType) {
      if (searchType === "name") {
        sql += `
          AND (CONCAT(conducteur.nom_conducteur, ' ', conducteur.prenom_conducteur) LIKE '%${searchTerm}%')
        `;
      } else if (searchType === "code") {
        sql += `
          AND (conducteur.code_conducteur LIKE '%${searchTerm}%')
        `;
      } else if (searchType === "phone") {
        sql += `
          AND (conducteur.telephone_conducteur LIKE '%${searchTerm}%')
        `;
      } else if (searchType === "tag") {
        sql += `
          AND (tag.tag LIKE '%${searchTerm}%')
        `;
      }
    }

    // Ajouter la pagination
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    db.query(sql, callback);
  },

  getAll: (id_user, searchTerm, searchType, callback) => {
    let sql = `SELECT COUNT(*) AS count
      FROM conducteur
      LEFT JOIN tag ON conducteur.id_tag = tag.id_tag
      WHERE conducteur.id_user IN (
          SELECT id_manageduser
          FROM user_user
          WHERE user_user.id_user = ?
      )
      AND conducteur.intrash = 0`;

    // Ajouter la condition de recherche en fonction du type de recherche
    if (searchTerm && searchType) {
      if (searchType === "name") {
        sql += `
          AND (CONCAT(conducteur.nom_conducteur, ' ', conducteur.prenom_conducteur) LIKE '%${searchTerm}%')
        `;
      } else if (searchType === "phone") {
        sql += `
          AND (conducteur.telephone_conducteur LIKE '%${searchTerm}%')
        `;
      } else if (searchType === "tag") {
        sql += `
          AND (tag.tag LIKE '%${searchTerm}%')
        `;
      }
    }

    db.query(sql, [id_user], callback);
  },

  getDeletedDriverCount: (id_user, callback) => {
    let sql = "";
    if (id_user == 1) {
      // Super admin condition
      sql = `SELECT COUNT(*) as total FROM conducteur WHERE conducteur.intrash != 0`;
    } else {
      // Other user condition
      sql = `SELECT COUNT(*) as total FROM conducteur WHERE conducteur.intrash != 0 AND conducteur.intrash = ${id_user}`;
    }

    db.query(sql, callback);
  },

  // Modèle addDriver
  addDriver: (
    code_conducteur,
    nom_conducteur,
    prenom_conducteur,
    telephone_conducteur,
    email_conducteur,
    adresse_conducteur,
    date_naissance_conducteur,
    nationalite_conducteur,
    piece_identite_conducteur,
    numero_piece_identite_conducteur,
    date_delivrance_pi_conducteur,
    lieu_delivrance_pi_conducteur,
    premis_conducteur,
    numero_permis_conducteur,
    date_delivrance_permis_conducteur,
    date_expir_permis_conducteur,
    id_user,
    callback
  ) => {
    try {
      const sqlDriver = `
      INSERT INTO conducteur (
        code_conducteur, nom_conducteur, prenom_conducteur, telephone_conducteur, email_conducteur, 
        adresse_conducteur, date_naissance_conducteur, nationalite_conducteur,
        piece_identite_conducteur, numero_piece_identite_conducteur, date_delivrance_pi_conducteur,
        lieu_delivrance_pi_conducteur,premis_conducteur, numero_permis_conducteur, date_delivrance_permis_conducteur,
       date_expir_permis_conducteur,id_user
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        code_conducteur,
        nom_conducteur,
        prenom_conducteur,
        telephone_conducteur,
        email_conducteur,
        adresse_conducteur,
        date_naissance_conducteur,
        nationalite_conducteur,
        piece_identite_conducteur,
        numero_piece_identite_conducteur,
        date_delivrance_pi_conducteur,
        lieu_delivrance_pi_conducteur,
        premis_conducteur,
        numero_permis_conducteur,
        date_delivrance_permis_conducteur,
        date_expir_permis_conducteur,
        id_user,
      ];

      db.query(sqlDriver, params, (err, result) => {
        if (err) {
          return callback(err, null);
        }

        const driverId = result.insertId;
        callback(null, driverId);
      });
    } catch (err) {
      callback(err, null);
    }
  },

  // Modèle updateDriver
  updateDriver: (
    code_conducteur,
    nom_conducteur,
    prenom_conducteur,
    telephone_conducteur,
    email_conducteur,
    adresse_conducteur,
    date_naissance_conducteur,
    nationalite_conducteur,
    piece_identite_conducteur,
    numero_piece_identite_conducteur,
    date_delivrance_pi_conducteur,
    lieu_delivrance_pi_conducteur,
    premis_conducteur,
    numero_permis_conducteur,
    date_delivrance_permis_conducteur,
    date_expir_permis_conducteur,
    id_user,
    id_conducteur,
    callback
  ) => {
    try {
      const sqlUpdateDriver = `
      UPDATE conducteur
      SET
        code_conducteur=?,
        nom_conducteur=?,
        prenom_conducteur=?,
        telephone_conducteur=?,
        email_conducteur=?,
        adresse_conducteur=?,
        date_naissance_conducteur=?,
        nationalite_conducteur=?,
        piece_identite_conducteur=?,
        numero_piece_identite_conducteur=?,
        date_delivrance_pi_conducteur=?,
        lieu_delivrance_pi_conducteur=?,
        premis_conducteur=?,
        numero_permis_conducteur=?,
        date_delivrance_permis_conducteur=?,
        date_expir_permis_conducteur=?,
        id_user=?
      WHERE
        id_conducteur=?
    `;
      const params = [
        code_conducteur,
        nom_conducteur,
        prenom_conducteur,
        telephone_conducteur,
        email_conducteur,
        adresse_conducteur,
        date_naissance_conducteur,
        nationalite_conducteur,
        piece_identite_conducteur,
        numero_piece_identite_conducteur,
        date_delivrance_pi_conducteur,
        lieu_delivrance_pi_conducteur,
        premis_conducteur,
        numero_permis_conducteur,
        date_delivrance_permis_conducteur,
        date_expir_permis_conducteur,
        id_user,
        id_conducteur,
      ];
      db.query(sqlUpdateDriver, params, (err) => {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          callback(null, { message: "Conducteur mis à jour avec succès" });
        }
      });
    } catch (err) {
      callback(err, null);
    }
  },

  //fonction pour récupére les conducteurs aprés modification
  getDriverform(id_conducteur, callback) {
    const query = "SELECT * FROM conducteur WHERE id_conducteur = ?";

    db.query(query, [id_conducteur], (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des détails du conducteur :",
          err
        );
        return callback(err, null);
      } else {
        return callback(null, result[0]);
      }
    });
  },

  //fonction pour la supression d'un conducteur
  deleteDriver: (id_conducteur, loggedInUserID, callback) => {
    const sql = "UPDATE conducteur SET intrash = ? WHERE id_conducteur = ?";
    db.query(sql, [loggedInUserID, id_conducteur], callback);
  },

  //fonction pour la sélection d'un conducteur
  getUsersByUserId: (id_user, callback) => {
    const sql = `SELECT * FROM conducteur INNER JOIN user ON conducteur.id_user = user.id_user WHERE user.id_user = ?`;

    db.query(sql, [id_user], callback);
  },

  getOptionsByUserId: (id_user, callback) => {
    // Si l'utilisateur est l'administrateur (ID 1), récupérez tous les utilisateurs
    if (id_user === "1") {
      const sql = `
        SELECT id_user, nom_user, prenom_user
        FROM user
      `;
      db.query(sql, callback);
    } else {
      // Sinon, récupérez les options associées à l'ID utilisateur spécifique
      const sql = `
        SELECT id_user, nom_user, prenom_user
        FROM user
        WHERE id_user = ${db.escape(id_user)}
      `;
      db.query(sql, callback);
    }
  },

  getDeletedDrivers: (id_user, callback) => {
    let sql = "";

    if (id_user == 1) {
      // Super admin condition
      sql = `SELECT * FROM conducteur WHERE intrash != 0 ORDER BY conducteur.id_conducteur`;
    } else {
      // Other user condition
      sql = `SELECT * FROM conducteur WHERE intrash = ${id_user}`;
    }

    db.query(sql, callback);
  },

  // Restore Driver
  restoreDeletedDrivers: (id_conducteur, callback) => {
    const sql = `UPDATE conducteur AS c
    JOIN tag AS t ON c.id_tag = t.id_tag
    SET c.intrash = 0, c.id_tag = NULL
    WHERE c.id_conducteur = ${id_conducteur}`;

    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la restauration des conducteurs supprimés : " +
            err.message
        );
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },
};
module.exports = Driver;
