
import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface MissionOrderModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null; 
  title?: string | null; 
  IdUser: number; 
  IdMissionOrder: number; 
  updateMissionOrderList: () => void | Promise<void>;
}

const MissionOrderModal: React.FC<MissionOrderModalProps> = ({ show, onHide, status, title,IdUser, IdMissionOrder, updateMissionOrderList  }) => {
  
  const { translate } = useTranslate();


  const deletemissionOrder = async (id_mission: number, id_user: number) => {


    try { 
      const res = await fetch(`${backendUrl}/api/geop/missionOrderManage/delete/${IdMissionOrder}/${id_user}`, {
        method: "DELETE",
        mode: "cors",
      });
      onHide();
      if (!res.ok) {
       
  
        console.error("Error deleting Mission Order");
        status=null;
        toast.warn("Can't delete Mission Order", {
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
       
        console.log("Mission Order deleted successfully");
        updateMissionOrderList();  
        toast.success("Mission Order deleted successfully !", {
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
      console.error("Error deleting mission Order", error);


      toast.warn("Can't deleting Mission Order", {
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
        <button   className="btn btn-outline-success mt-2 mx-auto" onClick={() =>deletemissionOrder(IdMissionOrder,IdUser)}> 
          {translate("Delete")} 
        </button>
      </Modal.Footer>
    </Modal>
  );
};







export default MissionOrderModal;
