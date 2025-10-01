// VehicleModal.tsx

import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface VehicleModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null; 
  title?: string | null; 
  IdUser: number; 
  IdVehicle: number; 
  updateVehicleList: () => void | Promise<void>;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ show, onHide, status, title,IdUser, IdVehicle,updateVehicleList  }) => {
  
  const { translate } = useTranslate();

  const deleteVehicle = async (id_vehicule: number, id_user: number) => {


    try { 
      const res = await fetch(`${backendUrl}/api/geop/vehicle/delete/${id_vehicule}/${id_user}`, {
        method: "DELETE",
        mode: "cors",
      });
      onHide();
      if (!res.ok) {
       
  
        console.error("Error deleting Vehicle");
        status=null;
        toast.warn("Can't deleting Vehicle", {
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
        updateVehicleList();  
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
      console.error("Error deleting Vehicle", error);


      toast.warn("Can't deleting Vehicle", {
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
        <Modal.Title style={{ fontWeight: 'bold', color: 'grey' }}>{title || ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center"> 
        <p> {status || ""}</p>   
      </Modal.Body>  
      <Modal.Footer>
        <button  className="btn btn-outline-danger mt-2 mx-auto" onClick={onHide}> 
            {translate("Close")}
        </button>
        <button   className="btn btn-outline-success mt-2 mx-auto" onClick={() =>deleteVehicle(IdVehicle,IdUser)}> 
          {translate("Delete")} 
        </button>
      </Modal.Footer>
    </Modal>
  );
};







export default VehicleModal;
