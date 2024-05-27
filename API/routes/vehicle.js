const Vehicle = require("../models/Vehicle");
const router = require("express").Router(); 


 
//GET ALL Vehiclecheck
router.get("/vehicules/:id_user/:page/:limit", async (req, res) => {
  const { page, limit, id_user } = req.params;
    const searchTerm = req.query.searchTerm;
    const searchType = req.query.searchType;

    
  try {
    const results = await Vehicle.getAllUserId(
      id_user,
      page,
      limit,
      searchTerm,
      searchType
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des véhicules vérifiés. " + err,
    });
  }
});


module.exports = router;
