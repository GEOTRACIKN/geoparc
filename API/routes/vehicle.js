const {getAllUserId, getAll} = require("../models/Vehicle");
const router = require("express").Router(); 



//GET ALL Vehiclecheck
router.post("/vehicules/:id_user/:page/:limit", async (req, res) => {
  const {id_user,  page, limit } = req.params;
  const { sortColumn, sortOrder, searchColumn, searchValue } = req.body;

  try {
    const results = await getAllUserId(
      id_user,
      page,
      limit,
      sortColumn, 
      sortOrder, 
      searchColumn, 
      searchValue
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des véhicules vérifiés. " + err,
    });
  }
});
// Route pour récupérer le nombre total de véhicules vérifiés
router.post('/vehicules/count/:id_user', async (req, res) => {
  const { id_user } = req.params;
  const { searchTerm, searchType } = req.body;

  try {
    const result = await getAll(Number(id_user), searchTerm, searchType);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
