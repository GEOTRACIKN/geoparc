const {getAllGeopUserID, getAll} = require("../models/Vehicle");
const router = require("express").Router(); 



//GET ALL Vehiclecheck
router.get("/vehicules/:id_user/:page/:limit", async (req, res) => {

  // @exomple link {http://localhost:5000/api/vehicules/1/1/15?sortColumn=id_vhc&sortOrder=desc&searchColumn=license_vhc&searchValue=EFG123}

  const { page, limit, id_user } = req.params;
    const sortColumn = req.query.sortColumn;
    const sortOrder = req.query.sortOrder;
    const searchColumn = req.query.searchColumn;
    const searchValue = req.query.searchValue;

    
  try {
    const results = await getAllGeopUserID(
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
router.get('/vehicles/count', async (req, res) => {
  const { id_user, searchTerm, searchType } = req.query;

  try {
    const result = await getAll(Number(id_user), searchTerm, searchType);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
