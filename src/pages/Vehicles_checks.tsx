import { Dropdown, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { useState, useEffect } from "react";
import AdvancedSearch from "../components/AdvancedSearch";
import { toTimestamp } from "../functions";
import { Bounce, toast } from "react-toastify";

type Vehicles = {
  id_verif: string;
  creation_date: string;
  checker: string;
  driver_out: string;
  driver_in: string;
  tractor_number: string;
  trailer_number: string;
  maintenance: number;
};

export function Vehicleschecks() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const userID = localStorage.getItem("userID");
  let currentPage = 1;
  const { translate } = useTranslate();
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [list_Vehicleschecks, setItems] = useState<Vehicles[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('Checker');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedvehiclecheckID, setSelectedvehiclecheckID] = useState<string | null>(null);


  const initialColumns = {
    id_verif: true,
    creation_date: true,
    Checker: true,
    Driver_out: true,
    Driver_in: true,
    tractor_number: true,
    trailer_number: true,
    maintenance: true,
  };
  // Load selected columns from localStorage or use initial state
  const loadSelectedColumns = () => {
    const savedColumns = localStorage.getItem("selectedColumns");
    return savedColumns ? JSON.parse(savedColumns) : initialColumns;
  };
  const [selectedColumns, setSelectedColumns] = useState(loadSelectedColumns);

  // getVehicleschecks api 
  const getVehicleschecks = async (currentPage: number, limit: number) => {
    try {
      const total_pages = await fetch(`${backendUrl}/api/geop/vehiclecheck/totalpage/${1}?searchTerm=${searchTerm}&searchType=${searchType}`,
        { mode: "cors" });
      const totalpages = await total_pages.json();
      const total = totalpages[0].total;
      setTotal(total);
      const calculatedPageCount = Math.ceil(total / limit);
      setPageCount(calculatedPageCount);

      const res = await fetch(`${backendUrl}/api/geop/vehiclecheck/${1}/${currentPage}/${limit}?searchTerm=${searchTerm}&searchType=${searchType}`,
        { mode: "cors" });
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Erreur lors du chargement des Vehicles Vérifié :", error);
    }
  };
  // fetchVehicleschecks api 
  const fetchVehicleschecks = async (currentPage: number, limit: number) => {
    const res = await fetch(`${backendUrl}/api/geop/vehiclecheck/${1}/${currentPage}/${limit}?searchTerm=${searchTerm}&searchType=${searchType}`,
      { mode: "cors" });
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    getVehicleschecks(currentPage, limit);
  }, [searchTerm, limit]);

  const refreshVehicleschecksData = async () => {
    getVehicleschecks(currentPage, limit);
  };


  const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1;
    const commentsFormServer = await fetchVehicleschecks(currentPage, limit);
    setItems(commentsFormServer);
    window.scrollTo(0, 0);
  };

  const handleColumnChange = (column: string) => {
    const updatedColumns = {
      ...selectedColumns,
      [column]: !selectedColumns[column],
    };
    setSelectedColumns(updatedColumns);
    localStorage.setItem("selectedColumns", JSON.stringify(updatedColumns));  // Save selected columns to localStorage
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
    // Call getVehicleschecks with empty search term to reset table data
    getVehicleschecks(currentPage, limit);
  };

  // Function to handle search
  const searchOptions = ['Checker', 'Driver_out', 'Driver_in', 'tractor_number'];
  const handleSearch = (term: string, type: string) => {
    setSearchTerm(term);
    setSearchType(type);
    getVehicleschecks(currentPage, limit);
  };

  const options = [10, 20, 40, 60, 80, 100, 200, 500]; // Les options de taille de page mises à jour

  //------- Partie Delete -------
  const handleConfirmDelete = async () => {
    try {
      const loggedInuserID = 1;

      const response = await fetch(`${backendUrl}/api/geop/delete/${selectedvehiclecheckID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loggedInuserID: loggedInuserID }),

      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression logique. Statut : ${response.status}`);
      }

      const result = await response.json();

      // Fermez le modal après la suppression
      setShowDeleteModal(false);

      if (response.ok) {

        toast.success("Vehcile check Deleted successfully !", {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        refreshVehicleschecksData();
      }

    } catch (error) {
      console.error(error);
      toast.error("Erreur Deleted Vehcile check", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

    }
  };

  const handleDeleteClick = (id_verif: any) => {
    setSelectedvehiclecheckID(id_verif);
    setShowDeleteModal(true);
  };


  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-car" data-rel="bootstrap-tooltip" title="Increased"></i>
            {translate("Verified Vehicles")} ({total})
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">
          <Link to="/Vehicle_check" className="btn btn-primary mt-2 mr-1">
            <i className="las la-plus mr-3"></i>
            {translate("Add Verification")}
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4" style={{ margin: '0px 0px 10px 0px', padding: '10px' }}>
          <AdvancedSearch
            searchOptions={searchOptions}
            onSearch={handleSearch}
            clearSearchTerm={clearSearchTerm}
            placeholderText={`${searchType}`}
          />
        </div>
        <div className="col-md-8 d-flex justify-content-end align-items-center">
          {/* Dropdown Pour le Show du tableau */}
          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic" title="Résultats d'affichage">
              <i className="fas fa-list-alt"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {options.map((option) => (
                <Dropdown.Item key={option}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`checkbox-${option}`}
                      checked={limit === option}
                      onChange={() => setLimit(option)}
                    />
                    <label className="form-check-label" htmlFor={`checkbox-${option}`}>
                      {option}
                    </label>
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>

          </Dropdown>
          {/* Dropdown Pour le filtrage du tableau */}
          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic" title="Colonnes dʼaffichage">
              <i className="fas fa-eye"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.id_verif}
                  onChange={() => handleColumnChange("id_verif")}
                />
                <span style={{ marginLeft: '10px' }}>id</span>
              </Dropdown.Item>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.creation_date}
                  onChange={() => handleColumnChange("creation_date")}
                />
                <span style={{ marginLeft: '10px' }}>{translate("creation Date")}</span>
              </Dropdown.Item>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.Checker}
                  onChange={() => handleColumnChange("Checker")}
                />
                <span style={{ marginLeft: '10px' }}>{translate("Checker")}</span>
              </Dropdown.Item>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.Driver_out}
                  onChange={() => handleColumnChange("Driver_out")}
                />
                <span style={{ marginLeft: '10px' }}>{translate("Outgoing Driver")}</span>
              </Dropdown.Item>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.Driver_in}
                  onChange={() => handleColumnChange("Driver_in")}
                />
                <span style={{ marginLeft: '10px' }}>{translate("Incoming Driver")}</span>
              </Dropdown.Item>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.tractor_number}
                  onChange={() => handleColumnChange("tractor_number")}
                />
                <span style={{ marginLeft: '10px' }}>{translate("Tractor Registration")}</span>
              </Dropdown.Item>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.trailer_number}
                  onChange={() => handleColumnChange("trailer_number")}
                />
                <span style={{ marginLeft: '10px' }}>{translate("Remorque Registration")}</span>
              </Dropdown.Item>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.maintenance}
                  onChange={() => handleColumnChange("maintenance")}
                />
                <span style={{ marginLeft: '10px' }}>{translate("Maintenance")}</span>
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
              {selectedColumns.id_verif && <th>N°</th>}
              {selectedColumns.creation_date && <th>{translate("creation Date")}</th>}
              {selectedColumns.Checker && <th>{translate("Checker")}</th>}
              {selectedColumns.Driver_out && <th>{translate("Outgoing Driver")}</th>}
              {selectedColumns.Driver_in && <th>{translate("Incoming Driver")}</th>}
              {selectedColumns.tractor_number && <th>{translate("Tractor Registration")}</th>}
              {selectedColumns.trailer_number && <th>{translate("Remorque Registration")}</th>}
              {selectedColumns.maintenance && <th>{translate("Maintenance")}</th>}
              <th>{translate("Actions")}</th>
            </tr>
          </thead>
          <tbody key="#" className="ligth-body">
            {Array.isArray(list_Vehicleschecks) && list_Vehicleschecks.length !== 0 && list_Vehicleschecks.map((data) => (
              <tr className={""} key={data.id_verif}>
                <td>
                  <div className="form-check form-check-inline">
                    <input type="checkbox" className="form-check-input" />
                  </div>
                </td>
                {selectedColumns.id_verif && <td>{data.id_verif}</td>}
                {selectedColumns.creation_date && <td>{toTimestamp(data.creation_date).split(' ')[0]}</td>}
                {selectedColumns.Checker && <td>{data.checker}</td>}
                {selectedColumns.Driver_out && <td>{data.driver_out}</td>}
                {selectedColumns.Driver_in && <td>{data.driver_in}</td>}
                {selectedColumns.tractor_number && <td>{data.tractor_number}</td>}
                {selectedColumns.trailer_number && <td>{data.trailer_number}</td>}
                {selectedColumns.maintenance && <td>{data.maintenance}</td>}
                <td>
                  <div className="d-flex align-items-center list-action">
                    <Link
                      to={`/Detail_vehicle_check/${data.id_verif}`}
                      className="badge badge-success mr-2"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Détail"
                    >
                      <i className="fa fa-eye" style={{ fontSize: "1.2em" }}></i>
                    </Link>


                    <a
                      className="badge bg-warning mr-2"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete"
                      onClick={() => handleDeleteClick(data.id_verif)}
                    >
                      <i className="ri-delete-bin-line mr-0" style={{ fontSize: "1.2em" }}></i>
                    </a>
                    <a
                      className="badge bg-primary mr-2"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="download"
                    >
                      <i className="las la-download mr-0" style={{ fontSize: "1.2em" }}></i>

                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        dialogClassName="modal-90w"
        aria-labelledby=""
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 'bold', color: 'grey' }}>
            {translate('Trash')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {translate('Do you really want to remove this check vehicle?')}
        </Modal.Body>
        <Modal.Footer className="d-flex">
          <button
            className="btn btn-outline-danger mt-2 mx-auto"
            onClick={() => setShowDeleteModal(false)}
          >
            {translate('Cancel')}
          </button>
          <button
            className="btn btn-outline-success mt-2 mx-auto"
            onClick={handleConfirmDelete}
          >
            {translate('Confirm')}
          </button>
        </Modal.Footer>
      </Modal>

      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>Affichage 1 à {limit} sur {total} </span>
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
      </div>
    </>
  );
}
