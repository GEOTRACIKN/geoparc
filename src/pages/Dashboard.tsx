import { useEffect, useState } from "react";
import FleetCounter from "../components/Dashboard/fleetCounter";
import FleetSate from "../components/Dashboard/fleetSate";
import StateVehicule from "../components/Dashboard/stateVehicule";
import StateTraining from "../components/Dashboard/stateTraining";

import StatsComponent from "../components/Dashboard/StatsComponent";

import { useTranslate } from "../hooks/LanguageProvider";

import { Table } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { BarLoader } from "react-spinners";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

import {
  engineStat,
  // BarreReseau,
  // ValiderPosition,
  getAddressFromCoordinates,
  formatDateForAlgeriaTimeZone,
} from "../utilities/functions";
import AlertCounter from "../components/Dashboard/AlertCounter";
import FleetCo2 from "../components/Dashboard/fleetCo2";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
// Définir une interface pour les données de véhicule
interface VehicleData {
  immatriculation_vehicule: string;
  SOG: number;
  GSMLVL: number;
  NST: number;
  psn_dispositif: string;

  // Ajoutez d'autres propriétés si nécessaire
}

interface SearchResult {
  psn_dispositif: string;
  prenom_user: string;
  nom_conducteur: string;
  prenom_conducteur: string;
  nom_user: string;
  nom_groupe: string;
  immatriculation_vehicule: string;
  SOG: number;
  LAT: number;
  LON: number;
  GPSDIST: number;
  ENGINESTAT: number;
  category_vehicule: string;
  vehicule_type: string;
  TIMESTAMP: string;
  Adresse: string; // Add the address field
}



interface ImmatriSuggestion {
  immatriculation_vehicule: string;
}
type TrainingState = {
  date_end_training: string;
}

type VehicleState = {
  etat_vehicule: string;
  total: number;
};


export function Dashboard() {
  const { translate } = useTranslate();
  const userID = localStorage.getItem("GeopUserID");
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [totalTrainings, setTotalTrainings] = useState(0);
  const [totalFires, setTotalFires] = useState(0);
  const navigate = useNavigate();

  const [vehicleStates, setVehicleStates] = useState<VehicleState[]>([]);
  const [totalReports, setTotalReports] = useState(0);
  const [dashData, setDashData] = useState<VehicleData[]>([]);
  const [userName, setUserName] = useState(
    localStorage.getItem("Geopusername")
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [immatriculationSuggestions, setImmatriculationSuggestions] = useState<ImmatriSuggestion[]>([]);
  const [selectedPsn, setSelectedPsn] = useState<string | null>(null); // État pour stocker le PSN sélectionné
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [totalDrivingLicense, setTotalDrivingLicense] = useState(0);
  const [totalVehicleInsurance, setTotalVehicleInsurance] = useState(0);
  const [totalTechnicalInspection, setTotalTechnicalInspection] = useState(0);
  const [totalTraining, setTotalTraining] = useState(0);
  const [totalFireExtinguisher, setTotalFireExtinguisher] = useState(0);
  const [trainings, setTrainings] = useState<TrainingState[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total number of drivers
        const responseDrivers = await fetch(
          `${backendUrl}/api/dash/driver/${userID}`,
          { mode: "cors" }
        );
        if (responseDrivers.ok) {
          const totalDriversData = await responseDrivers.json();
          const totalDriversCount = totalDriversData[0].total;
          setTotalDrivers(totalDriversCount);
          console.log("drivers:", totalDriversCount);
        } else {
          console.error("Failed to fetch total number of drivers");
        }

        // Fetch total number of vehicle
        const responseVehicles = await fetch(
          `${backendUrl}/api/vehicle/totalpage/${userID}`,
          { mode: "cors" }
        );
        if (responseVehicles.ok) {
          const totalVehiclesData = await responseVehicles.json();
          const totalVehiclesCount = totalVehiclesData[0].total;
          console.log("totalVehiclesCount: "+totalVehiclesCount);
          setTotalVehicles(totalVehiclesCount);
        } else {
          console.error("Failed to fetch total number of Vehicles");
        }

        // Prepare the request body
        const bodyData = JSON.stringify({
          id_user: userID,
          state: 1,
        });

        const responseVehicleState = await fetch(
          `${backendUrl}/api/etat/totalpage/${userID}`,
          { mode: "cors" }
        );
        if (responseVehicleState.ok) {
          const vehicleStateData = await responseVehicleState.json();
          console.log("Vehicle states data before:", vehicleStateData);
          setVehicleStates(vehicleStateData);
          console.log("Vehicle states:", vehicleStateData);
        } else {
          console.error("Failed to fetch vehicle states");
        }

        // Fetch total number of training
        const responseTraining = await fetch(
          `${backendUrl}/api/geop/training/count/${userID}`,
          { mode: "cors" }
        );
        if (responseTraining.ok) {
          const totalTrainingsData = await responseTraining.json();
          const totalTrainingsCount = totalTrainingsData;

          console.log("totalTrainingsCount: "+totalTrainingsCount);
          setTotalTrainings(totalTrainingsCount);
          console.log("totalTrainingsCount: "+totalTrainingsCount);
        } else {
          console.error("Failed to fetch total number of Vehicles");
        }

        

        // Fetch total number of training
        const responseFire = await fetch(
          `${backendUrl}/api/geop/fire/count/${userID}`,
          { mode: "cors" }
        );
        if (responseFire.ok) {
          const totalFiresData = await responseFire.json();
          const totalFiresCount = totalFiresData;
          console.log("totalFiresCount: "+totalFiresCount);
          
          setTotalFires(totalFiresCount);
        } else {
          console.error("Failed to fetch total number of Vehicles");
        }


        // Make the fetch request
        const responseNotifications = await fetch(
          `${backendUrl}/api/geop/notification/read`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: bodyData,
            mode: "cors",
          }
        );
        if (responseVehicles.ok) {
          const totalNotificationsData = await responseNotifications.json();

          setNotifications(totalNotificationsData);

          const counts: Record<string, number> = {
            "1": 0, // Permis de conduire
            "2": 0, // Assurance véhicule
            "3": 0, // Contrôle technique
            "4": 0, // Formation
            "5": 0, // Extincteur
            "6": 0, // Vidange
            "7": 0, // Entretiens planifiés par kilométrage
            "8": 0, // Entretiens planifiés par date
            "9": 0, // Stock de pièces
            "10": 0, // Permis de circuler
            "11": 0, // Agrément sanitaire
            "12": 0, // Récépissé
          };



          totalNotificationsData.forEach((notif: { id_type: string }) => {
            if (counts[notif.id_type] !== undefined) {
              counts[notif.id_type]++;
            }
          });

          // Update the statuses with the new accounts
          setAlertData([
            { id: "1", value: counts["1"], max: totalVehicles, color: "#e66d05", label: translate("Driving license"), modalId: "detailLicense" },
            { id: "2", value: counts["2"], max: totalDrivers, color: "#3c8dbc", label: translate("Vehicle insurance"), modalId: "detailInsurance" },
            { id: "3", value: counts["3"], max: totalVehicles, color: "#f56954", label: translate("Maintenance"), modalId: "detailMaintenance" },
            { id: "4", value: counts["4"], max: totalTrainings, color: "#00a65a", label: translate("Training"), modalId: "detailFormation" },
            { id: "5", value: counts["5"], max: totalFires, color: "#3c8dbc", label: translate("Extinguisher"), modalId: "detailExt" },
            { id: "6", value: counts["6"], max: totalVehicles, color: "#00a65a", label: translate("Technical control"), modalId: "DrainingDetail" },
            { id: "7", value: counts["7"], max: totalVehicles, color: "purple", label: translate("Sticker"), modalId: "detailSticker" },
            { id: "8", value: counts["8"], max: totalVehicles, color: "#d5d546", label: translate("Draining"), modalId: "detailDraining" },
            // { id: "9", value: counts["9"], max: 10, color: "#e60505", label: "Stock", modalId: "stockpiece" },
            // { id: "10", value: counts["10"], max: 10, color: "#9896f1", label: "Permis circulé", modalId: "detailPermis" },
            // { id: "11", value: counts["11"], max: 10, color: "#264e70", label: "Agrément Sanitaire", modalId: "detaiAgrement" },
            // { id: "12", value: counts["12"], max: 10, color: "#edb1f1", label: "Récépissé", modalId: "detailRecepisse" },
          ]);
          console.log(setTotalDrivingLicense)


        } else {
          console.error("Failed to fetch total number of Vehicles");
          setNotifications([]);
        }

        const responseTrainings = await fetch(
          `${backendUrl}/api/geop/training/all/${userID}`,
          { mode: "cors" }
        );
        if (responseTrainings.ok) {
          const trainingsData = await responseTrainings.json();
          setTrainings(trainingsData);
        }
  

        // Fetch total number of users
        const responseUsers = await fetch(
          `${backendUrl}/api/user/totalpage/${userID}`,
          { mode: "cors" }
        );
        if (responseUsers.ok) {
          const totalUsersData = await responseUsers.json();
          const totalUsersCount = totalUsersData[0].total;
          setTotalUsers(totalUsersCount);
        } else {
          console.error("Failed to fetch total number of users");
        }

        // Similarly fetch total number of vehicles and reports if needed
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const responseimmatriculation = await fetch(
          `${backendUrl}/api/immatriculation/${userID}`
        );
        if (responseimmatriculation.ok) {
          const data = await responseimmatriculation.json();
          setImmatriculationSuggestions(data);
        } else {
          console.error("Failed to fetch immatriculation data");
        }
      } catch (error) {
        console.error("Error fetching immatriculation data:", error);
      }
    };

    fetchData();
  }, [userID]);



  const [alertData, setAlertData] = useState([
    { id: "1", value: 0, max: totalDrivers, color: "#e66d05", label: translate("Driving license"), modalId: "detailPermis" },
    { id: "2", value: 0, max: totalVehicles, color: "#3c8dbc", label: translate("Vehicle insurance"), modalId: "detailASS" },
    { id: "3", value: 0, max: totalVehicles, color: "#f56954", label: translate("Maintenance"), modalId: "detailCnrlTech" },
    { id: "4", value: 0, max: totalTrainings, color: "#00a65a", label: translate("Training"), modalId: "detailFormation" },
    { id: "5", value: 0, max: totalFires, color: "#3c8dbc", label: translate("Extinguisher"), modalId: "detailExt" },
    { id: "6", value: 0, max: totalVehicles, color: "#00a65a", label: translate("Technical control"), modalId: "detailVidange" },
    { id: "7", value: 0, max: totalVehicles, color: "purple", label: translate("Sticker"), modalId: "detailEntretienKlm" },
    { id: "8", value: 0, max: totalVehicles, color: "#d5d546", label: translate("Draining"), modalId: "detailEntretienDate" },
    // { id: "9", value: 0, max: 10, color: "#e60505", label: "Stock", modalId: "stockpiece" },
    // { id: "10", value: 0, max: 10, color: "#9896f1", label: "Permis circulé", modalId: "detailPermis" },
    // { id: "11", value: 0, max: 10, color: "#264e70", label: "Agrément Sanitaire", modalId: "detaiAgrement" },
    // { id: "12", value: 0, max: 10, color: "#edb1f1", label: "Récépissé", modalId: "detailRecepisse" },
  ]);

  const handleSearch = async () => {
    setLoading(true);
    if (!searchTerm.trim()) {
      setSearchResults([]); // Clear search results if search term is empty
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/dash-data/${userID}`);
      if (response.ok) {
        const data: SearchResult[] = await response.json();

        const searchedItems: SearchResult[] = [];
        const getAddressPromises: Promise<void>[] = [];

        for (const item of data) {
          // Check if the immatriculation_vehicule matches the search term
          if (item.immatriculation_vehicule.includes(searchTerm.trim())) {
            // Extract necessary fields for getAddressFromCoordinates
            const { LAT, LON } = item;
            const addressPromise = getAddressFromCoordinates(LAT, LON)
              .then((address) => {
                // Push the item with the address into the search results
                searchedItems.push({ ...item, Adresse: address });
              })
              .catch((error) => {
                console.error("Error fetching address:", error);
              });
            getAddressPromises.push(addressPromise);
          }
        }

        // Wait for all getAddressFromCoordinates calls to complete
        await Promise.all(getAddressPromises);

        // Update the search results with all items that have addresses
        setSearchResults(searchedItems);
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    setLoading(false);
  };

  // const fetchUserName = async (userID: any) => {
  //   try {
  //     const response = await fetch(`${backendUrl}/api/getUserName/${userID}`);
  //     if (response.ok) {
  //       const userData = await response.json();
  //       // Concatenate nom_user and username_user to form the userName
  //       const userName = `${userData.nom_user} ${userData.prenom_user}`;
  //       setUserName(userName);
  //     } else {
  //       console.error("Failed to fetch user data");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserName(userID); // Add this line to fetch the user's name
  // }, [userID]);

  useEffect(() => {
    const fetchdashData = async () => {
      setRefreshing(true);

      try {
        const response = await fetch(`${backendUrl}/api/dash-data/${userID}`);
        if (response.ok) {
          const data = await response.json();
          setDashData(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setRefreshing(false);
      }
    };

    fetchdashData();
  }, []);

  interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
    LAT: number;
    LON: number;
    SOG: number;
    COG: number;
    ENGINESTAT: number;
    TIMESTAMP: string;
    GPSDIST: number;
    GSMLVL: number;
    NST: number;
  }

  const SOGChart: React.FC<{ data: Vehicle[] }> = ({ data }) => {
    // Extract unique immatriculation values
    const immatriculations = Array.from(
      new Set(data.map((vehicle) => vehicle.immatriculation_vehicule))
    );
    // Get current date
    const currentDate = new Date().toLocaleDateString();
    const chartData = immatriculations.map((immatriculation: string) => ({
      name: immatriculation,
      y:
        data.find(
          (vehicle) => vehicle.immatriculation_vehicule === immatriculation
        )?.SOG || 0,
    }));

    const options = {
      chart: {
        type: "column",
        zoomType: "x",
      },
      title: {
        text:
          translate("Speed Over Ground (SOG) of Fleet") +
          " - " +
          `${currentDate}`,
      },
      xAxis: {
        categories: immatriculations,
        title: {
          text: translate("Vehicle"),
        },
      },
      yAxis: {
        title: {
          text: translate("Vitesse"),
        },
      },
      series: [
        {
          name: translate("Vitesse"),

          type: "column",
          data: chartData.map((point) => ({
            name: point.name,
            y: point.y,
            color: point.y === 0 ? "green" : point.y > 90 ? "red" : null, // Set color to green if SOG is 0, else red if exceeds threshold
          })),
        },
      ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
  };

  const GSMLVLChart: React.FC<{ data: Vehicle[] }> = ({ data }) => {
    // Extract unique immatriculation values
    const immatriculations = Array.from(
      new Set(data.map((vehicle) => vehicle.immatriculation_vehicule))
    );

    // Get current date
    const currentDate = new Date().toLocaleDateString();
    const chartData = immatriculations.map((immatriculation: string) => ({
      name: immatriculation,
      y:
        data.find(
          (vehicle) => vehicle.immatriculation_vehicule === immatriculation
        )?.GSMLVL || 0,
      NST:
        data.find(
          (vehicle) => vehicle.immatriculation_vehicule === immatriculation
        )?.NST || 0,
    }));

    const options = {
      chart: {
        type: "column",
        zoomType: "x",
      },
      title: {
        text:
          translate("Niveau de GSM pour chaque véhicule") +
          " - " +
          `${currentDate}`,
      },
      xAxis: {
        categories: immatriculations,
        title: {
          text: translate("Vehicle"),
        },
      },
      yAxis: {
        title: {
          text: translate("Niveau de GSM"),
        },
      },
      series: [
        {
          name: translate("Niveau de GSM"),
          type: "column",
          data: chartData.map((point) => ({
            name: point.name,
            y: point.y,
            color:
              point.y === 0
                ? "red"
                : point.y > 75
                  ? "green"
                  : point.y > 50
                    ? "yellow"
                    : point.y < 50
                      ? "orange"
                      : null,
            dataLabels: {
              enabled: true,
              formatter: function () {
                return point.NST === 1 ? "Valide" : "Non valide"; // Formattez la valeur de NST
              },
            },
          })),
        },
      ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
  };

  // Fonction pour convertir les données de type VehicleData en Vehicle
  const convertToVehicle = (data: VehicleData[]): Vehicle[] => {
    return data.map((vehicleData) => ({
      id_vehicule: 0, // Ajoutez l'ID du véhicule si nécessaire
      LAT: 0, // Ajoutez les autres propriétés manquantes si nécessaire
      LON: 0,
      COG: 0,
      ENGINESTAT: 0,
      TIMESTAMP: "",
      GPSDIST: 0,
      ...vehicleData,
    }));
  };
  const handleImmatriculationSelect = (
    selectedOption: { value: string; label: string } | null
  ) => {
    if (selectedOption) {
      const selectedImmatriculation = selectedOption.value;
      // Recherchez l'objet correspondant dans dashData pour obtenir le PSN
      const correspondingPsn = dashData.find(
        (vehicle) =>
          vehicle.immatriculation_vehicule === selectedImmatriculation
      )?.psn_dispositif;
      setSelectedPsn(correspondingPsn || null);
    } else {
      setSelectedPsn(null);
    }
  };

  const alertsData = [
    {
      id: 1,
      type: "Géofence",
      matriculation: "341.ANNABA PORT",
      message: "Véhicule hors de la zone définie",
      timestamp: "2023-01-15 10:30:00",
    },
    {
      id: 3,
      type: "Vitesse",
      matriculation: "MAN 01365-518-06",
      message: "Excès de vitesse détecté (120 km/h)",
      timestamp: "2023-01-13 08:15:00",
    },
    {
      id: 3,
      type: "Accélération brutale",
      matriculation: "00011-517-13",
      message: "Détection avec drurée 2min (65 km/h)",
      timestamp: "2023-01-13 08:15:00",
    },
  ];

  const fleetData = [
    {
      Driving: 1,
      Parcking: "Géofence",
      ParkingEngineRunning: "341.ANNABA PORT",
      LastTransmission: "Véhicule hors de la zone définie",
    },
  ];

  const [Driving, setDriving] = useState(0);
  const [Parcking, setParcking] = useState(0);
  const [ParkingEngineRunning, setParkingEngineRunning] = useState(0);
  const [LastTransmission, setLastTransmission] = useState(0);

  const [list_markers, setMarkers] = useState<Vehicle[]>([]);

  useEffect(() => {
    const getMarkers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/map/find/${userID}`);
        if (response.ok) {
          const data = await response.json();
          setMarkers(data);

          // Calcul du nombre de véhicules en démarrage, en stationnement, et en stationnement avec moteur démarré
          const startingVehicles = data.filter(
            (vehicle: Vehicle) => vehicle.ENGINESTAT == 1 && vehicle.SOG > 5
          );

          const parkingVehicles = data.filter(
            (vehicle: Vehicle) => vehicle.ENGINESTAT == 0
          );

          const runningVehicles = data.filter(
            (vehicle: Vehicle) => vehicle.ENGINESTAT == 1 && vehicle.SOG < 5
          );

          const filteredVehicles = data.filter((vehicle: Vehicle) => {
            const lastTransmissionHours = calculateHoursDifference(
              new Date().toISOString(),
              vehicle.TIMESTAMP
            );
            return lastTransmissionHours > 2;
          });

          setDriving(startingVehicles.length);
          setParcking(parkingVehicles.length);
          setParkingEngineRunning(runningVehicles.length);
          setLastTransmission(filteredVehicles.length);
        } else {
          console.error("Failed to fetch vehicle data");
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    getMarkers();
  }, []);
  const handleClick = (etat: string) => {
    navigate(`/vehicles?etat=${etat}`);
  }

  // Fonction pour calculer la différence en heures entre deux timestamps
  function calculateHoursDifference(
    timestamp1: string,
    timestamp2: string
  ): number {
    const diffInMilliseconds =
      new Date(timestamp1).getTime() - new Date(timestamp2).getTime();
    return diffInMilliseconds / (1000 * 60 * 60);
  }
  const currentDate = new Date().toLocaleDateString();
  const handleStateClick = (etat: string) => {
    window.location.href = `/vehicles?etat_vehicule=${encodeURIComponent(etat)}`;
  };
  


  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-2 col-md-2">
              <FleetCounter
                numberOfItem={totalVehicles}
                title={translate("Vehicles")}
                icon={"car"}
                color={"bg-info-light"}
                linkTo="/vehicles" // Add the link here
              ></FleetCounter>
            </div>
            <div className="col-lg-2 col-md-2">
              <FleetCounter
                numberOfItem={totalDrivers}
                title={translate("Drivers")}
                icon={"user-tie"}
                color={"bg-danger-light"}
                linkTo="/drivers" // Add the link here
              ></FleetCounter>
            </div>
            <div className="col-lg-2 col-md-2">
              <FleetCounter
                numberOfItem={notifications.length}
                title={translate("Alert")}
                icon={"chart-bar"}
                color={"bg-success-light"}
                linkTo="/notifications" // Add the link here
              ></FleetCounter>
            </div>
            <div className="col-lg-2 col-md-2">
              <FleetCounter
                numberOfItem={totalUsers}
                title={translate("Users")}
                icon={"users-cog"}
                color={"bg-success-user"}
                linkTo="/" // Add the link here
              ></FleetCounter>
            </div>

            <div className="col-lg-2 col-md-2" onClick={() => handleStateClick("HS")} style={{ cursor: "pointer" }}>              
              <FleetCounter
                numberOfItem={vehicleStates.find(state => state.etat_vehicule === "HS")?.total || 0}
                title={translate("Out of Service")}
                icon={"exclamation-circle"}
                color={"bg-warning-light"}
                linkTo="/vehicles"
              />
            </div>
            <div className="col-lg-2 col-md-2" onClick={() => handleStateClick("En panne")} style={{ cursor: "pointer" }}>              
              <FleetCounter
                numberOfItem={vehicleStates.find(state => state.etat_vehicule === "En panne")?.total || 0}
                title={translate("Broken Down")}
                icon={"tools"}
                color={"bg-danger-light"}
                linkTo="/vehicles"
              />
            </div>
            <div className="col-lg-2 col-md-2" onClick={() => handleStateClick("En Réparation")} style={{ cursor: "pointer" }}>
                <FleetCounter
                numberOfItem={vehicleStates.find(state => state.etat_vehicule === "En réparation")?.total || 0}
                title={translate("Under Repair")}
                icon={"wrench"}
                color={"bg-info-light"}
                linkTo="/vehicles"
              />
            </div>
            <div className="col-lg-2 col-md-2" onClick={() => handleStateClick("Disponible")} style={{ cursor: "pointer" }}>
              <FleetCounter
                numberOfItem={vehicleStates.find(state => state.etat_vehicule === "Disponible")?.total || 0}
                title={translate("Available")}
                icon={"check-circle"}
                color={"bg-success-light"}
                linkTo="/vehicles"
              />
            </div>

            {/* <div className="col-lg-2 col-md-2">
              <FleetCounter
                numberOfItem={0}
                title={translate("Affectés")}
                icon={"users"}
                color={"bg-primary-light"}
                linkTo="/affectes"
              ></FleetCounter>
            </div> */}
            {/* <div className="col-lg-2 col-md-2">
              <FleetCounter
                numberOfItem={0}
                title={translate("Report")}
                icon={"chart-bar"}
                color={"bg-primary-light"}
                linkTo="/affectes"
              ></FleetCounter>
            </div>
            <div className="col-lg-2 col-md-2">
              <FleetCounter
                numberOfItem={0}
                title={translate("Statistic")}
                icon={"chart-pie"}
                color={"bg-primary-light"}
                linkTo="/affectes"
              ></FleetCounter>
            </div> */}
          </div>
        </div>

        <>
          <div className="container-fluid"></div>
        </>


        <div className="col-lg-6">{/* <FleetCo2 /> */}</div>
        <div className="col-lg-12">
          <div className="card">
            <div className="" style={{ padding: "20px" }}>
              <h6 className="box-title">
                <i className="las la-bell" style={{ fontSize: "24px" }}></i>{" "}
                Alertes{" "}
                <span className="badge bg-red">
                  {alertData.reduce((acc, alert) => acc + alert.value, 0)}
                </span>
              </h6>
            </div>
            <div className="row">
              {alertData.map((alert) => (
                <div key={alert.id} className="col-lg-2">
                  <AlertCounter
                    value={alert.value}
                    max={alert.max}
                    color={alert.color}
                    label={alert.label}
                    modalId={alert.modalId}
                    height={120}
                    id={alert.id} />
                </div>
              ))}
            </div>
          </div>
        </div>
          {/* <div className="col-lg-6">
        <FleetSate
          options={{
            maintenanceCosts: 5000, // Coûts de Maintenance
            missionCosts: 3000, // Coûts des Missions
            fuelCosts: 2000, // Coûts de Carburant
            legalCosts: 1500, // Coûts Juridiques
            employeeCosts: 4000, // Coûts des Employés
            hseCosts: 1000, // Coûts HSE (Hygiène, Sécurité, Environnement)
          }}
        />
      </div> */}

        <div className="col-lg-6">
        <StateVehicule 
  vehicleStates={vehicleStates}
/>
        </div>
        <div className="col-lg-6">
        <StateTraining 
  trainings={trainings}
/>
        </div>
      </div>
    </>
  );
}
