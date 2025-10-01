
import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface MissionReportModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null; 
  title?: string | null; 
  IdUser: number; 
  IdMissionReport: number; 
  updateMissionReportList: () => void | Promise<void>;
}

const MissionReportModal: React.FC<MissionReportModalProps> = ({ show, onHide, status, title,IdUser, IdMissionReport, updateMissionReportList  }) => {
  const { translate } = useTranslate();
  const deletemissionReport = async (id_mission: number, id_user: number) => {

    try { 
      const res = await fetch(`${backendUrl}/api/geop/missionReportManage/delete/${IdMissionReport}/${id_user}`, {
        method: "DELETE",
        mode: "cors",
      });
      onHide();
      if (!res.ok) {
        console.error("Error deleting Mission Report");
        status=null;
        toast.warn("Can't delete Mission Report", {
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
       
        console.error("Mission Report deleted successfully");
        updateMissionReportList();  
        toast.success("Mission Report deleted successfully !", {
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
      console.error("Error deleting mission Report", error);
      toast.warn("Can't deleting Mission Report", {
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
        <button   className="btn btn-outline-success mt-2 mx-auto" onClick={() =>deletemissionReport(IdMissionReport,IdUser)}> 
          {translate("Delete")} 
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MissionReportModal;
