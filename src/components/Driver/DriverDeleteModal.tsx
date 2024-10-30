// DriverModal.tsx

import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface DriverModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null; 
  title?: string | null; 
  IdUser: number; 
  IdDriver: number; 
  updateDriverList: () => void | Promise<void>;
}

const DriverModal: React.FC<DriverModalProps> = ({ show, onHide, status, title,IdUser, IdDriver,updateDriverList  }) => {
  
  const { translate } = useTranslate();


  const deletedriver = async (id_vehicule: number, id_user: number) => {


    try { 
      const res = await fetch(`${backendUrl}/api/geop/driver/delete/${IdDriver}/${id_user}`, {
        method: "DELETE",
        mode: "cors",
      });
      onHide();
      if (!res.ok) {
       
  
        console.error("Error deleting driver");
        status=null;
        toast.warn("Can't deleting driver", {
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
       
        console.error("driver deleted successfully");
        updateDriverList();  
        toast.success("driver deleted successfully !", {
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
      console.error("Error deleting driver", error);


      toast.warn("Can't deleting driver", {
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
        <button   className="btn btn-outline-success mt-2 mx-auto" onClick={() =>deletedriver(IdDriver,IdUser)}> 
          {translate("Delete")} 
        </button>
      </Modal.Footer>
    </Modal>
  );
};







export default DriverModal;
