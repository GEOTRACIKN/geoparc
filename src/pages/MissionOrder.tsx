import React, { useState, useEffect } from "react";
import { Button, Dropdown, Modal, Table } from "react-bootstrap";
import { Form, Link, NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { PropagateLoader } from 'react-spinners';
//import DriverModal from "../components/Driver/DriverModal";
import ConfirmSalaryModal from "../components/Driver/ConfirmSalaryModal";
import DriverAssignmentModal from "../components/Driver/DriverAssignmentModal";
import { DownloadModal, generateExcelFile, generatePDFFile, handleDownloadConfirm, toTimestamp } from "../utilities/functions";

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
interface MissionOrder {
  id_mission: number;
  object_mission: string;
  fuel_loading_mission: number;
  fuel_type_mission: number;
  expenses_mission: number;
  tank_mission: number;
  trailer_mission: number;
  driver_mission: number;
  accomp_mission: number;
  dep_loc_mission: string;
  dep_date_mission: number;
  dep_dest_mission: string;
  return_date_mission: number;
  itinerary_mission: string;
  vehicle_km_mission: number;
  new_km_mission: number;
  fuel_cost_mission: number;
  fuel_level_mission: number;
  voucher_mission: number;
  vehicle_mission: number;
  id_user: string;

}



export function MissionOrder() {
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
  let [total, settotal] = useState(0);
  const [colum, setSortColum] = useState("id_conducteur");
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [type, setType] = useState(2);
  const [typeSearch, setTypeSearch] = useState(translate("Last and first name"));
  const [showDownloadModal, setShowDownloadModal] = useState(false); 



  const [list_MissionOrder, setMissionOrder] = useState<MissionOrder[]>([]);


  const driverHeaders = [
    translate("ID"),
    translate("Code"),
    translate("Last and first name"),
    translate("Date of birth"),
    translate("Phone"),
    translate("Email"),
    translate("Park")
  ];

  const driverData = list_Drivers.map(driver=> [
    driver.id_conducteur,
    driver.code_conducteur,
    driver.nom_conducteur+' '+ driver.prenom_conducteur,
    toTimestamp(driver.date_naissance_conducteur),
    driver.telephone_conducteur,
    driver.email_conducteur,
    driver.nom_parc,
  ]);

  
  
  const downloadVehicleExcel = () => {
    generateExcelFile(translate("List")+' '+translate("Drivers"), driverHeaders, driverData);
  };

  const downloadVehiclePDF = () => {
    generatePDFFile(translate("List")+' '+translate("Drivers"), driverHeaders, driverData);
  };

  const onDownloadConfirm = (format: string) => {
    handleDownloadConfirm(format, downloadVehicleExcel, downloadVehiclePDF);
  };
  


  const getDrivers = async (limitValue: number, currentPage: number, search: string, type: number, colum: string, sort: string) => {
    try {
      setLoading(true);

      // Preparing the data to send
      const bodyData = JSON.stringify({
        limitValue,
        currentPage,
        search,
        type,
        id_user,
        colum: searchColum[colum],
        sort
      });

      // Retrieve the total number of pages
    
      // Retrieve driver data
      const DriversResponsssse = await fetch(`${backendUrl}/api/geop/driver/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyData,
        mode: 'cors',
      });
      //setDrivers et data et dDreiversResponse
      // DriversReesponse et serDrivers 


      //partie mission
      

      const datan = await DriversResponsssse.json();
      setPageCount(Math.ceil(total / limitValue));
      setLimit(limitValue)
      return datan;
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  //
  const getMissionOrder = async (limitValue: number, currentPage: number, search: string, type: number, colum: string, sort: string) => {
    try {
      setLoading(true);

      // Preparing the data to send
      const bodyData = JSON.stringify({
        limitValue,
        currentPage,
        search,
        type,
        id_user,
        colum: searchColum[colum],
        sort
      });

      // Retrieve the total number of pages
      const totalPagesResponse = await fetch(`${backendUrl}/api/geop/missionOrderManage/totalpage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyData,
        mode: 'cors',
      });

      const totalPagesJson = await totalPagesResponse.json();
      const total = totalPagesJson[0]["count"];
      settotal(total);

      // Retrieve driver data
      const MissionOrderResponse = await fetch(`${backendUrl}/api/geop/missionOrderManage/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyData,
        mode: 'cors',
      });
      //setDrivers et data et dDreiversResponse
      // DriversReesponse et serDrivers 


      //partie mission
      

      const data = await MissionOrderResponse.json();
      setPageCount(Math.ceil(total / limitValue));
      setLimit(limitValue)
      setMissionOrder(data);
      return data;
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };






  const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1;
    await getMissionOrder(limit, currentPage, search, type, colum, sort);
    //setDrivers(commentsFormServer);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    getMissionOrder(limit, currentPage, search, type, colum, sort);
  }, []);

 

  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setCurrentPage(1); // Réinitialiser currentPage à 1 lorsque la limite change
    setLimit(newValue);
    const commentsFormServer = await getMissionOrder(parseInt(newValue), 1, search, type, colum, sort); // Ajouter await ici
    setMissionOrder(commentsFormServer);
    window.scrollTo(0, 0);
  };


  const [selectedColumns, setSelectedColumns] = useState({
    id_mission: true,
    object_mission: true,
    fuel_loading_mission: true,
    fuel_type_mission: true,
    expenses_mission: true,
    tank_mission: true,
    trailer_mission: true,
    driver_mission: true,
    accomp_mission: true,
    dep_loc_mission: true,
    dep_date_mission: true,
    dep_dest_mission: true,
    return_date_mission: true,
    itinerary_mission: true,
    vehicle_km_mission: true,
    new_km_mission: true,
    fuel_cost_mission: true,
    fuel_level_mission: true,
    voucher_mission: true,
    vehicle_mission: true,
  });
  

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prevState: any) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };


  const searchColum: { [key: string]: number } = {
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
    await getMissionOrder(limit, currentPage, newValue, type, colum, sort);
  };


  const handleSortingColum = (curentColum: string) => {

    setSortColum(curentColum)
    sort === "ASC" ? setSort("DESC") : setSort("ASC");
    getMissionOrder(limit, currentPage, search, type, colum, sort);
  };


  const handledeleteDriver = async (id_conducteur: number) => {
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
    getDrivers(limit, currentPage, search, type, colum, sort).catch(error => {
      console.error('Failed to update driver list:', error);
    });
  };

  const handleResetSearch = async () => {
    setSearch("")

    await getDrivers(limit, currentPage, search, type, colum, sort)
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
            {translate("Missions Order")} <span>{total}</span>
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">


          <NavLink to="/mission-order-manage/add" className="btn btn-primary mt-2 mr-1">
            <i className="las la-plus mr-3"></i>
            {translate("Add")} {translate("Mission Order")}
          </NavLink>

        

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
                  checked={selectedColumns.id_mission}
                  onChange={() => handleColumnChange("id_mission")}
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
                  checked={selectedColumns.voucher_mission}
                  onChange={() => handleColumnChange("voucher_mission")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Voucher")}
                </span>
              </Dropdown.Item>
              
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.object_mission}
                  onChange={() => handleColumnChange("object_mission")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Object")}
                </span>
              </Dropdown.Item>



              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.driver_mission}
                  onChange={() => handleColumnChange("driver_mission")}
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
                  checked={selectedColumns.dep_date_mission}
                  onChange={() => handleColumnChange("dep_date_mission")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Departure Date")}
                </span>
              </Dropdown.Item>



             
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.vehicle_mission}
                  onChange={() => handleColumnChange("vehicle_mission")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Vehicle")}
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
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label"></label>
                </div>
              </th>
              {selectedColumns.id_mission && (<th className="sorting" onClick={() => handleSortingColum("id_mission")}>{translate("ID")}</th>)}
              {selectedColumns.voucher_mission && (<th className="sorting" onClick={() => handleSortingColum("voucher_mission")}>{translate("Voucher")}</th>)}

              {selectedColumns.object_mission && (<th className="sorting" onClick={() => handleSortingColum("object_mission")}>{translate("Object")}</th>)}
              {selectedColumns.dep_date_mission && (<th className="sorting" onClick={() => handleSortingColum("dep_date_mission")}>{translate("Departure Date")}</th>)}
              {selectedColumns.vehicle_mission && (<th className="sorting" onClick={() => handleSortingColum("vehicle_mission")}>{translate("Vehicle")}</th>)}


              
              {selectedColumns.driver_mission && (<th className="sorting" onClick={() => handleSortingColum("driver_mission")}>{translate("Driver")}</th>)}


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
                list_MissionOrder.length > 0 ? (
                  list_MissionOrder.map((missionOrder) => (
                    <tr key={missionOrder.id_mission}>
                      <td>
                        <div className="form-check form-check-inline">
                          <input type="checkbox" className="form-check-input" />
                        </div>
                      </td>
                      {selectedColumns.id_mission && (<td>{missionOrder.id_mission}</td>)}
                      {selectedColumns.voucher_mission && (<td>{missionOrder.voucher_mission}</td>)}
                      {selectedColumns.object_mission && (<td>{missionOrder.object_mission}</td>)}
                      {selectedColumns.dep_date_mission && (<td>{missionOrder.dep_date_mission}</td>)}
                      {selectedColumns.vehicle_mission && (<td>{missionOrder.vehicle_mission}</td>)}

                   
                      {selectedColumns.driver_mission && (<td>{missionOrder.driver_mission}</td>)}


                      

                      <td>
                        <div className="d-flex align-items-center list-action">
                          <Link
                            to={`/mission-order-manage/edit/${missionOrder.id_mission}`}
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
                          <a className="badge bg-warning mr-2"   onClick={() => {}}
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
                          <a className="badge bg-primary mr-2"   onClick={() => {}} >
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
                    <td colSpan={9}>No Mission Orders available</td>
                  </tr>
                )
              )}
          </tbody>
        </Table>
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
            containerClassName={"pagination justify-right"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
        {/*
<DriverModal
  show={modalStatus !== null}
  onHide={closeModal}
  status={modalStatus}
  title={titleStatus}
  IdUser={IdUser}
  IdDriver={IdDriver}
  updateDriverList={handleUpdateDriverList}
/>
*/}

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
function convertValue(maintenance: any) {
  throw new Error("Function not implemented.");
}

