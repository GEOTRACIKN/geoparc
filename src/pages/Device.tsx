// Device.tsx
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Tabs, Tab, Col, Row, Nav } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import SelectGroup from "../components/Vehicle/SelectGroup";
import "react-datepicker/dist/react-datepicker.css";
import { toast, Bounce } from "react-toastify";   
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface DeviceInterface {

  id_dispositif: null | number;
  id_user: number;
  psn_dispositif: null | string;
  id_vehicule: number;
  immatriculation_vehicule: null | string;
  id_puce: null | number;
  id_groupe_disp: null | number;
  

}


interface UserInterface {
  id_user: number;
  nom_user: string;
  prenom_user: string;
}

interface VehicleInterface {
  id_vehicule: number;
  immatriculation_vehicule: string;
}


interface CartesSimInterface {
  id_puce: number;
  serial_number: string;
}


interface groupDeviceInterface {
  id_groupe: number;
  nom_groupe: string;
}



const Device: React.FC = () => {
  
  const userID = localStorage.getItem("userID");
  const { id_device } = useParams<{ id_device?: string }>();
  const { translate } = useTranslate();
  const [Users, setUsers] = useState<UserInterface[]>([]);
  const [usersOptions, setusersOptions] = useState<any[]>([  { value: "Aucun", label: "Aucun" },]);
  const [Device, setDevice] = useState<DeviceInterface>();
  const [vehiclesOptions, setVehiclesOptions] = useState([ { value: "Aucun", label: "Aucun" },]);
  const [cartesSimOptions, setCartesSimOptions] = useState([ { value: "Aucun", label: "Aucun" },]);
  const [cartesSim, setCartesSim] = useState<CartesSimInterface[]>([]);
  const [groupDevicesOptions, setGroupDevicesOptions] = useState([ { value: "Aucun", label: "Aucun" },]);
  const [groupDevices, setgroupDevices] = useState<groupDeviceInterface[]>([]);
  const [Vehicles, setvehicles] = useState<VehicleInterface[]>([]);
  const [idVehiculeOld, setIdVehiculeOld] = useState<number | null>(0); 
 
  useEffect(() => {
    if (userID) { 
      getUser(userID);
      getCartesSim(userID); 
      getGroupDevice(userID);
    }

    if (id_device) {
      getDevice();
   
    }

  }, []);

  const getDevice = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/Device/find/${id_device}`, {
        mode: "cors",
      });

      if (!res.ok) {
        console.error("Erreur lors de la récupération du véhicule");
        return;
      }

      const data = await res.json();
      setDevice(data[0]);
      setIdVehiculeOld(data[0]["id_vehicule"]);

      getVehicles(data[0]["id_user"]); 

      console.log(Device);
    } catch (error) { 
      console.error("Erreur lors de la récupération du véhicule", error);
    }
  };

  const getVehicles = async (id_user:any) => {
    try {
      const res = await fetch(`${backendUrl}/api/vehicle/options/${id_user}`, {
        mode: "cors",
      });

      const vehiclesData = await res.json();

      const vehiclesOptionsData = vehiclesData.map((vehicle: any) => ({
        value: vehicle.id_vehicule,
        label: `${vehicle.immatriculation_vehicule || ""}`,
      }));

      setVehiclesOptions(vehiclesOptionsData);
      setvehicles(vehiclesData);


    } catch (error) {
      console.error(error);
    }
  };



  
  const getCartesSim = async (id_user:any) => { 
    try {
      const res = await fetch(`${backendUrl}/api/simcards/getsimcards/${id_user}`, {
        mode: "cors",
      });

      const cartesSimData = await res.json();

      const cartesSimOptionsData = cartesSimData.map((cartesSim: any) => ({
        value: cartesSim.id_puce,
        label: `${cartesSim.serial_number || ""}`,
      })); 
 
      setCartesSimOptions(cartesSimOptionsData);
      setCartesSim(cartesSimData);

    } catch (error) {
      console.error(error);
    }
  };


  const getGroupDevice= async (id_user:any) => { 
    try {
      const res = await fetch(`${backendUrl}/api/groups-device/groups/${id_user}`, {  
        mode: "cors",
      });
 
      const groupDeviceData = await res.json();

      const groupDeviceDataOptionsData = groupDeviceData.map((groupDevice: any) => ({
        value: groupDevice.id_groupe,
        label: `${groupDevice.nom_groupe || ""}`,
      })); 
 
      setGroupDevicesOptions(groupDeviceDataOptionsData);
      setgroupDevices(groupDeviceData);

    } catch (error) {
      console.error(error);
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

      setusersOptions(usersOptionsData);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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


  const findVehicleById = (
    id: number
  ): { value: number; label: string } | undefined => {
    const foundVehicle = Vehicles.find((vehicle) => vehicle.id_vehicule === id);

    if (foundVehicle) { 
      const { id_vehicule, immatriculation_vehicule } = foundVehicle;
      return { value: id_vehicule, label: `${immatriculation_vehicule || ""}` };
    }

    return undefined;
  };


  
  const findCardSimById = (
    id: number
  ): { value: number; label: string } | undefined => {
    const foundCardSimB = cartesSim.find((carteSim) => carteSim.id_puce === id);

    if (foundCardSimB) { 
      const { id_puce, serial_number } = foundCardSimB;
      return { value: id_puce, label: `${serial_number || ""}` };
    }

    return undefined;
  };


  const findGroupDeviceById = (
    id: number
  ): { value: number; label: string } | undefined => {
    const foundGroupsDevice = groupDevices.find((groupDevice) => groupDevice.id_groupe === id);

    if (foundGroupsDevice) { 
      const { id_groupe, nom_groupe } = foundGroupsDevice;
      return { value: id_groupe, label: `${nom_groupe || ""}` };
    }

    return undefined;
  };

  const handleDeviceChange = (updatedValues: Partial<DeviceInterface>) => {
    setDevice((prevData) => ({
      ...prevData!,
      ...updatedValues,
    }));
  };



  const handleUserChange = async (selectedOption: any) => {
    
    setDevice((prevData: DeviceInterface | undefined) => {
      const newData: DeviceInterface = { ...prevData! };
      newData.id_user = selectedOption.value;

      return newData;
    });


    getVehicles(selectedOption.value);
    
  };


  const handleCardSimChange = async (selectedOption: any) => {
    
    setDevice((prevData: DeviceInterface | undefined) => {
      const newData: DeviceInterface = { ...prevData! };
      newData.id_puce = selectedOption.value;

      return newData;
    });


    getVehicles(selectedOption.value);
    
  };


  const handleGroupDevicesChange = async (selectedOption: any) => {
    
    setDevice((prevData: DeviceInterface | undefined) => {
      const newData: DeviceInterface = { ...prevData! };
      newData.id_groupe_disp = selectedOption.value;

      return newData;
    });


    getVehicles(selectedOption.value);
    
  };






  
  
  const handleGroupDeviceChange = async (selectedOption: any) => {
    
    setDevice((prevData: DeviceInterface | undefined) => {
      const newData: DeviceInterface = { ...prevData! };
      newData.id_puce = selectedOption.value;

      return newData;
    });


    getVehicles(selectedOption.value);
    
  };




  const handleVehiclehange = (selectedOption: any) => {
    setDevice((prevData: DeviceInterface | undefined) => {
      const newData: DeviceInterface = { ...prevData! };
      newData.id_vehicule = selectedOption.value; 

      return newData;
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDevice((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  const handletypeChange = (selectedOption: any) => {
    setDevice((prevData) => ({
      ...prevData!,
      type_vehicule: selectedOption.value,
    }));
  };

  const handleCategoryChange = (selectedOption: any) => {
    setDevice((prevData) => ({
      ...prevData!,
      category_vehicule: selectedOption.value,
    }));
  };

  
  const updateDevice = async (device: DeviceInterface) => {
    
    const deviceDatas = {  
      id_new_device: device.id_dispositif,
      id_user_vehicle: device.id_user,    
      id_old_Vehicle: idVehiculeOld,
      id_new_vehicle:device.id_vehicule,
      id_puce: device.id_puce,
      id_groupe_disp: device.id_groupe_disp,
    }; 

    try { 

      const res = await fetch(`${backendUrl}/api/device/updateVehiculeDeviceRelation`, {   
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(deviceDatas),
      });

      if (!res.ok) { 
        
        console.error("Error updating vehicle device");

        toast.warn("Can't updating vehicle device", { 
          position: "bottom-right",    
          autoClose: 5000,
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

        console.log("Vehicle device relation updated successfully");  

        toast.success("Vehicle device relation updated successfully", { 
          position: "bottom-right",
          autoClose: 5000,
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
      
      toast.warn("Can't updating vehicle device", { 
        position: "bottom-right",    
        autoClose: 5000,
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

  const createDevice = async (device: DeviceInterface) => {
    try {
      const deviceDatas = {
        id_dispositif: device.id_dispositif,
        id_user: device.id_user,
        psn_dispositif: device.psn_dispositif,
        id_vehicule: device.id_vehicule,
        immatriculation_vehicule:device.immatriculation_vehicule
      };

      const res = await fetch(`${backendUrl}/api/vehicle/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(deviceDatas),
       }
      );

      if (!res.ok) {
        console.log("Error creating vehicle");  
 
        toast.warn("Can't creating device", { 
          position: "bottom-right",    
          autoClose: 5000,
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

        console.log("Device create successfully"); 

        toast.success("Device create successfully", { 
          position: "bottom-right",
          autoClose: 5000,
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
      console.error("Erreur lors de la création du véhicule", error);

      toast.warn("Can't create device", { 
        position: "bottom-right",    
        autoClose: 5000,
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
    <> 
      <div className="row">
        <h4 className="col-sm-6 col-md-6">
          <i  className="las la-compass"  data-rel="bootstrap-tooltip"   title="Increased"></i>
          {id_device ? translate("Edit Device") : translate("New Device")}
        </h4>
      </div>
      <div className="row">
        <div className="col-sm-6 col-md-6">
          <Form onSubmit={handleSubmit} style={{ padding: "20px" }}>
           
              <div style={{ padding: "20px" }} > 
              <h5>Affectation dispositif / véhicule</h5>
                <Form.Group
                  controlId="immatriculation_vehicule"
                  style={{ margin: "20px 0" }}
                >
                  <Row>
                  <Col column sm="4" md="4" lg="4">
                  <Form.Label>PSN / IMEI </Form.Label>
                  </Col>
                  <Col sm="8" md="8" lg="8">
                  <Form.Control
                    type="text"
                    placeholder="Saisir la balise PSN"
                    name="psn-dispositif"
                    value={Device?.psn_dispositif ?? ""}
                    onChange={(e) =>
                      handleDeviceChange({ psn_dispositif: e.target.value })
                    }
                    disabled={id_device!==undefined} 
                  />
                  </Col>
                  </Row>
                </Form.Group>

                <SelectGroup
                  controlId="user"
                  label="User"
                  icon="user"
                  options={usersOptions} 
                  valueType={{
                    value: Device?.id_user,
                    label: findUserById(Device?.id_user || 0)?.label || translate("Select a user"),
                  }}
                  onChange={handleUserChange}
                />
                
                <input type='hidden' placeholder="Old vehicle" aria-label="Search" value={idVehiculeOld? idVehiculeOld: 0} className="me-2 form-control"></input>
 
                <SelectGroup 
                  controlId="Vehicule"
                  label={translate("Vehicle")}
                  icon="car" 
                  options={vehiclesOptions}
                  placeholder={
                    Device?.id_vehicule
                      ? findVehicleById(Device?.id_vehicule)?.label || ""
                      : translate("Select a vehicle")
                  }
                  valueType={{
                    value: Device?.id_vehicule,
                    label: findVehicleById(Device?.id_vehicule || 0)?.label || translate("Select a vehicle")
                  }}
                  onChange={handleVehiclehange}
                />
 
                 <SelectGroup
                  controlId="SIM"
                  label={translate("N° SIM")}
                  icon="sim-card" 
                  options={cartesSimOptions} 
                  valueType={{ 
                    value: Device?.id_puce,
                    label: findCardSimById(Device?.id_puce || 0)?.label || translate("Select SIM"),  
                  }}
                  onChange={handleCardSimChange} 
                /> 

               <SelectGroup
                  controlId="Group"
                  label={translate("Group")+" "+translate("Device")}
                  icon="users"
                  options={groupDevicesOptions}  
                  valueType={{  
                    value: Device?.id_groupe_disp,
                    label: findGroupDeviceById(Device?.id_groupe_disp || 0)?.label || translate("Select Group device"),   
                  }}
                  onChange={handleGroupDevicesChange} 
                />
               
              </div>
                 

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
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
                id="msg-new"
              ></p>
              <Nav.Link
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                {translate("Cancel")} 
              </Nav.Link>
              <Button
                onClick={() =>
                  Device &&
                  (id_device
                    ? updateDevice(Device)
                    : createDevice(Device))
                }
                variant="primary"
                type="submit"
              >
                {id_device ? "Save Changes" : "Create Vehicle"}
              </Button> 
            </div>
          </Form>
        </div>
        <div className="col-sm-6 col-md-6"> 
        </div>
      </div>
    </>
  );
};

export default Device;
