/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { Button, Dropdown, Modal, Nav, Table } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { DownloadModal, formatToTimestamp, generateExcelFile, generatePDFFile, handleDownloadConfirm, toTimestamp } from "../utilities/functions";
import { PropagateLoader } from "react-spinners";
import TooltipText from "../components/TooltipText";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import GeoFenceUploadModal from "../components/Park/GeoFenceUploadModal";
import DeletePOIModal from "../components/Park/PoiModal";

interface ParkInterface{
  idgeof: number;
  codegeof: string;
  namegeof: string;
  descriptiongeof: string;
  username_user: string;
  etatgeof: string;
  areageof: string;
  areageofdata: string;
  datecreategeof: string;
}

export function Parks() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { translate } = useTranslate();
  let [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [list_park, setPark] = useState<ParkInterface[]>([]);
  const id_user = localStorage.getItem("GeopUserID");
  const [loading, setLoading] = useState(true); // Add loading state
  const [pageCount, setPageCount] = useState(0);
  let [total, setTotal] = useState(0);
  const [colum, setSortColum] = useState("idgeof");
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [type, setType] = useState(0);
  const [typeSearch, setTypeSearch] = useState("ID POI");
  const [selectedSearch, setSelectedSearch] = useState(translate("ID POI"));
  const [selectedPois, setSelectedPois] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showCreatePOIModal, setShowCreatePOIModal] = useState(false);
  const handleShowCreatePOIModal = () => setShowCreatePOIModal(true);
  const handleCloseCreatePOIModal = () => setShowCreatePOIModal(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<string | null>(null);
  const [titleStatus, setTitleStatus] = useState<string | null>(null);
  const [IdUser, setIdUser] = useState<number>(0);
  const [IdPoi, setIdPoi] = useState<number>(0);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    // Votre logique de soumission ici
  };


  function generateExcelFileModel() {
    // Définir les données de l'en-tête et les lignes du modèle
    const data = [
      ["codegeof", "namegeof", "descriptiongeof", "areageof"],
    ];

    // Créer une nouvelle feuille de calcul (worksheet)
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Créer un nouveau classeur (workbook)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GeoFenceModel");

    // Générer le fichier Excel (XLSX) et le déclencher en téléchargement
    XLSX.writeFile(workbook, "GeoFence_Model.xlsx");
  }

  const getPOI = async (
    limitValue: number,
    currentPage: number,
    search: string,
    type: number,
    colum: string,
    sort: string
  ) => {
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
        sort,
      });

      // Récupération du nombre total de pages
      const totalPagesResponse = await fetch(
        `${backendUrl}/api/poi/totalpage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyData,
          mode: "cors",
        }
      );

      const totalPagesJson = await totalPagesResponse.json();
      const total = totalPagesJson[0]["count"];
      setTotal(total);

      // Retrieving alarm data
      const POIResponse = await fetch(`${backendUrl}/api/poi/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
        mode: "cors",
      });

      if (!POIResponse.ok) {
        console.error("Error retrieving POI listI");
        setLoading(false);
        return;
      }


      const data = await POIResponse.json();
      setPageCount(Math.ceil(total / limitValue));
      setLimit(limitValue);
      setPark(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const refreshPOI = () => {
    getPOI(limit, currentPage, search, type, colum, sort);
  };


  const getPOIlimitValue = async (
    limitValue: number,
    currentPage: number,
    search: string,
    type: number,
    colum: string,
    sort: string
  ) => {
    try {
      setLoading(true);

      // Preparing the data to send
      const bodyData = JSON.stringify({
        limitValue,
        currentPage,
        search,
        type,
        id_user,
        colum,
        sort,
      });

      // Retrieve the total number of pages
      const totalPagesResponse = await fetch(
        `${backendUrl}/api/poi/totalpage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyData,
          mode: "cors",
        }
      );

      const totalPagesJson = await totalPagesResponse.json();
      const total = totalPagesJson[0]["count"];
      setTotal(total);

      // Retrieving alarm data
      const POIResponse = await fetch(`${backendUrl}/api/poi/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
        mode: "cors",
      });

      const data = await POIResponse.json();
      setPageCount(Math.ceil(total / limitValue));
      setLimit(limitValue);

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
    const commentsFormServer = await getPOI(
      limit,
      currentPage,
      search,
      type,
      colum,
      sort
    );
    // setPark(commentsFormServer);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getPOI(limit, currentPage, search, type, colum, sort);
  }, []);

  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setCurrentPage(1); // Réinitialiser currentPage à 1 lorsque la limite change
    setLimit(newValue);
    const commentsFormServer = await getPOIlimitValue(
      parseInt(newValue),
      1,
      search,
      type,
      colum,
      sort
    ); // Ajouter await ici
    setPark(commentsFormServer);
    window.scrollTo(0, 0);
  };

  const [selectedColumns, setSelectedColumns] = useState({
    idgeof: true,
    codegeof: true,
    namegeof: true,
    descriptiongeof: true,
    areageof: true,
    username_user: true,
    etatgeof: true,
    datecreategeof: true,
  });

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prevState: any) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };

  const handleTypeSearch = (event: any) => {
    const selectedValue = event.target.textContent;

    switch (selectedValue) {
      case translate("ID POI"):
        setSelectedSearch(translate("ID POI"))
        setType(0);
        break;
      case translate("Code"):
        setSelectedSearch(translate("Code"))
        setType(1);
        break;
      case translate("Name"):
        setSelectedSearch(translate("Name"))
        setType(2);
        break;
      case translate("Description"):
        setSelectedSearch(translate("Description"))
        setType(3);
        break;
      case translate("User"):
        setSelectedSearch(translate("User"))
        setType(4);
        break;
      case translate("State"):
        setSelectedSearch(translate("State"))
        setType(5);
        break;
      case translate("Type"):
        setSelectedSearch(translate("Type"))
        setType(6);
        break;
      case translate("Creation date"):
        setSelectedSearch(translate("Creation date"))
        setType(7);
        break;
      default:
        console.log("Unknown selection");
        break;
    }

    setTypeSearch(selectedValue);
    console.log("Selected value:", selectedValue);
  };

  const handleAdvancedSearch = async (event: any) => {
    const newValue = event.target.value;
    setSearch(newValue);
    await getPOI(limit, currentPage, newValue, type, colum, sort);
  };

  const handleSortingColum = (curentColum: string) => {
    setSortColum(curentColum);
    sort == "ASC" ? setSort("DESC") : setSort("ASC");
    setCurrentPage(1)
    getPOI(limit, 1, search, type, colum, sort);
  };

  const options = [
    "ID POI",
    "Code",
    "Name",
    "Description",
    "User",
    "State",
    "Type",
    "Creation date"
  ];

  const poiHeaders = [
    translate("ID POI"),
    translate("Code"),
    translate("Name"),
    translate("Description"),
    translate("Format"),
    translate("Creation date")
  ];


  const downloadVehicleExcel = () => {

    const selectedData = list_park.filter((poi) =>
      selectedPois.includes(poi.idgeof.toString())
    ).map((poi) => [
      poi.idgeof,
      poi.codegeof,
      poi.namegeof,
      poi.descriptiongeof,
      poi.areageofdata,
      toTimestamp(poi.datecreategeof),
    ]);


    generateExcelFile(translate("List") + ' ' + translate("POIs"), poiHeaders, selectedData);
  };

  const downloadVehiclePDF = () => {


    const selectedData = list_park.filter((poi) =>
      selectedPois.includes(poi.idgeof.toString())
    ).map((poi) => [
      poi.idgeof,
      poi.codegeof,
      poi.namegeof,
      poi.descriptiongeof,
      poi.areageofdata,
      toTimestamp(poi.datecreategeof),
    ]);

    generatePDFFile(translate("List") + ' ' + translate("POIs"), poiHeaders, selectedData);
  };

  const onDownloadConfirm = (format: string) => {
    if (selectedPois.length > 0) {
      handleDownloadConfirm(format, downloadVehicleExcel, downloadVehiclePDF);
    } else {
      toast.warn("Please select at least one POI", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const [isPoisSelected, setIsPoisSelected] = useState(false);

  // Dans la fonction handleDriverSelect
  const handlePoisSelect = (PoiID: string) => {
    let updatedSelectedPois: string[] = [];

    console.log(PoiID);

    // Gère la sélection ou désélection en fonction de selectAll
    if (selectAll) {
      updatedSelectedPois = selectedPois.includes(PoiID)
        ? selectedPois.filter(id => id !== PoiID) // If already selected, deselect
        : list_park.map(poi => poi.idgeof.toString()); // Select all POI
    } else {
      // Manages the selection/selection of an individual POI
      if (selectedPois.includes(PoiID)) {
        updatedSelectedPois = selectedPois.filter(id => id !== PoiID);
      } else {
        updatedSelectedPois = [...selectedPois, PoiID];
      }
    }

    // Updates the list of selected POI
    setSelectedPois(updatedSelectedPois);

    // Updates the POI state
    setIsPoisSelected(updatedSelectedPois.length > 0);
    console.log(updatedSelectedPois);
  };

  // Si vous souhaitez désélectionner la case à cocher globale lorsque toutes les cases individuelles sont désélectionnées.
  useEffect(() => {
    // Si la liste des POIs sélectionnés est vide, désactivez la sélection générale
    if (selectedPois.length === 0 && selectAll) {
      setSelectAll(false);
    }
  }, [selectedPois, selectAll]);

  // Fonction pour gérer la sélection/désélection de tous les POIs
  const handleSelectAllPois = (checked: boolean) => {
    setSelectAll(checked);

    if (checked) {
      // Sélectionner tous les POIs
      const allPoiIDs = list_park.map((poi) => poi.idgeof.toString()); // Convertir en chaînes de caractères
      setSelectedPois(allPoiIDs);
      setIsPoisSelected(true); // Marquer comme sélectionné
    } else {
      // Désélectionner tous les POIs
      setSelectedPois([]);
      setIsPoisSelected(false); // Marquer comme non sélectionné
    }
  };


  const handleDeletePoi = async (id_vehicule: string, IdUser: number) => {
    try {
      console.log(id_vehicule);
      setModalStatus('Do you want to delete this geo-fence');
      setTitleStatus('Delete geo-fence');
      setIdUser(IdUser);
      setIdPoi(parseInt(id_vehicule));

    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalStatus(null);
  };



  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-map-pin"></i>
            {translate("Parks")} ({total})
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">

          <NavLink to="/park/add" className="btn btn-primary  mr-1">
            <i className="las la-plus fs-5"></i>
            {translate('New park')}
          </NavLink >

          <Button
            variant=""
            className="mr-1 btn btn-outline-secondary"
            onClick={() => setShowDownloadModal(true)}
          >
            <i className="las la-download fs-5"></i>  {translate("Export")}
          </Button>

          <Button
            variant=""
            className="mr-1 btn btn-outline-secondary"
            onClick={handleShowCreatePOIModal}
          >
            <i className="las la-upload fs-5"></i>{translate("Upload park")}
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
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                <i
                  className="fas fa-chevron-down"
                  style={{ fontSize: "20" }}
                ></i>
              </Dropdown.Toggle>
              <Dropdown.Menu onClick={handleTypeSearch}>
                {options.map(option => (
                  <Dropdown.Item
                    key={option}
                    className={`${selectedSearch == translate(option) ? 'active' : ''}`}
                    onClick={() => setSelectedSearch(translate(option))}
                  >
                    {translate(option)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <input
              type="text"
              placeholder={` By ${typeSearch}`}
              onChange={handleAdvancedSearch}
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-8 d-flex justify-content-end align-items-center">
          <Button
            variant=""
            className="mr-1 border-0 btn btn-outline-secondary"
            onClick={generateExcelFileModel}
            title={translate("Please fill in the mandatory attributes: geo-fence code, name, description, geo-fence format")}
          >
            <i className="las la-file-excel fs-4"></i>{translate("Model of excel POI")}
          </Button>
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
                  checked={selectedColumns.idgeof}
                  onChange={() => handleColumnChange("idgeof")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("ID Park")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.codegeof}
                  onChange={() => handleColumnChange("codegeof")}
                />
                <span style={{ marginLeft: "10px" }}>{translate("Code")}</span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.namegeof}
                  onChange={() => handleColumnChange("namegeof")}
                />
                <span style={{ marginLeft: "10px" }}>{translate("Name")}</span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.descriptiongeof}
                  onChange={() => handleColumnChange("descriptiongeof")}
                />
                <span style={{ marginLeft: "10px" }}>{translate("Description")}</span>
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
                <span style={{ marginLeft: "10px" }}>{translate("User")}</span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.areageof}
                  onChange={() => handleColumnChange("areageof")}
                />
                <span style={{ marginLeft: "10px" }}>{translate("Type")}</span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.etatgeof}
                  onChange={() => handleColumnChange("etatgeof")}
                />
                <span style={{ marginLeft: "10px" }}>{translate("State")}</span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.datecreategeof}
                  onChange={() => handleColumnChange("datecreategeof")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Date created")}
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="row m-1">
        <div className="table-responsive">
          <Table className="dataTable">
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
                <th>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      checked={selectAll}
                      onChange={(e) => handleSelectAllPois(e.target.checked)}
                      type="checkbox" />
                    <label className="form-check-label"></label>
                  </div>
                </th>
                {selectedColumns.idgeof && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("idgeof")}
                  >
                    {translate("ID Park")}
                  </th>
                )}
                {selectedColumns.codegeof && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("codegeof")}
                  >
                    {translate("Code")}
                  </th>
                )}
                {selectedColumns.namegeof && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("namegeof")}
                  >
                    {translate("Name")}
                  </th>
                )}
                {selectedColumns.descriptiongeof && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("descriptiongeof")}
                  >
                    {translate("Description")}
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
                {selectedColumns.etatgeof && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("etatgeof")}
                  >
                    {translate("State")}
                  </th>
                )}
                {selectedColumns.datecreategeof && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("datecreategeof")}
                  >
                    {translate("Type")}
                  </th>
                )}

                {selectedColumns.datecreategeof && (
                  <th
                    className="sorting"
                    onClick={() => handleSortingColum("datecreategeof")}
                  >
                    {translate("Date created")}
                  </th>
                )}
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
              ) : list_park.length > 0 ? (
                list_park.map((poi) => (
                  <tr key={poi.idgeof}>
                    <td>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`checkbox-${poi.idgeof}`}
                          checked={selectedPois.includes(poi.idgeof.toString())}
                          onChange={() => handlePoisSelect(poi.idgeof.toString())}
                        />
                      </div>
                    </td>
                    {selectedColumns.idgeof && <td>{poi.idgeof}</td>}
                    {selectedColumns.codegeof && <td>{poi.codegeof}</td>}
                    {selectedColumns.namegeof && <td>{<TooltipText fullText={poi.namegeof} />}</td>}
                    {selectedColumns.descriptiongeof && <td>{poi.descriptiongeof}</td>}
                    {selectedColumns.username_user && <td>{poi.username_user}</td>}
                    {selectedColumns.etatgeof && <td className={poi.etatgeof == "Active" ? `text-success` : `text-danger`}>{poi.etatgeof}</td>}
                    {selectedColumns.areageof && <td>{poi.areageof}</td>}
                    {selectedColumns.datecreategeof && (<td>{formatToTimestamp(poi.datecreategeof)}</td>)}
                    <td>
                      <div className="d-flex align-items-center list-action">
                        <Link
                          to={`/park/edit/${poi.idgeof}`}
                          className="badge badge-success mr-2"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Edit park"
                        >
                          <i
                            className="las la-cog"
                            style={{ fontSize: "1.2em" }}
                          ></i>
                        </Link>
                        <Link
                          to={`#`}
                          className="badge badge-warning  mr-2"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Delete POI"
                        >
                          <i
                            className="las la-trash"
                            style={{ fontSize: "1.2em" }}
                            onClick={() => handleDeletePoi(poi.idgeof.toString(), parseInt(id_user ?? "0", 10))}
                          ></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10}>None Park available</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            {translate("Displaying")} {list_park.length} {translate("out of")}{" "}
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
        <GeoFenceUploadModal
          show={showCreatePOIModal}
          onHide={handleCloseCreatePOIModal}
          refreshGeofences={refreshPOI}
        />
        <DownloadModal
          show={showDownloadModal}
          onHide={() => setShowDownloadModal(false)}
          onDownloadConfirm={onDownloadConfirm}
        />
        <DeletePOIModal
          show={modalStatus !== null}
          onHide={closeModal}
          status={modalStatus}
          title={titleStatus}
          IdUser={IdUser}
          IdPOI={IdPoi}
          updatePOIList={refreshPOI}
        />
      </div>
    </>
  );
}
