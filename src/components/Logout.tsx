import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Cookies from 'universal-cookie';
import axios from "axios";
import { useTranslate } from "../hooks/LanguageProvider";
import { useNavigate , useLocation, redirect} from "react-router-dom";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface LogoutButtonProps {
  onLogout: () => void;
  activeMenu: string;
  title: string;
  margin: string;
}

const Logout: React.FC<LogoutButtonProps> = ({ onLogout, activeMenu, title, margin }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const cookies = new Cookies();

 const idUser = localStorage.getItem("GeopUserID");

 const handleLogout = async () => {
  const GeoploginTime = localStorage.getItem("GeoploginTime");

  if (GeoploginTime !== null) {
    const formattedDateTime = new Date(parseInt(GeoploginTime));
    formattedDateTime.setHours(formattedDateTime.getHours() + 1); // Adding one hour
    const last_auth = formattedDateTime.toISOString().slice(0, 19).replace('T', ' ');
    console.log(last_auth);

    const logoutTime = new Date().getTime(); // Get current time
    const duration = logoutTime - parseInt(GeoploginTime, 10); // Calculate duration

    // Convert duration to hours, minutes, and seconds
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);

    const lastAuthDuration = `${hours}h ${minutes}m ${seconds}s`;

    console.log("Duration of connection:", lastAuthDuration);

    try {
      await axios.put(`${backendUrl}/api/update-auth/${idUser}`, {
        last_auth_duration: lastAuthDuration,
        last_auth: last_auth // Pass last_auth value
      });
      console.log('Authentication information updated successfully');
    } catch (error) {
      console.error('Error updating authentication information:', error);
    }
  }

  // Proceed with logout actions
  localStorage.removeItem("authToken");
  localStorage.removeItem("GeoploginTime");
  localStorage.removeItem("GeopUserID");
  localStorage.removeItem("userPermissions");
  cookies.remove("jwtToken");
  window.location.href ="https://geotrackin.com";
};

  
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "logoutEvent") {
        // La déconnexion s'est produite, déconnectez l'utilisateur
        handleLogout();
      }
    };
  
    // Ajouter un écouteur d'événement de stockage local
    window.addEventListener("storage", handleStorageChange);
  
    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Gérer l'événement unload pour la déconnexion
    const handleUnload = () => {
      handleLogout();
    };

    window.addEventListener("unload", handleUnload);

    // Gérer la déconnexion après 30 minutes d'inactivité
    const inactivityTimeout = setTimeout(() => {
      handleLogout();
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      window.removeEventListener("unload", handleUnload);
      clearTimeout(inactivityTimeout);
    };
  }, []);

  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = () => setShowConfirmation(true);

  useEffect(() => {
    const inactivityTimeout = setTimeout(handleLogout, 30 * 60 * 1000); //  30 minutes

    return () => {
      clearTimeout(inactivityTimeout); // Annuler le minuteur si le composant est démonté
    };
  }, []);

  const handleClick = (event: any) => {
    event.preventDefault();
    console.log('Link clicked, but page did not reload.');
  };


 
  return (
    <>
      <li onClick={handleShowConfirmation} style={{cursor: "pointer"}}>
      <a className="svg-icon nav-link" onClick={handleClick}>
        <i className="las la-sign-out-alt"></i>
        <span className={`${margin}  ${activeMenu}`}>{title}</span>
        </a>
      </li>

      <Modal show={showConfirmation} onHide={handleCloseConfirmation} centered>
        <Modal.Header closeButton>
          <Modal.Title>{translate("Logout")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="popup text-left">
            <div className="content create-workform bg-body">
              <div className="pb-3">
                <p className="mb-2" style={{ textAlign: "center" }}>
                 {translate("Are you sure you want to log out?")}
                </p>
              </div> 
              <div className="col-lg-12 mt-4">
                <div className="d-flex flex-wrap align-items-ceter justify-content-center">
                  <Button variant="secondary" className="mr-4" onClick={handleCloseConfirmation}>
                    {translate("Cancel")}
                  </Button>
                  <Button variant="outline-primary" onClick={handleLogout}>
                    {translate("Logout")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Logout;
