const Vehiclecheck = require("../models/Vehiclecheck");
const { verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//GET ALL Vehiclecheck
router.get("/vehiclecheck/:page/:limit/:id_user", async (req, res) => { 
  const {page, limit,id_user}= req.params; 
     
  Vehiclecheck.getAllUserId(page, limit, id_user, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({
          error: "Erreur lors de la récupération des véhicules vérifié.",
        });
    }
    res.json(results);
  });
});

//GET ALL COUNT Vehiclecheck
router.get("/vehicle/totalpage/:id_user", async (req, res) => {
  const { id_user } = req.params;

  Vehiclecheck.getAll(id_user, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Erreur lors de la récupération des véhicules vérifié .",
      });
    }
    res.json(results);
  });
});




module.exports = router;