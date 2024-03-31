const express = require('express');
const router = express.Router();
const Role = require('../models/Role');


router.get('/roles', (req, res) => {
  Role.getRole((error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error retrieving data' });
    } else {
      res.json(results);
    }
  });
});

router.get('/role/permission/:id_user/:id_role', (req, res) => {
  // Récupérez les paramètres d'URL
  const id_user = req.params.id_user;
  const id_role = req.params.id_role;

  // Appelez la fonction getALLCount avec les paramètres
  Role.getPermission(id_user, id_role, (error, results) => {
    if (error) {
      // Gérez l'erreur, par exemple, renvoyez un statut d'erreur
      res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    } else {
      // Renvoyez les résultats en tant que réponse JSON
      res.json(results);
    }
  });
});

router.put('/updatePermissions', (req, res) => {
  const { id_user, id_permission, newPermissions } = req.body;

  Role.updatePermissions(id_user, id_permission, newPermissions, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour des permissions.' });
    } else {
      res.json({ message: 'Permissions mises à jour avec succès.' });
    }
  });
});





module.exports = router;
