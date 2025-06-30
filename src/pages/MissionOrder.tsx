import React, { useState, useEffect } from "react";
import { Button, Dropdown, Modal, Table } from "react-bootstrap";
import { Form, Link, NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { PropagateLoader } from 'react-spinners';
import { jsPDF } from 'jspdf';

import 'jspdf-autotable';
//import DriverModal from "../components/Driver/DriverModal";
import ConfirmSalaryModal from "../components/Driver/ConfirmSalaryModal";
import DriverAssignmentModal from "../components/Driver/DriverAssignmentModal";
import { DownloadModal, generateExcelFile, generatePDFFile, handleDownloadConfirm, toTimestamp } from "../utilities/functions";

import MissionOrderPreview from "../components/MissionOrder/MissionOrderPreview";
import MissionOrderDeleteModal from "../components/MissionOrder/MissionOrderDeleteModal";




interface MissionOrder {
  id_mission: number;
  ref_mission: number;
  object_mission: string;
  fuel_loading_mission: number;
  fuel_type_mission: number;
  expenses_mission: number;
  tank_mission: number;
  trailer_mission: number;
  driver_mission: string;
  accomp_mission: number;
  dep_loc_mission: string;
  dep_date_mission: string;
  dep_dest_mission: string;
  return_date_mission: number;
  itinerary_mission: string;
  vehicle_km_mission: number;
  new_km_mission: number;
  fuel_cost_mission: number;
  fuel_level_mission: number;
  voucher_mission: number;
  immatriculation_vehicule : string;
  id_vehicule : number;
  id_user: string;

}



export function MissionOrder() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { translate } = useTranslate();
  let [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const id_user = localStorage.getItem("GeopUserID");
  const [fileData, setFileData] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const [modalStatus, setModalStatus] = useState<string | null>(null);
  const [titleStatus, setTitleStatus] = useState<string | null>(null);
  const [selectedMissionOrder, setSelectedMissionOrder] = useState<any | null>(null);

  const [IdUser, setIdUser] = useState<number>(0);
  const [previewVisible, setPreviewVisible] = useState(false); // Gestion de la visibilité du modal

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // Modal pour aperçu
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);   // Modal pour suppression

  

  const [loading, setLoading] = useState(true); // Add loading state
  const [pageCount, setPageCount] = useState(0);
  let [total, settotal] = useState(0);
  const [colum, setSortColum] = useState("id_mission");
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [type, setType] = useState(0);
  const [typeSearch, setTypeSearch] = useState(translate("ID"));

  const [IdMissionOrder, setIdMissionOrder] = useState<number>(0);


  const [list_MissionOrder, setMissionOrder] = useState<MissionOrder[]>([]);


  const getMissionOrder = async (
  limitValue: number, 
  currentPage: number, 
  search: string, 
  type: number, 
  colum: string, 
  sort: string
) => {
  try {
    setLoading(true);

    // Préparation des paramètres pour la requête
    const params = {
      limitValue,
      currentPage,
      id_user,
      search,
      type,
      colum,
      sort
    };

    // 1. Récupération du nombre total de missions
    const totalPagesResponse = await fetch(`${backendUrl}/api/geop/missionOrderManage/totalpage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id_user, 
        search,
        type // Ajout du type si nécessaire dans votre backend
      }),
      mode: 'cors',
    });

    if (!totalPagesResponse.ok) {
      throw new Error("Failed to fetch total pages");
    }

    const totalData = await totalPagesResponse.json();
    const total = totalData.count; // Accès direct à la propriété count
    settotal(total);

    // 2. Récupération des données paginées
    const missionOrderResponse = await fetch(`${backendUrl}/api/geop/missionOrderManage/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      mode: 'cors',
    });

    if (!missionOrderResponse.ok) {
      throw new Error("Failed to fetch mission orders");
    }

    const data = await missionOrderResponse.json();
    
    // Calcul de la pagination
    setPageCount(Math.ceil(total / limitValue));
    setLimit(limitValue);
    setMissionOrder(data);
    
    return data;
  } catch (error) {
    console.error("Error fetching mission orders:", error);
    // Gestion d'erreur avec toast ou autre
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

  const handlePreviewClick = (missionOrder: any) => {
    console.log("Selected Mission:", missionOrder); 
    setSelectedMissionOrder(missionOrder); // Store the mission order data
    setIsPreviewModalOpen(true); // Open the modal
  };
  
  const closePreviewModal = () => {
    setIsPreviewModalOpen(false); // Close the modal
  };


  const [showPreviewModal, setShowPreviewModal] = useState(false);


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
    ref_mission: true,
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
    immatriculation_vehicule : true,
  });
  

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prevState: any) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };


  const searchColum: { [key: string]: number } = {
    id_mission: 0,
    object_mission: 1,
    ref_mission: 2,
    dep_date_mission: 3,
    vehicle_mission: 4,
    driver_mission: 5
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
    await getMissionOrder(limit, currentPage, newValue, type, colum, sort);
  };


  const handleSortingColum = (curentColum: string) => {

    setSortColum(curentColum)
    sort === "ASC" ? setSort("DESC") : setSort("ASC");
    getMissionOrder(limit, currentPage, search, type, colum, sort);
  };


  const handledeleteMissionOrder = async (id_mission: number) => {
    try {
      console.log(id_mission);
      setModalStatus(`${translate('Do you want to delete this')} ${translate('Mission Order')}?`);
      setTitleStatus('Delete MissionOrder');
      setIdUser(parseInt(id_user || '0', 0));
      setIdMissionOrder(id_mission);

    
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalStatus(null);
  };


  const handleUpdateMissionOrderList = () => {
    getMissionOrder(limit, currentPage, search, type, colum, sort).catch(error => {
      console.error('Failed to update driver list:', error);
    });
  };

  const handleResetSearch = async () => {
    setSearch("")

    await getMissionOrder(limit, currentPage, search, type, colum, sort)
  };

  const menuItems = [
    translate("ID"),
    translate("Object"),
    translate("Reference"),
    translate("Departure Date"),
    translate("Vehicle"),
    translate("Driver")
   ];

   
   const generatePDFPreview = (missionOrder: MissionOrder) => {
    const doc = new jsPDF();
  
    // Exemple : Ajout des détails de la mission dans le PDF
    doc.text("Mission Order Details", 20, 10);
    doc.text(`Mission Ref: ${missionOrder.ref_mission}`, 20, 20);
    doc.text(`Mission Object: ${missionOrder.object_mission}`, 20, 30);
    doc.text(`Fuel Type: ${missionOrder.fuel_type_mission}`, 20, 40);
    doc.text(`Driver: ${missionOrder.driver_mission}`, 20, 50);
    doc.text(`Departure Location: ${missionOrder.dep_loc_mission}`, 20, 60);
    doc.text(`Departure Date: ${missionOrder.dep_date_mission}`, 20, 70);
    doc.text(`Return Date: ${missionOrder.return_date_mission}`, 20, 80);
    doc.text(`Vehicle Registration: ${missionOrder.immatriculation_vehicule}`, 20, 90);
  
    // Génère le PDF comme un blob
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
  
    // Affiche l'aperçu
    setPdfUrl(pdfUrl);
    setPreviewVisible(true);
  };
  const handleDownloadPreview = () => {
    const doc = new jsPDF();
  
    // Récupérer le contenu du modal
    const content = `
      Mission Ref: ${selectedMissionOrder?.ref_mission}
      Object: ${selectedMissionOrder?.object_mission}
      Driver: ${selectedMissionOrder?.driver_mission}
      Vehicle: ${selectedMissionOrder?.immatriculation_vehicule}
      Departure Location: ${selectedMissionOrder?.dep_loc_mission}
      Itinerary: ${selectedMissionOrder?.itinerary_mission}
    `;
  
    // Ajouter le contenu au PDF
    doc.text(content, 10, 10);
  
    // Télécharger le PDF
    doc.save("MissionOrder_Preview.pdf");
  };
  
  const fetchPdf = async () => {
    try {
      const response = await fetch('/path/to/your/pdf');
      const blob = await response.blob();
      setFileData(blob);
      const fileUrl = URL.createObjectURL(blob);
      setPdfUrl(fileUrl);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

 function formatDatetimeLocal(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }


  


  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-tasks"></i>
            {translate("Missions Order")} <span>{total < 10 ? `0${total}` : total}</span> 
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">


          <NavLink to="/mission-order-manage/add" className="btn btn-primary mt-2 mr-1">
            <i className="las la-plus mr-3"></i>
             {translate("Missions Order")}
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
                  checked={selectedColumns.ref_mission}
                  onChange={() => handleColumnChange("ref_mission")}
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
                  checked={selectedColumns.immatriculation_vehicule }
                  onChange={() => handleColumnChange("immatriculation_vehicule ")}
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
              {selectedColumns.ref_mission && (<th className="sorting" onClick={() => handleSortingColum("ref_mission")}>{translate("Reference")}</th>)}
              {selectedColumns.object_mission && (<th className="sorting" onClick={() => handleSortingColum("object_mission")}>{translate("Object")}</th>)}
              {selectedColumns.dep_date_mission && (<th className="sorting" onClick={() => handleSortingColum("dep_date_mission")}>{translate("Departure Date")}</th>)}
              {selectedColumns.immatriculation_vehicule  && (<th className="sorting" onClick={() => handleSortingColum("immatriculation_vehicule ")}>{translate("Vehicle")}</th>)}  
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
                      {selectedColumns.ref_mission && (<td>{missionOrder.ref_mission}</td>)}
                      {selectedColumns.object_mission && (<td>{missionOrder.object_mission}</td>)}
                      {selectedColumns.dep_date_mission && (<td>{formatDatetimeLocal(missionOrder.dep_date_mission)}</td>)}
                      {selectedColumns.immatriculation_vehicule  && (<td>{missionOrder.immatriculation_vehicule }</td>)}
                      {selectedColumns.driver_mission && (<td>{missionOrder.driver_mission}</td>)}

                     
                      <td>
                        <div className="d-flex align-items-center list-action">
                        <a
                          className="badge bg-primary mr-2"
                          onClick={() => {
                            console.log("Selected Mission:", missionOrder);
                            setSelectedMissionOrder(missionOrder); // Set the mission
                            setIsPreviewModalOpen(true); // Open the modal
                          }}
                          title={translate("Preview") + " " + translate("Mission Order")}
                        >
                          <i className="las la-eye" style={{ fontSize: "1.2em" }}></i>
                        </a>
                          <Link
                            to={`/mission-order-manage/edit/${missionOrder.id_mission}`}
                            className="badge badge-success mr-2"
                            data-toggle="tooltip"
                            data-placement="top"
                            title={translate("Edit") + " " + translate("Mission Order")}
                          >
                            <i
                              className="las la-edit"
                              style={{ fontSize: "1.2em" }}
                            ></i>
                          </Link>

                        

                    <a
                      className="badge bg-danger mr-2"
                      onClick={() => handledeleteMissionOrder(missionOrder.id_mission)}
                      title={translate("Delete")}
                    >
                      <i className="las la-trash" style={{ fontSize: "1.2em" }}></i>
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
            {translate("Displaying")} {list_MissionOrder.length} {translate("on")}{" "}
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
      
          <MissionOrderDeleteModal
          show={modalStatus !== null}
          onHide={closeModal}
          status={modalStatus}
          title={titleStatus}
          IdUser={IdUser}
          IdMissionOrder={IdMissionOrder}
          updateMissionOrderList={handleUpdateMissionOrderList}
        />
         <MissionOrderPreview
            show={isPreviewModalOpen} // Contrôle si le modal est ouvert
            onHide={() => setIsPreviewModalOpen(false)} // Fonction pour fermer le modal
            status={modalStatus} // Statut de la mission (peut être null)
            title={titleStatus} // Titre du modal
            IdUser={IdUser} // Id de l'utilisateur
            IdMissionOrder={IdMissionOrder} // Id de la mission
            selectedMissionOrder={selectedMissionOrder} // Mission sélectionnée
            updateMissionOrderList={handleUpdateMissionOrderList} // Fonction pour mettre à jour la liste
          />



      
      </div>
    </>
  );
}
function convertValue(maintenance: any) {
  throw new Error("Function not implemented.");
}

