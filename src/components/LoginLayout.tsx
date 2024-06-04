 
 import React, { useEffect, useState } from "react";
 import Button from "react-bootstrap/Button";
 import Modal from "react-bootstrap/Modal";
 import axios from "axios";
 import Cookies from 'universal-cookie';

 import { useNavigate , useLocation} from "react-router-dom";

 const backendUrl = process.env.REACT_APP_BACKEND_URL;


 interface LogoutButtonProps {
   onLogout: () => void;
 }
 
 const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
   const [showConfirmation, setShowConfirmation] = useState(false);
   const idUser = localStorage.getItem("GeopUserID");
   const navigate = useNavigate();
   const cookies = new Cookies();


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
  
    const cookies = new Cookies();
    cookies.remove("jwtToken");
  
    navigate("/login");
  };
  
   const handleCloseConfirmation = () => setShowConfirmation(false);
   const handleShowConfirmation = () => setShowConfirmation(true);
 
   useEffect(() => {
     const inactivityTimeout = setTimeout(handleLogout, 1800000); 
 
     return () => {
       clearTimeout(inactivityTimeout); // Annuler le minuteur si le composant est démonté
     };
   }, []);
 
   return (
     <div>
       <Button variant="danger" onClick={handleShowConfirmation}>
         Logout
       </Button>
 
       <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
         <Modal.Header closeButton>
           <Modal.Title>Logout Confirmation</Modal.Title>
         </Modal.Header>
         <Modal.Body>
         Are you sure you want to log out?
         </Modal.Body>
         <Modal.Footer>
           <Button variant="secondary" onClick={handleCloseConfirmation}>
           Cancel
           </Button>
           <Button variant="danger" onClick={handleLogout}>
           Logout
           </Button>
         </Modal.Footer>
       </Modal>
     </div>
   );
 };
 
 export default LogoutButton;
 
  