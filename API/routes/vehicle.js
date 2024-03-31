const Vehicle = require("../models/Vehicle");
const {
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router(); 
 

 
// Create a new vehicle
router.post("/vehicle/add", async (req, res) => {
  try { 
    const vehicleData = req.body;
    console.log(vehicleData); 
  
    Vehicle.add(vehicleData, (err, result) => {
      if (err) {
        console.error("Error creating vehicle:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      res.status(201).json({ message: "Vehicle created successfully", id_vehicle: result });
    });
  } catch (err) {
    console.error("Error creating vehicle:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// UPDATE Vehicle 
router.post("/vehicle/update", async (req, res) => {
  try {
    const id_vehicule = req.body.id_vehicule;
   console.log( req.body);
    // Check if the id_vehicule is provided in the request body
    if (!id_vehicule) {
      return res.status(400).json({ message: "id_vehicule is required" });
    }
 
    const updatedVehicle = await Vehicle.update(
      req.body,
      (err, result) => {
        if (err) {
          console.error("Error updating vehicle:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Vehicle not found" });
        }

        res.status(200).json({ message: "Vehicle updated successfully" });
      }
    );
  } catch (err) {
    console.error("Error updating vehicle:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE Vehicle
router.delete("/vehicle/delete/:id_vehicle/:id_user", async (req, res) => {
  
  const { id_vehicle ,id_user} = req.params;
  Vehicle.delete(id_vehicle,id_user,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.'+err });
    } 
 
    if (results.length === 0) {
      return res.status(404).json({ error: 'Véhicule non trouvé.' });
    }
    res.json(results);
  });
  
});

//GET Vehicle
router.get("/vehicle/find/:id_vehicule", async (req, res) => {
 
  const { id_vehicule } = req.params;
  Vehicle.getById(id_vehicule,(err, results) => {
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.' });
    }  

    if (results.length === 0) {
      return res.status(404).json({ error: 'Véhicule non trouvé.' });
    }
    res.json(results[0]);
  });
  
});

//GET options Vehicle
router.get("/vehicle/options/:id_user", async (req, res) => {
 
  const { id_user } = req.params;
  Vehicle.getOptions(id_user,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.' });
    } 

    if (results.length === 0) {
      return res.status(404).json({ error: 'Véhicule non trouvé.' });
    }
    res.json(results);
  });
  
});

//GET ALL Vehicles
router.get("/vehicle/:page/:limit/:id_user", async (req, res) => { 
  const {page, limit,id_user}= req.params; 
     
  Vehicle.getAllUserId(page,limit,id_user,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.' });
    }
    res.json(results);
  });
});

router.get("/vehicle/totalpage/:id_user", async (req, res) => { 
  const {id_user}= req.params; 
     
  Vehicle.getAll(id_user,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.' });
    }
    res.json(results);
  });
});



//GET ALL Vehicles with search

router.get("/vehicle/search/:page/:limit/:id_user/:search/:type", async (req, res) => { 
  const {page, limit,id_user,search,type}= req.params; 
     
  Vehicle.getAllUserSearch(page,limit,id_user,search,type,(err, results) => {  
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.' });
    }
    res.json(results);
  });
}); 
 
router.get("/vehicle/search/totalpage/:id_user/:search/:type", async (req, res) => { 
  const {id_user,search,type}= req.params; 
     
  Vehicle.getAllSearch(id_user,search,type,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.' });
    }
    res.json(results);
  });
});




 
router.get("/vehicle/type-options/:type", async (req, res) => { 
  const {type}= req.params; 
     
  Vehicle.getTypeOptions(type,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des type options.' });
    }
    res.json(results[0]); 
  });
});


module.exports = router;
