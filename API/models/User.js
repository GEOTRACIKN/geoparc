const jwt = require('jsonwebtoken');
const db = require('../database');
const crypto = require('crypto');

exports.validateUser = (username, password, callback) => {
  // Vérification de l'utilisateur dans la base de données
  const query = 'SELECT id_user, username_user,nom_user ,prenom_user,password_user, intrash FROM user WHERE username_user = ?';
  db.query(query, [username], (err, results) => {
    if (err) { 
      console.error('Erreur lors de la recherche de l\'utilisateur : ' + err.message);
      callback({ status: 500, message: 'Erreur lors de la recherche de l\'utilisateur' });
    } else if (results.length === 0) {
      // Si aucun utilisateur correspondant n'est trouvé
      callback({ status: 401, message: 'Nom d\'utilisateur incorrect' });
    } else {
      const user = results[0];
      const motDePasseEnBase = user.password_user;
      const motDePasseHache = crypto.createHash('sha512').update(password).digest('hex');

      // Vérification du mot de passe en texte brut
      if (motDePasseHache !== motDePasseEnBase) {
        // Si le mot de passe ne correspond pas
        callback({ status: 401, message: 'Mot de passe incorrect' });
      } else if (user.intrash !== 0) {
        // Si l'utilisateur a intrash différent de 0
        callback({ status: 402, message: 'Utilisateur introuvable' });
      } else {
        // Utilisateur authentifié avec intrash à 0, générer un jeton JWT
        const id_user = user.id_user;
        const token = jwt.sign({ id_user }, process.env.JWT_SECRET);
        const username=user.username_user; 
        callback(null, { id_user, token,username });
      }
    }
  });
};
