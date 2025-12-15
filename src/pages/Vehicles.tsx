/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useTranslate } from "../hooks/LanguageProvider";
import { useState, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  Modal,
  Form,
  Col,
  Row,
  Dropdown,
  Button,
} from "react-bootstrap";
import {
  FaPlus,
  FaRedo,
  FaCar,
  FaShieldAlt,
  FaStickyNote,
  FaTachometerAlt,
  FaWrench,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { Link, NavLink } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { ButtonCustomHover } from "../components/ButtonHover";
import { useNavigate } from "react-router-dom";
import { DownloadModal, generateExcelFile, generatePDFFile, handleDownloadConfirm, useClipboard } from "../utilities/functions";
import { toast } from "react-toastify"; import VehicleModal from "../components/Vehicle/VehicleDeleteModal";


const backendUrl = process.env.REACT_APP_BACKEND_URL + "/api/geop";

interface VehiculeListInterface {
  id_vehicule: number;
  vehicule_type: string;
  modele_vehicule: string;
  immatriculation_vehicule: string;
  couleur_vehicule: string;
  etat_vehicule: string;
  id_conducteur_vehicule?: number;
  driver_first_name?: string;
  driver_last_name?: string;
  affectation?: string;
  username_user: string;
  id_user: string;
  category_vehicule?: string;
  propriete_vehicule?: string;
  id_marque?: number;
  date_aquisition_vehicule?: Date;
  type_carburant_vehicule?: string;
  annee_vehicule?: string;
  date_circulation_vehicule?: Date;
  num_chassis_vehicule?: string;
  nbre_place_vehicule?: number;
  puissance_vehicule?: string;
  kilometrage_vehicule?: string;
  commentaire_vehicule?: string;
  companie_assurance_vehicule?: string;
  type_assurance_vehicule?: string;
  date_debut_assurance_vehicule?: string;
  date_expir_assurance_vehicule?: string;
  cout_assurance_vehicule?: string;
  delai_assurance_vehicule?: string;
  reference_assurance_vehicule?: string;
  note_assurance_vehicule?: string;
  etat_ctr_tech_vehicule?: string;
  date_debut_ctr_tech_vehicule?: string;
  date_fin_ctr_tech_vehicule?: string;
  station_ctr_vehicule?: string;
  cout_ctr_tech_vehicule?: string;
  note_ctr_tech_vehicule?: string;
  date_vignette_vehicule?: string;
  cout_vignette_vehicule?: string;
  id_gps?: number;
  longueur_vehicule?: string;
  largeur_vehicule?: string;
  hauteur_vehicule?: string;
  poid_vehicule?: string;
  nbre_porte_vehicule?: number;
  icon_vehicule?: string;
  detail_vehicule?: string;
  num_porte_vehicule?: string;
  ptac_vehicule?: string;
  kilometrage_reel_vehicule?: string;
  image_vehicule?: string;
  consomatio_gasoil_reel_vehicule?: string;
  latitude_vehicule?: string;
  longitude_vehicule?: string;
  date_heure_position_vehicule?: string;
  id_sousParc_vehicule?: number;
  num_vignette_vehicule?: string;
  famille_vehicule?: string;
  gamme_vehicule?: string;
  id_groupe?: number;
  fuel_level_vehicule?: string;
  co2_vehicule?: string;
  capacite_res_vehicule?: string;
  prochain_vidange_vehicule?: string;
  info_vehicule?: number;
  draft?: number;
  inService_vehicule?: string;
  date_creation_vehicule?: string;
  date_modification_vehicule?: string;
  date_suppression_vehicule?: string;
  PSN?: string;
  LAST_IB_CODE?: string;
  fuel_type?: string;
  maximum_allowed_total?: string;
  consommation_moyenne_vehicule?: string;
  id_parc?: number;
  nom_user?: string;
  prenom_user?: string;
  nom_conducteur?: string;
  nom_parc?: string;
  date_dernier_vidange?: string;
  dernier_vidange_vehicule?: number;
  kilometrage_prochain_entretien?: number;
  nom_marque?: string;
  reference_ctr_tech_vehicule?: string;
}


export function Vehicles() {
  const { translate } = useTranslate();
  const [type, setType] = useState(1);
  const [typeSearch, setTypeSearch] = useState(translate("Immatriculation"));
  const [search, setSearch] = useState("");
  const [pageCount, setPageCount] = useState(0); // Nombre total de pages
  const [column, setSortColumn] = useState("id_conducteur");
  const [sort, setSort] = useState("ASC");
  const userID = localStorage.getItem("GeopUserID");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [vehicles, setVehicles] = useState<VehiculeListInterface[]>([]);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const navigate = useNavigate();
  const [modalStatus, setModalStatus] = useState<string | null>(null);
  const [titleStatus, setTitleStatus] = useState<string | null>(null);
  const [IdUser, setIdUser] = useState<number>(0);
  const [IdVehicle, setIdDVehicle] = useState<number>(0);
  const [modalStatusDetail, setModalStatusDetail] = useState<string | null>(null);
  const [titleStatusDetail, setTitleStatusDetail] = useState<string | null>(null);
  const [paginatedVehicles, setPaginatedVehicles] = useState<VehiculeListInterface[]>([]); 
  const { copyToClipboard, copiedId } = useClipboard(translate("Matriculation Copied"));

  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const etat = queryParams.get("etat_vehicule") || ""; // Récupère le paramètre `etat`  
  // State pour stocker les véhicules filtrés

  console.log("État extrait de l'URL :", etat); // Vérifiez la valeur dans la console
  const handleClickLink = (navigateTo: string) => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };


  const handleSortingColum = (currentColumn: string) => {
    setSortColumn(currentColumn);
    sort == "ASC" ? setSort("DESC") : setSort("ASC");
    getVehicles(limit, currentPage, search, type, column, sort);
  };

  const searchColum: { [key: string]: number } = {
    id_vehicule: 0,
    immatriculation_vehicule: 1,
    vehicule_type: 2,
    // nom_conducteur: 3,
    username_user: 4,
  };

  const HandleDelete = async (id_vehicle: number) => {
    try {
      console.log(id_vehicle);
      setModalStatus('Do you want to delete this vehicle');
      setTitleStatus('Delete vehicle');
      setIdUser(userID ? Number(userID) : 0);
      setIdDVehicle(id_vehicle);
      // After successful deletion, update the vehicle list
      //  await updateVehicleList();
    } catch (error) {
      console.error(error);
    }
  };

  const getVehicles = async (
    limit: number,
    page: number,
    search: string,
    type: number,
    column: string,
    sort: string,
    etat?: string
  ) => {
    try {
      setLoading(true);

      const [countData, vehicleData] = await Promise.all([
        fetch(`${backendUrl}/vehicles/count`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_user: parseInt(userID ?? "0") || 0,
            search: search,
            etat: etat, // Ajout du filtre état
          }),
        }).then(res => res.json()),

        fetch(`${backendUrl}/vehicles/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_user: userID,
            page: 1, // Toujours récupérer la première page (tous les véhicules)
            limit: 1000, // Récupérer tous les véhicules en une seule requête
            column: searchColum[column],
            sort: sort,
            search: search,
            type: type,
            etat: etat, // Ajout du filtre état
          }),
        }).then(res => res.json()),
      ]);

      // Mise à jour CRITIQUE de la pagination
      const newTotal = countData[0].total;
      setTotal(newTotal);

      // Filtrer les véhicules côté frontend
      const filteredVehicles = etat
        ? vehicleData.filter((vehicle: VehiculeListInterface) => vehicle.etat_vehicule.toUpperCase() === etat.toUpperCase())
        : vehicleData;

      // Calculer le nombre total de pages
      const calculatedPageCount = Math.ceil(filteredVehicles.length / limit);
      setPageCount(calculatedPageCount);

      // Réinitialiser la page actuelle si nécessaire
      if (page > calculatedPageCount) {
        setCurrentPage(1);
      }

      // Stocker tous les véhicules filtrés
      setVehicles(filteredVehicles);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log("Valeur de etat récupérée depuis l'URL :", etat); // Vérifie la valeur



  const filteredVehicles = etat
    ? vehicles.filter(vehicle => vehicle.etat_vehicule.toUpperCase() === etat.toUpperCase())
    : vehicles;

  console.log("Véhicules filtrés côté frontend :", filteredVehicles); // Vérifiez les résultats 

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  //const filteredVehicles = vehicles.filter(vehicle => selectedStates.includes(vehicle.etat_vehicule));
  console.log("Véhicules filtrés côté frontend :", filteredVehicles); // Vérifiez les résultats 


  const handleStateChange = (state: string) => {
    const newStates = selectedStates.includes(state)
      ? selectedStates.filter(s => s !== state)
      : [...selectedStates, state];
    setSelectedStates(newStates);
    setCurrentPage(1); // Réinitialiser la page actuelle à 1
  };
  // Dans le gestionnaire de changement d'état
  const handleStateFilter = (selectedStates: string[]) => {
    setSelectedStates(selectedStates);
    setCurrentPage(1); // Réinitialisation à la première page
    getVehicles(limit, 1, search, type, column, sort, selectedStates.join(','));
  };
  const refreshVehiculeData = async () => {
    await getVehicles(
      limit,
      currentPage,
      search,
      type,
      column,
      sort,
      selectedStates.join(',') // Envoi des états sélectionnés
    );
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const newPaginatedVehicles = vehicles.slice(startIndex, endIndex);
    setPaginatedVehicles(newPaginatedVehicles);
  }, [currentPage, vehicles, limit]);
  useEffect(() => {
    getVehicles(limit, currentPage, search, type, column, sort, etat);
  }, [currentPage, etat]);


  /*useLayoutEffect(() => {
    refreshVehiculeData();
  }, [userID, limit, limit, search, type, column, sort, selectedStates]);
  */

  /*const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1;
    await getVehicles(limit, currentPage, search, type, column, sort);
    // setDrivers(commentsFormServer);
    window.scrollTo(0, 0);
  };*/


  const menuItems = [
    translate("ID"),
    translate("Immatriculation"),
    //  translate("Driver"),
    translate("User"),
  ];

  const handleTypeSearch = (selectedValue: string) => {
    console.log(selectedValue);
    switch (selectedValue) {
      case translate("ID"):
        console.log(0);
        setType(0);
        break;
      case translate("Immatriculation"):
        console.log(1);
        setType(1);
        break;
      // case translate("Driver"):
      //   console.log(2)
      //   setType(2);
      //  break;
      case translate("User"):
        console.log(3);
        setType(3);
        break;
      default:
        console.log("Unknown selection");
        console.log(selectedValue);
        break;
    }
    setTypeSearch(selectedValue);
    console.log("Selected value:", selectedValue);
  };

  const [selectedColumns, setSelectedColumns] = useState({
    id_vehicule: true,
    model: true,
    immatriculation_vehicule: true,
    state: true,
    assignment: true,
    vehicule_type: true,
    nom_conducteur: true,
    username_user: true,
    trailer: true,
  });

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prevState: any) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };

  const handleAdvancedSearch = async (event: any) => {
    const newValue = event.target.value;
    setSearch(newValue);
    await getVehicles(limit, currentPage, newValue, type, column, sort);
  };

  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setCurrentPage(1); // Réinitialiser currentPage à 1 lorsque la limite change
    setLimit(newValue);
    const commentsFormServer = await getVehicles(
      parseInt(newValue),
      1,
      search,
      type,
      column,
      sort
    ); // Ajouter await ici
    //setVehicles(commentsFormServer);
    window.scrollTo(0, 0);
  };


  const handleResetSearch = async () => {
    setSearch("");

    await getVehicles(limit, currentPage, search, type, column, sort);
  };

  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [isVehiclesSelected, setIsVehiclesSelected] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllVehicles = (checked: boolean) => {
    setSelectAll(checked);
    console.log(checked);
    if (checked) {
      // Select all POIs
      const allVehicleIDs = vehicles.map((vehicle) =>
        vehicle.id_vehicule.toString()
      ); // Convert to strings
      setSelectedVehicles(allVehicleIDs);
      setIsVehiclesSelected(true); // Mark as selected
    } else {
      // Select all POIs
      setSelectedVehicles([]);
      setIsVehiclesSelected(false); // Mark as unselected
    }
  };

  const handleVehiclesSelect = (DriverID: string) => {
    let updatedSetSelectedVehicles: string[] = [];

    // If "Select All Vehicles" is enabled, selects or deselects all vehicles
    if (selectAll) {
      updatedSetSelectedVehicles = selectedVehicles.includes(DriverID)
        ? selectedVehicles.filter(id => id !== DriverID) //Deselect if already selected
        : vehicles.map(vehicle => vehicle.id_vehicule.toString()); // Select all vehicles
    } else {
      //Managing selection/normal selection of an individual vehicle
      if (selectedVehicles.includes(DriverID)) {
        updatedSetSelectedVehicles = selectedVehicles.filter(id => id !== DriverID);
      } else {
        updatedSetSelectedVehicles = [...selectedVehicles, DriverID];
      }
    }

    // Updates the list of selected vehicles
    setSelectedVehicles(updatedSetSelectedVehicles);

    // Updates the Vehicles Selected state (activate if at least one is selected)
    setIsVehiclesSelected(updatedSetSelectedVehicles.length > 0);

    console.log(updatedSetSelectedVehicles);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const newPaginatedVehicles = vehicles.slice(startIndex, endIndex);
    setPaginatedVehicles(newPaginatedVehicles);
  }, [currentPage, vehicles, limit]);

  // Gérer le changement de page
  const handlePageClick = (selectedPage: { selected: number; }) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  // Charger les véhicules au montage du composant
  useEffect(() => {
    getVehicles(limit, currentPage, search, type, column, sort, etat);
  }, [currentPage, etat]);



  const vehicleHeaders = [
    translate("ID"),
    translate("Model"),
    translate("Matriculation"),
    translate("State"),
    translate("Assignment"),
    translate("Driver"),
    translate("User"),
    translate("Trailer"),
  ];

  const downloadVehicleExcel = () => {
    const selectedData = vehicles
      .filter((vehicle) => selectedVehicles.includes(vehicle.id_vehicule.toString()))
      .map((vehicle) => [
        vehicle.id_vehicule,
        vehicle.immatriculation_vehicule,
        vehicle.category_vehicule || "",
        vehicle.vehicule_type,
        vehicle.etat_vehicule,
        vehicle.kilometrage_vehicule || "",
        vehicle.driver_first_name ? vehicle.driver_first_name + " " + (vehicle.driver_last_name || "") : "",
        vehicle.nom_marque || "",
        vehicle.modele_vehicule || "",
        vehicle.type_carburant_vehicule || "",

        vehicle.PSN || "",
        vehicle.annee_vehicule || "",
        vehicle.nbre_porte_vehicule || "",
        vehicle.puissance_vehicule || "",
        vehicle.longueur_vehicule || "",
        vehicle.hauteur_vehicule || "",
        vehicle.co2_vehicule || "",
        vehicle.date_circulation_vehicule || "",
        vehicle.num_chassis_vehicule || "",
        vehicle.nbre_place_vehicule || "",
        vehicle.ptac_vehicule || "",
        vehicle.largeur_vehicule || "",
        vehicle.poid_vehicule || "",

        vehicle.companie_assurance_vehicule || "",
        vehicle.type_assurance_vehicule || "",
        vehicle.date_debut_assurance_vehicule || "",
        vehicle.date_expir_assurance_vehicule || "",
        vehicle.cout_assurance_vehicule || "",
        vehicle.delai_assurance_vehicule || "",

        vehicle.etat_ctr_tech_vehicule || "",
        vehicle.reference_ctr_tech_vehicule || "",
        vehicle.date_debut_ctr_tech_vehicule || "",
        vehicle.date_fin_ctr_tech_vehicule || "",
        vehicle.cout_ctr_tech_vehicule || "",

        vehicle.num_vignette_vehicule || "",
        vehicle.date_vignette_vehicule || "",
        vehicle.cout_vignette_vehicule || "",

        vehicle.dernier_vidange_vehicule || "",
        vehicle.prochain_vidange_vehicule || "",
        vehicle.date_dernier_vidange || "",
        vehicle.kilometrage_prochain_entretien || "",
      ]);

    const vehicleHeadersExcel = [

      translate("Vehicle ID"),
      translate("License Plate"),
      translate("Category"),
      translate("Type"),
      translate("Condition"),
      translate("KM"),
      translate("Driver Full Name"),
      translate("Modele"),
      translate("Brand"),
      translate("Fuel Type"),

      translate("PSN"),
      translate("Year"),
      translate("Door Number"),
      translate("Power"),
      translate("Length"),
      translate("Height"),
      translate("CO2 Emissions"),
      translate("First Registration Date"),
      translate("Chassis Number"),
      translate("Number of Seats"),
      translate("Gross Vehicle Weight (PTAC)"),
      translate("Width"),
      translate("Weight"),

      translate("Insurance Company"),
      translate("Insurance Type"),
      translate("Insurance Start Date"),
      translate("Insurance Expiry Date"),
      translate("Insurance Cost"),
      translate("Insurance Duration"),

      translate("Technical Inspection Status"),
      translate("Technical Inspection Reference"),
      translate("Technical Inspection Start Date"),
      translate("Technical Inspection End Date"),
      translate("Technical Inspection Cost"),

      translate("Vignette Number"),
      translate("Vignette Date"),
      translate("Vignette Cost"),

      translate("Last Oil Change (km)"),
      translate("Next Oil Change (km)"),
      translate("Last Oil Change Date"),
      translate("Next Maintenance Mileage"),

    ];

    generateExcelFile(translate("Vehicle List"), vehicleHeadersExcel, selectedData);
  };
  const downloadVehiclePDF = () => {

    const selectedData = vehicles.filter((vehicle) =>
      selectedVehicles.includes(vehicle.id_vehicule.toString())
    ).map((vehicle) => [
      vehicle.id_vehicule,
      vehicle.modele_vehicule,
      vehicle.immatriculation_vehicule,
      vehicle.etat_vehicule,
      vehicle.affectation,
      vehicle.driver_first_name + ' ' + vehicle.driver_last_name,
      vehicle.username_user,
    ]);
    generatePDFFile(translate("List") + ' ' + translate("Vehicles"), vehicleHeaders, selectedData);
  };


  const onDownloadConfirm = (format: string) => {
    if (selectedVehicles.length > 0) {
      handleDownloadConfirm(format, downloadVehicleExcel, downloadVehiclePDF);
    } else {
      toast.warn("Please select at least one vehicle", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };


  const closeModal = () => {
    setModalStatus(null);
  };

  const closeDetailModal = () => {
    setModalStatusDetail(null);
  };
  const totalVehiclesToDisplay = etat ? filteredVehicles.length : total;



  return (
    <>
      <div
        id="DataTables_Table_0_wrapper"
        className="dataTables_wrapper dt-bootstrap4 no-footer"
      >
        <div className="row">
          <div
            className="col-sm-12 col-md-6 dataTables_length"
            id="DataTables_Table_0_length"
          >
            <h4 className="mb-3 text-nowrap">
              <i className="las la-car mr-2"></i>
              {translate("Total Vehicles")} {totalVehiclesToDisplay}
            </h4>

          </div>
          <div className="col-sm-12 col-md-6">
            <div className="text-right">


              <button
                className="btn btn-outline-secondary  mt-2 mr-1"
                onClick={() => setShowDownloadModal(true)}
              >
                <i className="las la-download"></i>
                {translate("Export")} {translate("Vehicle")}
              </button>

              <ButtonCustomHover
                text={translate("Add vehicule")}
                icon={<FaPlus />}
                ClasStyle="bg-success"
                onClick={() => handleClickLink("/vehicle/add")}
              />

              <ButtonCustomHover
                text={translate("Assurance")}
                icon={<FaShieldAlt />}
                onClick={() => navigate("/administratif/insurance")}
              />
              <ButtonCustomHover
                text={translate("Vignette")}
                icon={<FaStickyNote />}
                onClick={() => navigate("/administratif/vignette")}
              />
              {/*<ButtonCustomHover
                text={translate("Mileage")}
                icon={<FaTachometerAlt />}
              />*/}
              <ButtonCustomHover
                text={translate("Control Technic")}
                icon={<FaWrench />}
                onClick={() => navigate("/administratif/technical-control")}

              />
            </div>
          </div>

          <div className="col-sm-12 col-md-12">
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <div className="input-group">
                  <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                      <i
                        className="fas fa-chevron-down"
                        style={{ fontSize: "20" }}
                      ></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {menuItems.map((item, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleTypeSearch(item)}
                          eventKey={item}
                          active={typeSearch === item}
                          className={typeSearch === item ? "select-active" : ""}
                        >
                          {item}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>

                  </Dropdown>
                  {/*  <div className="col-sm-12 col-md-6">
              <div className="input-group">
                <Dropdown className="mr-2">
                  <Dropdown.Toggle variant="secondary" id="dropdown-states">
                    <i className="las la-filter"></i> {translate("State")}
                    {selectedStates.length > 0 && ` (${selectedStates.length})`}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {[
                      { value: "Disponible", label: translate("Disponible") },
                      { value: "HS", label: translate("HS") },
                      { value: "En Réparation", label: translate("En Réparation") },
                      { value: "En Panne", label: translate("En Panne") }
                    ].map((state) => (
                      <Dropdown.Item 
                        key={state.value} 
                        as="label"
                        onClick={(e) => e.preventDefault()}
                      >
                        <div className="form-check d-flex align-items-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedStates.includes(state.value)}
                            onChange={(e) => {
                              const newStates = e.target.checked
                                ? [...selectedStates, state.value]
                                : selectedStates.filter(v => v !== state.value);
                              setSelectedStates(newStates);
                              setCurrentPage(1);
                            }}
                          />
                          <span className="ml-2">{state.label}</span>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                

  </div>
</div>*/}
                  <input
                    type="text"
                    placeholder={` ${translate("Search by")} ${translate(
                      typeSearch
                    )}`}
                    onChange={handleAdvancedSearch}
                    className="form-control"
                  />
                  <Button
                    variant="secondary"
                    onClick={handleResetSearch}
                    className="btn-reset"
                  >
                    <i className="las la-times" style={{ color: "#fff" }}></i>
                  </Button>
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-end align-items-center">
                <div
                  className="dataTables_length"
                  id="DataTables_Table_0_length"
                >
                  <label style={{ marginBottom: "0" }}>
                    {translate("Show")}
                    <select
                      name="DataTables_Table_0_length"
                      aria-controls="DataTables_Table_0"
                      className="custom-select custom-select-sm form-control form-control-sm ml-2"
                      style={{ width: "66px" }}
                      onChange={handleSelectChange}
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="500">500</option>
                    </select>
                  </label>
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant=""
                    id="dropdown-basic"
                    title={translate("Display columns")}
                    style={{ marginTop: "-13" }}
                  >
                    <i className="las la-eye"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      as="button"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedColumns.id_vehicule}
                        onChange={() => handleColumnChange("id_vehicule")}
                      />
                      <span style={{ marginLeft: "0px" }}>
                        {translate("ID")}
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedColumns.immatriculation_vehicule}
                        onChange={() =>
                          handleColumnChange("immatriculation_vehicule")
                        }
                      />
                      <span style={{ marginLeft: "10px" }}>
                        {translate("Matriculation")}
                      </span>
                    </Dropdown.Item>

                    <Dropdown.Item
                      as="button"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedColumns.nom_conducteur}
                        onChange={() => handleColumnChange("nom_conducteur")}
                      />
                      <span style={{ marginLeft: "10px" }}>
                        {translate("Driver")}
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedColumns.username_user}
                        onChange={() => handleColumnChange("username_user")}
                      />
                      <span style={{ marginLeft: "10px" }}>
                        {translate("User")}
                      </span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="row m-1 table-responsive">
          <Table className="dataTable">
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
                <th>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) =>
                        handleSelectAllVehicles(e.target.checked)
                      }
                    />
                    <label className="form-check-label"></label>
                  </div>
                </th>

                {selectedColumns.id_vehicule && userID == "1" && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("id_vehicule")}
                  >
                    {translate("Id")}
                  </th>
                )}
                {selectedColumns.model && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("model")}
                  >
                    {translate("Model")}
                  </th>
                )}
                {selectedColumns.immatriculation_vehicule && (
                  <th
                    className="sorting"
                    onClick={() =>
                      handleSortingColum("immatriculation_vehicule")
                    }
                  >
                    {translate("Matriculation")}
                  </th>
                )}
                {selectedColumns.state && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("state")}
                  >
                    {translate("State")}
                  </th>
                )}
                {/* {selectedColumns.assignment && (
                  <th
                    className="assignment"
                    onClick={() => handleSortingColum("assignment")}
                  >
                    {translate("Assignment")}
                  </th>
                )} */}
                {selectedColumns.nom_conducteur && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("nom_conducteur")}
                  >
                    {translate("Driver")}
                  </th>
                )}
                {selectedColumns.username_user && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("username_user")}
                  >
                    {translate("User")}
                  </th>
                )}
                {/* {selectedColumns.trailer && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("trailer")}
                  >
                    {translate("Trailer")}
                  </th>
                )} */}
                {<th>{translate("Action")}</th>}
              </tr>
            </thead>
            <tbody key="#" className="ligth-body">
              {loading ? (
                <tr style={{ textAlign: "center" }}>
                  <td className="text-center" colSpan={10}>
                    <p>
                      <PropagateLoader
                        color={"#123abc"}
                        loading={loading}
                        size={20}
                      />
                    </p>
                  </td>
                </tr>
              ) : paginatedVehicles.length > 0 ? (
                paginatedVehicles.map((item) => (
                  <tr key={item.id_vehicule}>
                    <td>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`checkbox-${item.id_vehicule}`}
                          checked={selectedVehicles.includes(item.id_vehicule.toString())}
                          onChange={() => handleVehiclesSelect(item.id_vehicule.toString())}
                        />
                        <label htmlFor={`checkbox-${item.id_vehicule}`} className="mb-0"></label>
                      </div>
                    </td>

                    {selectedColumns.id_vehicule && userID == "1" && <td>{item.id_vehicule}</td>}
                    {selectedColumns.model && (<td className="text-center">{item.modele_vehicule}</td>)}
                        {selectedColumns.immatriculation_vehicule && <td
                        id={`vehicle-${item.id_vehicule}`}
                        style={{ cursor: 'pointer', position: 'relative', color: copiedId === item.id_vehicule.toString() ? '#28a745' : '#007bff' }}
                        title={translate("Click to copy the registration matriculation")}
                        onClick={() => {
                          if (item.immatriculation_vehicule && item.id_vehicule.toString()) {
                            copyToClipboard(item.immatriculation_vehicule, item.id_vehicule.toString());
                          }
                        }} >{
                          <>
                            <span style={{ color: copiedId === item.id_vehicule.toString() ? '#28a745' : '#007bff' }}>
                              {item.immatriculation_vehicule}
                            </span>

                            {copiedId === item.id_vehicule.toString() && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '-20px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  backgroundColor: '#28a745',
                                  color: '#fff',
                                  padding: '2px 5px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                }}
                              >
                                {translate("Matriculation Copied")}
                              </span>
                            )}
                          </>
                        }
                      </td>}
                    {selectedColumns.state && (<td className="text-center"><span className="badge p-1 fs-6 btn"> {item.etat_vehicule}</span></td>)}
                    {/* {selectedColumns.assignment && (<td className="text-center">{item.affectation}</td>)} */}
                    {selectedColumns.nom_conducteur && (<td className="text-center">{item.driver_first_name} - {item.driver_last_name} </td>)}
                    {selectedColumns.username_user && (<td className="text-center">{item.username_user}</td>)}
                    {/* {selectedColumns.trailer && (<td className="text-center">{}</td>)} */}
                    <td>
                      <div className="d-flex align-items-center list-action">
                        <NavLink
                          to={`/vehicle/edit/${item.id_vehicule}`}
                          className="badge bg-success mr-2"
                          data-toggle="tooltip"
                          data-placement="top"
                          title={translate("Edit")}
                        >
                          <i className="ri-pencil-line mr-0"></i>
                        </NavLink>
                        <a
                          className="badge bg-warning mr-2 nav-link"
                          data-toggle="tooltip"
                          title="Delete"
                          onClick={() => HandleDelete(item.id_vehicule)}
                        >
                          <i className="ri-delete-bin-line mr-0"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10}>{translate("No vehicles available")}</td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="row">
            <div className="col-md-6 d-flex align-items-center">
              <span>
                {translate("Displaying")} {vehicles.length} {translate("on")}{" "}
                {total}
              </span>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <ReactPaginate
                previousLabel={translate("previous")}
                nextLabel={translate("next")}
                breakLabel={"..."}
                pageCount={pageCount} // Nombre total de pages
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick} // Gérer le changement de page
                containerClassName={"pagination justify-content-end"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
                forcePage={currentPage - 1} // Forcer la page active
              />
            </div>
          </div>
        </div>
      </div>
      <VehicleModal
        show={modalStatus !== null}
        onHide={closeModal}
        status={modalStatus}
        title={titleStatus}
        IdUser={IdUser}
        IdVehicle={IdVehicle}
        updateVehicleList={refreshVehiculeData}
      />
      <DownloadModal
        show={showDownloadModal}
        onHide={() => setShowDownloadModal(false)}
        onDownloadConfirm={onDownloadConfirm}
      />

    </>
  );
}
