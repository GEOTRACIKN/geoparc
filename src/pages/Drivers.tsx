/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Button, Dropdown, Modal, Table } from "react-bootstrap";
import { Form, Link, NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { PropagateLoader } from 'react-spinners';
import DriverModal from "../components/Driver/DriverDeleteModal";
import ConfirmSalaryModal from "../components/Driver/ConfirmSalaryModal";
import DriverAssignmentModal from "../components/Driver/DriverAssignmentModal";
import { DownloadModal, generateExcelFile, generatePDFFile, handleDownloadConfirm, toTimestamp } from "../utilities/functions";
import DriverDeleteModal from "../components/Driver/DriverDeleteModal";
import DriverDetailsModal from "../components/Driver/DriverDetailsModal";
import { toast } from "react-toastify";
import TrainingCalendar from "../components/Calendar/Events";


interface Drivers {
  id_conducteur: number;
  code_conducteur: number;
  nom_conducteur: string;
  prenom_conducteur: string;
  date_naissance_conducteur: string;
  email_conducteur: string;
  telephone_conducteur: string;
  id_parc: number;
  nom_parc: string;
}



export function Drivers() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { translate } = useTranslate();
  let [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [list_Drivers, setDrivers] = useState<Drivers[]>([]);
  const id_user = localStorage.getItem("GeopUserID");
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const handleShowCreateTicketModal = () => setShowCreateTicketModal(true);
  const handleCloseCreateTicketModal = () => setShowCreateTicketModal(false);
  const [modalStatus, setModalStatus] = useState<string | null>(null);
  const [titleStatus, setTitleStatus] = useState<string | null>(null);

  const [modalStatusDetail, setModalStatusDetail] = useState<string | null>(null);
  const [titleStatusDetail, setTitleStatusDetail] = useState<string | null>(null);

  const [modalConfirmStatus, setModalConfirmStatus] = useState<string | null>(null);
  const [titleConfirmStatus, setTitleConfirmStatus] = useState<string | null>(null);
  const [modalAssignmentStatus, setModalAssignmentStatus] = useState<string | null>(null);
  const [titleAssignmentStatus, setTitleAssignmentStatus] = useState<string | null>(null);
  const [IdDriver, setIdDriver] = useState<number>(0);
  const [IdUser, setIdUser] = useState<number>(0);
  const [IdPark, setIdPark] = useState<number>(0);
  const [NamePark, setNamePark] = useState<string>("");

  const [loading, setLoading] = useState(true); // Add loading state
  const [pageCount, setPageCount] = useState(0);
  let [total, setTotal] = useState(0);
  const [column, setSortcolumn] = useState("id_conducteur");
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [type, setType] = useState(2);
  const [typeSearch, setTypeSearch] = useState(translate("Last and first name"));
  const [showDownloadModal, setShowDownloadModal] = useState(false); 

  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const driverHeaders = [
    translate("ID"),
    translate("Code"),
    translate("Last and first name"),
    translate("Date of birth"),
    translate("Phone"),
    translate("Email"),
    translate("Park")
  ];


  
  const downloadVehicleExcel = () => {

    const selectedData = list_Drivers.filter((driver) =>
      selectedDrivers.includes(driver.id_conducteur.toString())
    ).map((driver) => [
      driver.id_conducteur,
      driver.code_conducteur,
      driver.nom_conducteur+' '+ driver.prenom_conducteur,
      toTimestamp(driver.date_naissance_conducteur),
      driver.telephone_conducteur,
      driver.email_conducteur,
      driver.nom_parc,
    ]);


    generateExcelFile(translate("List") + ' ' + translate("Vehicles"), driverHeaders, selectedData);
  };

  const downloadVehiclePDF = () => {

    const selectedData = list_Drivers.filter((driver) =>
      selectedDrivers.includes(driver.id_conducteur.toString())
    ).map((driver) => [
      driver.id_conducteur,
    driver.code_conducteur,
    driver.nom_conducteur+' '+ driver.prenom_conducteur,
    toTimestamp(driver.date_naissance_conducteur),
    driver.telephone_conducteur,
    driver.email_conducteur,
    driver.nom_parc,
    ]);
    generatePDFFile(translate("List") + ' ' + translate("Vehicles"), driverHeaders, selectedData);
  };


  const onDownloadConfirm = (format: string) => {
    if (selectedDrivers.length > 0) {
      handleDownloadConfirm(format, downloadVehicleExcel, downloadVehiclePDF);
    } else {
      toast.warn("Please select at least one driver", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };


  const [isVehiclesSelected, setIsVehiclesSelected] = useState(false);


  const handleDriversSelect = (DriverID: string) => {
    let updatedsetSelectedDrivers: string[] = [];

    // If "Select All Vehicles" is enabled, selects or deselects all vehicles
    if (selectAll) {
      updatedsetSelectedDrivers = selectedDrivers.includes(DriverID)
        ? selectedDrivers.filter(id => id !== DriverID) //Deselect if already selected
        : list_Drivers.map(driver => driver.id_conducteur.toString()); // Select all vehicles
    } else {
      //Managing selection/normal selection of an individual vehicle
      if (selectedDrivers.includes(DriverID)) {
        updatedsetSelectedDrivers = selectedDrivers.filter(id => id !== DriverID);
      } else {
        updatedsetSelectedDrivers = [...selectedDrivers, DriverID];
      }
    }

    // Updates the list of selected vehicles
    setSelectedDrivers(updatedsetSelectedDrivers);

    // Updates the Vehicles Selected state (activate if at least one is selected)
    setIsVehiclesSelected(updatedsetSelectedDrivers.length > 0);

    console.log(updatedsetSelectedDrivers);
  };



  useEffect(() => {
   // If the list of selected POIs is empty, disable general selection
    if (setSelectedDrivers.length === 0 && selectAll) {
      setSelectAll(false);
    }
  }, [setSelectedDrivers, selectAll]);


  // In the handleSelectAllDrivers function
  const handleSelectAllDrivers = (checked: boolean) => {
    setSelectAll(checked);
    console.log(checked)
    if (checked) {
      // Select all POIs
      const allVehicleIDs = list_Drivers.map((driver) => driver.id_conducteur.toString()); // Convert to strings
      setSelectedDrivers(allVehicleIDs);
      setIsVehiclesSelected(true);// Mark as selected
    } else {
      // Select all POIs
      setSelectedDrivers([]);
      setIsVehiclesSelected(false); // Mark as unselected
    }
  };


  const getDrivers = async (limitValue: number, currentPage: number, search: string, type: number, column: string, sort: string) => {
    try {
      setLoading(true);

      // Preparing the data to send
      const bodyData = JSON.stringify({
        limitValue,
        currentPage,
        search,
        type,
        id_user,
        column: searchColumn[column],
        sort
      });

      // Retrieve the total number of pages
      const totalPagesResponse = await fetch(`${backendUrl}/api/geop/driver/totalpage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyData,
        mode: 'cors',
      });

      const totalPagesJson = await totalPagesResponse.json();
      const total = totalPagesJson[0]["count"];
      setTotal(total);

      // Retrieve driver data
      const DriversResponse = await fetch(`${backendUrl}/api/geop/driver/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyData,
        mode: 'cors',
      });

      const data = await DriversResponse.json();
      setPageCount(Math.ceil(total / limitValue));
      setLimit(limitValue)
      setDrivers(data);
      return data;
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };




  const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1;
    await getDrivers(limit, currentPage, search, type, column, sort);
    // setDrivers(commentsFormServer);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getDrivers(limit, currentPage, search, type, column, sort);
  }, []);


  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setCurrentPage(1); // Réinitialiser currentPage à 1 lorsque la limite change
    setLimit(newValue);
    const commentsFormServer = await getDrivers(parseInt(newValue), 1, search, type, column, sort); // Ajouter await ici
    setDrivers(commentsFormServer);
    window.scrollTo(0, 0);
  };


  const [selectedColumns, setSelectedColumns] = useState({
    id_conducteur: true,
    code_conducteur: true,
    nom_conducteur: true,
    prenom_conducteur: true,
    date_naissance_conducteur: true,
    email_conducteur: true,
    telephone_conducteur: true,
    id_parc: true
  });

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prevState: any) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };


  const searchColumn: { [key: string]: number } = {
    id_conducteur: 0,
    code_conducteur: 1,
    nom_conducteur: 2,
    date_naissance_conducteur: 3,
    email_conducteur: 4,
    telephone_conducteur: 5,
    id_sousParc: 6
  };



  const handleTypeSearch = (selectedValue: string) => {

    console.log(selectedValue)
    switch (selectedValue) {
      case translate("ID"):
        console.log(0)
        setType(0);
        break;
      case translate("Code"):
        console.log(1)
        setType(1);
        break;
      case translate("Last and first name"):
        console.log(2)
        setType(2);
        break;
      case translate("Date of birth"):
        console.log(3)
        setType(3);
        break;
      case translate("Email"):
        console.log(4)
        setType(4);
        break;
      case translate("Phone"):
        console.log(5)
        setType(5);
        break;
      case translate("Park"):
        console.log(6)
        setType(6);
        break;
      default:
        console.log('Unknown selection');
        console.log(selectedValue)
        break;
    }
    setTypeSearch(selectedValue);
    console.log('Selected value:', selectedValue);
  };

  const handleAdvancedSearch = async (event: any) => {

    const newValue = event.target.value;
    setSearch(newValue)
    await getDrivers(limit, currentPage, newValue, type, column, sort);
  };


  const handleSortingcolumn = (curentColumn: string) => {

    setSortcolumn(curentColumn)
    sort === "ASC" ? setSort("DESC") : setSort("ASC");
    getDrivers(limit, currentPage, search, type, column, sort);
  };


  const HandleDeleteDriver = async (id_conducteur: number) => {
    try {
      console.log(id_conducteur);
      setModalStatus('Do you want to delete this Driver');
      setTitleStatus('Delete Driver');
      setIdUser(parseInt(id_user || '0', 0));
      setIdDriver(id_conducteur);

      // Perform deletion logic here...

      // After successful deletion, update the vehicle list
      //  await updateVehicleList();
    } catch (error) {
      console.error(error);
    }
  };


  const HandleDetailDriver = async (id_conducteur: number) => {
    try {
      console.log(id_conducteur);
      setModalStatusDetail('Do you want to Show this Driver');
      setTitleStatusDetail('Driver Information :');
      setIdUser(parseInt(id_user || '0', 0));
      setIdDriver(id_conducteur);

      // Perform deletion logic here...

      // After successful deletion, update the vehicle list
      //  await updateVehicleList();
    } catch (error) {
      console.error(error);
    }
  };



  const handleConfirmSalaryDriver = async () => {
    try {

      setModalConfirmStatus('Are you sure you want to validate the salary?');
      setTitleConfirmStatus('Confirm!');
      setIdUser(parseInt(id_user || '0', 0));
      // setIdDriver(id_conducteur);

      // Perform deletion logic here...

      // After successful deletion, update the vehicle list
      //  await updateVehicleList();
    } catch (error) {
      console.error(error);
    }
  };



  const handleDriverAssignmentDriver = async (id_conducteur: number, id_parc: number, nom_parc: string, id_user: any) => {
    try {

      setModalAssignmentStatus('Are you sure you want to assignment this driver to this park?');
      setTitleAssignmentStatus('Driver assignment');
      setIdUser(parseInt(id_user || '0', 0));
      setIdDriver(id_conducteur);
      setIdPark(id_parc)
      setNamePark(nom_parc)
      // Perform deletion logic here...

      // After successful deletion, update the vehicle list
      //  await updateVehicleList();
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalStatus(null);
  };

  const closeDetailModal = () => {
    setModalStatusDetail(null);
  };



  const closeConfirmModal = () => {
    setModalConfirmStatus(null);
  };

  const closeAssignmentModal = () => {
    setModalAssignmentStatus(null);
    setTitleAssignmentStatus("");
    setIdUser(0);
    setIdDriver(0);
    setIdPark(0);
  };

  const handleUpdateDriverList = () => {
    getDrivers(limit, currentPage, search, type, column, sort).catch(error => {
      console.error('Failed to update driver list:', error);
    });
  };

  const handleResetSearch = async () => {
    setSearch("")

    await getDrivers(limit, currentPage, search, type, column, sort)
  };


  const menuItems = [
    translate("ID"),
    translate("Code"),
    translate("Last and first name"),
    translate("Date of birth"),
    translate("Email"),
    translate("Phone"),
    translate("Park")
  ];

  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-user-nurse"></i>
            {translate("Drivers")} <span>{total}</span>
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">


          <NavLink to="/driver/add" className="btn btn-primary mt-2 mr-1">
            <i className="las la-plus mr-3"></i>
            {translate("Add")} {translate("Driver")}
          </NavLink>

          <Button variant="" className="btn btn-outline-secondary  mt-2 mr-1" onClick={() => handleConfirmSalaryDriver()}>
            <i className="las la-cubes mr-3"></i>{translate("Validate employees' salaries")}
          </Button>

          <button
            className="btn btn-outline-secondary  mt-2 mr-1"
            onClick={() => setShowDownloadModal(true)}
          >
            <i className="las la-download"></i>
            {translate("Export")} {translate("Driver")}
          </button>
        </div>
      </div>
      <div className="row">
        <div
          className="col-md-4"
          style={{ margin: "0px 0px 10px 0px", padding: "10px" }}
        >
          <div className="input-group">
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic" >
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
            <input type="text" placeholder={` ${translate("Search by")} ${translate(typeSearch)}`} onChange={handleAdvancedSearch} className="form-control" />
            <Button
              variant="secondary"
              onClick={handleResetSearch}
              className="btn-reset"
            >
              <i className="las la-times" style={{ color: "#fff" }}></i>
            </Button>
          </div>
        </div>
        <div className="col-md-8 d-flex justify-content-end align-items-center">
          <div className="dataTables_length" id="DataTables_Table_0_length">
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
                  checked={selectedColumns.id_conducteur}
                  onChange={() => handleColumnChange("id_conducteur")}
                />
                <span style={{ marginLeft: "10px" }}>
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
                  checked={selectedColumns.code_conducteur}
                  onChange={() => handleColumnChange("code_conducteur")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Code")}
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
                  {translate("Last and first name")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.date_naissance_conducteur}
                  onChange={() => handleColumnChange("date_naissance_conducteur")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Date of birth")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.telephone_conducteur}
                  onChange={() => handleColumnChange("telephone_conducteur")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Phone")}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.email_conducteur}
                  onChange={() => handleColumnChange("email_conducteur")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Email")}
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
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
                        onChange={(e) => handleSelectAllDrivers(e.target.checked)}
                      />
                      <label className="form-check-label"></label>
                </div>
              </th>

              {selectedColumns.id_conducteur && <th className="sorting" onClick={() => handleSortingcolumn("id_conducteur")}>{translate("Id")}</th>}
              {selectedColumns.code_conducteur && (<th className="sorting" onClick={() => handleSortingcolumn("code_conducteur")}>{translate("Code")}</th>)}
              {selectedColumns.nom_conducteur && (<th className="sorting" onClick={() => handleSortingcolumn("nom_conducteur")}>{translate("Last and first name")}</th>)}
              {selectedColumns.date_naissance_conducteur && (<th className="sorting" onClick={() => handleSortingcolumn("date_naissance_conducteur")}>{translate("Date of birth")}</th>)}
              {selectedColumns.email_conducteur && (<th className="sorting" onClick={() => handleSortingcolumn("date_creation")}>{translate("Email")}</th>)}
              {selectedColumns.telephone_conducteur && (<th className="sorting" onClick={() => handleSortingcolumn("email_conducteur")}>{translate("Phone")}</th>)}
              {selectedColumns.id_parc && (<th className="sorting" onClick={() => handleSortingcolumn("id_parc")}>{translate("Park")}</th>)}
              {<th>{translate("Action")}</th>}
            </tr>
          </thead>
          <tbody key="#" className="ligth-body">
            {loading ? (
              <tr style={{ textAlign: "center" }}>
                <td className="text-center" colSpan={10}>
                  <p><PropagateLoader
                    color={"#123abc"}
                    loading={loading}
                    size={20}
                  /></p>
                </td>
              </tr>
            ) :
              (
                list_Drivers.length > 0 ? (
                  list_Drivers.map((driver) => (
                    <tr key={driver.id_conducteur}>
                      <td>
                        <div className="form-check form-check-inline">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`checkbox-${driver.id_conducteur}`}
                            checked={selectedDrivers.includes(driver.id_conducteur.toString())}
                            onChange={() => handleDriversSelect(driver.id_conducteur.toString())}
                          />
                          <label htmlFor={`checkbox-${driver.id_conducteur}`} className="mb-0"></label>
                        </div>
                      </td>
                      {selectedColumns.id_conducteur && <td>{driver.id_conducteur}</td>}
                      {selectedColumns.code_conducteur && (<td>{driver.code_conducteur}</td>)}
                      {selectedColumns.nom_conducteur && (<td>{driver.nom_conducteur + " " + driver.prenom_conducteur}</td>)}
                      {selectedColumns.date_naissance_conducteur && <td>{driver.date_naissance_conducteur != null ? driver.date_naissance_conducteur.split('T')[0] + ' ' + driver.date_naissance_conducteur.split('T')[1].split('.000Z')[0] : translate("None")}</td>}
                      {selectedColumns.email_conducteur && (<td>{driver.email_conducteur}</td>)}
                      {selectedColumns.telephone_conducteur && (<td>{driver.telephone_conducteur}</td>)}
                      {selectedColumns.id_parc && (<td>{driver.nom_parc}</td>)}

                      <td>
                        <div className="d-flex align-items-center list-action">
                          <Link
                            to={`/driver/edit/${driver.id_conducteur}`}
                            className="badge badge-success mr-2"
                            data-toggle="tooltip"
                            data-placement="top"
                            title={translate("Edit") + " " + translate("Driver")}
                          >
                            <i
                              className="las la-cog"
                              style={{ fontSize: "1.2em" }}
                            ></i>
                          </Link>
                          <a className="badge bg-primary mr-2" onClick={() => HandleDetailDriver(driver.id_conducteur)} title={translate("Delete")} >
                            <i
                              className="las la-eye"
                              style={{ fontSize: "1.2em" }}
                            ></i>
                          </a>
                          <a className="badge bg-warning mr-2" 
                          onClick={() => handleDriverAssignmentDriver(driver.id_conducteur, driver.id_parc, driver.nom_parc, id_user)}
                            data-toggle="tooltip"
                            data-placement="top"
                            title={translate("Update park")}
                            data-original-title="Delete"
                          >
                            <i
                              className="ri-share-forward-fill  mr-0"
                              style={{ fontSize: "1.2em" }}
                            ></i>
                          </a>
                          <a className="badge bg-primary mr-2" onClick={() => HandleDeleteDriver(driver.id_conducteur)} title={translate("Delete")} >
                            <i
                              className="las la-trash"
                              style={{ fontSize: "1.2em" }}
                            ></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))) : (

                  <tr>
                    <td colSpan={9}>No drivers available</td>
                  </tr>
                )
              )}
          </tbody>
        </Table>
        {/* <TrainingCalendar eventsData={trainingData} /> */}
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            {translate("Displaying")} {list_Drivers.length} {translate("on")}{" "}
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
        <DriverDeleteModal
          show={modalStatus !== null}
          onHide={closeModal}
          status={modalStatus}
          title={titleStatus}
          IdUser={IdUser}
          IdDriver={IdDriver}
          updateDriverList={handleUpdateDriverList}
        />
        
        <DriverDetailsModal
          show={modalStatusDetail !== null}
          onHide={closeDetailModal}
          status={modalStatusDetail}
          title={titleStatusDetail}
          IdUser={IdUser}
          IdDriver={IdDriver}
        />

        <ConfirmSalaryModal
          show={modalConfirmStatus !== null}
          onHide={closeConfirmModal}
          status={modalConfirmStatus}
          title={titleConfirmStatus}
          IdUser={IdUser}
        // updateConfirmSalaryList={ }       
        />

        <DriverAssignmentModal
          show={modalAssignmentStatus !== null}
          onHide={closeAssignmentModal}
          status={modalAssignmentStatus}
          title={titleAssignmentStatus}
          id_user={IdUser}
          id_driver={IdDriver}
          id_parc={IdPark}
          updateDriverList={handleUpdateDriverList}
        />

        <DownloadModal
          show={showDownloadModal}
          onHide={() => setShowDownloadModal(false)}
          onDownloadConfirm={onDownloadConfirm}
        />

      </div>
    </>
  );
}

