// VehicleModal.tsx

import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface VehicleModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null; 
  title?: string | null; 
  IdUser: number; 
  IdVehicule: number; 
}

const VehicleModal: React.FC<VehicleModalProps> = ({ show, onHide, status, title,IdUser, IdVehicule }) => {
  
  const { translate } = useTranslate();


  const deleteVehicle = async (id_vehicule: number, id_user: number) => {


    try {
      const res = await fetch(`${backendUrl}/api/vehicle/delete/${id_vehicule}/${id_user}`, {
        method: "DELETE",
        mode: "cors",
      });
      onHide();
      if (!res.ok) {
       
  
        console.error("Error deleting vehicle");
        status=null;
        toast.warn("Can't deleting vehicle", {
          position: "bottom-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        
        return;
      }

      if (res.ok) {
       
        console.error("Vehicle deleted successfully");
       
        toast.success("Vehicle deleted successfully !", {
          position: "bottom-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        show=false;
        return;
      }


    } catch (error) {
      console.error("Error deleting vehicle", error);


      toast.warn("Can't deleting vehicle", {
        position: "bottom-right",
        autoClose: 2500, 
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

 
 
  return ( 
    <Modal  show={show} onHide={onHide} centered>
      <Modal.Header closeButton> 
        <Modal.Title>{title || ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body> 
        <p> {status || ""}</p>   
      </Modal.Body> 
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}> 
            {translate("Close")}
        </Button>
        <Button variant="secondary" onClick={() =>deleteVehicle(IdVehicule,IdUser)}> 
          {translate("Delete")} 
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VehicleModal;
