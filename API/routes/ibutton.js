const express = require("express");
const router = express.Router();
const Ibutton = require("../models/Ibutton");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// Route pour récupérer les tags par son ID
router.get("/ibutton/:id_user", async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1; // Vérifier si la page est définie
  const limit = req.query.limit ? parseInt(req.query.limit) : 10; // Vérifier si la limite est définie
  const searchTerm = req.query.searchTerm; // Ajout du terme de recherche

  const { id_user } = req.params;

  Ibutton.getTagsByUserId(page, limit, id_user, searchTerm, (err, tag) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des Tags." + err });
    } else {
      res.json(tag);
    }
  });
});

router.get("/ibutton/totalpage/:id_user", async (req, res) => {
  const { id_user } = req.params;
  const searchTerm = req.query.searchTerm; // Retrieve the searchTerm from the request query

  Ibutton.getAll(id_user, searchTerm, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des Tags." });
    }
    res.json(results);
  });
});

// Route pour récupérer tous les Tags
router.get("/ibutton", (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  Ibutton.getAllTags(page, limit, (err, ibutton) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des Tags" });
    } else {
      res.status(200).json(ibutton);
    }
  });
});

router.get("/deletedcount/:id_user", async (req, res) => {
  const { id_user } = req.params;

  Ibutton.getDeletedTagCount(id_user, (err, count) => {
    if (err) {
      res.status(500).json({ message: "Error retrieving deleted tag count" });
    } else {
      res.status(200).json({ count: count[0].total });
    }
  });
});

router.get("/options/:id_user", async (req, res) => {
  const { id_user } = req.params;
  Ibutton.getOptionsByUserId(id_user, (err, options) => {
    if (err) {
      res.status(500).json({
        message: "Erreur lors de la récupération des options de l'utilisateur",
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

router.get("/optionsdrivers/:id_user", async (req, res) => {
  const { id_user } = req.params;
  Ibutton.getDriverByUserId(id_user, (err, drivers) => {
    if (err) {
      res.status(500).json({
        message: "Erreur lors de la récupération des drivers de l'utilisateur",
      });
    } else {
      res.status(200).json(drivers);
    }
  });
});

router.post("/addibutton", async (req, res) => {
  try {
    const { 
      NumSerie, 
      Utilisateur, 
      Conducteur, 
      Note 
    } = req.body;

    const currentDate = new Date(); // Obtenez la date et l'heure actuelles
    const draft=0;

    Ibutton.AddTag(
      NumSerie,
      currentDate,
      currentDate,
      Conducteur,
      Utilisateur,
      draft,
      Note,
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de l'ajout du Tag", error: err });
        }
        res
          .status(201)
          .json({ message: "Tag ajouté avec succès", tagId: result });
      }
    );
  } catch (error) {
    res
      .status(400)
      .json({ message: "Paramètres invalides", error: error.message });
  }
});


router.put("/deletetag/:id_tag", (req, res) => {
  const id_tag = req.params.id_tag;
  const loggedInUserID = req.body.loggedInUserID;

  Ibutton.deleteTag(id_tag, loggedInUserID, (err) => {
    if (err) {
      res.status(500).json({
        error: "Erreur lors de la suppression logique du Tag.",
      });
    } else {
      res.status(200).json({ message: "Suppression réussie." });
    }
  });
});

// Route pour mettre à jour un TAG //
router.post("/Tag/updateTag", (req, res) => {
  const { 
    id_tag, 
    NumSerie, 
    Utilisateur, 
    Conducteur, 
    Note 
  } = req.body;
  if (!id_tag) {
    return res.status(400).json({ message: "Missing id_tag in request" });
  }
  const currentDate = new Date(); // Obtenez la date et l'heure actuelles

  Ibutton.updateTag(
    NumSerie, 
    currentDate,
    Utilisateur, 
    Conducteur, 
    Note, 
    id_tag, 
    (err) => {
    if (err) {
      console.error("Erreur lors de la mise à jour du Tag :", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour du Tag" });
    }
    res.status(200).json({ message: "TAg mis à jour avec succès" });
  });
});


router.get('/Tagform/:id', (req, res) => {
  const userId = req.params.id;

  Ibutton.getTagform(userId, (err, user) => {
    if (err) {
      res.status(500).json({ error: "Erreur serveur" });
    } else {
      res.json(user);
    }
  });
});



// Route pour récupérer les tags par son ID
router.get("/history/:id_user", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const { id_user } = req.params;

  Ibutton.gethistoryTagsByUserId(page, limit, id_user, (err, tag) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération Historique des tags." });
    } else {
      res.json(tag);
    }
  });
});

router.get("/history/totalpage/:id_user", async (req, res) => {
  const { id_user } = req.params;

  Ibutton.getAllhisory(id_user, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération Historique des tags." });
    }
    res.json(results);
  });
});



module.exports = router;
