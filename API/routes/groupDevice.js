const express = require('express');
const router = express.Router();
const GroupDevice = require('../models/GroupDevice');

// Start Create
// Route pour créer un nouveau groupe
router.post('/groups-device/create', async (req, res) => {
  const { id_user, nom_groupe, description_groupe, date_update } = req.body;

  const groupData = {
    id_user,
    nom_groupe,
    description_groupe,
    date_update,
  };

  GroupDevice.createGroup(groupData, (err, id_groupe) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json({ id_groupe });
  });
});

// END Create
  // Start Read
  router.post('/groups-device/get-with-id-user/:id_user', async (req, res)  => {
    const { page, limit, sortColumn, sortOrder, searchValue, searchColumn } = req.body;
    const { id_user } = req.params;
  
    GroupDevice.getAllGroups(page, limit, id_user, sortColumn, sortOrder, searchValue, searchColumn, (err, groups) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
      } else if (!groups) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      } else {
        return res.status(200).json(groups);
      }
    });
  });
  




router.get('/groups-device/groups/:id_user', async (req, res)  => {
 
  const { id_user } = req.params;
 
  GroupDevice.getAllGroupsOption( id_user, (err, groups) => {
  if (err) {
    return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
  } else if (!groups) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  } else {
    return res.status(200).json(groups);
  }
});
});


router.get("/groups-device/options/user/:id_user", async (req, res) => {
  const { id_user } = req.params;
  GroupDevice.getOptionsByUserId(id_user, (err, options) => {
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


// Start Count
router.post('/groups-device/total/:id_user', async (req, res) => {
  const { searchValue, searchColumn } = req.body;
  const { id_user } = req.params;

  GroupDevice.getALLCount(id_user, searchValue, searchColumn, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});

// END Count
  
// router.get('/groups-device/get-with-id-group/:id_groupe',(req, res)=>{
//   const {id_groupe} = req.params;
//   GroupDevice.getDateForGroupId(id_groupe, (error, results) => {
//     if (error) {
//       res.status(500).send('Erreur lors de la récupération des données.');
//       return;
//     }
//     // Traitez les résultats comme nécessaire
//     res.json(results);
//   });
// });


router.post('/groups-device/id', (req, res) => {
  const id_groupes = req.body.id_groupes; // Les id_groupes seront envoyés dans le corps de la requête
  GroupDevice.getDateForGroupIds(id_groupes, (error, results) => {
    if (error) {
      res.status(500).send('Erreur lors de la récupération des données.');
      return;
    }

    // Traitez les résultats comme nécessaire
    res.json(results);
  });
});


  // END Read

  // Start Delete

  router.get("/groups-device/get-deleted-count/user/:id_user", async (req, res) => {
    const { id_user } = req.params;
  
    GroupDevice.getDeletedGroupCount(id_user, (err, count) => {
        if (err) {
            res
                .status(500)
                .json({ message: "Error retrieving deleted users count" });
        } else {
            res.status(200).json({ count: count[0].total });
        }
    });
  });
  

  router.put('/groups-device/softDeletegroupe/:id_groupe', (req, res) => {
    const id_groupe = req.params.id_groupe;
    const loggedInUserID = req.body.loggedInUserID;  // Récupère l'ID de l'utilisateur connecté depuis le corps de la requête
    GroupDevice.softDeleteGroup(id_groupe, loggedInUserID, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression logique de l\'utilisateur.' });
      } else {
        res.status(200).json({ message: 'Suppression logique réussie.' });
      }
    });
  });
  // END Delete
  // Start Update

  router.put('/groups-device/update-group/:id_groupe', async (req, res) => {
    const groupId = req.params.id_groupe;
    const updatedData = {
      nom_groupe: req.body.nom_groupe,
      id_user: req.body.id_user,
      description_groupe: req.body.description_groupe,
      date_update: req.body.date_update,
    };
    GroupDevice.updateGroup(groupId, updatedData, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du groupe.' });
      }
      res.status(200).json({ message: 'Mise à jour du groupe réussie.' });
    });
  });
  // END Update

  // Delete
  router.get("/groups-device/getDeleted/user/:id_user", async (req, res) => {
    const { id_user } = req.params;
    GroupDevice.getDeletedGroupsDevices( id_user, (err, users) => {
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

  // Restore
  router.put("/groups-device/restoreDeleted/:id_groupe", async (req, res) => {
    const { id_groupe } = req.params;
    GroupDevice.restoreDeletedGroupsVehicule(id_groupe, (err, results) => {
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
module.exports = router;
