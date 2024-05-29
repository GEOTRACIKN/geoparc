import { Dropdown, Table,Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { useState, useEffect } from "react";
import AdvancedSearch from "../components/AdvancedSearch";
import NewSinisterModal from "../components/NewSinisterModal";


type Sinister = {
  id_sinistre: number;
  sinister_type: string;
  vehicle_license: string;
  sinister_cost: string;
  sinister_detail: string;
  sinister_datetime: string;
  vehicle_registration_2: string;
  sinister_location: string;
  sinister_report: string;
  driver_name: string;
  // Add other properties as needed
};
const initialColumns = {
  id_sinistre: true,
  sinister_type: true,
  vehicle_license: true,
  sinister_cost: true,
  sinister_detail: true,
  sinister_datetime: true,
  sinister_location: true,
  sinister_report:true,
  driver_name:true,
};

export function VehicleSinister() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const userID = 21;
  let currentPage = 1;
  const { translate } = useTranslate();
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [list_Sinisters, setSinisters] = useState<Sinister[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("sinister_type"); // Default search type
  const [showModal, setShowModal] = useState(false);

 

  // API call to get total count of sinisters
  const getTotalCount = async (searchTerm: string, searchType: string) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/sinister/count/${21}?searchTerm=${searchTerm}&searchType=${searchType}`
      );
      const data = await res.json();
      setTotal(data[0].total_count);
      setPageCount(Math.ceil(data[0].total_count / limit));
    } catch (error) {
      console.error(
        "Erreur lors du chargement du nombre total de sinistres :",
        error
      );
    }
  };

  // API call to get sinisters
  const getSinisters = async (
    currentPage: number,
    limit: number,
    searchTerm: string,
    searchType: string
  ) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/sinister/${21}/${currentPage}/${limit}?searchTerm=${searchTerm}&searchType=${searchType}`
      );
      const data = await res.json();
      setSinisters(data);
    } catch (error) {
      console.error("Erreur lors du chargement des sinistres :", error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Load selected columns from localStorage or use initial state
  const loadSelectedColumns = () => {
    const savedColumns = localStorage.getItem("selectedColumns");
    return savedColumns ? JSON.parse(savedColumns) : initialColumns;
  };
  const handleColumnChange = (column: string) => {
    const updatedColumns = {
      ...selectedColumns,
      [column]: !selectedColumns[column],
    };
    setSelectedColumns(updatedColumns);
    localStorage.setItem("selectedColumns", JSON.stringify(updatedColumns)); // Save selected columns to localStorage
  };

  const [selectedColumns, setSelectedColumns] = useState(loadSelectedColumns);

  useEffect(() => {
    getTotalCount(searchTerm, searchType);
    getSinisters(currentPage, limit, searchTerm, searchType);
  }, [limit, searchTerm, searchType]);

  console.log(list_Sinisters);
  const handlePageClick = async (data: any) => {
    let selectedPage = data.selected + 1;
    await getSinisters(selectedPage, limit, searchTerm, searchType);
    window.scrollTo(0, 0);
  };

  const handleSearch = (term: string, type: string) => {
    setSearchTerm(term);
    setSearchType(type);
  };
  const clearSearchTerm = () => {
    setSearchTerm("");
    // Call getSinisters with empty search term to reset table data
    getSinisters(currentPage, limit, "", searchType);
  };

  const options = [10, 20, 40, 60, 80, 100, 200, 500]; // Page size options
  const searchOptions = [
    "sinister_type",
    "license_vhc",
    "sinister_location",
    "driver_name"
  ];
  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i
              className="las la-car"
              data-rel="bootstrap-tooltip"
              title="Increased"
            ></i>
            {translate("Vehicles Sinister")} ({total})
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">
  <Button variant="primary" className="mt-2 mr-1" onClick={handleShow}>
    <i className="las la-plus mr-3"></i>
    {translate("Add sinister")}
  </Button>
</div>
      </div>
      <div className="row">
        <div
          className="col-md-4"
          style={{ margin: "0px 0px 10px 0px", padding: "10px" }}
        >
          <AdvancedSearch
            searchOptions={searchOptions}
            onSearch={handleSearch}
            clearSearchTerm={clearSearchTerm}
            placeholderText={`${searchType}`}
          />
        </div>
        <div className="col-md-8 d-flex justify-content-end align-items-center">
          <Dropdown>
            <Dropdown.Toggle
              variant=""
              id="dropdown-basic"
              title="Résultats d'affichage"
            >
              <i className="fas fa-list-alt"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {options.map((option) => (
                <Dropdown.Item key={option} onClick={() => setLimit(option)}>
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle
              variant=""
              id="dropdown-basic"
              title="Colonnes dʼaffichage"
            >
              <i className="fas fa-eye"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.id_sinistre}
                  onChange={() => handleColumnChange("id_sinistre")}
                />
                <span style={{ marginLeft: "10px" }}>id</span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.sinister_datetime}
                  onChange={() => handleColumnChange("sinister_datetime")}
                />
                <span style={{ marginLeft: "10px" }}>{translate("Date")}</span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.sinister_type}
                  onChange={() => handleColumnChange("sinister_type")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("sinister type")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.sinister_location}
                  onChange={() => handleColumnChange("sinister_location")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("location")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.vehicle_license}
                  onChange={() => handleColumnChange("vehicle_license")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("vehicle license")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.driver_name}
                  onChange={() => handleColumnChange("driver_name")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Driver Name")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.sinister_detail}
                  onChange={() => handleColumnChange("sinister_detail")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("sinister detail")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.sinister_cost}
                  onChange={() => handleColumnChange("sinister_cost")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("sinister cost")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.sinister_report}
                  onChange={() => handleColumnChange("sinister_report")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("sinister State")}
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="row m-1">
        <Table>
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label"></label>
                </div>
              </th>
              {selectedColumns.id_sinistre &&<th>N°</th>}
             {selectedColumns.sinister_type &&<th>{translate("Type")}</th>}
              {selectedColumns.sinister_datetime &&<th>{translate("Date")}</th>}
             {selectedColumns.sinister_location &&<th>{translate("Location")}</th>}
              {selectedColumns.vehicle_license &&<th>{translate("Vehicle 1")}</th>}
              {selectedColumns.driver_name &&<th>{translate("Driver Name")}</th>}
            {selectedColumns.sinister_detail &&<th>{translate("Sinister Detail")}</th>}
              {selectedColumns.sinister_cost &&<th>{translate("Sinister Cost")}</th>}
              {selectedColumns.sinister_report &&<th>{translate("sinister report")}</th>}
              <th>{translate("Actions")}</th>
            </tr>
          </thead>
          <tbody key="#" className="ligth-body">
            {Array.isArray(list_Sinisters) && list_Sinisters.length > 0 ? (
              list_Sinisters.map((sinister) => (
                <tr key={sinister.id_sinistre}>
                  <td>
                    <div className="form-check form-check-inline">
                      <input type="checkbox" className="form-check-input" />
                    </div>
                  </td>
                  {selectedColumns.id_sinistre &&<td>{sinister.id_sinistre}</td>}
                  {selectedColumns.sinister_type &&<td>{sinister.sinister_type}</td>}
                { selectedColumns.sinister_datetime &&<td>
                    {new Date(sinister.sinister_datetime).toLocaleString()}
                  </td>}
                  {selectedColumns.sinister_location &&<td>{sinister.sinister_location}</td>}
                  {selectedColumns.vehicle_license &&<td>{sinister.vehicle_license}</td>}
                  {selectedColumns.driver_name &&<td>{sinister.driver_name}</td>}
                  {selectedColumns.sinister_detail &&<td>{sinister.sinister_detail}</td>}
                  {selectedColumns.sinister_cost && <td>{sinister.sinister_cost}</td>}
                  {selectedColumns.sinister_report && <td>{sinister.sinister_report}</td>}
                  <td>
                    <div className="d-flex align-items-center list-action">
                      <Link
                        to={`#`}
                        className="badge badge-success mr-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Détail"
                      >
                        <i
                          className="fa fa-eye"
                          style={{ fontSize: "1.2em" }}
                        ></i>
                      </Link>
                      <a
                        className="badge bg-warning mr-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete"
                        data-original-title="Delete"
                      >
                        <i
                          className="ri-delete-bin-line mr-0"
                          style={{ fontSize: "1.2em" }}
                        ></i>
                      </a>
                      <a
                        className="badge bg-primary mr-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="download"
                        data-original-title="download"
                      >
                        <i
                          className="las la-download"
                          style={{ fontSize: "1.2em" }}
                        ></i>
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">
                  No sinisters found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            Affichage 1 à {limit} sur {total}{" "}
          </span>
        </div>
        <div className="col-md-6">
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
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
          />
        </div>
        <NewSinisterModal show={showModal} onClose={handleClose}></NewSinisterModal>
      </div>
    
    </>
    
  );
}
