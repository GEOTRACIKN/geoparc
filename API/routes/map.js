const Map = require("../models/Map");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
const db = require('../database');

//CREATE Map
router.post("/map", verifyTokenAndAdmin, async (req, res) => {
  const newMap = new Map(req.body);

  try {
    const savedMap = await newMap.save();
    res.status(200).json(savedMap);
  } catch (err) {
    res.status(500).json(err);
  }
});


//CREATE Map
router.get("/map/reports/:type/:PSN", async (req, res) => {

  try {
    const { type, PSN } = req.params;

    switch (parseInt(type)) {

      case 1:

        Map.getReconstitutionItinerary(PSN, (err, result) => {
          if (err) {
            console.error("Erreur de recherche :", err);
            return res.status(500).json({ message: "Erreur interne du serveur " + err });
          }
 
          res.status(200).json({ data: result });
        });

        break;


      case 4:
 
        Map.getContactSpeedDistanceDiagram(PSN, (err, result) => {
          if (err) {
            console.error("Erreur de recherche :", err);
            return res.status(500).json({ message: "Erreur interne du serveur " + err });
          }

          res.status(200).json({ data: result });
        });

        break;

      case 8:

        Map.getDistanceAndConsumptionDiagram(PSN, (err, result) => {
          if (err) {
            console.error("Erreur de recherche :", err);
            return res.status(500).json({ message: "Erreur interne du serveur " + err });
          }

          res.status(200).json({ data: result });
        });

        break;

      case 19:

        Map.getTemperatureHumidityDiagram(PSN, (err, result) => {
          if (err) {
            console.error("Erreur de recherche :", err);
            return res.status(500).json({ message: "Erreur interne du serveur " + err });
          }

          res.status(200).json({ data: result });
        });

        break;


      default:
        return res.status(400).json({ message: "Type non pris en charge" });
    }

  } catch (err) {
    console.error("Erreur de recherche :", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }

});



//UPDATE Map
router.put("/map/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedMap = await Map.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedMap);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE Map
router.delete("/map/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Map.findByIdAndDelete(req.params.id);
    res.status(200).json("Map has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET ALL Maps
router.get("/map/find/:id_user", async (req, res) => {
  const { id_user } = req.params;

  Map.getAll(id_user, (err, results) => {
    if (err) {
      // Traitement spécifique pour toutes les erreurs (différentes de 200)
      return res.status(err.statusCode || 500).json({ error: 'Erreur lors de la récupération des véhicules.' + err.message });
    }
    // Traitement pour une réponse réussie (200)
    res.json(results);
  });
});

router.get('/map/:id_user', async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const { id_user } = req.params;

  Map.getByUserId(page, limit, id_user, (err, map) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des map.' });
    } else {
      res.json(map);
    }
  });
});

module.exports = router;
