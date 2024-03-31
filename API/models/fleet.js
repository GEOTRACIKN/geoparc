const db = require("../database");
const moment = require("moment-timezone");

const fleet = {
  getAllfleet: (id_user, callback) => {
    const sql = `SELECT COUNT(DISTINCT id_vehicule) AS total
    FROM 
        dispositif
        LEFT JOIN vehicule ON vehicule.id_dispositif = dispositif.id_dispositif
        LEFT JOIN user_user ON vehicule.id_user = user_user.id_manageduser
        LEFT JOIN last_position_requests ON last_position_requests.PSN = dispositif.psn_dispositif
        LEFT JOIN vehicule_groupe ON vehicule_groupe.id_groupe = vehicule.id_groupe
        LEFT JOIN user ON vehicule.id_user = user.id_user
        LEFT JOIN conducteur ON vehicule.id_conducteur_vehicule = conducteur.id_conducteur
    WHERE 
        user_user.id_user = ${id_user}`;

    db.query(sql, callback);
  },

  getFleetData: (page, limit, id_user, searchTerm, searchOption, callback) => {
    const offset = (page - 1) * limit;
    let sql = `
          SELECT 
          DISTINCT
            dispositif.id_dispositif,
            dispositif.psn_dispositif,
            dispositif.id_user,
            vehicule.vehicule_type,
            vehicule.id_vehicule,
            vehicule.category_vehicule,
            vehicule.immatriculation_vehicule,
            vehicule.id_conducteur_vehicule,
            vehicule.id_groupe AS vehicule_id_groupe,
            last_position_requests.PSN AS last_position_requests_PSN,
            last_position_requests.ALT,
            last_position_requests.LAT,
            last_position_requests.LON,
            last_position_requests.SOG,
            last_position_requests.GSMLVL,
            last_position_requests.NST,
            last_position_requests.PSN AS last_position_requests_PSN,
            last_position_requests.TIMESTAMP,
            last_position_requests.ENGINESTAT,
            last_position_requests.GPSDIST,
            last_position_requests.COG,
            vehicule_groupe.id_groupe AS vehicule_groupe_id_groupe,
            vehicule_groupe.id_user AS vehicule_groupe_id_user,
            vehicule_groupe.nom_groupe,
            vehicule_groupe.draft_groupe,
            user.id_user AS user_id_user,
            user.nom_user,
            user.prenom_user,
            user.username_user,
            user.phone_user,
            user.id_groupe AS user_id_groupe,
            user.intrash AS user_intrash,
            conducteur.id_conducteur,
            conducteur.nom_conducteur,
            conducteur.prenom_conducteur,
            conducteur.telephone_conducteur,
            conducteur.id_user AS conducteur_id_user
          FROM 
            dispositif
          LEFT JOIN vehicule ON vehicule.id_dispositif = dispositif.id_dispositif
          LEFT JOIN user_user ON vehicule.id_user = user_user.id_manageduser
          LEFT JOIN last_position_requests ON last_position_requests.PSN = dispositif.psn_dispositif
          LEFT JOIN vehicule_groupe ON vehicule_groupe.id_groupe = vehicule.id_groupe
          LEFT JOIN user ON vehicule.id_user = user.id_user
          LEFT JOIN conducteur ON vehicule.id_conducteur_vehicule = conducteur.id_conducteur
          WHERE 
            user_user.id_user = ${id_user}
        `;

    if (searchTerm) {
      // Modifier la clause WHERE pour inclure le champ de recherche sélectionné
      if (searchOption === "PSN") {
        sql += `AND dispositif.psn_dispositif LIKE '%${searchTerm}%'`;
      } else if (searchOption === "vehicule") {
        sql += `AND vehicule.immatriculation_vehicule LIKE '%${searchTerm}%'`;
      } else if (searchOption === "user") {
        sql += `AND (user.nom_user LIKE '%${searchTerm}%' OR user.prenom_user LIKE '%${searchTerm}%')`;
      } else if (searchOption === "conducteur") {
        sql += `AND (conducteur.nom_conducteur LIKE '%${searchTerm}%' OR conducteur.prenom_conducteur LIKE '%${searchTerm}%')`;
      }
    }

    sql += `ORDER BY vehicule.id_vehicule ASC LIMIT ${limit} OFFSET ${offset}`;

    db.query(sql, callback);
  },

  getOneFleetData(id_dispositif, callback) {
    let sql = `
  SELECT DISTINCT
    *
FROM 
    dispositif
    LEFT JOIN vehicule ON vehicule.id_dispositif = dispositif.id_dispositif
    LEFT JOIN user_user ON vehicule.id_user = user_user.id_manageduser
    LEFT JOIN last_position_requests ON last_position_requests.PSN = dispositif.psn_dispositif
    LEFT JOIN vehicule_groupe ON vehicule_groupe.id_groupe = vehicule.id_groupe
    LEFT JOIN user ON vehicule.id_user = user.id_user
    LEFT JOIN conducteur ON vehicule.id_conducteur_vehicule = conducteur.id_conducteur
WHERE 
    dispositif.id_dispositif = ${id_dispositif}`;

    db.query(sql, callback);
  },

  getDuration: (dateBegin, dateEnd) => {
    const timeDiff = new Date(dateEnd) - new Date(dateBegin);
    return timeDiff;
  },

  convertirEnHeuresMinutesSecondes(totalSeconds) {
    const heures = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secondes = totalSeconds % 60;

    return {
      heures: heures,
      minutes: minutes,
      secondes: secondes,
    };
  },

  calculateStats: (dateDebut, dateFin, PSN, callback) => {
    try {
      // Requête SQL pour les statistiques
      const statsSql = `
      SELECT
        MAX(SOG) AS maxVitesse,
        AVG(CASE WHEN SOG >5 THEN SOG END) AS moyVitesse,
        MAX(GPSDIST) - MIN(GPSDIST) AS distance
      FROM
        hello_record
      WHERE
        PSN = ?
        AND TIMESTAMP BETWEEN ? AND ?
    `;

      // Exécution de la requête pour les statistiques
      db.query(
        statsSql,
        [PSN, dateDebut, dateFin],
        (statsError, statsResults) => {
          if (statsError) {
            console.error(statsError);
            return callback(statsError, null);
          }

          // Traitement des résultats des statistiques
          const statsResult = {
            maxVitesse:
              statsResults[0].maxVitesse !== null
                ? statsResults[0].maxVitesse.toFixed(2)
                : "-",
            moyVitesse:
              statsResults[0].moyVitesse !== null
                ? statsResults[0].moyVitesse.toFixed(2)
                : "--",
            distance:
              statsResults[0].distance !== null
                ? statsResults[0].distance / 1000
                : "--",
            // Ajoutez d'autres résultats en fonction de vos besoins
          };

          // Requête SQL pour les données du Line Chart
          const lineChartSql = `
  SELECT
    SOG,
    GPSDIST,
    TIMESTAMP,
    DATE_FORMAT(TIMESTAMP, '%H:%i:%s') AS TEMPS,
    ENGINESTAT AS EtatM
  FROM
    hello_record
  WHERE
    PSN = ?
    AND TIMESTAMP BETWEEN ? AND ?
  ORDER BY
    TIMESTAMP ASC;
`;

          db.query(
            lineChartSql,
            [PSN, dateDebut, dateFin],
            (lineChartError, lineChartResults) => {
              if (lineChartError) {
                console.error(lineChartError);
                return callback(lineChartError, null);
              }

              // Traitement des résultats du Line Chart
              const lineChartResult = lineChartResults;
              // Initialiser la distance cumulative précédente
              // Initialiser la distance cumulative précédente et la somme cumulative
              let prevCumulativeDistance = null;
              let cumulativeSum = 0;

              // Iterer sur les éléments du résultat
              for (let i = 0; i < lineChartResult.length; i++) {
                const currentData = lineChartResult[i];

                // Si c'est le premier élément, initialiser prevCumulativeDistance
                if (prevCumulativeDistance === null) {
                  prevCumulativeDistance = currentData.GPSDIST / 1000; // Convertir en kilomètres
                }

                // Calculer la différence avec la première cumulativeDistance
                const difference =
                  currentData.GPSDIST / 1000 - prevCumulativeDistance;

                // Ajouter la différence à la somme cumulative
                cumulativeSum += difference;

                // Mettre à jour le champ cumulativeDifference
                currentData.cumulativeDifference = cumulativeSum;

                // Mettre à jour prevCumulativeDistance pour l'itération suivante
                prevCumulativeDistance = currentData.GPSDIST / 1000; // Convertir en kilomètres
              }
              let tempsMarche = 0;
              let tempsArret = 0;

              // Spécifiez la journée que vous souhaitez analyser (par exemple, '2023-12-18')
              const currentDay = new Date().toISOString().split("T")[0];

              for (let i = 0; i < lineChartResult.length - 1; i++) {
                const currentData = lineChartResult[i];
                const nextData = lineChartResult[i + 1];

                const currentTimestamp = new Date(currentData.TIMESTAMP);
                const nextTimestamp = new Date(nextData.TIMESTAMP);

                // Vérifiez si la date actuelle correspond à la journée spécifiée
                if (
                  currentTimestamp.toISOString().split("T")[0] === currentDay
                ) {
                  const tempsDifference =
                    (nextTimestamp - currentTimestamp) / 1000;

                  if (currentData.EtatM == 0) {
                    tempsArret += tempsDifference;
                  }
                  if (currentData.EtatM == 1 && currentData.SOG < 5) {
                    tempsArret += tempsDifference;
                  } else {
                    if (currentData.EtatM == 1 && currentData.SOG > 5) {
                      tempsMarche += tempsDifference;
                    }
                  }

                  // Si le dernier point est un arrêt, ajoutez également le temps d'arrêt
                }
              }

              // Convertir les temps de marche et d'arrêt en heures, minutes, secondes
              const tempsMarcheConverti =
                fleet.convertirEnHeuresMinutesSecondes(tempsMarche);
              const tempsArretConverti =
                fleet.convertirEnHeuresMinutesSecondes(tempsArret);

              const result = {
                statsResult: statsResult,
                lineChart: lineChartResult,
                tempsMarche: tempsMarcheConverti,
                tempsArret: tempsArretConverti,
                // Ajoutez d'autres résultats en fonction de vos besoins
              };

              callback(null, result);
            }
          );
        }
      );
    } catch (error) {
      console.error(error);
      callback(error, null);
    }
  },

  getDashData(id_user, callback) {
    let sql = `
  SELECT DISTINCT
  dispositif.id_dispositif,
  dispositif.psn_dispositif,
  dispositif.id_user,
  vehicule.vehicule_type,
  vehicule.id_vehicule,
  vehicule.category_vehicule,
  vehicule.immatriculation_vehicule,
  vehicule.id_conducteur_vehicule,
  vehicule.id_groupe AS vehicule_id_groupe,
  last_position_requests.PSN AS last_position_requests_PSN,
  last_position_requests.ALT,
  last_position_requests.LAT,
  last_position_requests.LON,
  last_position_requests.SOG,
  last_position_requests.GSMLVL,
  last_position_requests.NST,
  last_position_requests.PSN AS last_position_requests_PSN,
  last_position_requests.TIMESTAMP,
  last_position_requests.ENGINESTAT,
  last_position_requests.GPSDIST,
  last_position_requests.COG,
  vehicule_groupe.id_groupe AS vehicule_groupe_id_groupe,
  vehicule_groupe.id_user AS vehicule_groupe_id_user,
  vehicule_groupe.nom_groupe,
  vehicule_groupe.draft_groupe,
  user.id_user AS user_id_user,
  user.nom_user,
  user.prenom_user,
  user.username_user,
  user.phone_user,
  user.id_groupe AS user_id_groupe,
  user.intrash AS user_intrash,
  conducteur.id_conducteur,
  conducteur.nom_conducteur,
  conducteur.prenom_conducteur,
  conducteur.telephone_conducteur,
  conducteur.id_user AS conducteur_id_user
FROM 
  dispositif
  LEFT JOIN vehicule ON vehicule.id_dispositif = dispositif.id_dispositif
  LEFT JOIN user_user ON vehicule.id_user = user_user.id_manageduser
  LEFT JOIN last_position_requests ON last_position_requests.PSN = dispositif.psn_dispositif
  LEFT JOIN vehicule_groupe ON vehicule_groupe.id_groupe = vehicule.id_groupe
  LEFT JOIN user ON vehicule.id_user = user.id_user
  LEFT JOIN conducteur ON vehicule.id_conducteur_vehicule = conducteur.id_conducteur
WHERE 
  CASE
      WHEN ${id_user} = 1 THEN true
      ELSE user_user.id_user = ${id_user}
  END`;

    db.query(sql, callback);
  },

  getVehiclesByUserId(userId, callback) {
    const query =
      "SELECT DISTINCT immatriculation_vehicule FROM vehicule WHERE id_user = ?";

    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des détails de immatriculation_vehicule:",
          err
        );
        return callback(err, null);
      } else {
        return callback(null, result);
      }
    });
  },
};

module.exports = fleet;
