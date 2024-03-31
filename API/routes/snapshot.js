const express = require('express');
const router = express.Router();
const Snapshot = require('../models/Snapshot'); // Assuming your model is in the 'models' directory



router.get('/snapshot/total/:id_user', async (req, res) => {
  const { id_user } = req.params;
  Snapshot.getALLCount(id_user, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});

router.get('/snapshot/getsnapshots/sort/:id_user', async (req, res)  => {
  const { page, limit, sortColumn, sortOrder } = req.query;
  const { id_user } = req.params;

  Snapshot.getSnapshotsSort(page, limit, id_user, sortColumn, sortOrder, (err, groups) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    } else if (!groups) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    } else {
      return res.status(200).json(groups);
    }
  });
});



module.exports = router;

