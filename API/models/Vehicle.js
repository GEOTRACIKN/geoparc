const db = require("../database");

const padZero = (number) => {
  return number < 10 ? `0${number}` : `${number}`;
};

// Your getCurrentDateTimeString function
const getCurrentDateTimeString = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = padZero(now.getMonth() + 1); // Months are zero-based
  const day = padZero(now.getDate());
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
};

const Vehicle = {
  // Retrieve all Vehicle User Id
  getAllUserId: (page, limit, id_user, callback) => {
    let sql;

    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    if (id_user == 1) {
      sql = ` 
            SELECT DISTINCT 
                vehicule.id_vehicule,
                vehicule.immatriculation_vehicule,
                vehicule.category_vehicule,
                vehicule.vehicule_type,
                vehicule.couleur_vehicule,
                dispositif.id_dispositif,
                dispositif.psn_dispositif AS PSN,
                groupe.nom_groupe,
                user.prenom_user, 
                user.nom_user,
                groupe.color_groupe,
                COALESCE(ib.IB_CODE, 'none') AS IB_CODE,
                COALESCE(ib.GPSDIST, 'O') AS GPSDIST,
                COALESCE(c.nom_conducteur, 'none') AS nom_conducteur,
                COALESCE(c.prenom_conducteur, 'none') AS prenom_conducteur
            FROM vehicule
            LEFT JOIN user ON vehicule.id_user = user.id_user
            LEFT JOIN vehicule_groupe AS groupe ON vehicule.id_groupe = groupe.id_groupe
            LEFT JOIN dispositif ON vehicule.id_dispositif = dispositif.id_dispositif
            LEFT JOIN (
                SELECT
                    ib.IB_CODE,
                    ib.GPSDIST,
                    ib.PSN
                FROM ibutton_a_record_22 ib
                JOIN (
                    SELECT
                        PSN,
                        MAX(TIMESTAMP) AS latest_timestamp
                    FROM ibutton_a_record_22
                    WHERE TIMESTAMP >= '${yesterday
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ")}'
                    AND TIMESTAMP < '${currentDate
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ")}'
                    GROUP BY PSN
                ) ib2 ON ib.PSN = ib2.PSN AND ib.TIMESTAMP = ib2.latest_timestamp
            ) AS ib ON dispositif.psn_dispositif = ib.PSN
            LEFT JOIN tag t ON ib.IB_CODE = t.tag
            LEFT JOIN conducteur c ON t.id_tag = c.id_tag
            WHERE
                vehicule.draft = 0
                GROUP BY vehicule.immatriculation_vehicule  ORDER BY vehicule.id_vehicule ASC
            LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    } else {
      sql = `
            SELECT DISTINCT
                vehicule.id_vehicule,
                vehicule.immatriculation_vehicule,
                vehicule.category_vehicule,
                vehicule.vehicule_type,
                vehicule.couleur_vehicule,
                dispositif.id_dispositif,
                dispositif.psn_dispositif AS PSN,
                groupe.nom_groupe,
                groupe.color_groupe,
                user.prenom_user, 
                user.nom_user,
                COALESCE(ib.IB_CODE, 'none') AS IB_CODE,
                COALESCE(ib.GPSDIST, '0') AS GPSDIST,
                COALESCE(c.nom_conducteur, 'none') AS nom_conducteur,
                COALESCE(c.prenom_conducteur, 'none') AS prenom_conducteur
            FROM vehicule
            LEFT JOIN user ON vehicule.id_user = user.id_user
            LEFT JOIN vehicule_groupe AS groupe ON vehicule.id_groupe = groupe.id_groupe
            LEFT JOIN dispositif ON vehicule.id_dispositif = dispositif.id_dispositif
            LEFT JOIN (
                SELECT
                    ib.IB_CODE,
                    ib.GPSDIST,
                    ib.PSN
                FROM ibutton_a_record_22 ib
                JOIN (
                    SELECT
                        PSN,
                        MAX(TIMESTAMP) AS latest_timestamp
                    FROM ibutton_a_record_22
                    WHERE TIMESTAMP >= '${yesterday
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ")}'
                    AND TIMESTAMP < '${currentDate
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ")}'
                    GROUP BY PSN
                ) ib2 ON ib.PSN = ib2.PSN AND ib.TIMESTAMP = ib2.latest_timestamp
            ) AS ib ON dispositif.psn_dispositif = ib.PSN
            LEFT JOIN tag t ON ib.IB_CODE = t.tag
            LEFT JOIN conducteur c ON t.id_tag = c.id_tag
            WHERE
                vehicule.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})
                AND
                vehicule.draft = 0
                GROUP BY vehicule.immatriculation_vehicule    ORDER BY vehicule.id_vehicule ASC
            LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    }
    console.log(sql); 
    db.query(sql, callback);
  },

  // Retrieve all Vehicle User Id
  getAll: (id_user, callback) => {
    let sql;
  
    if (id_user == 1) {
      sql = `SELECT COUNT(*) as total FROM vehicule WHERE vehicule.draft = 0`;
    } else {
      sql = `SELECT COUNT(*) as total FROM vehicule WHERE vehicule.draft = 0 AND vehicule.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})`;
    }

    db.query(sql, callback);
  },

// Search

getAllUserSearch: (page, limit, id_user, search, type, callback) => {
  let sql;

  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  if (id_user == 1) {
    sql = ` 
          SELECT DISTINCT 
              vehicule.id_vehicule,
              vehicule.immatriculation_vehicule,
              vehicule.category_vehicule,
              vehicule.vehicule_type,
              vehicule.couleur_vehicule,
              dispositif.id_dispositif,
              dispositif.psn_dispositif AS PSN,
              groupe.nom_groupe,
              user.prenom_user, 
              user.nom_user,
              groupe.color_groupe,
              COALESCE(ib.IB_CODE, 'none') AS IB_CODE,
              COALESCE(ib.GPSDIST, 'O') AS GPSDIST,
              COALESCE(c.nom_conducteur, 'none') AS nom_conducteur,
              COALESCE(c.prenom_conducteur, 'none') AS prenom_conducteur
          FROM vehicule
          LEFT JOIN user ON vehicule.id_user = user.id_user
          LEFT JOIN vehicule_groupe AS groupe ON vehicule.id_groupe = groupe.id_groupe
          LEFT JOIN dispositif ON vehicule.id_dispositif = dispositif.id_dispositif
          LEFT JOIN (
              SELECT
                  ib.IB_CODE,
                  ib.GPSDIST,
                  ib.PSN
              FROM ibutton_a_record_22 ib
              JOIN (
                  SELECT
                      PSN,
                      MAX(TIMESTAMP) AS latest_timestamp
                  FROM ibutton_a_record_22
                  WHERE TIMESTAMP >= '${yesterday
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")}'
                  AND TIMESTAMP < '${currentDate
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")}'
                  GROUP BY PSN
              ) ib2 ON ib.PSN = ib2.PSN AND ib.TIMESTAMP = ib2.latest_timestamp
          ) AS ib ON dispositif.psn_dispositif = ib.PSN
          LEFT JOIN tag t ON ib.IB_CODE = t.tag
          LEFT JOIN conducteur c ON t.id_tag = c.id_tag
          WHERE
              vehicule.draft = 0`;

    if (search) {
      sql += ` AND vehicule.immatriculation_vehicule LIKE '%${search}%'`; 
    }

    sql += ` GROUP BY vehicule.immatriculation_vehicule ORDER BY vehicule.id_vehicule ASC
          LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  } else {
    sql = `
          SELECT DISTINCT
              vehicule.id_vehicule,
              vehicule.immatriculation_vehicule,
              vehicule.category_vehicule,
              vehicule.vehicule_type,
              vehicule.couleur_vehicule,
              dispositif.id_dispositif,
              dispositif.psn_dispositif AS PSN,
              groupe.nom_groupe,
              groupe.color_groupe,
              user.prenom_user, 
              user.nom_user,
              COALESCE(ib.IB_CODE, 'none') AS IB_CODE,
              COALESCE(ib.GPSDIST, '0') AS GPSDIST,
              COALESCE(c.nom_conducteur, 'none') AS nom_conducteur,
              COALESCE(c.prenom_conducteur, 'none') AS prenom_conducteur
          FROM vehicule
          LEFT JOIN user ON vehicule.id_user = user.id_user
          LEFT JOIN vehicule_groupe AS groupe ON vehicule.id_groupe = groupe.id_groupe
          LEFT JOIN dispositif ON vehicule.id_dispositif = dispositif.id_dispositif
          LEFT JOIN (
              SELECT
                  ib.IB_CODE,
                  ib.GPSDIST,
                  ib.PSN
              FROM ibutton_a_record_22 ib
              JOIN (
                  SELECT
                      PSN,
                      MAX(TIMESTAMP) AS latest_timestamp
                  FROM ibutton_a_record_22
                  WHERE TIMESTAMP >= '${yesterday
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")}'
                  AND TIMESTAMP < '${currentDate
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")}'
                  GROUP BY PSN
              ) ib2 ON ib.PSN = ib2.PSN AND ib.TIMESTAMP = ib2.latest_timestamp
          ) AS ib ON dispositif.psn_dispositif = ib.PSN
          LEFT JOIN tag t ON ib.IB_CODE = t.tag
          LEFT JOIN conducteur c ON t.id_tag = c.id_tag
          WHERE
              vehicule.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})
              AND
              vehicule.draft = 0`;

    if (search) {
      sql += ` AND vehicule.immatriculation_vehicule LIKE '%${search}%'`;
    }

    sql += ` GROUP BY vehicule.immatriculation_vehicule ORDER BY vehicule.id_vehicule ASC
          LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
  }
  console.log(sql);
  db.query(sql, callback);
},

 
getAllSearch: (id_user, search, type, callback) => {
  let sql = `SELECT COUNT(*) as total FROM vehicule WHERE vehicule.draft = 0`;

  if (search) {
    sql += ` AND vehicule.immatriculation_vehicule LIKE '%${search}%'`;
  }

  if (id_user != 1) {
    sql += ` AND vehicule.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})`;
  }

  db.query(sql, callback);
},


   // Retrieve all Vehicle User Id
   getOptions: (id_user, callback) => {
    let sql;

    if (id_user == 1) {
      sql = `SELECT vehicule.id_vehicule, vehicule.immatriculation_vehicule  FROM vehicule WHERE vehicule.draft = 0`;
    } else {
      sql = `SELECT vehicule.id_vehicule, vehicule.immatriculation_vehicule  FROM vehicule WHERE vehicule.draft = 0 AND vehicule.id_user IN (SELECT id_manageduser FROM user_user WHERE user_user.id_user=${id_user})`;
    }

    db.query(sql, callback);
  },

  // Récupérer un véhicule par son ID
  getById: (id_vehicule, callback) => {
    const sql = `SELECT 
                  vehicule.id_vehicule,
                  vehicule.category_vehicule,
                  vehicule.couleur_vehicule,
                  vehicule.id_conducteur_vehicule,
                  vehicule.id_dispositif,
                  vehicule.id_groupe,
                  vehicule.id_marque,
                  vehicule.id_user,
                  vehicule.id_vehicule,
                  vehicule. immatriculation_vehicule,
                  vehicule.num_porte_vehicule,
                  vehicule.vehicule_type,
                  vehicule.draft
                  FROM vehicule 
                  WHERE  vehicule.id_vehicule  = ?`;
   

    db.query(sql, [id_vehicule], callback);
  },

  getByUserId: (page, limit, id_user, callback) => {
    const params = [limit, page];
    const sql = `SELECT * FROM vehicule WHERE id_user = ? LIMIT ${limit} OFFSET ${page} `;
    db.query(sql, [id_user], callback);
  },

  getTypeOptions: (type, callback) => {
    const sql = `SELECT model FROM vehicule_type WHERE nom_type="${type}"`;

    db.query(sql, callback);
  },

  // Ajouter un nouveau véhicule
  add: (vehicleData, callback) => {
    const {
      category_vehicule,
      couleur_vehicule,
      id_groupe,
      id_user,
      immatriculation_vehicule,
      num_porte_vehicule,
      vehicule_type,
    } = vehicleData;

    const sql = `
      INSERT INTO vehicule (
        category_vehicule,
        couleur_vehicule,
        id_groupe,
        id_user,
        immatriculation_vehicule,
        num_porte_vehicule,
        vehicule_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      sql,
      [
        category_vehicule,
        couleur_vehicule,
        id_groupe,
        id_user,
        immatriculation_vehicule,
        num_porte_vehicule,
        vehicule_type,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        const id_vehicule = result.insertId;
        callback(null, id_vehicule);
      }
    );
  },

  // Mettre à jour un véhicule
  update: (vehicleData, callback) => {
    const {
      category_vehicule,
      couleur_vehicule,
      id_groupe,
      id_user,
      immatriculation_vehicule,
      num_porte_vehicule,
      vehicule_type,
      id_vehicule,
    } = vehicleData;

    const sql = `
    UPDATE vehicule
    SET 
      category_vehicule=?,
      couleur_vehicule=?,
      id_groupe=?,
      id_user=?,
      immatriculation_vehicule=?,
      num_porte_vehicule=?,
      vehicule_type=?
    WHERE 
      id_vehicule=?
     `;

    db.query(
      sql,
      [
        category_vehicule,
        couleur_vehicule,
        id_groupe,
        id_user,
        immatriculation_vehicule,
        num_porte_vehicule,
        vehicule_type,
        id_vehicule,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      }
    );
  },

  // Supprimer un véhicule
  delete: (id_vehicle,id_user, callback) => {
    const sql = `
    UPDATE vehicule
    SET 
      draft=${id_user},
      date_suppression_vehicule=?
    WHERE  
      id_vehicule=?
     `;
   console.log(sql);  
    db.query(
      sql,
      [getCurrentDateTimeString(), id_vehicle],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result["changedRows"]); 
      }
    );
  },
};

module.exports = Vehicle;
