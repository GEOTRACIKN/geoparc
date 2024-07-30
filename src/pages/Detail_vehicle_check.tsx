import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Nav, Tab, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { toTimestamp } from '../functions';


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
  niv_gasoile :number;
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
  pression_rm_issue1_d	: number;
  pression_rm_issue2_g	: number;
  pression_rm_issue2_d	: number;
  pression_rm_issue3_g: number;
  pression_rm_issue3_d: number;
  cleanliness_int: number;
  cleanliness_ext: number;
  maintenance : number;
  comment : string;
}

export function DetailVehicleCheck() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { id_verif } = useParams();
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        console.log("ID vérif dans le front-end:", id_verif);
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

  const renderCheckIcon = (isChecked: number) => {
    return isChecked === 1
      ? <i className="las la-check" style={{ color: 'green' }}></i>
      : <i className="las la-times" style={{ color: 'red' }}></i>;
  };

  const goToVehicleChecks = () => {
    navigate("/vehicles_checks"); // Naviguer vers la page Vehicle_checks
  };

  return (
    <>
      <div className="header-title">
        <h4 className="mb-3" style={{ color: "grey", fontWeight: "bold" }}>
          Détail du Véhicule {id_verif}
        </h4>
      </div>
      <div className="container">
        <Tab.Container id="vehicle-details-tabs" defaultActiveKey="general">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
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
            </Col>
            <Col sm={9}>
              <Tab.Content>
                {/* Onglet Général */}
                <Tab.Pane eventKey="general">             
                      <h5 className="card-title">Informations Générales</h5>
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
                      <h5 className="card-title">Pneus du Tracteur</h5>
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
                 <h5>Pneus de la Remorque</h5>
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
                      <h5 className="card-title">État Extérieur</h5>
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
                      <h5 className="card-title">Autres</h5>
                      <ul className="list-group list-group-flush">
                      <li className="list-group-item">Triangles / Cales	: {renderCheckIcon(vehicleDetails.triangles_wedges)}</li>
                        <li className="list-group-item">Battery: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Crique: {renderCheckIcon(vehicleDetails.jack_truck)}</li>
                        <li className="list-group-item">Trousse outils	: {renderCheckIcon(vehicleDetails.tool_kit)}</li>
                        <li className="list-group-item">Mannon de pression		: {renderCheckIcon(vehicleDetails.pressure_gauge)}</li>
                        <li className="list-group-item">Reservoir (fissure, bouchon)			: {renderCheckIcon(vehicleDetails.tank	)}</li>
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
                      <h5 className="card-title">Remarques</h5>
                      <ul className="list-group list-group-flush">
                      <li className="list-group-item">Maintenance	: {renderCheckIcon(vehicleDetails.maintenance)}</li>
                      <li className="list-group-item">Autre Commentaire	: {vehicleDetails.comment}</li>   
                      </ul>      
                </Tab.Pane>
                
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        
      </div>
      <Button variant="danger" onClick={goToVehicleChecks}>
          Quitter
        </Button>

    </>
  );
}
