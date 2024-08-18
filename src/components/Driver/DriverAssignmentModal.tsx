// DriverAssignmentModal.tsx

import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslate } from "../LanguageProvider";
import { Bounce, toast } from "react-toastify";
import SelectPark from "./SelectPark";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface DriverAssignmentModalProps {
  show: boolean;
  onHide: () => void;
  status: string | null;
  title?: string | null;
  id_user: number;
  id_parc: number;
  id_driver: number;
}


interface UserInterface {
  id_user: number;
  nom_user: string;
  prenom_user: string;
}


const DriverAssignmentModal: React.FC<DriverAssignmentModalProps> = ({ show, onHide, status, title, id_user, id_driver, id_parc }) => {
  const { translate } = useTranslate();
  const [usersOptions, setUsersOptions] = useState<any[]>([{ value: "Aucun", label: "Aucun" },]);
  const [Users, setUsers] = useState<UserInterface[]>([]);




  useEffect(() => {
    if (id_user) {
      getUser(id_user);
    }
  }, [id_user]);


  const findParkById = (
    id: number
  ): { value: number; label: string } | undefined => {
    const foundUser = Users.find((user: any) => user.id_user === id);

    if (foundUser) {
      const { id_user, nom_user, prenom_user } = foundUser;
      return { value: id_user, label: `${nom_user} ${prenom_user || ""}` };
    }

    return undefined;
  };

  const getUser = async (userId: any) => {
    try {
      const res = await fetch(`${backendUrl}/api/users/find/${userId}`, {
        mode: "cors",
      });

      if (!res.ok) {
        console.error("Erreur lors de la récupération des utilisateurs");
        return;
      }

      const usersData = await res.json();
      setUsers(usersData);

      const usersOptionsData = usersData.map((user: any) => ({
        value: user.id_user,
        label: `${user.nom_user} ${user.prenom_user || ""}`,
      }));

      setUsersOptions(usersOptionsData);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    }
  };


  const handleParkChange = (selectedOption: any) => {
    console.log(selectedOption)
  };


  const driverAssignment = async (id_parc: number, id_driver: number, id_user: number) => {

    try {
      const res = await fetch(`${backendUrl}/api/geop/driver/assignment/${id_parc}/${id_driver}/${id_user}`, {
        method: "DELETE",
        mode: "cors",
      });
      onHide();
      if (!res.ok) {


        console.error("Error deleting DriverAssignment");
        status = null;
        toast.warn("Can't deleting DriverAssignment", {
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

        console.error("DriverAssignment deleted successfully");

        toast.success("DriverAssignment deleted successfully !", {
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

        show = false;
        return;
      }


    } catch (error) {
      console.error("Error deleting DriverAssignment", error);


      toast.warn("Can't deleting DriverAssignment", {
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
        <Modal.Title style={{ fontWeight: 'bold', color: 'grey' }}>{title || ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p> {status || ""}</p>
        <SelectPark
          controlId="Prak"
          name={"Prak"}
          label={translate("Prak")} 
          icon="user"
          options={usersOptions}
          valueType={{
            value: id_user,
            label: findParkById(id_user || 0)?.label || translate("None"),
          }}
          onChange={handleParkChange}

        />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-danger mt-2 mx-auto" onClick={onHide}>
          {translate("Close")}
        </button>
        <button className="btn btn-outline-success mt-2 mx-auto" onClick={() => driverAssignment(id_parc, id_driver, id_user)}>
          {translate("Updates")}
        </button>
      </Modal.Footer>
    </Modal>
  );
};



export default DriverAssignmentModal;