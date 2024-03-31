const db = require("../database");
const Rapport = {

//Start Modéle Rapport Itinerary reconstitution By Chafik
getReport1 :(id_repport, callback) => {
  
  let query1 = `
    SELECT id,start, end, ENGINESTAT, duration, Odometer, distance, max_speed, LAT, LNG, SOG, COG,trip_date
    FROM repport_datas
    WHERE id_repport = ?
    ORDER BY start ASC`;  

  let query2 = `SELECT vehicule.immatriculation_vehicule, repport.date_debut, repport.date_fin, repport.parking_duration, repport.driving_duration, repport.total_duration, repport.total_distance, repport.max_speed, repport.avg_speed
                FROM repport
                JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif
                WHERE repport.id_report = ?`; 

    // Using Promise.all to execute both queries asynchronously
      Promise.all([
          new Promise((resolve, reject) => {
              db.query(query2, [id_repport], (err, results) => {
                if (err) reject(err);
                else resolve(results);
              });
          }),
          new Promise((resolve, reject) => {
              db.query(query1, [id_repport], (err, results) => {
                if (err) reject(err);
                else resolve(results);
              });
          })
      ])
      .then(([repportResult, repportDatasResult]) => {
        // Combine results and pass them to the callback
        const combinedResult = {
            repport: repportResult,
            repportDatas: repportDatasResult
        };
        callback(null, combinedResult);
    })
      .catch(error => {
          callback(error, null);
      });
},
//End Modéle Rapport Gantt sur contact By Chafik






//Start Modéle Rapport de proximité numéro 2 By Hichem
getReport2: (id_repport, callback) => {
  let query1 = `
      SELECT start, end, ENGINESTAT, duration, Odometer, distance, max_speed, LAT, LNG, SOG, trip_date
      FROM repport_datas
      WHERE id_repport = ?
      ORDER BY start ASC`;

  let query2 = `
      SELECT
      vehicule.immatriculation_vehicule
      FROM repport rep
      JOIN vehicule ON rep.id_dispositif = vehicule.id_dispositif
      WHERE rep.id_report = ? `;

  // Using Promise.all to execute both queries asynchronously
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(query2, [id_repport], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(query1, [id_repport], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    }),
  ])
    .then(([immatriculationResult, repportDatasResult]) => {
      // Combine results and pass them to the callback
      const combinedResult = {
        immatriculation: immatriculationResult[0].immatriculation_vehicule,
        repportDatas: repportDatasResult,
      };
      callback(null, combinedResult);
    })
    .catch((error) => {
      callback(error, null);
    });
},
//End Modéle Rapport de proximité numéro 2 By Hichem


//Start Modéle CAN Distance and Consumption Diagram By Chafik
getReport8 :(id_repport, callback) => {
  
  const query1 = `SELECT datetime, Odometer, FUELLVL, TFUEL, LAT,  LNG FROM repport_datas WHERE  id_repport=?  ORDER BY repport_datas.datetime ASC`;  
  
  
  const query2 = `SELECT vehicule.immatriculation_vehicule, repport.date_debut, repport.date_fin,repport.total_odometer, repport.total_fuel_lvl, repport.total_fuel  FROM repport JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif WHERE  id_report= ?`;
   
      // Using Promise.all to execute both queries asynchronously 
        Promise.all([
            new Promise((resolve, reject) => {
                db.query(query2, [id_repport], (err, results) => {
                  if (err) reject(err);
                  else resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query(query1, [id_repport], (err, results) => {
                  if (err) reject(err);
                  else resolve(results);
                });
            })
        ])
        .then(([repportResult, repportDatasResult]) => {
            // Combine results and pass them to the callback
            const combinedResult = {
                repport: repportResult,
                repportDatas: repportDatasResult
            };
            callback(null, combinedResult);
        })
        .catch(error => {
            callback(error, null);
        });
  },
  //End Modéle Rapport Gantt sur contact By Chafik
  


//Start Modéle CAN Distance and Consumption Diagram By Chafik
getReport19 :(id_repport, callback) => {
  
  const query1 = `SELECT datetime, temperature, humidity , LAT, LNG FROM repport_datas WHERE  id_repport= ?  ORDER BY repport_datas.datetime ASC`;   
  
  
  const query2 = `SELECT vehicule.immatriculation_vehicule, repport.avg_temperature, repport.avg_humidity,repport.max_temperature, repport.max_humidity, repport.min_temperature, repport.min_humidity, repport.date_start, repport.date_end, 	repport.date_creation, repport.type_report  FROM repport JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif WHERE  id_report= ?`;
   


  


      // Using Promise.all to execute both queries asynchronously 
        Promise.all([
            new Promise((resolve, reject) => {
                db.query(query2, [id_repport], (err, results) => {
                  if (err) reject(err);
                  else resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query(query1, [id_repport], (err, results) => {
                  if (err) reject(err);
                  else resolve(results);
                });
            })
        ])
        .then(([repportResult, repportDatasResult]) => {
            // Combine results and pass them to the callback
            const combinedResult = {
                repport: repportResult,
                repportDatas: repportDatasResult
            };
            callback(null, combinedResult);
        })
        .catch(error => {
            callback(error, null);
        });
  },
  //End Modéle Rapport Gantt sur contact By Chafik
  


//Start Modéle Rapport Gantt sur contact By Chafik
getReport15 :(id_repport, callback) => {
  
const query1 = `SELECT start, end, name 
                FROM repport_datas 
                WHERE  id_repport= ?  ORDER BY repport_datas.start ASC`;  


const query2 = `SELECT vehicule.immatriculation_vehicule, repport.date_start,repport.date_end,repport.parking_duration,repport.driving_duration,repport.total_duration,repport.total_distance,repport.max_speed,avg_speed 
                FROM repport 
                JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif
                WHERE  id_report= ?`;
 
    // Using Promise.all to execute both queries asynchronously
      Promise.all([
          new Promise((resolve, reject) => {
              db.query(query2, [id_repport], (err, results) => {
                if (err) reject(err);
                else resolve(results);
              });
          }),
          new Promise((resolve, reject) => {
              db.query(query1, [id_repport], (err, results) => {
                if (err) reject(err);
                else resolve(results);
              });
          })
      ])
      .then(([repportResult, repportDatasResult]) => {
          // Combine results and pass them to the callback
          const combinedResult = {
              repport: repportResult,
              repportDatas: repportDatasResult
          };
          callback(null, combinedResult);
      })
      .catch(error => {
          callback(error, null);
      });
},
//End Modéle Rapport Gantt sur contact By Chafik

 // Start By Younes 
 // Report 12
 getReport12: (id_report, callback) => {
 let immatriculationQuery = `
    SELECT
      vehicule.immatriculation_vehicule,
      rep.date_creation,
      rep.date_debut,
      rep.date_fin
    FROM
      repport AS rep
    JOIN
      vehicule ON rep.id_dispositif = vehicule.id_dispositif
    WHERE
      rep.id_report = ?
    `;

// SQL SELECT statement to retrieve specific columns from the repport_datas table
let repportDatasQuery = `
  SELECT  
  x, y, speed_range, duration, percent,start 
  FROM repport_datas
  WHERE id_repport = ?`;

// Using Promise.all to execute both queries asynchronously
Promise.all([
   new Promise((resolve, reject) => {
       db.query(immatriculationQuery, [id_report], (err, results) => {
           if (err) reject(err);
           else resolve(results);
       });
   }),
   new Promise((resolve, reject) => {
       db.query(repportDatasQuery, [id_report], (err, results) => {
           if (err) reject(err);
           else resolve(results);
         });
   })
])
.then(([immatriculationResult, repportDatasResult]) => {
 // Combine results and pass them to the callback
 const combinedResult = {
   immatriculation: immatriculationResult,
   repportDatas: repportDatasResult
 };
 callback(null, combinedResult);
})
.catch(error => {
 callback(error, null);
});
},
  
  // Report 25
  getReport25: async (id_report, callback) => {
    // SQL SELECT statement to retrieve immatriculation from the vehicule table
  let immatriculationQuery = `
  SELECT
    vehicule.immatriculation_vehicule,
    vehicule_groupe.nom_groupe
  FROM
      repport rep
  JOIN
      vehicule ON rep.id_dispositif = vehicule.id_dispositif
  LEFT JOIN
      vehicule_groupe ON vehicule.id_groupe = vehicule_groupe.id_groupe
  WHERE
      rep.id_report = ?;

  `;

  // SQL SELECT statement to retrieve specific columns from the repport_datas table
  let repportDatasQuery = `
    SELECT
      datas.eventKey,
      datas.DriverTag,
      datas.DriverName,
      datas.EventLevel,
      datas.max_speed,
      datas.duration,
      datas.start,
      datas.LAT,
      datas.LNG
    FROM repport_datas datas
    WHERE datas.id_repport = ?
    ORDER BY datas.start ASC;
  `;

  // Using Promise.all to execute both queries asynchronously
  Promise.all([
      new Promise((resolve, reject) => {
          db.query(immatriculationQuery, [id_report], (err, results) => {
              if (err) reject(err);
              else resolve(results);
          });
      }),
      new Promise((resolve, reject) => {
          db.query(repportDatasQuery, [id_report], (err, results) => {
              if (err) reject(err);
              else resolve(results);
            });
      })
  ])
  .then(([immatriculationResult, repportDatasResult]) => {
    // Combine results and pass them to the callback
    const combinedResult = {
      immatriculation: immatriculationResult[0],
      repportDatas: repportDatasResult
    };
    callback(null, combinedResult);
  })
  .catch(error => {
    callback(error, null);
  });
  },

// END By Younes



//Start Modéle 35 numéro  By Badro
getReport35: (id_repport, callback) => {
  // Modifier la requête pour inclure une jointure avec les tables dispositif et vehicule
  let query1 = `
    SELECT rd.id_repport, rd.driver_name, rd.ibutton_code, rd.psn, rd.distance, rd.acc, rd.brk, rd.max_speed, rd.duration, rd.start, rd.end, rd.score, rd.rest_time, rd.driving_time,
    v.immatriculation_vehicule
    FROM repport_datas rd
    LEFT JOIN dispositif d ON rd.psn = d.psn_dispositif
    LEFT JOIN vehicule v ON d.id_dispositif = v.id_dispositif
    WHERE rd.id_repport = ? 
    ORDER BY rd.datetime ASC`;

  Promise.all([
    new Promise((resolve, reject) => {
      db.query(query1, [id_repport], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    })
  ])
  .then(([repportDatasResult]) => {
    const combinedResult = {
      repportDatas: repportDatasResult
    };
    callback(null, combinedResult);
  })
  .catch(error => {
    callback(error, null);
  });
},

//End Modéle 35 numéro  By Badro  



//Start Modéle Rapport de DVS numéro 4 By walid
getReport4(id_repport, callback) {
  try {
    const query1 = `
    SELECT id_repport, distance, LAT, LNG, SOG, ENGINESTAT, datetime
    FROM repport_datas
    WHERE id_repport = ?
    ORDER BY datetime ASC`;

    const query2 = `
    SELECT AVG(CASE WHEN SOG > 5 THEN SOG END) as average_speed, MAX(SOG) as max_speed
    FROM repport_datas
    WHERE id_repport = ?`;

    const query3 = `
    SELECT repport.id_report, repport.turn_report, repport.id_dispositif, 
           repport.type_report, repport.date_debut, repport.date_fin, repport.date_creation, vehicule.immatriculation_vehicule,
           vehicule.id_dispositif
    FROM repport
    LEFT JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif
    WHERE repport.id_report = ?`;

    const results1 = db.query(query1, [id_repport], (error, data1) => {
      if (error) {
        callback(error, null);
      } else {
        const results2 = db.query(query2, [id_repport], (error, data2) => {
          if (error) {
            callback(error, null);
          } else {
            const results3 = db.query(
              query3,
              [id_repport],
              (error, data3) => {
                if (error) {
                  callback(error, null);
                } else {
                  // Combinez les résultats des trois requêtes dans une seule réponse
                  const combinedResult = {
                    reportData: data1,
                    additionalData: data2[0], // Assurez-vous que les résultats sont uniques
                    moreInfo: data3[0], // Assurez-vous que les résultats sont uniques
                  };
                  callback(null, combinedResult);
                }
              }
            );
          }
        });
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du rapport :", error);
    throw error;
  }
},
//End Modéle Rapport de DVS numéro 4 By walid

//Start Modéle Rapport de DVS numéro 7 By walid
getReport7(id_repport, callback) {
  try {
    const query1 = `
    SELECT repport.id_report, repport.turn_report, repport.type_report, repport.max_speed_engine, repport.max_rotation_engine, repport.max_temperature_engine, repport.max_acceleration_engine, repport.min_speed_engine, repport.min_rotation_engine, repport.min_temperature_engine,
    repport.min_acceleration_engine, repport.avg_speed_engine, repport.avg_rotation_engine, repport.avg_temperature_engine, repport.avg_acceleration_engine, repport.date_start, repport.date_end, repport.date_creation,
    vehicule.immatriculation_vehicule,
    vehicule.id_dispositif
     FROM repport
     LEFT JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif
      WHERE repport.id_report= ?`;

    const query2 = `
    SELECT datetime, speed_engine, rotation_engine, temperature_engine, acceleration_engine  FROM repport_datas WHERE  id_repport= ?  ORDER BY repport_datas.datetime ASC`;

    db.query(query1, [id_repport], (error1, data1) => {
      if (error1) {
        callback(error1, null);
      } else {
        db.query(query2, [id_repport], (error2, data2) => {
          if (error2) {
            callback(error2, null);
          } else {
            // Appel du callback avec les résultats de chaque requête
            callback(null, { query1Result: data1, query2Result: data2 });
          }
        });
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du rapport :", error);
    throw error;
  }
},

  //Start Modéle Rapport de RPM numéro 11 By walid
  getReport11(id_repport, callback) {
    try {
      const query1 = `
      SELECT repport.id_report, repport.turn_report, repport.id_dispositif, 
           repport.type_report, repport.date_debut, repport.date_fin, repport.date_creation, vehicule.immatriculation_vehicule,
           vehicule.id_dispositif
    FROM repport
    LEFT JOIN vehicule ON repport.id_dispositif = vehicule.id_dispositif
    WHERE repport.id_report = ?`;
  
      const query2 = `
      SELECT  x, y, RPM, duration , percent FROM repport_datas WHERE  id_repport= ?`;
  
      db.query(query1, [id_repport], (error1, data1) => {
        if (error1) {
          callback(error1, null);
        } else {
          db.query(query2, [id_repport], (error2, data2) => {
            if (error2) {
              callback(error2, null);
            } else {
              // Appel du callback avec les résultats de chaque requête
              callback(null, { query1Result: data1, query2Result: data2 });
            }
          });
        }
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du rapport :", error);
      throw error;
    }
  },
  

  //End Modéle Rapport de RPM numéro 11 By walid





  getReport45: (id_report, callback) => {
    let query1 = `
        SELECT date_debut, date_fin,total_odometer, total_fuel_lvl, total_fuel
        FROM repport
        WHERE id_report = ?`;

    let query2 = `
        SELECT
        vehicule.immatriculation_vehicule
        FROM repport rep
        JOIN vehicule ON rep.id_dispositif = vehicule.id_dispositif
        WHERE rep.id_report = ? `;

    // Using Promise.all to execute both queries asynchronously
    Promise.all([
      new Promise((resolve, reject) => {
        db.query(query2, [id_report], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(query1, [id_report], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      }),
    ])
      .then(([immatriculationResult, repportDatasResult]) => {
        // Combine results and pass them to the callback
        const combinedResult = {
          immatriculation: immatriculationResult[0].immatriculation_vehicule,
          repportDatas: repportDatasResult,
        };
        callback(null, combinedResult);
      })
      .catch((error) => {
        callback(error, null);
      });
  },

}








  
module.exports = Rapport;
