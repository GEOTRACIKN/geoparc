const Vehiclesinister = require("../models/Vehiclesinister");

const router = require("express").Router();


// Get all sinisters by user with pagination and search
router.get('/sinister/:id_user/:page/:limit', async (req, res) => {
  const { id_user, page, limit } = req.params;
  const { searchTerm, searchType } = req.query;

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
        res.json(totalCount);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du nombre de sinistres. " + err.message });
    }
});

// Add a new sinister
router.post('/add_sinister', async (req, res) => {
    const sinister = {
        id_vehicule: req.body.id_vehicule,
        id_groupe: req.body.id_groupe,
        driver_name: req.body.driver_name,
        sinister_cost: req.body.sinister_cost,
        sinister_type: req.body.sinister_type,
        sinister_detail: req.body.sinister_detail,
        sinister_datetime: req.body.sinister_datetime,
        sinister_location: req.body.sinister_location,
        sinister_report: req.body.sinister_report,
        circumstances: req.body.circumstances,
        damage_caused: req.body.damage_caused,
        driver_name_2: req.body.driver_name_2,
        vehicle_registration_2: req.body.vehicle_registration_2,
        expertise_date: req.body.expertise_date,
        expertise_cost: req.body.expertise_cost,
        proforma_number: req.body.proforma_number,
        expert_name: req.body.expert_name,
        doc_transmitted: req.body.doc_transmitted,
        amortization_time: req.body.amortization_time
    };

    try {
        const result = await Vehiclesinister.addSinister(sinister);
        res.status(201).json({ message: 'Sinister added successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de l'ajout du sinistre. " + err.message });
    }
});
router.get('/vehicles_sinister/:id_user', async (req, res) => {
    const { id_user } = req.params;

    try {
        const results = await Vehiclesinister.getVehiclesByUser(id_user);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des véhicules. " + err.message });
    }
});

// Update an existing sinister
router.put('/update_sinister/:id', async (req, res) => {
    const sinister = {
        id: req.params.id,
        id_vehicule: req.body.id_vehicule,
        id_groupe: req.body.id_groupe,
        driver_name: req.body.driver_name,
        sinister_cost: req.body.sinister_cost,
        sinister_type: req.body.sinister_type,
        sinister_detail: req.body.sinister_detail,
        sinister_datetime: req.body.sinister_datetime,
        sinister_location: req.body.sinister_location,
        sinister_report: req.body.sinister_report,
        circumstances: req.body.circumstances,
        damage_caused: req.body.damage_caused,
        driver_name_2: req.body.driver_name_2,
        vehicle_registration_2: req.body.vehicle_registration_2,
        expertise_date: req.body.expertise_date,
        expertise_cost: req.body.expertise_cost,
        proforma_number: req.body.proforma_number,
        expert_name: req.body.expert_name,
        doc_transmitted: req.body.doc_transmitted,
        amortization_time: req.body.amortization_time
    };

    try {
        const result = await Vehiclesinister.updateSinister(sinister);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Sinister not found' });
        } else {
            res.status(200).json({ message: 'Sinister updated successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: "Error updating the sinister. " + err.message });
    }
});


// Delete (soft delete) a sinister by ID
router.delete('/delete_sinister/:id_user/:id_sinistre', async (req, res) => {
    const { id_user, id_sinistre } = req.params;

    try {
        const affectedRows = await Vehiclesinister.deleteSinister(id_sinistre, id_user);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Sinister deleted successfully (soft delete).' });
        } else {
            res.status(404).json({ error: 'Sinister not found or not authorized.' });
        }
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du sinistre. " + err.message });
    }
});


module.exports = router;