const db = require("../database");

const Search = {
  // Retrieve all Search type Id
  getReportFor: (type, callback) => {  
    const sql = `SELECT * FROM autocomplete_type WHERE id_type=${type}`;

    db.query(sql, callback);
  },

  autocompleteVehicles: (id_user, research, callback) => { 
    
    let sql;   
    if (id_user == 1) {  
      sql = `SELECT immatriculation_vehicule, id_dispositif 
        FROM vehicule  
        WHERE draft = 0
        AND immatriculation_vehicule LIKE '%${research}%'`;
    } else { 
      sql = `SELECT v.immatriculation_vehicule, v.id_dispositif
        FROM vehicule v
        INNER JOIN user_user uu ON v.id_user = uu.id_manageduser
        WHERE uu.id_user = ${id_user}  
          AND v.draft = 0
          AND v.immatriculation_vehicule LIKE '%${research}%'`;
    }
  console.log(sql);

    db.query(sql, callback); 

  },

  autocompletePSN: (id_user, research, callback) => { 
    
    let sql;   
    if (id_user == 1) {  
      sql = `SELECT immatriculation_vehicule, id_dispositif 
        FROM vehicule  
        WHERE draft = 0
        AND immatriculation_vehicule LIKE '%${research}%'`;
    } else { 
      sql = `SELECT v.immatriculation_vehicule, v.id_dispositif
        FROM vehicule v
        INNER JOIN user_user uu ON v.id_user = uu.id_manageduser
        WHERE uu.id_user = ${id_user}  
          AND v.draft = 0
          AND v.immatriculation_vehicule LIKE '%${research}%'`;
    }
  console.log(sql);

    db.query(sql, callback); 

  },

};

module.exports = Search;
