const Vehiclecheck = require("../models/Vehiclecheck");

const router = require("express").Router();


//GET ALL Vehiclecheck
router.get("/vehiclecheck/:id_user/:page/:limit", async (req, res) => {
  const { page, limit, id_user } = req.params;
  try {
    const results = await Vehiclecheck.getAllUserId(id_user, page, limit);
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
  try {
    const results = await Vehiclecheck.getAll(id_user);
    res.json(results);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des véhicules vérifiés.",
    });
  }
});



module.exports = router;