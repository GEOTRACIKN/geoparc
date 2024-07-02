import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Nav, Tab, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";


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
  truck_step_right: number;
  truck_step_left: number;
  triangles_wedges: number;
  battery: number;
  fire_extinguisher: number;
  tractor_tire: number;
  trailer_tire: number;
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
  window_mirrors: number;
  windshield_wipers: number;
  lights_turn_signals: number;
  latch: number;
  tbl_truck: number;
  reflector_lights: number;
  stop_Lights: number;
  spare_wheel: number;
  tire_pressure_Tractor: number;
  tire_pressure_trailer: number;
  cleanliness: number;
  maintenance : number;
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
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Informations Générales</h5>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">Date de création: {vehicleDetails.creation_date}</li>
                        <li className="list-group-item">Checker: {vehicleDetails.checker}</li>
                        <li className="list-group-item">Driver Out: {vehicleDetails.driver_out}</li>
                        <li className="list-group-item">Driver In: {vehicleDetails.driver_in}</li>
                        <li className="list-group-item">Km: {vehicleDetails.km}</li>
                        <li className="list-group-item">operating_hours: {vehicleDetails.operating_hours}</li>
                      </ul>
                    </div>
                  </div>
                </Tab.Pane>

                {/* Onglet Pneus Tracteur */}
                <Tab.Pane eventKey="tractor-tire">
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Pneus du Tracteur</h5>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">Tractor Number: {vehicleDetails.tractor_number}</li>
                        <li className="list-group-item">Tractor Tire: {renderCheckIcon(vehicleDetails.tractor_tire)}</li>
                        <li className="list-group-item">Truck Step Right: {renderCheckIcon(vehicleDetails.truck_step_right)}</li>

                        {/* Ajoutez d'autres détails spécifiques aux pneus du tracteur ici */}
                      </ul>
                    </div>
                  </div>
                </Tab.Pane>

                {/* Onglet Pneus Remorque */}
                <Tab.Pane eventKey="trailer-tire">
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Pneus de la Remorque</h5>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">Trailer Number: {vehicleDetails.trailer_number}</li>
                        <li className="list-group-item">Trailer Tire: {renderCheckIcon(vehicleDetails.trailer_tire)}</li>
                        {/* Ajoutez d'autres détails spécifiques aux pneus de la remorque ici */}
                      </ul>
                    </div>
                  </div>
                </Tab.Pane>

                {/* Onglet État Extérieur */}
                <Tab.Pane eventKey="external-condition">
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">État Extérieur</h5>
                      <ul className="list-group list-group-flush">
                      <li className="list-group-item">Retroviseur Vitres: {renderCheckIcon(vehicleDetails.window_mirrors)}</li>
                      <li className="list-group-item">Pare Brise Essuie Glasses: {renderCheckIcon(vehicleDetails.windshield_wipers)}</li>
                      <li className="list-group-item">feux Cligantants: {renderCheckIcon(vehicleDetails.lights_turn_signals)}</li>
                        <li className="list-group-item">Loquet: {renderCheckIcon(vehicleDetails.latch)}</li>
                        <li className="list-group-item">Feux de Stop Cligantatnts Garde Boue: {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                        <li className="list-group-item">Feux + Stop + Cligantatnts Garde Maraicher: {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                        <li className="list-group-item">Roue de Secours et 2 Cannes de Sécurité (Tracteur): {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                        <li className="list-group-item">Roue de Secours et 2 Cannes de Sécurité (Tractée): {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                        <li className="list-group-item">Pipe d'admission Tr: {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                        <li className="list-group-item">Bache Remorque: {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                        <li className="list-group-item">Marche Pied Gauche: {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                        <li className="list-group-item">Marche Pied Droite: {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                        <li className="list-group-item">Etat de Propreté de Camion (extérieur)	: {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                        <li className="list-group-item">Etat de Propreté de Camion (intérieure)	: {renderCheckIcon(vehicleDetails.stop_Lights)}</li>
                        
                        {/* Ajoutez d'autres détails spécifiques à l'état extérieur ici */}
                      </ul>
                    </div>
                  </div>
                </Tab.Pane>

                {/* Onglet Autres */}
                <Tab.Pane eventKey="others">
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Autres</h5>
                      <ul className="list-group list-group-flush">
                      <li className="list-group-item">Triangles / Cales	: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Battery: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Crique: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Trousse outils	: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Mannon de pression		: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Reservoir (fissure, bouchon)			: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Boite Pharmacie				: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Sangle (03)+, câble scellé					: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Etiquette Géocalisation (06)						: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Pied Parc							: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Butoir remorque								: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Twis lock squelette							: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Pare brise / Essuie Glasses								: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Cataphote / Feux de gabari									: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Papiers								: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Extincteur (Date d'expiration)									: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Nombre de lattes							: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Moteur cellule frigo						: {renderCheckIcon(vehicleDetails.battery)}</li>
                        <li className="list-group-item">Niveau gasoil						: {renderCheckIcon(vehicleDetails.battery)}</li>
                      </ul>
                    </div>
                  </div>
                </Tab.Pane>

                {/* Onglet Remarques */}
                <Tab.Pane eventKey="remarks">
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Remarques</h5>
                      <li className="list-group-item">Maintenance	: {renderCheckIcon(vehicleDetails.maintenance)}</li>
                      <li className="list-group-item">Autre commentaire		: {renderCheckIcon(vehicleDetails.maintenance)}</li>
                    </div>
                  </div>
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
