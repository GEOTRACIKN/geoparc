import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import SelectPark from "./SelectPark";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface DriverAssignmentModalProps {
  show: boolean;
  onHide: () => void;
  updateDriverList: () => void | Promise<void>;
  status: string | null;
  title?: string | null;
  id_user: number;
  id_driver: number;
  id_parc: number;
}

interface ParkInterface {
  id_parc: number;
  nom_parc: string;
}

interface OptionType {
  value: number;
  label: string;
}

const DriverAssignmentModal: React.FC<DriverAssignmentModalProps> = ({
  show,
  onHide,
  status,
  title,
  id_user,
  id_driver,
  id_parc,
  updateDriverList
}) => {
  const { translate } = useTranslate();
  const [parksOptions, setParksOptions] = useState<OptionType[]>([]);
  const [selectedPark, setSelectedPark] = useState<OptionType | null>(null);

  useEffect(() => {
    if (id_user) {
      getParks(id_user);
    }
  }, [id_user]);

  useEffect(() => {
    if (id_parc) {
      const park = parksOptions.find((p) => p.value === id_parc);
      setSelectedPark(park || null);
    } else {
      setSelectedPark(null);
    }
  }, [id_parc, parksOptions]);

  const getParks = async (userId: number) => {
    try {
      const res = await fetch(`${backendUrl}/api/geop/park/options/${userId}`, {
        mode: "cors",
      });

      if (!res.ok) {
        console.error("Error fetching parks");
        return;
      }

      const parkData = await res.json();
      const parkOptionsData: OptionType[] = parkData.map((park: ParkInterface) => ({
        value: park.id_parc,
        label: park.nom_parc || "Unknown",
      }));

      setParksOptions(parkOptionsData);
    } catch (error) {
      console.error("Error fetching parks", error);
    }
  };

  const handleParkChange = (selectedOption: OptionType | null) => {
    setSelectedPark(selectedOption);
  };

  const driverAssignment = async (
    id_parc: number,
    id_driver: number,
    id_user: number
  ) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/geop/driver/assignment/${id_parc}/${id_driver}/${id_user}`,
        {
          method: "GET",
          mode: "cors",
        }
      );
      onHide();
      if (!res.ok) {
        console.error("Error driver assignment");
        status = null;
        toast.warn("Can't  Driver Assignment", {
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

      toast.success("Driver assignment to park successfully!", {
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
      
      updateDriverList(); 
     

    } catch (error) {
      console.error("Error assignment driver ", error);
      toast.warn("Can't assignment driver to park", {
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
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: "bold", color: "grey" }}>
          {title || ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>{status || ""}</p>
        <SelectPark
          controlId="id_parc"
          label={translate("Park")}
          icon="parking"
          options={parksOptions}
          valueType={selectedPark || { value: 0, label: translate("None") }}
          onChange={handleParkChange}
          placeholder={translate("Select a park")}
          noOptionsMessage={translate("No parks available")}
          name="park-select"
        />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-danger mt-2 mx-auto" onClick={onHide}>
          {translate("Close")}
        </button>
        <button
          className="btn btn-outline-success mt-2 mx-auto"
          onClick={() => driverAssignment(selectedPark?.value || 0, id_driver, id_user)}
        >
          {translate("Update")}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DriverAssignmentModal;
