const Permission = require("../models/Permission");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router(); 
const db = require('../database'); 


//CREATE Permission
router.post("/permission", verifyTokenAndAdmin, async (req, res) => {
  const newPermission = new Permission(req.body);

  try {
    const savedPermission = await newPermission.save();
    res.status(200).json(savedPermission);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE Permission
router.put("/permission/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedPermission = await Permission.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedPermission);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE Permission
router.delete("/permission/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Permission.findByIdAndDelete(req.params.id);
    res.status(200).json("Permission has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Permission
router.get("/permission/find/:id_user/:id_permission", async (req, res) => {
 
  const { id_user, id_permission } = req.params;
  Permission.getById(id_user,id_permission,(err, results) => {
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des permissions.',  });
    } 

    if (results.length === 0) {
      return res.status(404).json({ error: 'Permission non trouvé.' });
    }
    res.json(results);
  });
  
});


//GET All Permission
router.get("/permission/all/:id_user", async (req, res) => {
  const { id_user } = req.params;

  Permission.getAll(id_user, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error retrieving permissions.' });
      } 

      if (results.length === 0) {
          return res.status(404).json({ error: 'Permissions not found.' });
      }
      res.json(results);
  });
});


module.exports = router;
