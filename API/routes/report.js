const express = require("express");
const router = express.Router();
const Rapport = require("../models/Report");


//Start Route Itinerary reconstitution By Chafik
router.get("/report1/:id", (req, res) => {
  const id_report = req.params.id;
 
  Rapport.getReport1(id_report, (error, reportData) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!reportData) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Send the report data as JSON response
    res.json(reportData);
  });
});

//End Route Rapport Gantt sur contact By Chafik


//Start Route Rapport de proximité numéro 2 By Hichem
router.get("/report2/:id", (req, res) => {
  const id_report = req.params.id;

  Rapport.getReport2(id_report, (error, reportData) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!reportData) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Send the report data as JSON response
    res.json(reportData);
  });
});

//End Route Rapport de proximité numéro 2 By Hichem


//Start RouteCAN] Distance and Consumption Diagram By Chafik
router.get("/report8/:id", (req, res) => {
  const id_report = req.params.id;
 
  Rapport.getReport8(id_report, (error, reportData) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!reportData) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Send the report data as JSON response
    res.json(reportData);
  });
});

//End Route Rapport Gantt sur contact By Chafik


//Start Route Rapport Gantt sur contact By Chafik
router.get("/report15/:id", (req, res) => {
  const id_report = req.params.id;
 
  Rapport.getReport15(id_report, (error, reportData) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!reportData) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Send the report data as JSON response
    res.json(reportData);
  });
});

//End Route Rapport Gantt sur contact By Chafik


// Start By Younes 
// Report 12

router.get('/report12/:id_repport', (req, res) => {
  const id_repport = req.params.id_repport;

  Rapport.getReport12(id_repport, (error, results) => {
      if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json(results);
      }
  });
});



// Report 25


//Start RouteCAN] Distance and Consumption Diagram By Chafik
router.get("/report8/:id", (req, res) => {
  const id_report = req.params.id;
 
  Rapport.getReport8(id_report, (error, reportData) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!reportData) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Send the report data as JSON response
    res.json(reportData);
  });
});

router.get('/report25/:id_report', (req, res) => {
  // Extracting id_report from request parameters
  const { id_report } = req.params;
  
  // Calling getReport25 function from the Rapport module
  Rapport.getReport25(id_report, (err, result) => {
    if (err) {
      // Handling errors during database query
      console.error('Erreur lors de la récupération des rapports par tour :', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      // Sending the query result as JSON response
      res.json(result);
    }
  });
});

// END By Younes Report 25

 //Start Modéle Rapport de DVS numéro 4 By walid
 router.get("/Rapport4/:id", (req, res) => {
  const id_repport = req.params.id;

  // Utilisez la fonction du modèle Rapport pour obtenir les données du rapport
  Rapport.getReport4(id_repport, (error, reportData) => {
    if (error) {
      // En cas d'erreur, renvoyez une réponse d'erreur avec un code 500
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur lors de la récupération du Rapports.",
      });
    }

    if (reportData.reportData.length > 0) {
      // Si des données principales sont trouvées, renvoyez-les en tant que réponse
      const response = {
        data: reportData.reportData,
        additionalData: reportData.additionalData,
        moreInfo: reportData.moreInfo
      };
      res.json(response);
    } else {
      // Si aucune donnée n'est trouvée pour l'ID donné, renvoyez un message approprié
      res.json({
        success: false,
        message: "Aucun rapport trouvé pour l'ID spécifié.",
      });
    }
  });
});
  //End Modéle Rapport de DVS numéro 4 By walid


 //Start Modéle Rapport de DM numéro 7 By walid

 router.get("/Rapport7/:id", (req, res) => {
  const id_repport = req.params.id;

  // Utilisez la fonction du modèle Rapport pour obtenir les données du rapport 7
  Rapport.getReport7(id_repport, (error, reportData) => {
    if (error) {
      // En cas d'erreur, renvoyez une réponse d'erreur avec un code 500
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur lors de la récupération du Rapports.",
      });
    }

    if (reportData.query1Result.length > 0 || reportData.query2Result.length > 0) {
      // Si des données sont trouvées, renvoyez-les en tant que réponse
      res.json({
        success: true,
        data: {
          query1Result: reportData.query1Result,
          query2Result: reportData.query2Result
        }
      });
    } else {
      // Si aucune donnée n'est trouvée pour l'ID donné, renvoyez un message approprié
      res.json({
        success: false,
        message: "Aucun rapport trouvé pour l'ID spécifié.",
      });
    }
  });
});



 //End Modéle Rapport de DM numéro 7 By walid

  //Start Modéle Rapport de DM numéro 7 By walid

  router.get("/Rapport11/:id", (req, res) => {
    const id_repport = req.params.id;
  
    // Utilisez la fonction du modèle Rapport pour obtenir les données du rapport 7
    Rapport.getReport11(id_repport, (error, reportData) => {
      if (error) {
        // En cas d'erreur, renvoyez une réponse d'erreur avec un code 500
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Erreur serveur lors de la récupération du Rapports.",
        });
      }
  
      if (reportData.query1Result.length > 0 || reportData.query2Result.length > 0) {
        // Si des données sont trouvées, renvoyez-les en tant que réponse
        res.json({
          success: true,
          data: { 
            query1Result: reportData.query1Result,
            query2Result: reportData.query2Result
          }
        });
      } else {
        // Si aucune donnée n'est trouvée pour l'ID donné, renvoyez un message approprié
        res.json({
          success: false,
          message: "Aucun rapport trouvé pour l'ID spécifié.",
        });
      }
    });
  });
//Start Route Rapport  numéro 35 By Badro




//Start RouteCAN] Distance and Consumption Diagram By Chafik
router.get("/report19/:id", (req, res) => {
  const id_report = req.params.id;
 
  Rapport.getReport19(id_report, (error, reportData) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!reportData) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Send the report data as JSON response
    res.json(reportData);
  });
});

  router.get("/report35/:id", (req, res) => {
    const id_report = req.params.id;
  
    Rapport.getReport35(id_report, (error, reportData) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (!reportData) {
        return res.status(404).json({ error: "Report not found" });
      }
  
      // Send the report data as JSON response
      res.json(reportData);
    });
  });          
//End Route Rapport  numéro 35 By Badro

//Start Route Rapport de Calcul de l'Empreinte Carbone numéro 45 By Hichem
router.get("/report45/:id", (req, res) => {
  const id_report = req.params.id;

  Rapport.getReport45(id_report, (error, reportData) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!reportData) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Send the report data as JSON response
    res.json(reportData);
  });
});

//End Route Rapport de Calcul de l'Empreinte Carbone numéro 45 By Hichem


module.exports = router;
