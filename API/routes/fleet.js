const Fleet = require("../models/fleet");
const router = require("express").Router();
const db = require('../database');

router.get("/fleet/totalpage/:id_user", async (req, res) => {
  const { id_user } = req.params;

  Fleet.getAllfleet(id_user, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.' });
    }
    res.json(results);
  });
});



router.get('/fleet/:page/:limit/:id_user', async (req, res) => {
  const { page, limit, id_user } = req.params;
  const searchTerm = req.query.searchTerm; // Récupérer le terme de recherche de la requête
  const searchOption = req.query.searchOption; // Récupérer l'option de recherche sélectionnée
  
  Fleet.getFleetData(page, limit, id_user, searchTerm, searchOption, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des données de la flotte.' });
    }
    res.json(results);
  });
});


// Updated route to search only by psn_dispositif

router.post('/calculateStats', (req, res) => {
  const { dateD, dateF, PSN } = req.body;

  if (!dateD || !dateF || !PSN) {
    return res.status(400).json({ error: 'Invalid request. Please provide dateD, dateF, and PSN in the request body.' });
  }
  const currentDate = new Date().toISOString().split('T')[0];
  Fleet.calculateStats(dateD + " 00:00:00", currentDate + " 23:59:59", PSN, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(result);
  });
});


router.get('/dash-data/:id_user', (req, res) => {
  const id_user = req.params.id_user;
  
  Fleet.getDashData(id_user, (err, data) => {
    if (err) {
      console.error("Error fetching dashboard data:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(data);
    }
  });  

});
router.get('/immatriculation/:id_user', (req, res) => {
  const id_user = req.params.id_user;
  
  Fleet.getVehiclesByUserId(id_user, (err, data) => {
    if (err) {
      console.error("Error fetching immatriculation data:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(data);
    }
  });
  });

  




module.exports = router;
