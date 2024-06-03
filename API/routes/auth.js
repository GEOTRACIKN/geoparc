const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookie = require('cookie');
const User = require("../models/User"); // Importez le modèle de l'utilisateur

 
// Endpoint pour la connexion (validation de l'utilisateur)
router.post("/login", (req, res) => { 
  const { GeopUserID } = req.body;
  
  // Utilisez la fonction validateUser du modèle User pour valider l'utilisateur
  User.validateUserByIdUser(GeopUserID, (err, userData) => { 
    if (err) {
      res.status(err.status).json({ message: err.message });
    } else {
      // L'authentification a réussi, renvoyez un jeton JWT
      const id_user = userData.id_user; // Obtenez l'id_user depuis les données de l'utilisateur
      const token = jwt.sign({ id_user }, process.env.JWT_SECRET);
      const Geopusername = userData.Geopusername; 
      res.setHeader('Set-Cookie', cookie.serialize('jwtToken', token, {
        httpOnly: true, // Pour empêcher l'accès au cookie depuis JavaScript côté client
        maxAge: 60 * 60 * 24, // Durée de validité du cookie en secondes ( jours dans cet exemple)
      }));
   
      res.json({ token,id_user,Geopusername}); 
    }
  
  });
});


router.post('/auth', (req, res) => {
  const { GeopUserID } = req.body;

  if (GeopUserID) {
    // Traitez les données GeopUserID ici si nécessaire
    console.log('GeopUserID reçu :', GeopUserID);
    // Réponse à la partie A
    res.status(200).send('Données GeopUserID reçues');
  } else {
    res.status(400).send('Aucune donnée GeopUserID reçue');
  }
});



module.exports = router;
