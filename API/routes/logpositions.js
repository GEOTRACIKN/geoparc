const LogPositions = require("../models/LogPositions");
const {
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router(); 
 

router.get("/LogPositions/:userID/search/:query", async (req, res) => {
  try {
    
    const userID = req.params.userID;
    const query = req.params.query;


    // Effectuez la recherche dans la base de données en utilisant le modèle de LogPositions
    const results = await LogPositions.searchByLicensePlate(userID, query);
    if (results.length === 0) {
      return res.status(404).json({ message: "Aucun véhicule trouvé." });
    }
    res.status(200).json(results);
    
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche des véhicules." });
  }
});

router.get("/LogPositions/filter/:vehicle/:startDate/:endDate/:page/:limit", async (req, res) => {
    try {
      const vehicle = req.params.vehicle;
      const startDate = req.params.startDate;
      const endDate = req.params.endDate;
      const page = req.params.page;
      const limit = req.params.limit;
      // Effectuez la recherche dans la base de données en utilisant le modèle approprié
      const results = await LogPositions.filterRapports(vehicle, startDate, endDate,page,limit);
      if (results.length === 0) {
        return res.status(404).json({ message: "Aucune posistion trouvée." });
      }
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la recherche des rapports." });
    }
  });






module.exports = router;
