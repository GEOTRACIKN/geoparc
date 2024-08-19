import { useEffect, useState } from "react";
import FleetCounter from "../components/Dashboard/fleetCounter";
import FleetSate from "../components/Dashboard/fleetSate";
import StatsComponent from "../components/Dashboard/StatsComponent";
import Alert from "../components/Dashboard/alerts";
import { useTranslate } from "../components/LanguageProvider";
import FleetCo2 from "../components/Dashboard/fleetCo2";
import { Table } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { BarLoader } from "react-spinners";
import Select from 'react-select';


import {
  engineStat,
  BarreReseau,
  ValiderPosition,
  getAddressFromCoordinates,
  formatDateForAlgeriaTimeZone,
} from "../utilities/functions";

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

export function Dashboard() {
  const { translate } = useTranslate();
  const userID = localStorage.getItem("userID");
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [dashData, setDashData] = useState<VehicleData[]>([]);
  const [userName, setUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [immatriculationSuggestions, setImmatriculationSuggestions] = useState<
    ImmatriSuggestion[]
  >([]);
  const [selectedPsn, setSelectedPsn] = useState<string | null>(null); // État pour stocker le PSN sélectionné
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

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
          setTotalVehicles(totalVehiclesCount);
        } else {
          console.error("Failed to fetch total number of Vehicles");
        }

        // Fetch total number of repport
        const responseReports = await fetch(
          `${backendUrl}/api/rapport/totalpage/${userID}`,
          { mode: "cors" }
        );
        if (responseVehicles.ok) {
          const totalReportsData = await responseReports.json();
          const totalReportsCount = totalReportsData[0].total;
          setTotalReports(totalReportsCount);
        } else {
          console.error("Failed to fetch total number of Vehicles");
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

  const fetchUserName = async (userID: any) => {
    try {
      const response = await fetch(`${backendUrl}/api/getUserName/${userID}`);
      if (response.ok) {
        const userData = await response.json();
        // Concatenate nom_user and username_user to form the userName
        const userName = `${userData.nom_user} ${userData.prenom_user}`;
        setUserName(userName);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserName(userID); // Add this line to fetch the user's name
  }, [userID]);

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
  const handleImmatriculationSelect = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const selectedImmatriculation = selectedOption.value;
      // Recherchez l'objet correspondant dans dashData pour obtenir le PSN
      const correspondingPsn = dashData.find(
        (vehicle) => vehicle.immatriculation_vehicule === selectedImmatriculation
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

  const clearInputs = () => {
    setSearchTerm("");
    // Ajoutez d'autres instructions pour effacer d'autres saisies si nécessaire
  };

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

  return (
    <>
      <div className="row">
        <div className="col-lg-4">
          <div className="card card-transparent card-block card-stretch card-height border-none">
            <div className="card-body p-0 mt-lg-2 mt-0">
              <h3 className="mb-3">
                {translate("Hello")}, {userName} {currentDate}{" "}
              </h3>

              <p
                style={{
                  marginBottom: "0",
                  marginRight: "20px",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  color: "#333",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                {translate(
                  "Your dashboard monitors business processes. Fleet Management optimizes operations. Geotrackin provides location data, while ensuring real-time tracking."
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="row">
            <div className="col-lg-3 col-md-3">
              <FleetCounter
                numberOfItem={totalVehicles}
                title={translate("Vehicles")}
                icon={"car"}
                color={"bg-info-light"}
                linkTo="/vehicles" // Add the link here
              ></FleetCounter>
            </div>
            <div className="col-lg-3 col-md-3">
              <FleetCounter
                numberOfItem={totalDrivers}
                title={translate("Drivers")}
                icon={"user-tie"}
                color={"bg-danger-light"}
                linkTo="/drivers" // Add the link here
              ></FleetCounter>
            </div>
            <div className="col-lg-3 col-md-3">
              <FleetCounter
                numberOfItem={totalReports}
                title={translate("Reports")}
                icon={"chart-bar"}
                color={"bg-success-light"}
                linkTo="/reports" // Add the link here
              ></FleetCounter>
            </div>
            <div className="col-lg-3 col-md-3">
              <FleetCounter
                numberOfItem={totalUsers}
                title={translate("Users")}
                icon={"users-cog"}
                color={"bg-success-user"}   
                linkTo="/users" // Add the link here
              ></FleetCounter>
            </div>
          </div>
        </div>

        <>
          <div className="container-fluid">
            {" "}
            {/* Use container-fluid to make it full-width */}
            <div className="row">
              <div className="col position-relative">
                <div className="input-group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                    placeholder={
                      translate("Matriculation") + " " + translate("Vehicle")
                    }
                    list="immatriculationSuggestions"
                  />
                  {searchTerm && (
                    <button
                      className="btn-close"
                      onClick={clearInputs}
                    ></button>
                  )}
                  <datalist id="immatriculationSuggestions">
                    {immatriculationSuggestions.map((suggestion, index) => (
                      <option
                        key={index}
                        value={suggestion.immatriculation_vehicule}
                      />
                    ))}
                  </datalist>
                </div>
              </div>
              <div className="col-auto">
                <button className="btn btn-primary" onClick={handleSearch}>
                  <i className="las la-search"></i>
                </button>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-12">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '20px' }}>
                  <BarLoader color="#007bff" loading={loading} />
                </div>
                ) : searchResults.length === 0 ? (
                  <p></p>
                ) : (
                  <Table bordered hover responsive className="w-100">
                    <thead className="bg-primary text-white">
                      <tr className="ligth ligth-data">
                        <th>{translate("Vehicle")}</th>
                        <th>{translate("User")}</th>
                        <th>{translate("Driver")}</th>
                        <th>{translate("Vehicles Groups")}</th>
                        <th> {translate("Vitesse")}</th>
                        <th> {translate("Address")}</th>
                        <th>{translate("Distance")}</th>
                        <th>{translate("State")}</th>
                        <th>{translate("Category/Type")}</th>
                        <th>{translate("Date Time")}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((result, index) => (
                        <tr key={index}>
                          <td>{result.immatriculation_vehicule}</td>
                          <td>
                            {result.nom_user} {result.prenom_user}
                          </td>
                          <td>
                            {result.nom_conducteur} {result.prenom_conducteur}
                          </td>
                          <td>{result.nom_groupe}</td>
                          <td>{result.SOG} km/h</td>
                          <td>{result.Adresse}</td>
                          <td>{(result.GPSDIST / 1000).toFixed(0)} km</td>
                          <td>
                            <img
                              src={
                                engineStat(
                                  result.ENGINESTAT,
                                  result.SOG,
                                  translate
                                ).iconState
                              }
                              alt=""
                              title={
                                engineStat(
                                  result.ENGINESTAT,
                                  result.SOG,
                                  translate
                                ).tooltipMessage
                              }
                            />
                          </td>
                          <td>
                            {result.category_vehicule} / {result.vehicule_type}
                          </td>
                          <td>
                            {formatDateForAlgeriaTimeZone(result.TIMESTAMP)}
                          </td>
                          <td>
                            <button
                              className="btn-close"
                              onClick={() =>
                                setSearchResults(
                                  searchResults.filter((_, i) => i !== index)
                                )
                              }
                            ></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </div>
          </div>
        </>

        <div className="col-lg-4">
          <FleetSate
            options={{
              DrivingValue: Driving,
              ParckingValue: Parcking,
              ParkingEngineRunningValue: ParkingEngineRunning,
              LastTransmissionValue: LastTransmission,
            }}
          ></FleetSate>
        </div>
        <div className="col-lg-8">
          <GSMLVLChart data={convertToVehicle(dashData)} />
        </div>
        <br />
        <div className="row">
          <div className="col-lg-8">
            {/* Mettez votre composant SOGChart ici */}
            <SOGChart data={convertToVehicle(dashData)} />
          </div>
          <div className="col-lg-4">
  <Select
    options={dashData.map((vehicle) => ({
      value: vehicle.immatriculation_vehicule,
      label: vehicle.immatriculation_vehicule
    }))}
    onChange={(selectedOption) => handleImmatriculationSelect(selectedOption)}
    placeholder={translate("Vehicles")}
  />
  <br />
  <br />
  {selectedPsn ? (
    <StatsComponent psn={selectedPsn} />
  ) : (
    <p
      style={{
        fontSize: "20px",
        color: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {translate("Select a vehicle to view more statistics.")}
    </p>
  )}
</div>

        </div>

        {/* <div className="col-lg-8">
          <h3>Alertes en cours</h3>
          <Table>
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
                <th>{translate("Type")}</th>
                <th>{translate("matriculation")}</th>
                <th>{translate("Message")}</th>
                <th>{translate("Date")}</th>
              </tr>
            </thead>

            <Alert alerts={alertsData}></Alert>
          </Table>
        </div> */}
      </div>
    </>
  );
}
