const db = require("../database");

const Ibutton = {
  // Fonction pour récupérer tous les Tags
  getAllTags: (page, limit, callback) => {
    const params = [limit, page];
    const sql = `SELECT * FROM tag LIMIT ${limit} OFFSET ${page}`;
    db.query(sql, callback);
  },

  // Retrieve all TAGS User Id
  getTagsByUserId: (page, limit, id_user, searchTerm, callback) => {
    const offset = (page - 1) * limit;

    let sql = `SELECT tag.*, user.nom_user
        FROM tag
        INNER JOIN user ON tag.id_user = user.id_user
        WHERE tag.id_user IN (
            SELECT id_manageduser
            FROM user_user
            WHERE user_user.id_user = ${id_user}
        )
        AND tag.draft = 0
    `;
    

    // Ajout de la condition de recherche
    if (searchTerm) {
      sql += ` AND(tag.tag LIKE '%${searchTerm}%')`;
    }

    // Ajouter la pagination
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
    
    db.query(sql, callback);
  },

  // Retrieve all Tags User Id
  getAll: (id_user, searchTerm, callback) => {
    let sql = "";

    if (id_user == 1) {
      sql = `SELECT COUNT(*) as total FROM tag WHERE draft = 0`;
    } else {
      sql = `SELECT COUNT(*) as total FROM tag WHERE tag.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user}) AND draft = 0`;
    }

    //If searchTerm is provided, add it to the SQL query
    if (searchTerm) {
      sql += ` AND (tag.tag LIKE '%${searchTerm}%')`;
    }

    db.query(sql, callback);
  },

  //Pour Calculer Combien ya de TAG supprimé
  getDeletedTagCount: (id_user, callback) => {
    let sql = "";
    if (id_user == 1) {
      // Super admin condition
      sql = `SELECT COUNT(*) as total FROM tag WHERE tag.draft != 0`;
    } else {
      // Other user condition
      sql = `SELECT COUNT(*) as total FROM tag WHERE tag.draft != 0 AND tag.draft = ${id_user}`;
    }

    db.query(sql, callback);
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

  getDriverByUserId: (id_user, callback) => {
    const sql = `
  SELECT 
      id_conducteur, 
      nom_conducteur, 
      prenom_conducteur 
  FROM 
      conducteur 
  WHERE 
      id_user = ?  AND 
      intrash = 0  
`;
    db.query(sql, [id_user], callback);
  },

  // Fonction pour ajouter un nouveau TAG et mettre à jour le conducteur
  AddTag: (
    tag,
    datecreationtag,
    lastAffectation,
    lastaffectationid,
    id_user,
    draft,
    tag_note,
    callback
  ) => {
    try {
      const sqltag =
        "INSERT INTO tag (tag, datecreationtag, lastAffectation, lastaffectationid, id_user, draft, tag_note) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const params = [
        tag,
        datecreationtag,
        lastAffectation,
        lastaffectationid,
        id_user,
        draft,
        tag_note,
      ];

      // Insérer le nouveau tag
      db.query(sqltag, params, async (err, result) => {
        if (err) {
          return callback(err, null);
        }

        // Récupérer l'ID du tag nouvellement inséré
        const newTagId = result.insertId;

        // Mettre à jour la table 'conducteur' avec l'ID du nouveau tag
        const sqlUpdateConducteur = `
        UPDATE conducteur 
        SET id_tag = ?
        WHERE id_conducteur = ?
      `;

        const paramsUpdateConducteur = [newTagId, lastaffectationid];

        db.query(sqlUpdateConducteur, paramsUpdateConducteur, (err) => {
          if (err) {
            console.log(err);
            callback(err, null);
          } else {
            callback(null, {
              message:
                "Nouveau tag ajouté et conducteur mis à jour avec succès",
            });
          }
        });
      });
    } catch (err) {
      callback(err, null);
    }
  },

  //fonction pour la supression d'un Tag
  deleteTag: (id_tag, loggedInUserID, callback) => {
    const sql = "UPDATE tag SET draft=? WHERE id_tag =?";
    db.query(sql, [loggedInUserID, id_tag], callback);
  },

  //Fonction Pour Update Tag
  updateTag: (
    tag,
    datecreationtag,
    id_user,
    lastaffectationid,
    tag_note,
    id_tag,
    callback
  ) => {
    try {
      // Mettre à jour la table 'tag'
      const sqlTag = `
      UPDATE tag 
      SET 
      tag=?,
      datecreationtag=?,
      id_user=?, 
      lastaffectationid=?, 
      tag_note=?
      WHERE id_tag= ?
    `;
      const paramsTag = [
        tag,
        datecreationtag,
        id_user,
        lastaffectationid,
        tag_note,
        id_tag,
      ];

      db.query(sqlTag, paramsTag, (err) => {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          // Mettre à jour la table 'conducteur' avec la valeur de id_tag fournie
          const sqlConducteur = `
          UPDATE conducteur 
          SET id_tag = ? 
          WHERE id_conducteur = ?
        `;
          const paramsConducteur = [id_tag, lastaffectationid];

          db.query(sqlConducteur, paramsConducteur, (err) => {
            if (err) {
              console.log(err);
              callback(err, null);
            } else {
              // Insérer une nouvelle entrée dans la table 'historique_tag_conducteur'
              const sqlHistorique = `
              INSERT INTO historique_tag_conducteur (id_tag, id_conducteur, date_creation_relation, date_fin_relation) 
              VALUES (?, ?, NOW(), NULL)
            `;
              const paramsHistorique = [id_tag, lastaffectationid];

              db.query(sqlHistorique, paramsHistorique, (err) => {
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else {
                  callback(null, {
                    message:
                      "Tag, conducteur et historique mis à jour avec succès",
                  });
                }
              });
            }
          });
        }
      });
    } catch (err) {
      callback(err, null);
    }
  },

  //fonction pour récupére les Tag aprés modification
  getTagform(id_tag, callback) {
    const query =
      "SELECT tag,lastaffectationid,id_user,tag_note FROM tag WHERE id_tag = ?";

    db.query(query, [id_tag], (err, result) => {
      if (err) {
        console.error("Erreur lors de la récupération des détails TAg :", err);
        return callback(err, null);
      } else {
        return callback(null, result[0]);
      }
    });
  },

  gethistoryTagsByUserId: (page, limit, id_user, callback) => {
    let sql = `
        SELECT 
            u.nom_user AS nom_utilisateur,
            u.prenom_user AS prenom_utilisateur,
            hc.id_rel,
            c.nom_conducteur AS nom_conducteur,
            c.prenom_conducteur AS prenom_conducteur,
            t.tag AS tag_actuel,
            (
                SELECT tag 
                FROM historique_tag_conducteur AS hc_prev 
                JOIN tag AS t_prev ON hc_prev.id_tag = t_prev.id_tag
                WHERE hc_prev.id_conducteur = hc.id_conducteur 
                AND hc_prev.date_creation_relation < hc.date_creation_relation
                ORDER BY hc_prev.date_creation_relation DESC
                LIMIT 1
            ) AS tag_historique,
            t.lastAffectation AS lastAffectation,
            hc.date_creation_relation
        FROM 
            historique_tag_conducteur AS hc
        JOIN 
            conducteur AS c ON hc.id_conducteur = c.id_conducteur
        JOIN 
            tag AS t ON hc.id_tag = t.id_tag
        JOIN 
            user AS u ON c.id_user = u.id_user
        `;
    if (id_user != 1) {
      sql += `
            WHERE 
                c.id_user = ${id_user}
                
            `;
    }
    sql += `
        ORDER BY hc.id_rel ASC 
        LIMIT ${limit} OFFSET ${(page - 1) * limit};
    `;

    db.query(sql, callback);
  },

  // Retrieve all Tags historique User Id
  getAllhisory: (id_user, callback) => {
    let sql = "";
    if (id_user == 1) {
      sql = `SELECT COUNT(*) as total FROM historique_tag_conducteur`;
      db.query(sql, callback);
    } else {
      sql = `SELECT COUNT(*) as total 
            FROM historique_tag_conducteur 
            JOIN tag ON historique_tag_conducteur.id_tag = tag.id_tag
            WHERE tag.id_user = ?`;
      db.query(sql, [id_user], callback);
    }
  },
};
module.exports = Ibutton;