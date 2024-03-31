const Device = require("../models/Device");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router(); 
const db = require('../database'); 

 
//CREATE Device
router.post("/device/add", verifyTokenAndAdmin, async (req, res) => {
  const newDevice = new Device(req.body);

  try {
    const savedDevice = await newDevice.save();
    res.status(200).json(savedDevice);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE Device
router.put("/device/:id_Device", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedDevice);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE Device
router.delete("/device/:id_device", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.status(200).json("Device has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Device
router.get("/device/find/:id_device", async (req, res) => { 
  
  const { id_device } = req.params;
  Device.getById(id_device,(err, results) => {
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des devices.' });
    } 

    if (results.length === 0) {
      return res.status(404).json({ error: 'Véhicule non trouvé.' });
    }
    res.json(results);
  });
  
});

//GET ALL Devices
router.get("/device/:page/:limit/:id_user", async (req, res) => { 
  const {page, limit,id_user}= req.params; 
     
  Device.getAllUserId(page,limit,id_user,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des devices.' });
    }
    res.json(results);
  });
}); 

router.get("/device/totalpage/:id_user", async (req, res) => { 
  const {id_user}= req.params; 
     
  Device.getAll(id_user,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des devices.' });
    }
    res.json(results);
  });
});

 
 
//Advanced search engine
router.get("/device/search/:page/:limit/:id_user/:search/:type", async (req, res) => { 
  const {page, limit,id_user,search,type}= req.params; 
     
  Device.getAllUserSearch(page,limit,id_user,search,type,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des devices.' });
    }
    res.json(results);
  });
});
 
router.get("/device/search/totalpage/:id_user/:search/:type", async (req, res) => { 
  const {id_user,search,type}= req.params; 
     console.log( req.params); 
  Device.getAllSearch(id_user,search,type,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des devices.' });
    }
    res.json(results);
  });
});





// Update Vehicle Device relation
router.post("/device/updateVehiculeDeviceRelation", async (req, res) => { 
  try { 
    const {id_old_Vehicle, id_new_device, id_new_vehicle,id_user_vehicle,id_puce,id_groupe_disp} = req.body;


   
    Device.updateVehiculeDeviceRelation(id_old_Vehicle, id_new_device, id_new_vehicle, (err, result1) => {
      if (err) {
        console.error("Error creating vehicle:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
     // res.status(201).json({ message: result1["affectedRows"] });
 
        if( result1["affectedRows"] ==1){
 
          Device.updateDeviceUserRelation(id_new_device, id_user_vehicle,id_puce,id_groupe_disp, (err, result2) => {
 
            console.log(result2);             
            if (err) {  
               
                return res.status(500).json({ 
                  updateVehiculeDevice: result1["affectedRows"],
                  updateDeviceUser: 0
                });
            }
    
            res.status(200).json({
                updateVehiculeDevice: result1["affectedRows"],
                updateDeviceUser: result2["affectedRows"] 
               }); 
        });
        }else{
          res.status(200).json({ 
            updateVehiculeDevice: result1["affectedRows"],
            updateDeviceUser:0
            }); 
        }

    });
  } catch (err) {
   
    res.status(500).json({  
      updateVehiculeDevice:0, 
      updateDeviceUser:0
    });
  }
});


// Update Device User Relation
router.post("/device/updateDeviceUserRelation", async (req, res) => {
  try {
      const { id_device, id_user_vehcle } = req.body;

      Device.updateDeviceUserRelation(id_device, id_user_vehcle, (err, result) => {
          if (err) {
              console.error("Error updating device user relation:", err);
              return res.status(500).json({ message: "Internal Server Error" });
          }

          res.status(200).json({ message: "Device user relation updated successfully" });
      });
  } catch (err) {
      console.error("Error updating device user relation:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


// Insert History Vehicule Device
router.post("/device/insertHistoryVehiculeDevice", async (req, res) => {
  try {
      const { id_vehicule, id_device } = req.body;

      Device.insertHistoryVehiculeDevice(id_vehicule, id_device, (err, result) => {
          if (err) {
              console.error("Error inserting history vehicule device:", err);
              return res.status(500).json({ message: "Internal Server Error" });
          }

          res.status(201).json({ message: "History vehicule device inserted successfully", id: result.insertId });
      });
  } catch (err) {
      console.error("Error inserting history vehicule device:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
