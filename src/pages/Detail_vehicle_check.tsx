import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Nav, Tab, Col, Row, Button, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { toTimestamp } from '../functions';
import { useTranslate } from "../components/LanguageProvider";
import ExcelJS from 'exceljs';
import { Bounce, toast } from "react-toastify";




interface VehicleDetails {
  id_verif: number;
  creation_date: string;
  checker: string;
  driver_out: string;
  driver_in: string;
  tractor_number: string;
  trailer_number: string;
  km: string;
  operating_hours: string;
  papers: number;
  truck_step_right: number;
  truck_step_left: number;
  triangles_wedges: number;
  battery: number;
  fire_extinguisher: string;
  pneu_tr_av_g: number;
  pneu_tr_av_d: number;
  pneu_tr_ar_g_int: number;
  pneu_tr_ar_d_int: number;
  pneu_tr_ar_g_ext: number;
  pneu_tr_ar_d_ext: number;
  pneu_rm_issue1_g: number;
  pneu_rm_issue1_d: number;
  pneu_rm_issue2_g: number;
  pneu_rm_issue2_d: number;
  pneu_rm_issue3_g: number;
  pneu_rm_issue3_d: number;
  jack_truck: number;
  tool_kit: number;
  pressure_gauge: number;
  tank: number;
  first_aid_kit: number;
  intake_pipe: number;
  sealed_cable: number;
  Geolocation_tag: number;
  parking_stand: number;
  bumper_trailer: number;
  twist_lock_skeleton: number;
  tarpaulin_trailer: number;
  slats: number;
  refrigerator_motor: number;
  niv_gasoile: number;
  window_mirrors: number;
  windshield_wipers: number;
  lights_turn_signals: number;
  latch: number;
  tbl_truck: number;
  reflector_lights: number;
  stop_Lights: number;
  spare_wheel: number;
  spare_trailer: number;
  pression_tr_av_g: number;
  pression_tr_av_d: number;
  pression_tr_ar_g_int: number;
  pression_tr_ar_d_int: number;
  pression_tr_ar_g_ext: number;
  pression_tr_ar_d_ext: number;
  pression_rm_issue1_g: number;
  pression_rm_issue1_d: number;
  pression_rm_issue2_g: number;
  pression_rm_issue2_d: number;
  pression_rm_issue3_g: number;
  pression_rm_issue3_d: number;
  cleanliness_int: number;
  cleanliness_ext: number;
  maintenance: number;
  comment: string;
}

export function DetailVehicleCheck() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { id_verif } = useParams();
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);
  const navigate = useNavigate();
  const [showDownloadModal, setShowDownloadModal] = useState(false); // État pour le modal de téléchargement
  const [selectedDownloadFormat, setSelectedDownloadFormat] = useState(''); // État pour le format de téléchargement
  const { translate } = useTranslate();




  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        //console.log("ID vérif dans le front-end:", id_verif);
        const response = await fetch(`${backendUrl}/api/geop/vehiclecheck/details/${id_verif}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du véhicule');
        }
        const data: VehicleDetails = await response.json();
        console.log("Données reçues:", data);

        if (data) {
          setVehicleDetails(data);
        } else {
          throw new Error('Données du véhicule invalides');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    if (id_verif) {
      fetchVehicleDetails();
    }
  }, [id_verif, backendUrl]);

  if (!vehicleDetails) {
    return <div>Chargement en cours...</div>;
  }

  const renderCheckIcon = (isChecked: number | null) => {
    if (isChecked === 1) {
      return (
        <span title="Conforme">
          <i className="las la-check" style={{ color: 'green' }}></i>
        </span>
      );
    } else if (isChecked === 2) {
      return (
        <span title="Non Conforme">
          <i className="las la-times" style={{ color: 'red' }}></i>
        </span>
      );
    } else if (isChecked === 0 || isChecked === null) {
      return (
        <span title="Non Vérifié" style={{ color: 'orange' }}>
          Non Vérifié
        </span>
      );
    } else {
      return null;
    }
  };


  const goToVehicleChecks = () => {
    navigate("/vehicles_checks"); // Naviguer vers la page Vehicle_checks
  };

  // Function to handle the download modal
  const handleDownloadClick = () => {
    setShowDownloadModal(true);
  };

  const convertValue = (value: any) => {
    if (value === 0) {
        return "Non vérifié";
    } else if (value ===  1) {
        return  "Conforme" ;
    } else if (value === 2) {
        return "Non Conforme" ;
    }
};

  const downloadExcel = async () => {
    try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Détail du Véhicule');

    // Définition des colonnes pour l'affichage vertical
    worksheet.columns = [
      { header: 'Champ', key: 'champ', width: 30 },
      { header: 'Valeur', key: 'valeur', width: 50 },
    ];

     // Ajout des données verticalement
     worksheet.addRow({ champ: 'ID Vérif', valeur: vehicleDetails.id_verif });
     worksheet.addRow({ champ: 'Date de Création', valeur: toTimestamp(vehicleDetails.creation_date) });
     worksheet.addRow({ champ: 'Vérificateur', valeur: vehicleDetails.checker });
     worksheet.addRow({ champ: 'Chauffeur Sortant', valeur: vehicleDetails.driver_out });
     worksheet.addRow({ champ: 'Chauffeur Entrant', valeur: vehicleDetails.driver_in });
     worksheet.addRow({ champ: 'Matricule Tracteur', valeur: vehicleDetails.tractor_number });
     worksheet.addRow({ champ: 'Matricule Remorque', valeur: vehicleDetails.trailer_number });
     worksheet.addRow({ champ: 'Km', valeur: vehicleDetails.km });
     worksheet.addRow({ champ: 'Heures de Fonctionnement', valeur: vehicleDetails.operating_hours });
     // Champs supplémentaires
     worksheet.addRow({ champ: 'Papiers', valeur: convertValue(vehicleDetails.papers) });
     worksheet.addRow({ champ: 'Marche pied droite', valeur: convertValue(vehicleDetails.truck_step_right) });
     worksheet.addRow({ champ: 'Marche pied gauche', valeur: convertValue(vehicleDetails.truck_step_left) });
     worksheet.addRow({ champ: 'Triangles/Cales', valeur: convertValue(vehicleDetails.triangles_wedges) });
     worksheet.addRow({ champ: 'Batterie', valeur: convertValue(vehicleDetails.battery) });
     worksheet.addRow({ champ: 'Extincteur', valeur: toTimestamp(vehicleDetails.fire_extinguisher)});
     worksheet.addRow({ champ: 'Pneu avant gauche (tracteur)', valeur: convertValue(vehicleDetails.pneu_tr_av_g) });
     worksheet.addRow({ champ: 'Pneu avant droite (tracteur)', valeur: convertValue(vehicleDetails.pneu_tr_av_d) });
     worksheet.addRow({ champ: 'Pneu arrière gauche intérieur (tracteur)', valeur: convertValue(vehicleDetails.pneu_tr_ar_g_int) });
     worksheet.addRow({ champ: 'Pneu arrière droite intérieur (tracteur)', valeur: convertValue(vehicleDetails.pneu_tr_ar_d_int) });
     worksheet.addRow({ champ: 'Pneu arrière gauche extérieur (tracteur)', valeur: convertValue(vehicleDetails.pneu_tr_ar_g_ext) });
     worksheet.addRow({ champ: 'Pneu arrière droite extérieur (tracteur)', valeur: convertValue(vehicleDetails.pneu_tr_ar_d_ext) });
     worksheet.addRow({ champ: 'Pneu remorque gauche problème 1', valeur: convertValue(vehicleDetails.pneu_rm_issue1_g) });
     worksheet.addRow({ champ: 'Pneu remorque droite problème 1', valeur: convertValue(vehicleDetails.pneu_rm_issue1_d) });
     worksheet.addRow({ champ: 'Pneu remorque gauche problème 2', valeur: convertValue(vehicleDetails.pneu_rm_issue2_g) });
     worksheet.addRow({ champ: 'Pneu remorque droite problème 2', valeur: convertValue(vehicleDetails.pneu_rm_issue2_d) });
     worksheet.addRow({ champ: 'Pneu remorque gauche problème 3', valeur: convertValue(vehicleDetails.pneu_rm_issue3_g) });
     worksheet.addRow({ champ: 'Pneu remorque droite problème 3', valeur: convertValue(vehicleDetails.pneu_rm_issue3_d) });
     worksheet.addRow({ champ: 'Cric tracteur', valeur: convertValue(vehicleDetails.jack_truck) });
     worksheet.addRow({ champ: 'Trousse à outils', valeur: convertValue(vehicleDetails.tool_kit) });
     worksheet.addRow({ champ: 'Manomètre', valeur: convertValue(vehicleDetails.pressure_gauge) });
     worksheet.addRow({ champ: 'Réservoir', valeur: convertValue(vehicleDetails.tank) });
     worksheet.addRow({ champ: 'Trousse de premiers secours', valeur: convertValue(vehicleDetails.first_aid_kit) });
     worksheet.addRow({ champ: 'Pipe d\'admission', valeur: convertValue(vehicleDetails.intake_pipe) });
     worksheet.addRow({ champ: 'Câble scellé', valeur: convertValue(vehicleDetails.sealed_cable) });
     worksheet.addRow({ champ: 'Étiquette de géolocalisation', valeur: convertValue(vehicleDetails.Geolocation_tag) });
     worksheet.addRow({ champ: 'Support de stationnement', valeur: convertValue(vehicleDetails.parking_stand) });
     worksheet.addRow({ champ: 'Pare-choc remorque', valeur: convertValue(vehicleDetails.bumper_trailer) });
     worksheet.addRow({ champ: 'Twist-lock remorque', valeur: convertValue(vehicleDetails.twist_lock_skeleton) });
     worksheet.addRow({ champ: 'Bâche remorque', valeur: convertValue(vehicleDetails.tarpaulin_trailer) });
     worksheet.addRow({ champ: 'Lattes', valeur: convertValue(vehicleDetails.slats) });
     worksheet.addRow({ champ: 'Moteur de réfrigérateur', valeur: convertValue(vehicleDetails.refrigerator_motor) });
     worksheet.addRow({ champ: 'Niveau de gasoil', valeur: convertValue(vehicleDetails.niv_gasoile) });
     worksheet.addRow({ champ: 'Fenêtres/Miroirs', valeur: convertValue(vehicleDetails.window_mirrors) });
     worksheet.addRow({ champ: 'Essuie-glaces', valeur: convertValue(vehicleDetails.windshield_wipers) });
     worksheet.addRow({ champ: 'Feux/Clignotants', valeur: convertValue(vehicleDetails.lights_turn_signals) });
     worksheet.addRow({ champ: 'Loquet', valeur: convertValue(vehicleDetails.latch) });
     worksheet.addRow({ champ: 'Tableau de bord tracteur', valeur: convertValue(vehicleDetails.tbl_truck) });
     worksheet.addRow({ champ: 'Catadioptres', valeur: convertValue(vehicleDetails.reflector_lights) });
     worksheet.addRow({ champ: 'Feux stop', valeur: convertValue(vehicleDetails.stop_Lights) });
     worksheet.addRow({ champ: 'Roue de secours', valeur: convertValue(vehicleDetails.spare_wheel) });
     worksheet.addRow({ champ: 'Remorque de secours', valeur: convertValue(vehicleDetails.spare_trailer) });
     worksheet.addRow({ champ: 'Pression pneu avant gauche (tracteur)', valeur: vehicleDetails.pression_tr_av_g });
     worksheet.addRow({ champ: 'Pression pneu avant droite (tracteur)', valeur: vehicleDetails.pression_tr_av_d});
     worksheet.addRow({ champ: 'Pression pneu arrière gauche intérieur (tracteur)', valeur: vehicleDetails.pression_tr_ar_g_int});
     worksheet.addRow({ champ: 'Pression pneu arrière droite intérieur (tracteur)', valeur: vehicleDetails.pression_tr_ar_d_int });
     worksheet.addRow({ champ: 'Pression pneu arrière gauche extérieur (tracteur)', valeur: vehicleDetails.pression_tr_ar_g_ext });
     worksheet.addRow({ champ: 'Pression pneu arrière droite extérieur (tracteur)', valeur: vehicleDetails.pression_tr_ar_d_ext });
     worksheet.addRow({ champ: 'Pression pneu remorque gauche problème 1', valeur: vehicleDetails.pression_rm_issue1_g });
     worksheet.addRow({ champ: 'Pression pneu remorque droite problème 1', valeur: vehicleDetails.pression_rm_issue1_d});
     worksheet.addRow({ champ: 'Pression pneu remorque gauche problème 2', valeur: vehicleDetails.pression_rm_issue2_g});
     worksheet.addRow({ champ: 'Pression pneu remorque droite problème 2', valeur: vehicleDetails.pression_rm_issue2_d });
     worksheet.addRow({ champ: 'Pression pneu remorque gauche problème 3', valeur: vehicleDetails.pression_rm_issue3_g });
     worksheet.addRow({ champ: 'Pression pneu remorque droite problème 3', valeur: vehicleDetails.pression_rm_issue3_d });
     worksheet.addRow({ champ: 'Propreté intérieur', valeur: convertValue(vehicleDetails.cleanliness_int) });
     worksheet.addRow({ champ: 'Propreté extérieur', valeur: convertValue(vehicleDetails.cleanliness_ext) });
     worksheet.addRow({ champ: 'Maintenance', valeur: convertValue(vehicleDetails.maintenance) });
     
    worksheet.addRow({ champ: 'Commentaire', valeur: vehicleDetails.comment });
     

    // Génération du fichier Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Création d'un blob à partir du buffer
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Création d'un lien pour télécharger le fichier
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detail_vehicule.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Notification de succès
    toast.success("Le fichier Excel a été téléchargé avec succès.", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  } catch (error) {
    console.error("Erreur lors de la génération du fichier Excel :", error);

    // Notification d'erreur
    toast.error("Une erreur s'est produite lors de la génération du fichier Excel.", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }
};

const handleDownloadConfirm = (format: string) => {
  setSelectedDownloadFormat(format);
  setShowDownloadModal(false);
  // Call your download function here based on the selected format
  if (format === 'excel') {
    downloadExcel();
  } else if (format === 'pdf') {
    //downloadPDF();
  }
};
return (
  <>
    <div className="vehicle-details-container">
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            Détail du Véhicule {id_verif}
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">
          <button
            className="btn btn-outline-secondary  mt-2 mr-1"
            onClick={handleDownloadClick}
          >
            <i className="las la-download"></i>
            Exporter
          </button>
        </div>
      </div>
      <div className="details-content">
        <Tab.Container id="vehicle-details-tabs" defaultActiveKey="general">
          <Nav variant="pills" className="mb-3 custom-nav-pills">
            <Nav.Item>
              <Nav.Link eventKey="general">Général</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tractor-tire">Pneus Tracteur</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="trailer-tire">Pneus Remorque</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="external-condition">État Extérieur</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="others">Autres</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="remarks">Remarques</Nav.Link>
            </Nav.Item>
          </Nav>
          <Col sm={12}>
            <Tab.Content>
              {/* Onglet Général */}
              <Tab.Pane eventKey="general">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Date de création: {toTimestamp(vehicleDetails.creation_date)}</li>
                  <li className="list-group-item">Vérificateur: {vehicleDetails.checker}</li>
                  <li className="list-group-item">Nom Chauffeur sortant: {vehicleDetails.driver_out}</li>
                  <li className="list-group-item">Nom Chauffeur sortant: {vehicleDetails.driver_in}</li>
                  <li className="list-group-item">Km: {vehicleDetails.km}</li>
                  <li className="list-group-item">Heur de Fonctionnement: {vehicleDetails.operating_hours}</li>
                </ul>
              </Tab.Pane>
              {/* Onglet Pneus Tracteur */}
              <Tab.Pane eventKey="tractor-tire">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Matricule tracteur: {vehicleDetails.tractor_number}</li>
                  <li className="list-group-item">Pneu Tracteur avant gauche: {renderCheckIcon(vehicleDetails.pneu_tr_av_g)}</li>
                  <li className="list-group-item">Pneu Tracteur avant droite: {renderCheckIcon(vehicleDetails.pneu_tr_av_d)}</li>
                  <li className="list-group-item">Pnue Tracteur arrière gauche interieur: {renderCheckIcon(vehicleDetails.pneu_tr_ar_g_int)}</li>
                  <li className="list-group-item">Pnue Tracteur arrière gauche exterieur: {renderCheckIcon(vehicleDetails.pneu_tr_ar_d_int)}</li>
                  <li className="list-group-item">Pnue Tracteur arrière droite interieur: {renderCheckIcon(vehicleDetails.pneu_tr_ar_g_ext)}</li>
                  <li className="list-group-item">Pnue Tracteur arrière droite exterieur: {renderCheckIcon(vehicleDetails.pneu_tr_ar_d_ext)}</li>

                  <li className="list-group-item">Pression Pnue Tracteur avant gauche: {vehicleDetails.pression_tr_av_g}</li>
                  <li className="list-group-item">Pression Pnue Tracteur avant droite: {vehicleDetails.pression_tr_av_d}</li>
                  <li className="list-group-item">Pression Pnue Tracteur arrière gauche interieur: {vehicleDetails.pression_tr_ar_g_int}</li>
                  <li className="list-group-item">Pression Pnue Tracteur arrière gauche exterieur: {vehicleDetails.pression_tr_ar_d_int}</li>
                  <li className="list-group-item">Pression Pnue Tracteur arrière droite interieur: {vehicleDetails.pression_tr_ar_g_ext}</li>
                  <li className="list-group-item">Pression Pnue Tracteur arrière droite exterieur: {vehicleDetails.pression_tr_ar_d_ext}</li>

                  {/* Ajoutez d'autres détails spécifiques aux pneus du tracteur ici */}
                </ul>
              </Tab.Pane>

              {/* Onglet Pneus Remorque */}
              <Tab.Pane eventKey="trailer-tire">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Matricule remorque: {vehicleDetails.trailer_number}</li>
                  <li className="list-group-item">Pneu Remorque Issue 1 Gauche: {renderCheckIcon(vehicleDetails.pneu_rm_issue1_g)}</li>
                  <li className="list-group-item">Pneu Remorque Issue 1 Droite: {renderCheckIcon(vehicleDetails.pneu_rm_issue1_d)}</li>
                  <li className="list-group-item">Pneu Remorque Issue 2 Gauche: {renderCheckIcon(vehicleDetails.pneu_rm_issue2_g)}</li>
                  <li className="list-group-item">Pneu Remorque Issue 2 Droite: {renderCheckIcon(vehicleDetails.pneu_rm_issue2_d)}</li>
                  <li className="list-group-item">Pneu Remorque Issue 3 Gauche: {renderCheckIcon(vehicleDetails.pneu_rm_issue3_g)}</li>
                  <li className="list-group-item">Pneu Remorque Issue 3 Droite: {renderCheckIcon(vehicleDetails.pneu_rm_issue3_d)}</li>

                  <li className="list-group-item">Pression Pnue Remorque Issue 1 Gauche: {vehicleDetails.pression_rm_issue1_g}</li>
                  <li className="list-group-item">Pression Pnue Remorque Issue 1 Droite: {vehicleDetails.pression_rm_issue1_d}</li>
                  <li className="list-group-item">Pression Pnue Remorque Issue 2 Gauche: {vehicleDetails.pression_rm_issue2_g}</li>
                  <li className="list-group-item">Pression Pnue Remorque Issue 2 Droite: {vehicleDetails.pression_rm_issue2_d}</li>
                  <li className="list-group-item">Pression Pnue Remorque Issue 3 Gauche: {vehicleDetails.pression_rm_issue3_g}</li>
                  <li className="list-group-item">Pression Pnue Remorque Issue 3 Droite: {vehicleDetails.pression_rm_issue3_d}</li>

                </ul>
              </Tab.Pane>

              {/* Onglet État Extérieur */}
              <Tab.Pane eventKey="external-condition">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Retroviseur Vitres: {renderCheckIcon(vehicleDetails.window_mirrors)}</li>
                  <li className="list-group-item">Pare Brise Essuie Glasses: {renderCheckIcon(vehicleDetails.windshield_wipers)}</li>
                  <li className="list-group-item">feux Cligantants: {renderCheckIcon(vehicleDetails.lights_turn_signals)}</li>
                  <li className="list-group-item">Loquet: {renderCheckIcon(vehicleDetails.latch)}</li>
                  <li className="list-group-item">Feux de Stop Cligantatnts Garde Boue: {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                  <li className="list-group-item">Feux + Stop + Cligantatnts Garde Maraicher: {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                  <li className="list-group-item">Roue de Secours et 2 Cannes de Sécurité (Tracteur): {renderCheckIcon(vehicleDetails.spare_wheel)}</li>
                  <li className="list-group-item">Roue de Secours et 2 Cannes de Sécurité (Tractée): {renderCheckIcon(vehicleDetails.spare_trailer)}</li>
                  <li className="list-group-item">Pipe d'admission Tr: {renderCheckIcon(vehicleDetails.intake_pipe)}</li>
                  <li className="list-group-item">Bache Remorque: {renderCheckIcon(vehicleDetails.tarpaulin_trailer)}</li>
                  <li className="list-group-item">Marche Pied Gauche: {renderCheckIcon(vehicleDetails.truck_step_left)}</li>
                  <li className="list-group-item">Marche Pied Droite: {renderCheckIcon(vehicleDetails.truck_step_right)}</li>
                  <li className="list-group-item">Etat de Propreté de Camion (extérieur)	: {renderCheckIcon(vehicleDetails.cleanliness_ext)}</li>
                  <li className="list-group-item">Etat de Propreté de Camion (intérieure)	: {renderCheckIcon(vehicleDetails.cleanliness_int)}</li>
                </ul>

              </Tab.Pane>

              {/* Onglet Autres */}
              <Tab.Pane eventKey="others">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Triangles / Cales	: {renderCheckIcon(vehicleDetails.triangles_wedges)}</li>
                  <li className="list-group-item">Battery: {renderCheckIcon(vehicleDetails.battery)}</li>
                  <li className="list-group-item">Crique: {renderCheckIcon(vehicleDetails.jack_truck)}</li>
                  <li className="list-group-item">Trousse outils	: {renderCheckIcon(vehicleDetails.tool_kit)}</li>
                  <li className="list-group-item">Mannon de pression		: {renderCheckIcon(vehicleDetails.pressure_gauge)}</li>
                  <li className="list-group-item">Reservoir (fissure, bouchon)			: {renderCheckIcon(vehicleDetails.tank)}</li>
                  <li className="list-group-item">Boite Pharmacie				: {renderCheckIcon(vehicleDetails.first_aid_kit)}</li>
                  <li className="list-group-item">Sangle (03)+, câble scellé					: {renderCheckIcon(vehicleDetails.sealed_cable)}</li>
                  <li className="list-group-item">Etiquette Géocalisation (06)						: {renderCheckIcon(vehicleDetails.Geolocation_tag)}</li>
                  <li className="list-group-item">Pied Parc							: {renderCheckIcon(vehicleDetails.parking_stand)}</li>
                  <li className="list-group-item">Butoir remorque								: {renderCheckIcon(vehicleDetails.bumper_trailer)}</li>
                  <li className="list-group-item">Twis lock squelette							: {renderCheckIcon(vehicleDetails.twist_lock_skeleton)}</li>
                  <li className="list-group-item">Pare brise / Essuie Glasses								: {renderCheckIcon(vehicleDetails.windshield_wipers)}</li>
                  <li className="list-group-item">Cataphote / Feux de gabari									: {renderCheckIcon(vehicleDetails.reflector_lights)}</li>
                  <li className="list-group-item">Papiers								: {renderCheckIcon(vehicleDetails.papers)}</li>

                  <li className="list-group-item">Extincteur (Date d'expiration) : {toTimestamp(vehicleDetails.fire_extinguisher)}</li>
                  <li className="list-group-item">Nombre de lattes							: {vehicleDetails.slats}</li>
                  <li className="list-group-item">Moteur cellule frigo						: {renderCheckIcon(vehicleDetails.refrigerator_motor)}</li>
                  <li className="list-group-item">Niveau gasoil						: {vehicleDetails.niv_gasoile}</li>
                </ul>
              </Tab.Pane>

              {/* Onglet Remarques */}
              <Tab.Pane eventKey="remarks">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Maintenance	: {renderCheckIcon(vehicleDetails.maintenance)}</li>
                  <li className="list-group-item">Autre Commentaire	: {vehicleDetails.comment}</li>
                </ul>
              </Tab.Pane>

            </Tab.Content>
          </Col>

        </Tab.Container>
        <div className="actions mt-4">
          <Button variant="danger" onClick={goToVehicleChecks}>
            Retour
          </Button>
        </div>
      </div>
    </div>
    <Modal
      show={showDownloadModal}
      onHide={() => setShowDownloadModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{translate("Select Download Format")}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {translate("Please select the format to download the data:")}
        <div className="mt-3 d-flex justify-content-center">
          <Button
            variant="success"
            className="mr-2"
            onClick={() => handleDownloadConfirm("excel")}
          >
            Excel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDownloadConfirm("pdf")}
          >
            PDF
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  </>
);
}
