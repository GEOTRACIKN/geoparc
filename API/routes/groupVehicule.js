const express = require('express');
const router = express.Router();
const groupVehicule = require('../models/GroupVehicule'); // Assuming your model is in the 'models' directory

// Route to create a new group
router.post('/groups-vehicule/total/:id_user', async (req, res) => {
  const { searchValue, searchColumn } = req.body; // Utilisez req.body au lieu de req.query
  const { id_user } = req.params;
  groupVehicule.getALLCount(id_user, searchValue, searchColumn, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});


// Route to create a new group
router.get('/groups-vehicule/all-groupe/:id_user', async (req, res) => {
  const { id_user } = req.params;
  groupVehicule.getALL(id_user, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});


router.post('/groups-vehicule/group-and-number-vehicule/sort/:id_user', async (req, res)  => {
  const { page, limit, sortColumn, sortOrder, searchValue, searchColumn } = req.body;
  const { id_user } = req.params;

  groupVehicule.getGroupVehiculeANDCountVehiculeSort(page, limit, id_user, sortOrder, sortColumn, searchColumn,searchValue,  (err, groups) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    } else if (!groups) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      return res.status(200).json(groups);
    }
  });
});



// Route pour créer un nouveau groupe
router.post('/groups-vehicule/create', async (req, res) => {
  const groupData = {
    id_user: req.body.id_user, 
    nom_groupe: req.body.nom_groupe,
    color_groupe: req.body.color_groupe,
    date_creation_groupe: new Date(), 
  };
  groupVehicule.createGroup(groupData, (err, id_groupe) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json({ id_groupe });
  });
});

// Route pour supprimer un utilisateur par son ID
router.put('/groups-vehicule/softDeletegroupe/:id_groupe', (req, res) => {
  const id_groupe = req.params.id_groupe;
  const loggedInUserID = req.body.loggedInUserID;  // Récupère l'ID de l'utilisateur connecté depuis le corps de la requête
  groupVehicule.softDeleteGroup(id_groupe, loggedInUserID, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la suppression logique de l\'utilisateur.' });
    } else {
      res.status(200).json({ message: 'Suppression logique réussie.' });
    }
  });
});

// Route pour mettre à jour un groupe existant
router.put('/groups-vehicule/update-group/:id_groupe', async (req, res) => {
  const groupId = req.params.id_groupe;
  const updatedData = {
    nom_groupe: req.body.nom_groupe,
    id_user: req.body.id_user,
    color_groupe: req.body.color_groupe,
  };
  groupVehicule.updateGroup(groupId, updatedData, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du groupe.' });
    }
    res.status(200).json({ message: 'Mise à jour du groupe réussie.' });
  });
});



router.get("/groups-vehicule/options/user/:id_user", async (req, res) => {
  const { id_user } = req.params;
  groupVehicule.getOptionsByUserId(id_user, (err, options) => {
    if (err) {
      res
        .status(500)
        .json({
          message:
            "Erreur lors de la récupération des options de l'utilisateur",
        });
    } else if (!options || options.length === 0) {
      res
        .status(404)
        .json({ message: "Options non trouvées pour cet utilisateur" });
    } else {
      res.status(200).json(options);
    }
  });
});


router.get("/groups-vehicule/groups/:id_user", async (req, res) => {
  const { id_user } = req.params;
  groupVehicule.getGroupsByUserId(id_user, (err, options) => {
    if (err) { 
      res
        .status(500)
        .json({
          message:
            "Erreur lors de la récupération des options de l'utilisateur",
        });
    } else if (!options || options.length === 0) {
      res
        .status(404)
        .json({ message: "Options non trouvées pour cet utilisateur" });
    } else {
      res.status(200).json(options);
    }
  });
});


router.get("/groups-vehicule/get-deleted-count/user/:id_user", async (req, res) => {
  const { id_user } = req.params;

  groupVehicule.getDeletedGroupCount(id_user, (err, count) => {
      if (err) {
          res
              .status(500)
              .json({ message: "Error retrieving deleted users count" });
      } else {
          res.status(200).json({ count: count[0].total });
      }
  });
});

// Endpoint pour récupérer les utilisateurs supprimés
router.get("/groups-vehicule/getDeleted/user/:id_user", async (req, res) => {
  const { id_user } = req.params;
  groupVehicule.getDeletedGroupsVehicule( id_user, (err, users) => {
      if (err) {
          res
              .status(500)
              .json({ message: "Error retrieving deleted users" });
      } else if (!users) {
          res.status(404).json({ message: "Deleted users not found" });
      } else {
          res.status(200).json(users);
      }
  });
});


// Endpoint pour restaurer les groupes de véhicules supprimés
router.put("/groups-vehicule/restoreDeleted/:id_groupe", async (req, res) => {
  const { id_groupe } = req.params;
  groupVehicule.restoreDeletedGroupsVehicule(id_groupe, (err, results) => {
    if (err) {
      res
      .status(500)
      .json({
          message:
            "Erreur lors de la restauration des utilisateurs supprimés",
        });
    } else {
      res.status(200).json({ message: "Restauration réussie" });
    }
  });
});

// Définission la route pour la duplication de groupe
  router.put('/groups-vehicule/duplicate/:id_groupe', (req,res)=> {
    const id_groupe = req.params.id_groupe;

    groupVehicule.duplicateGroup(id_groupe, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        // la réponse avec un message indiquant que la duplication a réussi
        res.status(200).json({ message: 'La duplication du groupe a réussi.' });
      }
    });
  });


  router.post('/groups-vehicule/id', (req, res) => {
    const id_groupes = req.body.id_groupes; // Les id_groupes seront envoyés dans le corps de la requête
    groupVehicule.getDateForGroupIds(id_groupes, (error, results) => {
      if (error) {
        res.status(500).send('Erreur lors de la récupération des données.');
        return;
      }
  
      // Traitez les résultats comme nécessaire
      res.json(results);
    });
  });
  


module.exports = router;
