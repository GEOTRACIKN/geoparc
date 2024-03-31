const express = require('express');
const router = express.Router();
const Puce = require('../models/Puce'); // Assuming your model is in the 'models' directory



router.get('/simcards/total/:id_user', async (req, res) => {
  const { id_user } = req.params;
  Puce.getALLCount(id_user, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});


router.get('/simcards/getsimcards/:id_user', async (req, res)  => {
  const { id_user } = req.params;
  Puce.getSimcards(id_user, (err, puces)=>{
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération de l'utilisateur" });
    } else if (!puces) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      return res.status(200).json(puces);
    }

  })
})

router.get('/simcards/getsimcards/sort/:id_user', async (req, res)  => {
  const { page, limit, sortColumn, sortOrder } = req.query;
  const { id_user } = req.params;

  Puce.getSimcardsSort(page, limit, id_user, sortColumn, sortOrder, (err, groups) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    } else if (!groups) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      return res.status(200).json(groups);
    }
  });
});



// Route to get simcards by user ID




// Route pour créer un nouveau simcard
router.post('/simcards/create', async (req, res) => {
  const simcardData = {
    id_user: req.body.id_user, 
    operateur_puce: req.body.operateur_puce,
    numero_puce: req.body.numero_puce,
    type_puce: req.body.type_puce,
    contrat_puce: req.body.contrat_puce,
    serial_number: req.body.serial_number,
    date_creation_carte_sim: new Date(), 
  };
  Puce.createSimcard(simcardData, (err, id_puce) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json({ id_puce });
  });
});

// Route pour supprimer une simcard par son ID
router.put('/simcards/softDeletesimcard/:id_puce', (req, res) => {
  const id_puce = req.params.id_puce;
  const loggedInUserID = req.body.loggedInUserID;  // Récupère l'ID de l'utilisateur connecté depuis le corps de la requête
  Puce.softDeleteSimcard(id_puce, loggedInUserID, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la suppression logique de l\'utilisateur.' });
    } else {
      res.status(200).json({ message: 'Suppression logique réussie.' });
    }
  });
});

// Route pour mettre à jour une simcard existant
router.put('/simcards/update-simcard/:id_puce', async (req, res) => {
  const simcardId = req.params.id_puce;
  const updatedData = {
    id_user: req.body.id_user,
    operateur_puce: req.body.operateur_puce,
    numero_puce: req.body.numero_puce,
    type_puce: req.body.type_puce,
    contrat_puce: req.body.contrat_puce,
    serial_number: req.body.serial_number,
  };
  Puce.updateSimcard(simcardId, updatedData, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du groupe.' });
    }
    res.status(200).json({ message: 'Mise à jour du groupe réussie.' });
  });
});



router.get("/simcards/options/user/:id_user", async (req, res) => {
  const { id_user } = req.params;
  Puce.getOptionsByUserId(id_user, (err, options) => {
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


router.get("/simcards/get-deleted-count/user/:id_user", async (req, res) => {
  const { id_user } = req.params;

  Puce.getDeletedSimcardsCount(id_user, (err, count) => {
      if (err) {
          res
              .status(500)
              .json({ message: "Error retrieving deleted users count" });
      } else {
          res.status(200).json({ count: count[0].total });
      }
  });
});

// Endpoint pour récupérer les Simcards supprimés
router.get("/simcards/getDeleted/user/:id_user", async (req, res) => {
  const { id_user } = req.params;
  Puce.getDeletedSimcards( id_user, (err, users) => {
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


// Endpoint pour restaurer les Simcards de véhicules supprimés
router.put("/simcards/restoreDeleted/:id_puce", async (req, res) => {
  const { id_puce } = req.params;
  Puce.restoreDeletedSimcards(id_puce, (err, results) => {
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

// Définission la route pour la duplication de simcards
  router.put('/simcards/duplicate/:id_puce', (req,res)=> {
    const id_puce = req.params.id_puce;

    Puce.duplicateSimcard(id_puce, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        // la réponse avec un message indiquant que la duplication a réussi
        res.status(200).json({ message: 'La duplication du simcard a réussi.' });


      }
    });
  })


module.exports = router;

