import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";
import { Card } from "react-bootstrap";
import { formatDateToTimestamp } from "../../utilities/functions";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface DriverDetailsModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null;
  title?: string | null;
  IdUser: number;
  IdDriver: number;
}

interface DriverInterface {
  id_conducteur?: number | null;
  nom_conducteur: string | null;
  prenom_conducteur: string | null;
  date_naissance_conducteur: string | null;
  premis_conducteur: string | null;
  nationalite_conducteur: string | null;
  adresse_conducteur: string | null;
  email_conducteur: string | null;
  telephone_conducteur: string | null;
  piece_identite_conducteur: string | null;
  numero_piece_identite_conducteur: string | null;
  date_delivrance_pi_conducteur: string | null;
  lieu_delivrance_pi_conducteur: string | null;
  numero_permis_conducteur: string | null;
  date_delivrance_permis_conducteur: string | null;
  lieu_delivrance_permis_conducteur: string | null;
  id_sousParc: number | null;
  situation_conducteur: string | null;
  prenom_pere_conducteur: string | null;
  nom_mere_conducteur: string | null;
  prenom_mere_conducteur: string | null;
  role_conducteur: string | null;
  service_conducteur: string | null;
  sexe_conducteur: string | null;
  date_expir_permis_conducteur: string | null;
  total_salaire_conducteur: string | null;
  code_conducteur: string | null;
  id_user: string | null;
  service: number | null;
  type_permis: string | null;
  groupe_sanguin: string | null;
}

const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({
  show,
  onHide,
  status,
  title,
  IdUser,
  IdDriver,
}) => {
  const { translate } = useTranslate();
  const [driver, setDriver] = useState<DriverInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [fillPercentage, setFillPercentage] = useState(0);

  const calculateFillPercentage = (driver: DriverInterface) => {
    const totalFields = 15;
    let filledFields = 0;

    if (driver.nom_conducteur) filledFields++;
    if (driver.prenom_conducteur) filledFields++;
    if (driver.date_naissance_conducteur) filledFields++;
    if (driver.premis_conducteur) filledFields++;
    if (driver.date_delivrance_permis_conducteur) filledFields++;
    if (driver.email_conducteur) filledFields++;
    if (driver.telephone_conducteur) filledFields++;
    if (driver.nationalite_conducteur) filledFields++;
    if (driver.adresse_conducteur) filledFields++;
    if (driver.piece_identite_conducteur) filledFields++;
    if (driver.numero_piece_identite_conducteur) filledFields++;
    if (driver.date_delivrance_pi_conducteur) filledFields++;
    if (driver.lieu_delivrance_pi_conducteur) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const fetchDriverDetails = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/geop/driver/find/${IdDriver}`, {
        method: "GET",
        mode: "cors",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch driver details");
      }

      const data = await res.json();
      setDriver(data);
      setFillPercentage(calculateFillPercentage(data));

      toast.success(translate("Get detail driver successfully!"), {
        position: "bottom-right",
        autoClose: 2500,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error fetching driver details:", error);
      toast.warn(translate("Can't show details driver"), {
        position: "bottom-right",
        autoClose: 2500,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && IdDriver && IdUser) {
      setLoading(true);
      fetchDriverDetails();
    }
  }, [show, IdDriver, IdUser]);

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="xl" className="custom-modal-width">
      <Modal.Header closeButton>
        <h5 style={{ }}>{title || ""} Percentage <span className="badge bg-info">{fillPercentage}%</span></h5>
      </Modal.Header>
      <Modal.Body className="text-center">
        {loading ? (
          <p>{translate("Loading driver details...")}</p>
        ) : driver ? (
          <div className="row text-left">
          {/* Informations Générales */}
          <div className="col-12 row border-bottom pb-3">
            <h5>{translate("General Information")} :</h5>
            <div className="col-6">
              <p>
                <i className="fas fa-user" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("First name")} :</strong> {driver.nom_conducteur || translate("None")}
              </p>
              <p>
                <i className="fas fa-user-circle" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Last name")} :</strong> {driver.prenom_conducteur || translate("None")}
              </p>
              <p>
                <i className="fas fa-id-badge" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Identification code")} :</strong> {driver.code_conducteur || translate("None")}
              </p>
              <p>
                <i className="fas fa-briefcase" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Function")} :</strong> {driver.role_conducteur || translate("None")}
              </p>
            </div>
            <div className="col-6">
              <p>
                <i className="fas fa-map-marker-alt" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Address")} :</strong> {driver.adresse_conducteur || translate("None")}
              </p>
              <p>
                <i className="fas fa-phone" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Phone")} :</strong> {driver.telephone_conducteur || translate("None")}
              </p>
              <p>
                <i className="fas fa-envelope" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Email")} :</strong> {driver.email_conducteur || translate("None")}
              </p>
            </div>
          </div>
          <div className="col-12 row p-3">
            {/* Pièce d'identité */}
            <div className="mb-3 col-6">
              <h5>{translate("Identity Document")} :</h5>
              <p>
                <i className="fas fa-id-card" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Type of document")} :</strong> {driver.piece_identite_conducteur || translate("None")}
              </p>
              <p>
                <i className="fas fa-file-alt" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Document number")} :</strong> {driver.numero_piece_identite_conducteur || translate("None")}
              </p>
              <p>
                <i className="fas fa-calendar-alt" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Date of issue")} :</strong> {driver.date_delivrance_pi_conducteur || translate("None")}
              </p>
              <p>
                <i className="fas fa-map-marker-alt" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Place of issue")} :</strong> {driver.lieu_delivrance_pi_conducteur || translate("None")}
              </p>
            </div>
        
            {/* Permis de conduire */}
            <div className="mb-3 col-6">
              <h5>{translate("Driving License")} :</h5>
              <p>
                <i className="fas fa-car" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Type of license")} :</strong> {driver.premis_conducteur || translate("None")}
              </p>
              <p>
                <i className="fas fa-id-card" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("License number")} :</strong> {driver.numero_permis_conducteur || translate("None")}
              </p>
              <p>
                <i className="fas fa-calendar-alt" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Date of issue")} :</strong> {driver.date_delivrance_permis_conducteur ? formatDateToTimestamp(driver.date_delivrance_permis_conducteur) : translate("None")}
              </p>
              <p>
                <i className="fas fa-calendar-times" style={{ color: '#f7ac35' }}></i>
                <strong> {translate("Expiration date")} :</strong> {driver.date_expir_permis_conducteur ? formatDateToTimestamp(driver.date_expir_permis_conducteur) : translate("None")}
              </p>
            </div>
          </div>
        </div>
        
        
        ) : (
          <p>{translate("No driver details available.")}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-danger " onClick={onHide}>
          {translate("Close")}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DriverDetailsModal;
