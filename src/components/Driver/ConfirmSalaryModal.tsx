// ConfirmSalaryModal.tsx

import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface ConfirmSalaryModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null; 
  title?: string | null; 
  IdUser: number; 
  //updateConfirmSalaryList: () => void | Promise<void>;
}

const ConfirmSalaryModal: React.FC<ConfirmSalaryModalProps> = ({ show, onHide, status, title,IdUser  }) => {
  
  const { translate } = useTranslate();


  const deleteConfirmSalary = async (id_user: number) => {


    try { 
      const res = await fetch(`${backendUrl}/api/geop/driver/confirm-salary/${id_user}`, {
        method: "GET",
        mode: "cors",
      });
      onHide();
      if (!res.ok) {
       
  
        console.error("Error deleting ConfirmS alary");
        status=null;
        toast.warn("Can't deleting Confirm Salary", {
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
       
        console.error("Confirm Salary  successfully");
      
        toast.success("Confirm Salary  successfully !", {
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
      console.error("Error  Confirm Salary", error);


      toast.warn("Can't Confirm Salary", {
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
        <button   className="btn btn-outline-success mt-2 mx-auto" onClick={() =>deleteConfirmSalary(IdUser)}> 
          {translate("Confirm!")} 
        </button>
      </Modal.Footer>
    </Modal>
  );
};







export default ConfirmSalaryModal;
