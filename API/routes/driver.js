const express = require('express');
const router = express.Router();
const Driver = require("../models/Driver");


const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// Route pour créer un nouveau conducteur
router.post('/addDriver', (req, res) => {
  const {
    code_emp,
    first_name,
    middle_name,
    phone,
    email,
    adresse,
    datenaiss,
    nationnalite,
    pi,
    num_pi,
    datedeliv_pi,
    lieudeliv_pi,
    category_permis,
    num_permis,
    datedeliv_permis,
    dateexpir_permis,
    id_user,
  } = req.body;

  Driver.addDriver(
    code_emp,
    first_name,
    middle_name,
    phone,
    email,
    adresse,
    datenaiss,
    nationnalite,
    pi,
    num_pi,
    datedeliv_pi,
    lieudeliv_pi,
    category_permis,
    num_permis,
    datedeliv_permis,
    dateexpir_permis,
    id_user,
    (err, driverId) => {
      if (err) {
        console.error("Erreur lors de l'ajout du conducteur :", err);
        return res
          .status(500)
          .json({ message: "Erreur lors de l'ajout du conducteur" });
      }
      res.status(201).json({ driverId });
    }
  );
});

// Route pour mettre à jour un Conducteur //
router.post("/updatedriver", (req, res) => {
  const {
    id_conducteur,
    code_emp,
    first_name,
    middle_name,
    phone,
    email,
    adresse,
    datenaiss,
    nationnalite,
    pi,
    num_pi,
    datedeliv_pi,
    lieudeliv_pi,
    category_permis,
    num_permis,
    datedeliv_permis,
    dateexpir_permis,
    id_user,
  } = req.body;

  if (!id_conducteur) {
    return res
      .status(400)
      .json({ message: "Missing id_conducteur in request" });
  }

  Driver.updateDriver(
    code_emp,
    first_name,
    middle_name,
    phone,
    email,
    adresse,
    datenaiss,
    nationnalite,
    pi,
    num_pi,
    datedeliv_pi,
    lieudeliv_pi,
    category_permis,
    num_permis,
    datedeliv_permis,
    dateexpir_permis,
    id_user,
    id_conducteur,
    (err) => {
      if (err) {
        console.error("Erreur lors de la mise à jour du conducteur :", err);
        return res
          .status(500)
          .json({ message: "Erreur lors de la mise à jour du conducteur" });
      }
      res.status(200).json({ message: "Conducteur mis à jour avec succès" });
    }
  );
});

// Route pour récupérer tous les conducteurs
router.get('/driver', (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
    Driver.getAllDrivers(page, limit, (err, driver) => {
      if (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
      } else {
        res.status(200).json(driver);
      }
    });
  });
  
// Route pour récupérer un conducteur par son ID avec recherche
router.get('/driver/:id_user', async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const searchTerm = req.query.searchTerm; 
  const searchType = req.query.searchType;

  const { id_user } = req.params;

  Driver.getDriversByUserId(
    page,
    limit,
    id_user,
    searchTerm,
    searchType,

    (err, drivers) => {
      if (err) {
        res
          .status(500)
          .json({
            error: "Erreur lors de la récupération des conducteurs." + err,
          });
      } else {
        res.json(drivers);
      }
    }
  );
});

router.get("/driver/totalpage/:id_user", async (req, res) => {
  const { id_user } = req.params;
  const searchTerm = req.query.searchTerm; 
  const searchType = req.query.searchType;

  Driver.getAll(id_user, searchTerm, searchType,(err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des véhicules." + err });
    }
    res.json(results);
  });
});


router.get("/deleted-driver-count/:id_user", async (req, res) => {
  const { id_user } = req.params;

  Driver.getDeletedDriverCount(id_user, (err, count) => {
    if (err) {
      res.status(500).json({ message: "Error retrieving deleted driver count" });
    } else {
      res.status(200).json({ count: count[0].total });
    }
  });
});

   router.get("/options/user/:id_user", async (req, res) => {
     const { id_user } = req.params;
     Driver.getOptionsByUserId(id_user, (err, options) => {
       if (err) {
         res.status(500).json({
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

     

   
   router.get("/agences/user/:id_user", async (req, res) => {
     const { id_user } = req.params;
     Driver.getAgenceByUserId(id_user, (err, options) => {
       if (err) {
         res.status(500).json({
           message:
             "Erreur lors de la récupération des options de lagence",
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

     router.get("/services/user/:id_user", async (req, res) => {
       const { id_user } = req.params;
       Driver.getServiceByUserId(id_user, (err, options) => {
         if (err) {
           res.status(500).json({
             message: "Erreur lors de la récupération des options de service",
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

router.put("/delete/:id_conducteur", (req, res) => {
  const id_conducteur = req.params.id_conducteur;
  const loggedInUserID = req.body.loggedInUserID; 

  Driver.deleteDriver(id_conducteur, loggedInUserID, (err) => {
    if (err) {
      res.status(500).json({
        error: "Erreur lors de la suppression logique de l'utilisateur.",
      });
    } else {
      res.status(200).json({ message: "Suppression réussie." });
    }
  });
});

router.get("/driverform/:id", (req, res) => {
  const userId = req.params.id;

  Driver.getDriverform(userId, (err, user) => {
    if (err) {
      res.status(500).json({ error: "Erreur serveur" });
    } else {
      res.json(user);
    }
  });
});

// récupérer les Drivers supprimés
router.get("/drivers/getDeleted/:id_user", async (req, res) => {
  const { id_user } = req.params;
  Driver.getDeletedDrivers(id_user, (err, users) => {
    if (err) {
      res.status(500).json({ message: "Error retrieving deleted Drivers" });
    } else if (!users) {
      res.status(404).json({ message: "Deleted Drivers not found" });
    } else {
      res.status(200).json(users);
    }
  });
});

//  restaurer les conducteurs supprimés
router.put("/drivers/restoreDeleted/:id_conducteur", async (req, res) => {
  const { id_conducteur } = req.params;
  Driver.restoreDeletedDrivers(id_conducteur, (err, results) => {
    if (err) {
      res.status(500).json({
        message: "Erreur lors de la restauration des conducteurs supprimés",
      });
    } else {
      res.status(200).json({ message: "Restauration réussie" });
    }
  });
});




module.exports = router;
