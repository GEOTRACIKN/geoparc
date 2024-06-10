import React, { useState, useEffect } from "react";
import { Button, Dropdown, Modal, Table } from "react-bootstrap";
import { Form, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { formatToTimestamp } from "../utilities/functions";
import { PropagateLoader } from 'react-spinners'; 
import ModalNewContrat from "../components/NewContart"

interface Drivers {
  id_conducteur:number;
  code_conducteur:number;
  nom_conducteur:string;
  prenom_conducteur:string;
  date_naissance_conducteur:string;
  email_conducteur:string;	
  telephone_conducteur:string;
  id_parc:number; 
}



export function Contrat() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { translate } = useTranslate();
  let [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [list_Drivers, setDrivers] = useState<Drivers[]>([]);
  const id_user = localStorage.getItem("GeopUserID");
  const [loading, setLoading] = useState(true); // Add loading state
  const [pageCount, setpageCount] = useState(0);
  let [total, settotal] = useState(0);   
  const [colum, setSortColum] = useState("id_conducteur");
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState(""); 
  const [type, setType] = useState(0); 
  const [typeSeach, setTypeSeach] = useState("ID");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);  

  const handleSubmit = () => {
    // Votre logique de soumission ici
  };

  const getAlarm = async (limitValue: number, currentPage: number, search: string, type: number, colum: string, sortr: string) => {
    try {
      setLoading(true);

      // Préparation des données à envoyer
      const bodyData = JSON.stringify({
        limitValue,
        currentPage,
        search,
        type,
        id_user,
        colum,
        sort
      });

      // Récupération du nombre total de pages
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
      settotal(total); 

      // Récupération des données d'alarmes
      const DriversResponse = await fetch(`${backendUrl}/api/geop/driver/search`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyData,
        mode: 'cors',
      });

      const data = await DriversResponse.json();
      setpageCount(Math.ceil(total / limitValue));
      setLimit(limitValue) 
      setDrivers(data);
  
    } catch (error) {
      console.error(error);
 
    } finally {
      setLoading(false);
    }
  };



  const getAlarmlimitValue = async (limitValue: number, currentPage: number, search: string, type: number, colum: string, sortr: string) => {
    try {
      setLoading(true);

      // Préparation des données à envoyer
      const bodyData = JSON.stringify({
        limitValue,
        currentPage,
        search,
        type,
        id_user,
        colum,
        sort
      });

      // Récupération du nombre total de pages
      const totalPagesResponse = await fetch(`${backendUrl}/api/alarm/totalpage`, {
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

      // Récupération des données d'alarmes
      const DriversResponse = await fetch(`${backendUrl}/api/alarm/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyData,
        mode: 'cors',
      });

      const data = await DriversResponse.json();
      setpageCount(Math.ceil(total / limitValue));
      setLimit(limitValue)
    
      return data;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1;
    const commentsFormServer = await getAlarm(limit, currentPage, search, type, colum, sort);
    // setDrivers(commentsFormServer);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getAlarm(limit, currentPage, search, type, colum, sort);
  }, []);


  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setCurrentPage(1); // Réinitialiser currentPage à 1 lorsque la limite change
    setLimit(newValue);
    const commentsFormServer = await getAlarmlimitValue(parseInt(newValue), 1, search, type, colum, sort); // Ajouter await ici
    setDrivers(commentsFormServer);
    window.scrollTo(0, 0); 
  };
  

  const [selectedColumns, setSelectedColumns] = useState({
    id_contrat:true,
    driver:true,
    contrat_start:true,
    contrat_end:true,
    type:true,
    rh_refererence:true,
  });

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prevState: any) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };



  
  const handleTypeSearch = (event:any) => {
    const selectedValue = event.target.textContent;
   
    switch (selectedValue) {
      case translate("ID Contrat"):
          setType(0);
        break;
      case translate("Driver"):
       setType(1);
       
        break;
      case translate("contract start date"):
     setType(2);
 
        break;
      case translate("contract end date"):
         setType(3);
        break;
        case translate("Type"):
          setType(4);
         break;
         case translate("HR reference"):
          setType(4);
         break;
      default:
        console.log('Unknown selection');
        break;
    }
    setTypeSeach(selectedValue);
    console.log('Selected value:', selectedValue); 
  };

  const handleAdvancedSearch = async (event:any) => {

    const newValue = event.target.value; 
    setSearch(newValue)
    await getAlarm(limit, currentPage, search, type, colum, sort);
  };


  const handleSortingColum =  (curentColum:string) => {

    setSortColum(curentColum) 
    sort=="ASC" ? setSort("DESC") :  setSort("ASC") ; 
     getAlarm(limit, currentPage, search, type, colum, sort);
  };



  
  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
           <i className="las la-file-contract"></i> 
            {translate("Contrats")} ({total})
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">
          <Button variant="" className="btn btn-primary mt-2 mr-1" onClick={handleShow}>
            <i className="las la-plus mr-3"></i>Add Contrat 
          </Button>
          {/* <Button variant="" className="btn btn-outline-secondary  mt-2 mr-1" onClick={handleShowCreateTicketModal}>
            <i className="las la-cubes mr-3"></i>Validate employees' salaries
          </Button> */}
          <Button variant="" className="btn btn-outline-info mt-2 mr-1">
            <i className="las la-file-excel mr-3"></i>Import Contrat 
          </Button>
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
              <Dropdown.Menu onClick={handleTypeSearch}>
                <Dropdown.Item>{translate("ID Contrat")}</Dropdown.Item>
                <Dropdown.Item>{translate("Driver")}</Dropdown.Item>
                <Dropdown.Item>{translate("contract start date")}</Dropdown.Item>
                <Dropdown.Item>{translate("contract end date")}</Dropdown.Item>
                <Dropdown.Item>{translate("Type")}</Dropdown.Item>
                <Dropdown.Item>{translate("HR reference")}</Dropdown.Item> 
              </Dropdown.Menu>
            </Dropdown>
            <input type="text" placeholder={` By ${typeSeach}` } onChange={handleAdvancedSearch} className="form-control" />
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
              title="Colonnes dʼaffichage"
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
                  checked={selectedColumns.id_contrat}
                  onChange={() => handleColumnChange("id_contrat")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("N° contrat")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.driver}
                  onChange={() => handleColumnChange("driver")}
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
                  checked={selectedColumns.contrat_start}
                  onChange={() => handleColumnChange("contrat_start")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("contract start date")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.contrat_end}
                  onChange={() => handleColumnChange("contrat_end")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("contract end date")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.type}
                  onChange={() => handleColumnChange("type")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("type")}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.rh_refererence} 
                  onChange={() => handleColumnChange("rh_refererence")}
                />
                <span style={{ marginLeft: "10px" }}>{translate("HR reference")}</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="row m-1">
        <Table className="dataTable">
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label"></label>
                </div>
              </th> 

              {selectedColumns.id_contrat && <th className="sorting" onClick={() => handleSortingColum("id_contrat")}>{translate("N° contrat")}</th>}
              {selectedColumns.driver && (<th className="sorting"  onClick={() => handleSortingColum("driver")}>{translate("Driver")}</th>)}
              {selectedColumns.contrat_start && (<th className="sorting"  onClick={() => handleSortingColum("contrat_start")}>{translate("contract start date")}</th>)}
              {selectedColumns.contrat_end && (<th className="sorting"  onClick={() => handleSortingColum("contrat_end")}>{translate("contract end date")}</th>)}
              {selectedColumns.type && (<th className="sorting"  onClick={() => handleSortingColum("type")}>{translate("type")}</th>)}
              {selectedColumns.rh_refererence && (<th className="sorting"  onClick={() => handleSortingColum("rh_refererence")}>{translate("HR reference")}</th>)}
              {<th>{translate("Action")}</th>}
            </tr>
          </thead>
          <tbody key="#" className="ligth-body">
            {loading ? (
              <tr > 
                <td className="text-center" colSpan={7}> <PropagateLoader color={'#123abc'} loading={loading} size={20} /></td>
              </tr>
            ) : 
            (
              list_Drivers.length > 0 ? (
                list_Drivers.map((driver) => (
                  <tr key={driver.id_conducteur}>
                    <td>
                      <div className="form-check form-check-inline">
                        <input type="checkbox" className="form-check-input" />
                      </div>
                    </td>
                    {selectedColumns.id_contrat && <td>{driver.id_conducteur }</td>}
                    {selectedColumns.driver && (<td>{driver.code_conducteur}</td>)}  
                    {selectedColumns.contrat_start && (<td>{driver.nom_conducteur+" " + driver.prenom_conducteur}</td>)}
                    {selectedColumns.contrat_end && <td>{formatToTimestamp(driver.date_naissance_conducteur)}</td>}
                    {selectedColumns.type && (<td>{driver.email_conducteur}</td>)}
                    {selectedColumns.rh_refererence && (<td>{driver.telephone_conducteur}</td>)}
                 
                    <td>
                      <div className="d-flex align-items-center list-action">
                      <a
                     
                     className="badge badge-success mr-2"
                     data-toggle="tooltip"
                     data-placement="top"
                     title="Détail"
                   >
                     <i
                       className="fa fa-eye"
                       style={{ fontSize: "1.2em", cursor:"pointer"  }}   
                     ></i>
                   </a>

                   <a
                     className="badge bg-primary mr-2"
                     data-toggle="tooltip"
                     data-placement="top"
                     title="edit"
                     data-original-title="edit"
                   >
                     <i
                       className="las la-edit"
                       style={{ fontSize: "1.2em", cursor:"pointer"  }}                        ></i>
                   </a>
                   <a
                     className="badge bg-warning mr-2"
                     data-toggle="tooltip"
                     data-placement="top"
                     title="Delete"
                     style={{ cursor: "pointer" }}
                   >
                     {" "}
                     <i
                       className="ri-delete-bin-line mr-0"
                       style={{ fontSize: "1.2em", cursor: "pointer" }}
                     ></i>{" "}
                   </a>
                      </div>
                    </td>
                  </tr>
                ))) : (

                <tr>
                  <td colSpan={7}>No drivers available</td>
                </tr>
              )
              )}
          </tbody>
        </Table>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            {translate("Displaying")} {list_Drivers.length} {translate("out of")}{" "}
            {total}
          </span>
        </div>
        <div className="col-md-6">
          <ReactPaginate
              previousLabel={translate("previous")}
              nextLabel={translate("next")}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center"}
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
        <ModalNewContrat show={showModal} handleClose={handleClose}/>
      </div>
    </>
  );
}
