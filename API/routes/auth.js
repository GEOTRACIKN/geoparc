const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookie = require('cookie');
const User = require("../models/User"); // Importez le modèle de l'utilisateur


// Endpoint pour la connexion (validation de l'utilisateur)
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Utilisez la fonction validateUser du modèle User pour valider l'utilisateur
  User.validateUser(username, password, (err, userData) => {
    if (err) {
      res.status(err.status).json({ message: err.message });
    } else {
      // L'authentification a réussi, renvoyez un jeton JWT
      const id_user = userData.id_user; // Obtenez l'id_user depuis les données de l'utilisateur
      const token = jwt.sign({ id_user }, process.env.JWT_SECRET);
      const username = userData.username; 
      res.setHeader('Set-Cookie', cookie.serialize('jwtToken', token, {
        httpOnly: true, // Pour empêcher l'accès au cookie depuis JavaScript côté client
        maxAge: 60 * 60 * 24, // Durée de validité du cookie en secondes ( jours dans cet exemple)
      }));
   

      res.json({ token,id_user,username}); 
    }
  
  });
//   // Endpoint pour la déconnexion (logout)
//   router.post("/logout", (req, res) => {
//     // Clear the JWT cookie on the client side
//     res.setHeader('Set-Cookie', cookie.serialize('jwtToken', '', {
//       httpOnly: true,
//       expires: new Date(0), // Set the expiration date to a past date
//     }));
  
//     // Respond with a success message
//     res.json({ message: 'Logout successful' });
//   });
  

});

module.exports = router;
