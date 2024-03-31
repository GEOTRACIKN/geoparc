const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const jwt = require('jsonwebtoken');


const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
// Route pour créer un nouvel utilisateur

router.post("/addUser", (req, res) => {
  const {
    first_name,
    middle_name,
    passwd,
    email,
    username,
    wilaya,
    phone,
    userM,
    roleUser,
    validite,
  } = req.body;

  Users.addUser(
    first_name,
    middle_name,
    passwd,
    email,
    username,
    wilaya,
    phone,
    userM,
    roleUser,
    validite,
    (err, userId) => {
      if (err) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", err);
        return res
          .status(500)
          .json({ message: "Erreur lors de l'ajout de l'utilisateur" });
      }

      // Si l'utilisateur est ajouté avec succès, ajoutez la relation utilisateur-utilisateur
      Users.insertRelUserUser(userM, userId, (relErr, relationId) => {
        if (relErr) {
          console.error(
            "Erreur lors de l'ajout de la relation utilisateur-utilisateur :",
            relErr
          );
          return res
            .status(500)
            .json({
              message:
                "Erreur lors de l'ajout de la relation utilisateur-utilisateur",
            });
        }

        res.status(201).json({ userId, relationId });
      });
    }
  );
});
router.post('/verifierUtilisateur',async (req, res) => {
  if (!req.body.thisusername) {
    return res.status(400).json({ error: 'Nom d\'utilisateur manquant dans la requête.' });
  }

  const thisusername = req.body.thisusername;

  await Users.verifyUser(thisusername, (err, userExists) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la vérification de l\'utilisateur.' });
    }

    res.json({ exist: userExists });
  });
});



// Route pour récupérer tous les utilisateurs
router.get("/users",async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
 await Users.getAllUsers(page, limit, (err, users) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des utilisateurs" });
    } else {
      res.status(200).json(users);
    }
  });
});



router.get("/users/find/:id_user", async (req, res) => {
  
  const { id_user } = req.params;

  Users.getOptionsByUserId(id_user, (err, options) => {
    if (err) {
      res
        .status(500)
        .json({
          message:
            "Erreur lors de la récupération des options de l'utilisateur",
        });
    } else if (!options || options.length === 0) {
      res
        .status(404)
        .json({ message: "Options non trouvées pour cet utilisateur" });
    } else {
      res.status(200).json(options);
    }
  });
});

router.get("/roles/user/:id_user", async (req, res) => {
  const { id_user } = req.params;

  Users.getRolesByUserId(id_user, (err, roles) => {
    if (err) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la récupération des rôles de l'utilisateur",
        });
    } else if (!roles || roles.length === 0) {
      res
        .status(404)
        .json({ message: "Rôles non trouvés pour cet utilisateur" });
    } else {
      res.status(200).json(roles);
    }
  });
});

// Route pour récupérer un utilisateur par son ID

router.get("/users/iduser/:id_user", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const sortColumn = req.query.sortColumn;
const sortOrder = req.query.sortOrder;


  const { id_user } = req.params;

  Users.getByUserId(page, limit, id_user, sortColumn, sortOrder, (err, users) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération de l'utilisateur" });
    } else if (!users) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      res.status(200).json(users);
    }
  });
});

router.get("/user/totalpage/:id_user", async (req, res) => { 
  const {id_user}= req.params; 
     
  Users.getAll(id_user,(err, results) => { 
    if (err) {
        return res.status(500).json({ error: 'Erreur lors de la récupération des users.' });
    }
    res.json(results);
  });
});


router.get('/userform/:id', (req, res) => {
  const userId = req.params.id;

  Users.getUserform(userId, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(user);
    }
  });
});

// Route pour mettre à jour un utilisateur par son ID// Route pour la mise à jour d'un utilisateur
router.post("/updateUser", (req, res) => {
  const {
    userId,
    first_name,
    middle_name,
    passwd,
    email,
    username,
    wilaya,
    phone,
    userM,
    roleUser,
    validite,
  } = req.body;

  Users.updateUser(
    userId,
    first_name,
    middle_name,
    passwd,
    email,
    username,
    wilaya,
    phone,
    userM,
    roleUser,
    validite,
    (err, updatedUserId) => {
      if (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
        return res
          .status(500)
          .json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
      }

      // Si la mise à jour réussit, mettez à jour la relation utilisateur-utilisateur
      Users.updateRelUserUser(userM, updatedUserId, (relErr, relationId) => {
        if (relErr) {
          console.error(
            "Erreur lors de la mise à jour de la relation utilisateur-utilisateur :",
            relErr
          );
          return res
            .status(500)
            .json({
              message:
                "Erreur lors de la mise à jour de la relation utilisateur-utilisateur",
            });
        }

        res.status(200).json({ updatedUserId, relationId });
      });
    }
  );
});


// Route pour supprimer un utilisateur par son ID
router.put('/softDeleteUser/:id_user', (req, res) => {
  const id_user = req.params.id_user;
  const loggedInUserID = req.body.loggedInUserID;  // Récupère l'ID de l'utilisateur connecté depuis le corps de la requête

  Users.softDeleteUser(id_user, loggedInUserID, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la suppression logique de l\'utilisateur.' });
    } else {
      res.status(200).json({ message: 'Suppression logique réussie.' });
    }
  });
});

// Route pour restorer un utilisateur par son ID
router.put('/restoreUser/:id_user', (req, res) => {
  const id_user = req.params.id_user;

  Users.restoreUser(id_user, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error restoring the user.' });
    } else {
      res.status(200).json({ message: 'User restored successfully.' });
    }
  });
});

// API route
router.get("/deleted-users/:id_user", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const { id_user } = req.params;

  Users.getDeletedUsers(page, limit, id_user, (err, users) => {
      if (err) {
          res
              .status(500)
              .json({ message: "Error retrieving deleted users" });
      } else if (!users) {
          res.status(404).json({ message: "Deleted users not found" });
      } else {
          res.status(200).json(users);
      }
  });
});

router.get("/deleted-users-count/:id_user", async (req, res) => {
  const { id_user } = req.params;

  Users.getDeletedUsersCount(id_user, (err, count) => {
      if (err) {
          res
              .status(500)
              .json({ message: "Error retrieving deleted users count" });
      } else {
          res.status(200).json({ count: count[0].total });
      }
  });
});


router.put('/update-auth/:id_user', async (req, res) => {
  const { id_user } = req.params;
  const { last_auth_duration, last_auth } = req.body;


  try {
    await Users.updateUserAuthInfo(id_user, last_auth_duration,last_auth ); // Call the updateUserAuthInfo function from your Users model
    res.status(200).json({ message: 'Authentication information updated successfully' });
  } catch (error) {
    console.error('Error updating authentication information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/log-user-action/:id', (req, res) => {
  const userID = req.params.id;
  const { action, page, timestamp, details, operation } = req.body;

  Users.logUserAction(userID,operation,page, action,timestamp, details, (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Error logging user action' });
    }
    res.sendStatus(200);
  });
});

router.get('/getUserName/:id', (req, res) => {
  const userId = req.params.id;

  Users.getUserName(userId, (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(user);
    }
  });
});





module.exports = router;
