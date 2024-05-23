const Role = require("../models/role");

const router = require("express").Router();


//GET ALL role
router.get("/role/:id_user/:page/:limit", async (req, res) => {
  const { page, limit, id_user } = req.params;
  try {
    const results = await Role.getAllUserId(id_user, page, limit);
    res.json(results);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des roles. " + err,
    });
  }
});


//GET ALL COUNT role
router.get("/role/totalpage/:id_user", async (req, res) => {
  const { id_user } = req.params;
  try {
    const results = await Role.getAll(id_user);
    res.json(results);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des roles.",
    });
  }
});



module.exports = router;