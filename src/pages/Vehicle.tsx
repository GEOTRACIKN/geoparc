// Vehicle.tsx
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Tabs, Tab, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import SelectGroup from "../components/Vehicle/SelectGroup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VehicleModal from "../components/Vehicle/VehicleModal";
import { Bounce, toast, ToastOptions } from 'react-toastify';


const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface VehicleInterface {
  id_vehicule: number;
  category_vehicule: string;
  couleur_vehicule: string;
  id_groupe: number;
  id_user: number;
  immatriculation_vehicule: string;
  num_porte_vehicule: string;
  vehicule_type: string;
}


interface UserInterface {
  id_user: number;
  nom_user: string;
  prenom_user: string;
}

interface GroupInterface {
  id_groupe: number;
  nom_groupe: string;
}

const Vehicle: React.FC = () => {
  const { id_vehicule } = useParams<{ id_vehicule?: string }>();
  const { translate } = useTranslate();
  const [acquisitionDateTime, setAcquisitionDateTime] = useState(new Date());
  const userID = localStorage.getItem("userID");
  const [Vehicle, setVehicle] = useState<VehicleInterface>({
    id_vehicule: 0, 
    category_vehicule: "PL", 
    couleur_vehicule: "#000", 
    id_groupe: 1, 
    id_user: 1, 
    immatriculation_vehicule: "", 
    num_porte_vehicule: "", 
    vehicule_type: "Tracteur", 
  });

  const [Users, setUsers] = useState<UserInterface[]>([]);
  const [groups, setGroups] = useState<GroupInterface[]>([]); 
  const [typesOptions, setTypesOptions] = useState<any[]>([{ value: "Aucun", label: "Aucun" }]);
  const [groupsOptions, setGroupsOptions] = useState<any[]>([ { value: "Aucun", label: "Aucun" },]);
  const [usersOptions, setUsersOptions] = useState<any[]>([ { value: "Aucun", label: "Aucun" }, ]);
  const [modalStatus, setModalStatus] = useState<string | null>(null);



  useEffect(() => {
    if (userID) {
      getUser(userID);
    }

    if (userID) {
      getGroup(userID);
     
    }
  }, []);

  const getGroup = async (userId: any) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/groups-vehicule/groups/${userId}`,
        { mode: "cors" }
      );

      if (!res.ok) {
        console.error("Erreur lors de la récupération des groupes");
        return;
      }

      const groupsData = await res.json();
      setGroups(groupsData);

      const groupsOptionsData = groupsData.map((group: any) => ({
        value: group.id_groupe,
        label: `${group.nom_groupe || ""}`,
      }));

      setGroupsOptions(groupsOptionsData);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    }
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

  const updateVehicle = async (vehicle: VehicleInterface) => {

    const vehicleDatas = {
      category_vehicule: vehicle.category_vehicule,
      couleur_vehicule: vehicle.couleur_vehicule,
      id_groupe: vehicle.id_groupe,
      id_user: vehicle.id_user,
      immatriculation_vehicule: vehicle.immatriculation_vehicule,
      num_porte_vehicule: vehicle.num_porte_vehicule,
      vehicule_type: vehicle.vehicule_type,
      id_vehicule: vehicle.id_vehicule,
    };

    try { 

      const res = await fetch(`${backendUrl}/api/vehicle/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(vehicleDatas),
      });

      if (!res.ok) {

        toast.warn(translate("Can't updating vehicle"), {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true, 
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        console.error("Error updating vehicle");

        return;
      }


      if (res.ok) {

        console.log("Vehicle updated successfully");
        toast.success(translate("Vehicle updated successfully"), { 
          position: "bottom-right",
          autoClose: 2400,
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

    } catch (error) {
 
      toast.warn(translate("Can't updating vehicle"), {  
        position: "bottom-right",
        autoClose: 2400,
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

  const createVehicle = async (vehicle: VehicleInterface) => {
    try {
      const vehicleDatas = {
        id_vehicule: vehicle.id_vehicule,
        category_vehicule: vehicle.category_vehicule,
        couleur_vehicule: vehicle.couleur_vehicule,
        id_groupe: vehicle.id_groupe,
        id_user: vehicle.id_user,
        immatriculation_vehicule: vehicle.immatriculation_vehicule,
        num_porte_vehicule: vehicle.num_porte_vehicule,
        vehicule_type: vehicle.vehicule_type,
      };

      const res = await fetch(`${backendUrl}/api/vehicle/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(vehicleDatas),
      });

      if (!res.ok) {
        
        console.log("Error creating vehicle");

        toast.warn(translate("Can't create a vehicle"), {
          position: "bottom-right",
          autoClose: 2400,
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
        console.log("Vehicle create successfully");
     

        toast.success(translate("Vehicle created successfully !"), {
          position: "bottom-right",
          autoClose: 2400,
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

    } catch (error) {
      
      console.error("Can't create vehicle", error);

      toast.warn(translate("Can't create a vehicle"), {  
        position: "bottom-right",
        autoClose: 2400,
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

 


  useEffect(() => {
    if (id_vehicule) {
      getVehicle();
    }
  }, [id_vehicule]);

  const getVehicle = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/vehicle/find/${id_vehicule}`, {
        mode: "cors",
      });

      if (!res.ok) {
        console.error("Erreur lors de la récupération du véhicule");
        return;
      }

      const data = await res.json();
      setVehicle({
        id_vehicule: data.id_vehicule,
        category_vehicule: data.category_vehicule,
        couleur_vehicule: data.couleur_vehicule,
        id_groupe: data.id_groupe,
        id_user: data.id_user,
        immatriculation_vehicule: data.immatriculation_vehicule,
        num_porte_vehicule: data.num_porte_vehicule,
        vehicule_type: data.vehicule_type,
      });


   
  

      try {
        const res = await fetch(
          `${backendUrl}/api/vehicle/type-options/${data.category_vehicule}`,
          { mode: "cors" }
        );
  
        if (!res.ok) {
          console.error("Erreur lors de la récupération des groupes");
          return;
        }
  
        const typesData = await res.json();
        const typesOptionsData = typesData.model.split(",").map((type: any) => ({
          value: type,
          label: `${type || ""}`,
        }));
  
        setTypesOptions(typesOptionsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }


    } catch (error) {
      console.error("Erreur lors de la récupération du véhicule", error);
    }
  };

  const handleVehicleChange = (updatedValues: Partial<VehicleInterface>) => {
    setVehicle((prevData) => ({
      ...prevData!,
      ...updatedValues,
    }));
  };

  const handleUserChange = (selectedOption: any) => {
    setVehicle((prevData: VehicleInterface | undefined) => {
      const newData: VehicleInterface = { ...prevData! };
      newData.id_user = selectedOption.value;

      return newData;
    });
  };

  const handleGroupChange = (selectedOption: any) => {
    setVehicle((prevData: VehicleInterface | undefined) => {
      const newData: VehicleInterface = { ...prevData! };
      newData.id_groupe = selectedOption.value;

      return newData;
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setVehicle((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };



  const handleCategoryChange = async (selectedOption: any) => {
    
    setVehicle((prevData) => ({
      ...prevData!,
      category_vehicule: selectedOption.value,
    }));

    try {
      const res = await fetch(
        `${backendUrl}/api/vehicle/type-options/${selectedOption.value}`,
        { mode: "cors" }
      );

      if (!res.ok) {
        console.error("Erreur lors de la récupération des groupes");
        return;
      }

      const typesData = await res.json();
      const typesOptionsData = typesData.model.split(",").map((type: any) => ({
        value: type,
        label: `${type || ""}`,
      }));

      setTypesOptions(typesOptionsData);
    } catch (error) {
      console.error("Erreur lors de la récupération des types", error);
    }
  };

  const handleTypeChange = async (selectedOption: any) => {
    setVehicle((prevData) => ({
      ...prevData!,
      vehicule_type: selectedOption.value,
    }));
  };


  const categoryOptions = [
    { value: "Aucun", label: "Aucun" },
    { value: "PL", label: "PL" },
    { value: "VL", label: "VL" },
    { value: "Engin", label: "Engin" },
    { value: "Outils", label: "Outils" },
    { value: "Utilitaires", label: "Utilitaires" },
    { value: "Autre", label: "Autre" },
  ];



  const findUserById = (
    id: number
  ): { value: number; label: string } | undefined => {
    const foundUser = Users.find((user) => user.id_user === id);

    if (foundUser) {
      const { id_user, nom_user, prenom_user } = foundUser;
      return { value: id_user, label: `${nom_user} ${prenom_user || ""}` };
    }

    return undefined;
  };

  const findGroupById = (
    id: number
  ): { value: number; label: string } | undefined => {
    const foundGroup = groups.find((group) => group.id_groupe === id);

    if (foundGroup) {
      const { id_groupe, nom_groupe } = foundGroup;
      return { value: id_groupe, label: `${nom_groupe || ""}` };
    }

    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const closeModal = () => {
    setModalStatus(null);
  };

  useEffect(() => {
    if (modalStatus === 'success') {

      const timeoutId = setTimeout(() => {
        setModalStatus(null);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [modalStatus]);



  return (
    <>
      <div className="row">
        <h4 className="col-sm-6 col-md-6">
          <i className="las la-car" title="Edit vehicle"></i>
          {id_vehicule ? translate("Edit vehicle") : translate("New vehicle")}
        </h4>
      </div>
      <div className="row">
        <div className="col-sm-6 col-md-6"> 
          <h5>{translate("Configuring")}</h5>
          <Form onSubmit={handleSubmit} style={{ padding: "20px" }}>
            <Form.Group controlId="immatriculation_vehicule">
              <Row>
                <Col column sm="4" md="4" lg="4">
                  <Form.Label>
                    {translate("Matriculation")} {translate("Vehicle")}
                  </Form.Label>
                </Col>
                <Col sm="8" md="8" lg="8">
                  <Form.Control
                    type="text"
                    placeholder="Saisir l'immatriculation du véhicule"
                    name="immatriculation_vehicule"
                    value={Vehicle?.immatriculation_vehicule ?? ""}
                    onChange={(e) =>
                      handleVehicleChange({
                        immatriculation_vehicule: e.target.value,
                      })
                    }
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group
              controlId="num_porte_vehicule"
              style={{ marginTop: "20px" }}
            >
              <Row>
                <Col column sm="4" md="4" lg="4">
                  <Form.Label>{translate("Door number")} </Form.Label> 
                </Col>
                <Col sm="8" md="8" lg="8">
                  <Form.Control
                    type="text"
                    placeholder="Saisir le numéro porte du véhicule"
                    name="num_porte_vehicule"
                    value={Vehicle?.num_porte_vehicule}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group
              controlId="acquisitionDateTime"
              style={{ margin: "20px 0 20px 0" }}
            >
              <Row>
                <Col column sm="4" md="4" lg="4">
                  <Form.Label> {translate("Acquisition date")}</Form.Label> 
                </Col>
                <Col sm="8" md="8" lg="8">
                  <div className="input-group">
                    <DatePicker
                      selected={acquisitionDateTime}
                      onChange={(date) => setAcquisitionDateTime(date as Date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      customInput={
                        <Form.Control
                          type="text"
                          placeholder="Select Date and Time"
                        />
                      }
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="las la-calendar-alt"></i>
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form.Group>
 
            <SelectGroup
              controlId="user"
              label={translate("User")}
              icon="user"
              options={usersOptions}
              valueType={{
                value: Vehicle?.id_user,
                label: findUserById(Vehicle?.id_user || 0)?.label || translate("None"),
              }}
              onChange={handleUserChange}
            />

            <SelectGroup
              controlId="Group"
              label={translate("Group")}
              icon="users"
              options={groupsOptions}
              valueType={{
                value: Vehicle?.id_groupe || translate("none"), 
                label: findGroupById(Vehicle?.id_groupe || 0)?.label || translate("None"), 
              }}
              onChange={handleGroupChange}
            />

            <SelectGroup
              controlId="category_vehicule"
              label={translate("Category")+" "+translate("Vehicle")}
              icon="search"
              options={categoryOptions}
              valueType={{
                value: Vehicle?.category_vehicule || translate("none"),
                label: Vehicle?.category_vehicule,
              }}
              onChange={handleCategoryChange}
            />

            <SelectGroup
              controlId="type_vehicule"
              label={translate("Vehicle type")}
              icon="car"
              options={typesOptions}
              valueType={{
                value: Vehicle?.vehicule_type ||  translate("none"),
                label: Vehicle?.vehicule_type || "",
              }}
              onChange={handleTypeChange}
            />

            <Form.Group controlId="formGroupColor" style={{ margin: "20px 0" }}>
              <Row>
                <Col column sm="4" md="4" lg="4">
                  {" "}
                  <Form.Label>{translate("Color")}</Form.Label>
                </Col>
                <Col sm="8" md="8" lg="8">
                  <Form.Control
                    type="color"
                    value={Vehicle?.couleur_vehicule}
                    onChange={(e) =>
                      handleVehicleChange({
                        couleur_vehicule: e.target.value,
                      })
                    }
                    required
                    style={{  width: "80px",float: "left", }}
                  />
                  <Form.Control
                    type="text"
                    value={Vehicle?.couleur_vehicule}
                    onChange={(e) =>
                      handleVehicleChange({
                        couleur_vehicule: e.target.value,
                      })
                    } 
                    style={{ float: "left", marginLeft: "10px", width: "120px",  fontSize: "18px", 
                    }}
                    pattern="#[0-9a-fA-F]{6}"
                    title="Veuillez entrer un code couleur hexadécimal valide (par exemple, #00ff00)"
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            <div className="modal-footer" style={{ padding: "2px 0px" }}>
              <p style={{ textAlign: "center" }}>
                <img
                  id="new"
                  style={{ display: "none", margin: "auto" }}
                  src="assets/images/wait.gif"
                  alt="Loading"
                />
              </p>
              <p
                style={{ textAlign: "center", fontWeight: "bold",  fontSize: "15px",
                }}
                id="msg-new"
              ></p>
              <Button
                onClick={() =>
                  Vehicle &&
                  (id_vehicule
                    ? updateVehicle(Vehicle)
                    : createVehicle(Vehicle))
                }
                variant="primary"
                type="submit"
              >
                {id_vehicule ?  translate("Save changes")  : translate("Create vehicle")} 
              </Button>
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                 {translate("Cancel")}
              </button> 
            </div>
          </Form>
        </div>
        <div className="col-sm-6 col-md-6">
          <h5>Etat du vehicule</h5>
        </div>
      </div>

    </>
  );
};

export default Vehicle;
