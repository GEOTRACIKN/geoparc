const express = require("express");
const Connexion = require("../models/Connexion");
const router = express.Router();


  
 // Route to retrieve a specific record by its ID
router.get('/connexion/:id', async (req, res) => {
  const userId = req.params.id;
  const page = parseInt(req.query.page); // Convert page to an integer
  const limit = parseInt(req.query.limit); // Convert limit to an integer

  // Check if page or limit is NaN (Not a Number)
  if (isNaN(page) || isNaN(limit)) {
      res.status(400).send('Invalid page or limit');
      return;
  }

  await Connexion.getAllConn(page, limit, userId, (err, results) => {
      if (err) {
          console.error('Error retrieving records:', err);
          res.status(500).send('Error retrieving records');
          return;
      }
      res.json(results);
  });
});

// Route to get user history
router.get('/userhistory/:id', async (req, res) => {
  const userId = req.params.id;
  const page = parseInt(req.query.page); // Convert page to an integer
  const limit = parseInt(req.query.limit); // Convert limit to an integer

  // Check if page or limit is NaN (Not a Number)
  if (isNaN(page) || isNaN(limit)) {
      res.status(400).send('Invalid page or limit');
      return;
  }

  // Call getHistory function to retrieve user history
  await Connexion.getHisory(page, limit, userId, (err, results) => {
      if (err) {
          console.error('Error retrieving user history:', err);
          res.status(500).send('Error retrieving user history');
          return;
      }
      res.json(results);
  });
});




router.get("/connexion/totalpage/:id", async (req, res) => {
    const userId = req.params.id;
  
    await Connexion.allConnCount(userId, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error retrieving total page count." }); // Updated error message
      }
      res.json(results);
    });
});

router.get("/userhistory/totalpage/:id", async (req, res) => {
  const userId = req.params.id;

  await Connexion.HistoryCount(userId, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error retrieving total page count." }); // Updated error message
    }
    res.json(results);
  });
});










module.exports = router;


