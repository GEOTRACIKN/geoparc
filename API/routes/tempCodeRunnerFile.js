//GET All Permission
// router.get("/permission/all/:id_user", async (req, res) => {
 
//   const { id_user } = req.params;

//   Permission.getAll(id_user,(err, results) => {
//     if (err) {
//         return res.status(500).json({ error: 'Erreur lors de la récupération des permissions.' });
//     } 

//     if (results.length === 0) {
//       return res.status(404).json({ error: 'Permission non trouvé.' });
//     }
//     res.json(results);
//   });
  
// });