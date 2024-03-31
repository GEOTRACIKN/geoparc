const express = require('express');
const router = express.Router();
const Rapports = require ('../models/Reports');


router.get("/rapports/iduser/:id_user", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const sortColumn = req.query.sortColumn;
  const sortOrder = req.query.sortOrder;
  const { id_user } = req.params;
  const searchTerm = req.query.searchTerm;
  const searchOption = req.query.searchOption;

  Rapports.getReportsByUserId(
    page,
    limit,
    id_user,
    sortColumn,
    sortOrder,
    searchTerm,
    searchOption,
    (err, rapports) => {
      if (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des rapports" });
      } else if (!rapports) {
        res.status(404).json({ message: "Aucun rapport trouvé pour cet utilisateur" });
      } else {
        res.status(200).json(rapports);
      }
    }
  );
});

  
  router.get("/rapport/totalpage/:id_user", async (req, res) => { 
    const {id_user}= req.params; 
       
    Rapports.getAll(id_user,(err, results) => { 
      if (err) {
          return res.status(500).json({ error: 'Erreur lors de la récupération des rapports.' });
      }
      res.json(results);
    });
  });


  router.get('/reports/byTurn/:turn_report', (req, res) => {
    const { turn_report } = req.params;
  
    Rapports.getReportsByTurn(turn_report, (err, result) => {
      if (err) {
        console.error('Erreur lors de la récupération des rapports par tour :', err);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        res.json(result);
      }
    });
  });

  router.post('/supprimer-rapports', async (req, res) => {
    try {
        const { turn_report, id_dispositif } = req.body;

        if (!turn_report || !id_dispositif) {
            return res.status(400).json({ Respond: 3, Message: "Veuillez remplir le formulaire correctement" });
        }

        // Sélectionnez les identifiants de rapport par tour et id_dispositif
        const reports = await Rapports.getReportsByTurnAndDispositif(turn_report, id_dispositif);
        const states = [];
        let respond = 0;





        for (const report of reports) {
            // Supprimer les données du rapport
            const deleteReportDatas = await Rapports.deleteReportDatas(report.id_report);
            if (deleteReportDatas !== null) {
                // Si les données du rapport sont supprimées, supprimer le rapport lui-même
                const deleteReport = await Rapports.deleteReport(report.id_report);

                if (deleteReport) {
                    respond = 1;
                    states.push(`${turn_report}-${id_dispositif}-${report.id_report}-${deleteReportDatas}`);
                } else {
                    respond = 0;
                    states.push(`${turn_report}-${id_dispositif}-${report.id_report}-0`);
                }
            } else {
                respond = 0;
                states.push(`${turn_report}-${id_dispositif}-${report.id_report}-0`);
            }
        }

        const message = ["Impossible de supprimer le rapport", "Rapports supprimés avec succès"];
        res.json({ Respond: respond, Message: message[respond], States: states });


    } catch (error) {
        console.error('Erreur lors de la suppression des rapports :', error);
        res.status(500).json({ Respond: 4, Message: "Une erreur interne s'est produite" });
    }
});


  module.exports = router;



