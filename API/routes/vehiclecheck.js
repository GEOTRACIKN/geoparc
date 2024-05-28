const Vehiclecheck = require("../models/Vehiclecheck");

const router = require("express").Router();


//GET ALL Vehiclecheck
router.get("/vehiclecheck/:id_user/:page/:limit", async (req, res) => {
  const { page, limit, id_user } = req.params;
    const searchTerm = req.query.searchTerm;
    const searchType = req.query.searchType;

    
  try {
    const results = await Vehiclecheck.getAllUserId(
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


//GET ALL COUNT Vehiclecheck
router.get("/vehiclecheck/totalpage/:id_user", async (req, res) => {
  const { id_user } = req.params;
    const { searchTerm, searchType } = req.query;


  try {
    const results = await Vehiclecheck.getAll(id_user, searchTerm, searchType);
    res.json(results);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des véhicules vérifiés.",
    });
  }
});

// Delete route 
router.put("/delete/:idverif_vehicle", async (req, res) => {
  const idverif_vehicle = req.params.idverif_vehicle;
  const loggedInUserID = req.body.loggedInUserID;

  try {
    await Vehiclecheck.deleteDriver(idverif_vehicle, loggedInUserID);
    res.status(200).json({ message: "Suppression réussie." });
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la suppression logique de vehicle vérifié.",
    });
  }
});
;



module.exports = router;