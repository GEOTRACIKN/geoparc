const db = require("../database");
const Map = {

  // Récupérer tous les véhicules
  getAll: (id_user, callback) => {
    const sql = `SELECT vehicule.id_vehicule,vehicule.immatriculation_vehicule,last_position_requests.LON,last_position_requests.PSN, last_position_requests.LAT,last_position_requests.SOG,last_position_requests.COG,last_position_requests.ENGINESTAT,last_position_requests.TIMESTAMP,last_position_requests.GPSDIST FROM dispositif,vehicule,user_user,last_position_requests WHERE vehicule.id_dispositif = dispositif.id_dispositif AND vehicule.id_user = user_user.id_manageduser AND user_user.id_user=${id_user} AND last_position_requests.PSN = dispositif.psn_dispositif GROUP BY vehicule.immatriculation_vehicule`;
    db.query(sql, callback);
  },


  getReconstitutionItinerary: (PSN, callback) => { 

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startTimestamp = today.toISOString().slice(0, 19).replace('T', ' ');

    const todayNow = new Date();
    const endTimestamp = todayNow.toISOString().slice(0, 19).replace('T', ' ');

    const sql = `SELECT ALT,LAT,LON,COG,SOG,ENGINESTAT,GPSDIST,ALARMS,PRIVATE_MODE,TIMESTAMP FROM hello_record WHERE PSN="${PSN}" AND NST=1 AND TIMESTAMP >= "${startTimestamp}" AND TIMESTAMP <= "${endTimestamp}" ORDER BY TIMESTAMP ASC`;
    db.query(sql, callback);

  }, 

  getContactSpeedDistanceDiagram: (PSN, callback) => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startTimestamp = today.toISOString().slice(0, 19).replace('T', ' ');

    const todayNow = new Date();
    const endTimestamp = todayNow.toISOString().slice(0, 19).replace('T', ' ');

    const sql = `SELECT LAT,LON,ENGINESTAT,SOG,GPSDIST,TIMESTAMP FROM hello_record WHERE PSN="${PSN}" AND NST=1 AND TIMESTAMP >= "${startTimestamp}" AND TIMESTAMP <= "${endTimestamp}" ORDER BY TIMESTAMP ASC`;
    db.query(sql, callback); 

  },

 

  getDistanceAndConsumptionDiagram: (PSN, callback) => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startTimestamp = today.toISOString().slice(0, 19).replace('T', ' ');

    const todayNow = new Date();
    const endTimestamp = todayNow.toISOString().slice(0, 19).replace('T', ' ');

    const sql = `SELECT LAT,LON,TFUEL,FUELLVL,VEHDIST,TIMESTAMP FROM can_fms_fuel_distance_record96 WHERE PSN="${PSN}" AND NST=1 AND TIMESTAMP >= "${startTimestamp}" AND TIMESTAMP <= "${endTimestamp}" ORDER BY TIMESTAMP ASC`;
    db.query(sql, callback);

  },
 

  getTemperatureHumidityDiagram: (PSN, callback) => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startTimestamp = today.toISOString().slice(0, 19).replace('T', ' ');

    const todayNow = new Date();
    const endTimestamp = todayNow.toISOString().slice(0, 19).replace('T', ' ');

    const sql = `SELECT LAT,LON,AVGHUM,AVGTEMP,TIMESTAMP FROM  temperature_humidity_record126 WHERE PSN="${PSN}" AND NST=1 AND TIMESTAMP >= "${startTimestamp}" AND TIMESTAMP <= "${endTimestamp}" ORDER BY TIMESTAMP ASC`;
    db.query(sql, callback);

  },

  
};

module.exports = Map;
