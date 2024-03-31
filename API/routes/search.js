const search = require('../models/search');
const {
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router(); 
 


// Search report for
router.get("/search/report-for/:type", async (req, res) => {  
  try {  
    const {type} = req.params; 
    
    search.getReportFor(type, (err, result) => { 
      if (err) {
        console.error("Error for search:", err);
        return res.status(500).json({ message: "Internal Server Error  "+err });  
      }

      res.status(201).json({ data: result });   
    }); 
  } catch (err) {
    console.error("Error search:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// Route pour la suggestion d'autocomplétion basée sur le type et le user
router.get("/search/:type/:research/:id_user", async (req, res) => { 

  try {
    const { type, research,id_user } = req.params;

    let autocomplate; 

    switch (parseInt(type)) {  
      case 11: 
         
        search.autocompleteVehicles(id_user, research, (err, result) => {   
          if (err) {
            console.error("Erreur de recherche :", err);
            return res.status(500).json({ message: "Erreur interne du serveur " + err });
          }
     
          res.status(200).json({ data: result }); 
        }); 
       
        break;
      case 12:
       

      search.autocompletePSN(id_user, research, (err, result) => {   
        if (err) {
          console.error("Erreur de recherche :", err);
          return res.status(500).json({ message: "Erreur interne du serveur " + err });
        }
   
        res.status(200).json({ data: result }); 
      }); 
      


        break;
      case 13:
        autocomplate = await autocomplateCodeVehicles(type);
        break;
      case 14:
        autocomplate = await autocomplateGroupe(type);
        break;
      case 15:
        autocomplate = await autocomplateUser(type);
        break;
      case 21:
        autocomplate = await autocomplateFlotte(type);
        break;
      case 31:
        if (req.query.params === '32') {
          autocomplate = await autocomplateConducteurById(type);
        } else {
          autocomplate = await autocomplateConducteur(type);
        }
        break;
      case 32:
        autocomplate = await autocomplateUser(type);
        break;
      case 33:
        autocomplate = await autocomplateAgence(type);
        break;
      case 34:
        if (req.query.id_groupe !== '0') {
          autocomplate = await autocomplateGroupeVehicules(req.params.id_groupe);
        }
        break;
      case 35:
        autocomplate = await autocomplateUserVehicules(type);
        break;
      case 36:
        autocomplate = await autocomplatePOI(type);
        break;
      case 37:
        autocomplate = await autocomplateCodePOI(type);
        break;
      case 51:
        autocomplate = await autocomplateConducteur(type);
        break;
      case 52:
        autocomplate = await autocomplateConducteurs(type);
        break;
      case 61:
        autocomplate = await autocomplateVehicles61(type);
        break;
      case 62:
        autocomplate = await autocomplatePSN62(type);
        break;
      default:
        return res.status(400).json({ message: "Type non pris en charge" });
    }
  
  } catch (err) {
    console.error("Erreur de recherche :", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});


 

module.exports = router;
