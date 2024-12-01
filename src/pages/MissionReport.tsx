import React, { useState, useEffect } from "react";
import { Button, Dropdown, Modal, Table } from "react-bootstrap";
import { Form, Link, NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { PropagateLoader } from 'react-spinners';
//import DriverModal from "../components/Driver/DriverModal";
import ConfirmSalaryModal from "../components/Driver/ConfirmSalaryModal";
import DriverAssignmentModal from "../components/Driver/DriverAssignmentModal";
import { DownloadModal, generateExcelFile, generatePDFFile, handleDownloadConfirm, toTimestamp } from "../utilities/functions";

import MissionReportDeleteModal from "../components/MissionReport/MissionReportDeleteModal";



interface MissionReport {
  id_misrap: number;               // Primary key with AUTO_INCREMENT
  ref_misrap: string;               // Reference, varchar(20)
  objt_misrap: string;              // Object of the mission, varchar(20)
  carb_misrap: string;              // Type of fuel, varchar(20)
  frais_misrap: number;             // Expenses, int(11)
  vehicule_misrap: string;         // Vehicle registration, varchar(20)
  remorque_misrap: string;         // Trailer, varchar(20)
  cond_misrap: string;             // Driver, varchar(20)
  acc_misrap: string;              // Accomplice, varchar(20)
  itnr_misrap: string;             // Itinerary, varchar(20)
  amort_misrap: number;            // Amortization, int(11)
  dep_misrap: string;              // Departure location, varchar(20)
  date_dep_misrap: string;         // Departure date, varchar(20)
  lieu_misrap: string;             // Place, varchar(20)
  date_arr_misrap: string;         // Arrival date, varchar(20)
  km_dep_misrap: number;           // Departure km, int(11)
  nuit_misrap: number;             // Night, int(11)
  immob_misrap: number;            // Immobilization, int(11)
  durr_misrap: number;             // Duration, int(11)
  km_ret_misrap: number;           // Return km, int(11)
  dist_misrap: number;            // Distance, int(11)
  id_user: string;


}



export function MissionReport() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { translate } = useTranslate();
  let [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const id_user = localStorage.getItem("GeopUserID");
 
  const [modalStatus, setModalStatus] = useState<string | null>(null);
  const [titleStatus, setTitleStatus] = useState<string | null>(null);

  const [IdUser, setIdUser] = useState<number>(0);
 

  const [loading, setLoading] = useState(true); // Add loading state
  const [pageCount, setPageCount] = useState(0);
  let [total, settotal] = useState(0);
  const [colum, setSortColum] = useState("id_conducteur");
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [type, setType] = useState(2);
  const [typeSearch, setTypeSearch] = useState(translate("Last and first name"));

  const [IdMissionReport, setIdMissionReport] = useState<number>(0);


  const [list_MissionReport, setMissionReport] = useState<MissionReport[]>([]);


  const driverHeaders = [
    translate("ID"),
    translate("Code"),
    translate("Last and first name"),
    translate("Date of birth"),
    translate("Phone"),
    translate("Email"),
    translate("Park")
  ];

  

  //
  const getMissionReport = async (limitValue: number, currentPage: number, search: string, type: number, colum: string, sort: string) => {
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
      const totalPagesResponse = await fetch(`${backendUrl}/api/geop/missionReportManage/totalpage`, {
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
      const MissionReportResponse = await fetch(`${backendUrl}/api/geop/missionReportManage/search`, {
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
      

      const data = await MissionReportResponse.json();
      setPageCount(Math.ceil(total / limitValue));
      setLimit(limitValue)
      setMissionReport(data);
      return data;
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };






  const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1;
    await getMissionReport(limit, currentPage, search, type, colum, sort);
    //setDrivers(commentsFormServer);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    getMissionReport(limit, currentPage, search, type, colum, sort);
  }, []);

 

  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setCurrentPage(1); // Réinitialiser currentPage à 1 lorsque la limite change
    setLimit(newValue);
    const commentsFormServer = await getMissionReport(parseInt(newValue), 1, search, type, colum, sort); // Ajouter await ici
    setMissionReport(commentsFormServer);
    window.scrollTo(0, 0);
  };


  const [selectedColumns, setSelectedColumns] = useState({
    
    id_misrap: true,
    ref_misrap: true,
    objt_misrap: true,
    carb_misrap: true,
    frais_misrap: true,
    vehicule_misrap: true,
    remorque_misrap: true,
    cond_misrap: true,
    acc_misrap: true,
    itnr_misrap: true,
    amort_misrap: true,
    dep_misrap: true,
    date_dep_misrap: true,
    lieu_misrap: true,
    date_arr_misrap: true,
    km_dep_misrap: true,
    nuit_misrap: true,
    immob_misrap: true,
    durr_misrap: true,
    km_ret_misrap: true,
    dist_misrap: true,
    id_user: true, // Set id_user only if not editing
  });
  

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prevState: any) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };


  const searchColum: { [key: string]: number } = {
    id_misrap: 0,
    objt_misrap: 1,
    ref_misrap: 2,
    date_dep_misrap: 3,
    vehicule_misrap: 4,
    cond_misrap: 5
  };



  const handleTypeSearch = (selectedValue: string) => {

    console.log(selectedValue)
    switch (selectedValue) {
      case translate("ID"):
        console.log(0)
        setType(0);
        break;
      case translate("Object"):
        console.log(1)
        setType(1);
        break;
      case translate("Reference"):
        console.log(2)
        setType(2);
        break;
      case translate("Departure Date"):
        console.log(3)
        setType(3);
        break;
      case translate("Vehicle"):
        console.log(4)
        setType(4);
        break;
      case translate("Driver"):
        console.log(5)
        setType(5);
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
    await getMissionReport(limit, currentPage, newValue, type, colum, sort);
  };


  const handleSortingColum = (curentColum: string) => {

    setSortColum(curentColum)
    sort === "ASC" ? setSort("DESC") : setSort("ASC");
    getMissionReport(limit, currentPage, search, type, colum, sort);
  };


  const handledeleteMissionReport = async (id_misrap: number) => {
    try {
      console.log(id_misrap);
      setModalStatus('Do you want to delete this MissionReport');
      setTitleStatus('Delete MissionReport');
      setIdUser(parseInt(id_user || '0', 0));
      setIdMissionReport(id_misrap);

    
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalStatus(null);
  };


  const handleUpdateMissionReportList = () => {
    getMissionReport(limit, currentPage, search, type, colum, sort).catch(error => {
      console.error('Failed to update driver list:', error);
    });
  };

  const handleResetSearch = async () => {
    setSearch("")

    await getMissionReport(limit, currentPage, search, type, colum, sort)
  };

  const menuItems = [
    translate("ID"),
    translate("Object"),
    translate("Reference"),
    translate("Departure Date"),
    translate("Vehicle"),
    translate("Driver")
   ];

  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-tasks"></i>
            {translate(" Missions Report")} <span>{total}</span>
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">


          <NavLink to="/mission-report-manage/add" className="btn btn-primary mt-2 mr-1">
            <i className="las la-plus mr-3"></i>
            {translate("New")} {translate("Mission Report")}
          </NavLink>

        

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
                  checked={selectedColumns.id_misrap}
                  onChange={() => handleColumnChange("id_misrap")}
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
                  checked={selectedColumns.ref_misrap}
                  onChange={() => handleColumnChange("ref_misrap")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Reference")}
                </span>
              </Dropdown.Item>
              
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.objt_misrap}
                  onChange={() => handleColumnChange("objt_misrap")}
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
                  checked={selectedColumns.cond_misrap}
                  onChange={() => handleColumnChange("cond_misrap")}
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
                  checked={selectedColumns.date_dep_misrap}
                  onChange={() => handleColumnChange("date_dep_misrap")}
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
                  checked={selectedColumns.vehicule_misrap }
                  onChange={() => handleColumnChange("vehicule_misrap ")}
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
              {selectedColumns.id_misrap && (<th className="sorting" onClick={() => handleSortingColum("id_misrap")}>{translate("ID")}</th>)}
              {selectedColumns.ref_misrap && (<th className="sorting" onClick={() => handleSortingColum("ref_misrapon")}>{translate("Reference")}</th>)}
              {selectedColumns.objt_misrap && (<th className="sorting" onClick={() => handleSortingColum("objt_misrap")}>{translate("Object")}</th>)}
              {selectedColumns.date_dep_misrap && (<th className="sorting" onClick={() => handleSortingColum("date_dep_misrap")}>{translate("Departure Date")}</th>)}
              {selectedColumns.vehicule_misrap  && (<th className="sorting" onClick={() => handleSortingColum("vehicule_misrap ")}>{translate("Vehicle")}</th>)}  
              {selectedColumns.cond_misrap && (<th className="sorting" onClick={() => handleSortingColum("cond_misrap")}>{translate("Driver")}</th>)}


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
                list_MissionReport.length > 0 ? (
                  list_MissionReport.map((missionReport) => (
                    <tr key={missionReport.id_misrap}>
                      <td>
                        <div className="form-check form-check-inline">
                          <input type="checkbox" className="form-check-input" />
                        </div>
                      </td>
                      {selectedColumns.id_misrap && (<td>{missionReport.id_misrap}</td>)}
                      {selectedColumns.ref_misrap && (<td>{missionReport.ref_misrap}</td>)}
                      {selectedColumns.objt_misrap && (<td>{missionReport.objt_misrap}</td>)}
                      {selectedColumns.date_dep_misrap && (<td>{missionReport.date_dep_misrap}</td>)}
                      {selectedColumns.vehicule_misrap  && (<td>{missionReport.vehicule_misrap }</td>)}
                      {selectedColumns.cond_misrap && (<td>{missionReport.cond_misrap}</td>)}


                      

                      <td>
                        <div className="d-flex align-items-center list-action">
                          <Link
                            to={`/mission-report-manage/edit/${missionReport.id_misrap}`}
                            className="badge badge-success mr-2"
                            data-toggle="tooltip"
                            data-placement="top"
                            title={translate("Edit") + " " + translate("Mission Report")}
                          >
                            <i
                              className="las la-cog"
                              style={{ fontSize: "1.2em" }}
                            ></i>
                          </Link>
                         
                          
                          <a className="badge bg-primary mr-2" onClick={() => handledeleteMissionReport(missionReport.id_misrap)} title={translate("Delete")} >
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
                    <td colSpan={9}>No Mission Reports available</td>
                  </tr>
                )
              )}
          </tbody>
        </Table>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            {translate("Displaying")} {list_MissionReport.length} {translate("on")}{" "}
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

        <MissionReportDeleteModal
          show={modalStatus !== null}
          onHide={closeModal}
          status={modalStatus}
          title={titleStatus}
          IdUser={IdUser}
          IdMissionReport={IdMissionReport}
          updateMissionReportList={handleUpdateMissionReportList}
        />

      
      </div>
      
        

      
      
    </>
  );
}
function convertValue(maintenance: any) {
  throw new Error("Function not implemented.");
}

