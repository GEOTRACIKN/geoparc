/* eslint-disable jsx-a11y/anchor-is-valid */
import { useTranslate } from "../hooks/LanguageProvider";
import { useState, useEffect, useLayoutEffect } from "react";
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
import { DownloadModal, generateExcelFile, generatePDFFile, handleDownloadConfirm, toTimestamp } from "../utilities/functions";
import { toast } from "react-toastify";

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
}

// let currentPage = 1;

export function Vehicles() {
  const { translate } = useTranslate();

  const [type, setType] = useState(1);
  const [typeSearch, setTypeSearch] = useState(translate("Immatriculation"));
  const [search, setSearch] = useState("");
  const [colum, setSortColum] = useState("id_conducteur");
  const [sort, setSort] = useState("ASC");
  const userID = localStorage.getItem("GeopUserID");
  //const userID = 1;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [vehicles, setVehicles] = useState<VehiculeListInterface[]>([]);
  const [limit, setLimit] = useState(10);
  const [selectedRows, setSelectedRows] = useState(new Map());
  const [pageCount, setPageCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState("id_vehicule");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [showText, setShowText] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id_vehicule: true,
    model: true,
    imatriculation: true,
    state: true,
    assignment: true,
    conducteur: true,
    trailer: true,
    actions: true,
    username_user: true,
  });

  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const navigate = useNavigate();

  const handleClickLink = (navigateTo: string) => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };


  const handleSort = (type: string) => {
    let sortOrder = sortDirection === "asc" ? "desc" : "asc";
    if (type !== sortColumn) sortOrder = "asc";
    setSortColumn(type);
    setSortDirection(sortOrder);
  };

  const handleSortingColum = (curentColum: string) => {
    setSortColum(curentColum);
    sort === "ASC" ? setSort("DESC") : setSort("ASC");
    getVehicles(limit, currentPage, search, type, colum, sort);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAllChecked(e.target.checked);
    setSelectedRows(new Map()); // or handle setting all items as selected
  };

  const searchColum: { [key: string]: number } = {
    id_vehicule: 0,
    immatriculation_vehicule: 1,
    vehicule_type: 2,
    // nom_conducteur: 3,
    username_user: 4,
  };

  const HandleDelete = async (id_conducteur: number) => {
    try {
      console.log(id_conducteur);
      // setModalStatus('Do you want to delete this Driver');
      // setTitleStatus('Delete Driver');
      // setIdUser(parseInt(id_user || '0', 0));
      // setIdDriver(id_conducteur);

      // Perform deletion logic here...

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
    sort: string
  ) => {
    try {
      setLoading(true);
      const [countData, vehicleData] = await Promise.all([
        fetch(`${backendUrl}/vehicles/count`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_user: parseInt(userID ?? "0") || 0,
            search: search,
          }),
        }).then((res) => res.json()),
        fetch(`${backendUrl}/vehicles/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_user: userID,
            page: page,
            limit: limit,
            column: searchColum[column],
            sort: sort,
            search: search,
            type: type,
          }),
        }).then((res) => res.json()),
      ]);

      const total = countData[0].total;
      setTotal(total);

      const calculatedPageCount = Math.ceil(total / limit);
      setPageCount(calculatedPageCount);
      setVehicles(vehicleData);

      return vehicleData;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false on data fetch completion
    }
  };

  const refreshVehiculeData = async () => {
    getVehicles(limit, currentPage, search, type, colum, sort);
  };

  useLayoutEffect(() => {
    refreshVehiculeData();
  }, [userID, limit, limit, search, type, colum, sort]);

  const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1;
    await getVehicles(limit, currentPage, search, type, colum, sort);
    // setDrivers(commentsFormServer);
    window.scrollTo(0, 0);
  };

  const handleClick = () => {
    console.log("Button clicked!");
  };

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
    await getVehicles(limit, currentPage, newValue, type, colum, sort);
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
      colum,
      sort
    ); // Ajouter await ici
    setVehicles(commentsFormServer);
    window.scrollTo(0, 0);
  };

  const handleResetSearch = async () => {
    setSearch("");

    await getVehicles(limit, currentPage, search, type, colum, sort);
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
    let updatedsetSelectedVehicles: string[] = [];

    // If "Select All Vehicles" is enabled, selects or deselects all vehicles
    if (selectAll) {
      updatedsetSelectedVehicles = selectedVehicles.includes(DriverID)
        ? selectedVehicles.filter(id => id !== DriverID) //Deselect if already selected
        : vehicles.map(vehicle => vehicle.id_vehicule.toString()); // Select all vehicles
    } else {
      //Managing selection/normal selection of an individual vehicle
      if (selectedVehicles.includes(DriverID)) {
        updatedsetSelectedVehicles = selectedVehicles.filter(id => id !== DriverID);
      } else {
        updatedsetSelectedVehicles = [...selectedVehicles, DriverID];
      }
    }

    // Updates the list of selected vehicles
    setSelectedVehicles(updatedsetSelectedVehicles);

    // Updates the Vehicles Selected state (activate if at least one is selected)
    setIsVehiclesSelected(updatedsetSelectedVehicles.length > 0);

    console.log(updatedsetSelectedVehicles);
  };


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


    generateExcelFile(translate("List") + ' ' + translate("Vehicles"), vehicleHeaders, selectedData);
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
              {translate("Vehicles")} {total}
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
              />
              <ButtonCustomHover
                text={translate("Vignette")}
                icon={<FaStickyNote />}
              />
              <ButtonCustomHover
                text={translate("Mileage")}
                icon={<FaTachometerAlt />}
              />
              <ButtonCustomHover
                text={translate("Control Technic")}
                icon={<FaWrench />}
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

                {selectedColumns.id_vehicule && (
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
                {selectedColumns.assignment && (
                  <th
                    className="assignment"
                    onClick={() => handleSortingColum("assignment")}
                  >
                    {translate("Assignment")}
                  </th>
                )}
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
                {selectedColumns.trailer && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("trailer")}
                  >
                    {translate("Trailer")}
                  </th>
                )}
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
              ) : vehicles.length > 0 ? (
                vehicles.map((item) => (
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

                    {selectedColumns.id_vehicule && <td>{item.id_vehicule}</td>}
                    {selectedColumns.model && (<td className="text-center">{item.modele_vehicule}</td>)}
                    {selectedColumns.immatriculation_vehicule && (<td className="text-center">{item.immatriculation_vehicule}</td>)}
                    {selectedColumns.state && (<td className="text-center"><span className="badge p-1 fs-6 btn"> {item.etat_vehicule}</span></td>)}
                    {selectedColumns.assignment && (<td className="text-center">{item.affectation}</td>)}
                    {selectedColumns.nom_conducteur && (<td className="text-center">{item.driver_first_name} - {item.driver_last_name} </td>)}
                    {selectedColumns.username_user && (<td className="text-center">{item.username_user}</td>)}
                    {selectedColumns.trailer && (<td className="text-center">{/* {item.trailer} */}</td>)}
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
                  <td colSpan={10}>No vehicles available</td>
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
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
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
                forcePage={currentPage - 1}
              />
            </div>
          </div>
        </div>
      </div>
      <DownloadModal
        show={showDownloadModal}
        onHide={() => setShowDownloadModal(false)}
        onDownloadConfirm={onDownloadConfirm}
      />

    </>
  );
}
