import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";
import { Dropdown } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface UpdateStatusGarageModalProps {
  show: boolean;
  onHide: () => void;
  updateGarageList: () => void | Promise<void>;
  status: string | null;
  title?: string | null;
  id_user: number;
  id_garage: number;
}

interface GarageInterface {
  id_garage: number;
  id_user: number;
  id_intervention: number;
  date_intervention: string;
  date_update: string;
  priority: string;
  status: string;
  immatriculation_vehicule: string;
  odometer: string;
  subject: string;
  client_name: string;
  client_phone_number: string;
  receptionist_name: string;
  service: string;
}


const UpdateStatusGarageModal: React.FC<UpdateStatusGarageModalProps> = ({
  show,
  onHide,
  title,
  id_user,
  id_garage,
  updateGarageList
}) => {
  const { translate } = useTranslate();
  const [loading, setLoading] = useState(true);
  const [garage, setGarage] = useState<GarageInterface>(); // state for vehicle input

  useEffect(() => {
    if (id_garage) {
      getGarage(id_garage);
    }
  }, [id_garage]);


  const getGarage = async (idGarage: number) => {
    try {
      setLoading(false)
      const res = await fetch(`${backendUrl}/api/geop/garage/find`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_garage: idGarage
        }),
      });

      if (!res.ok) {
        console.error("Error fetching garage");
        return;
      }

      const garageData = await res.json();

      console.log(garageData);

      setGarage(garageData[0]);
      setLoading(true);

    } catch (error) {
      console.error("Error fetching garage", error);
    }
  };

  const UpdateStatusGarage = async (id_garage: number, status: string) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/geop/garage/update`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_garage,
            status
          })
        }
      );
      onHide();
      if (!res.ok) {
        console.error("Error update state garage");
        toast.warn(translate("Can't update garage state"), { position: "bottom-right", autoClose: 2500, transition: Bounce });
        return;
      }

      toast.success(translate("Update state garage successful!"), { position: "bottom-right", autoClose: 2500, transition: Bounce });
      // toast.success(translate(status), { position: "bottom-right", autoClose: 2500, transition: Bounce });
      updateGarageList();
    } catch (error) {
      console.error("Error update garage ", error);
      toast.warn(translate("Can't update garage"), { position: "bottom-right", autoClose: 2500, transition: Bounce });
    }
  };

  const [selectedOperation, setSelectedOperation] = useState(translate("Select an operation"));

  const handleSelectOperation = (label: string) => {
    setSelectedOperation(label);

    if (garage?.id_garage) {
    
        const updatedGarage: GarageInterface = { 
            ...garage, 
            status: label 
        };

        setGarage(updatedGarage);

        UpdateStatusGarage(updatedGarage.id_garage, updatedGarage.status);
    }
};

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {title || ""}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-left">
        {loading ? (
          garage && Object.keys(garage).length > 0 ? ( 
            <div className="row">
              <div className="col-md-12 align-items-center mb-2">
                <span>
                  <strong style={{ marginRight: "8px" }}>{translate("Request")} N°:</strong>
                  {garage.id_garage || translate("Not specified")}
                </span>
              </div>
              <div className="col-md-12 d-flex align-items-center mb-2">
                <span>
                  <strong style={{ marginRight: "8px" }}>{translate("Vehicle")}:</strong>
                  {garage.immatriculation_vehicule || translate("Not specified")}
                </span>
              </div>
              <div className="col-md-12 align-items-center mb-3">
                <span>
                  <strong style={{ marginRight: "8px" }}>{translate("Operation")}:</strong>
                  {garage.status || translate("Not specified")}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center">{translate("No garage information available, Please try again.")}</p> 
          )
        ) : (
          <p className="text-center">
            <PropagateLoader color={"#123abc"} loading={loading} size={20} />
          </p>
        )}
      </Modal.Body>

      <Modal.Footer className="text-right">
        <button className="btn btn-outline-danger mt-2 mx-auto" onClick={onHide}>
          {translate("Close")}
        </button>
        <Dropdown className="col-md-8">
          <Dropdown.Toggle variant="secondary"
            id="operationDropdown"
            style={{ background: "#ffff", color: "#000" }}
            disabled={!loading}
          >
            <i className={"fas fa-clock"} style={{ marginRight: "8px", color: "#ffc107" }}></i>
            {selectedOperation}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {[
              { status: "Under diagnosis", icon: "fas fa-stethoscope", color: "#ffc107", label: translate("Under diagnosis") },
              { status: "Under repair", icon: "fas fa-tools", color: "#007bff", label: translate("Under repair") },
              { status: "Closed", icon: "fas fa-check-circle", color: "#28a745", label: translate("Closed") },
              { status: "Request", icon: "fas fa-hourglass-start", color: "#17a2b8", label: translate("Request") },
              { status: "Pending OR", icon: "fas fa-clock", color: "#fd7e14", label: translate("Pending OR") },
              { status: "OR established", icon: "fas fa-check-double", color: "#6f42c1", label: translate("OR established") },
              { status: "Pending part", icon: "fas fa-box-open", color: "#dc3545", label: translate("Pending part") },
              // { status: "Unknown", icon: "fas fa-question-circle", color: "#6c757d", label: translate("Unknown") },
            ].map((item) => (
              <Dropdown.Item
                key={item.status}
                onClick={() => handleSelectOperation(item.status)}
                style={{ display: "flex", alignItems: "center" }}
              >
                <i className={item.icon} style={{ marginRight: "8px", color: item.color }}></i>
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateStatusGarageModal;
