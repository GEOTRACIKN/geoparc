const Vehiclesinister = require("../models/Vehiclesinister");

const router = require("express").Router();


// Get all sinisters by user with pagination and search
router.get('/sinister/:id_user/:page/:limit', async (req, res) => {
    const { id_user, page, limit } = req.params;
    const searchTerm = req.query.searchTerm;
    const searchType = req.query.searchType;
  
    try {
      const results = await Vehiclesinister.getAllSinistersByUser(id_user, page, limit, searchTerm, searchType);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des sinistres. " + err.message });
    }
  });
  
  // Get total count of sinisters by user
router.get('/sinister/count/:id_user', async (req, res) => {
    const { id_user } = req.params;
    const searchTerm = req.query.searchTerm;
    const searchType = req.query.searchType;

    try {
        const totalCount = await Vehiclesinister.getTotalCountByUser(id_user, searchTerm, searchType);
        res.json({ total_count: totalCount });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du nombre de sinistres. " + err.message });
    }
});


module.exports = router;