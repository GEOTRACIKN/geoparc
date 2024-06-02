const jwt = require('jsonwebtoken');
const pool = require("../database");
const crypto = require('crypto');

const User = {

validateUserByIdUser : async (id_user, callback) => {

    const query = 'SELECT * FROM gp_user WHERE id_user= ?'; 
    console.log(id_user); 
    try {
      const [results] = await pool.execute(query, [id_user]);
  
      if (results.length === 0) {
        // Si aucun utilisateur correspondant n'est trouvé
        callback({ status: 401, message: 'Nom d\'utilisateur incorrect' });
      } else {
        const user = results[0];
     
        if (user.intrash !== 0) {
          // Si l'utilisateur a intrash différent de 0
          callback({ status: 402, message: 'Utilisateur introuvable' });
        } else {
          // Utilisateur authentifié avec intrash à 0, générer un jeton JWT
          const id_user = user.id_user;
          const token = jwt.sign({ id_user }, process.env.JWT_SECRET);
          const username = user.username_user;
          callback(null, { id_user, token, username });
        }
      }
    } catch (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur : ' + err.message);
      callback({ status: 500, message: 'Erreur lors de la recherche de l\'utilisateur' });
    }
  

}

};
module.exports = User;