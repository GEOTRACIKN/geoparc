import { Button, Dropdown, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { useState, useEffect } from "react";
import { DownloadModal, generateExcelFile, generatePDFFile, handleDownloadConfirm, toTimestamp } from "../functions";
import { Bounce, toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import { useListPagePreferences } from "../hooks/useListPagePreferences";
import { useGpVisibleColumns } from "../hooks/useGpVisibleColumns";



type Vehicles = {
  id_verif: number;
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
  const userID = localStorage.getItem("GeopUserID");
  const { translate } = useTranslate();
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [list_Vehicleschecks, setItems] = useState<Vehicles[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('Checker');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedvehiclecheckID, setSelectedvehiclecheckID] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false); // État pour le modal de téléchargement
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [type, setType] = useState(0);
  const { ready: listPreferencesReady } = useListPagePreferences({
    pageKey: "vehicle-checks",
    pageSize: limit, setPageSize: setLimit,
    searchType: type, setSearchType: setType,
    searchTypeLabel: searchType, setSearchTypeLabel: setSearchType,
    searchText: searchTerm, setSearchText: setSearchTerm,
  });
  const [selectedvehiclecheck, setSelectedvehiclecheck] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);






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
  useGpVisibleColumns("vehicle-checks", selectedColumns, setSelectedColumns, listPreferencesReady);
  const [loading, setLoading] = useState(true);


  // getVehicleschecks api 
  const getVehicleschecks = async (currentPage: number, limit: number) => {
    try {
      setLoading(true);
      const total_pages = await fetch(`${backendUrl}/api/geop/vehiclecheck/totalpage/${userID}?searchTerm=${searchTerm}&searchType=${type}`,
        { mode: "cors" });
      const totalpages = await total_pages.json();
      const total = totalpages[0].total;
      setTotal(total);
      const calculatedPageCount = Math.ceil(total / limit);
      setPageCount(calculatedPageCount);

      const res = await fetch(`${backendUrl}/api/geop/vehiclecheck/${userID}/${currentPage}/${limit}?searchTerm=${searchTerm}&searchType=${type}`,
        { mode: "cors" });
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Erreur lors du chargement des Vehicles Vérifié :", error);
    }
    finally {
      setLoading(false);
    }
  };
  // fetchVehicleschecks api 
  const fetchVehicleschecks = async (currentPage: number, limit: number) => {
    setLoading(true);

    const res = await fetch(`${backendUrl}/api/geop/vehiclecheck/${userID}/${currentPage}/${limit}?searchTerm=${searchTerm}&searchType=${type}`,
      { mode: "cors" });
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    if (!listPreferencesReady) return;
    getVehicleschecks(currentPage, limit);
  }, [currentPage, searchTerm, type, limit, listPreferencesReady]);

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

  const handleTypeSearch = (event: any) => {
    const selectedValue = event.target.textContent;

    switch (selectedValue) {
      case translate("ID"):
        setType(0);
        break;
      case translate("Checker"):
        setType(1);
        break;
      case translate("Outgoing Driver"):
        setType(2);
        break;
      case translate("Incoming Driver"):
        setType(3);
        break;
      case translate("Tractor Registration"):
        setType(4);
        break;
      case translate("Remorque Registration"):
        setType(5);
        break;
      case translate("Maintenance"):
        setType(6);
        break;
      default:
        console.log("Unknown selection");
        break;
    }
    setSearchType(selectedValue);

  }

  const handleAdvancedSearch = (event: any) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  //------- Partie Delete -------
  const handleConfirmDelete = async () => {
    try {
      const loggedInuserID = localStorage.getItem("GeopUserID");

      const response = await fetch(`${backendUrl}/api/geop/delete/${selectedvehiclecheckID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loggedInuserID }),

      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression logique. Statut : ${response.status}`);
      }
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

  const convertValue = (value: any) => {
    if (!value) {
      return "Not mentioned";
    } else if (value === 1) {
      return "Oui";
    } else if (value === 2) {
      return "Non";
    }
  };
  //**** Partie Excel ****
  const vehicleHeaders = [
    "ID Vérif",
    "Date de Création",
    "Vérificateur",
    "Conducteur Sortant",
    "Conducteur Entrant",
    "Matricule Tracteur",
    "Matricule Remorque",
    "Maintenance"
  ];

  const downloadVehicleExcel = () => {
    const selectedData = list_Vehicleschecks.filter((vehicleCheck) =>
      selectedvehiclecheck.includes(vehicleCheck.id_verif)
    ).map((vehicleCheck) => [
      vehicleCheck.id_verif,
      toTimestamp(vehicleCheck.creation_date),
      vehicleCheck.checker,
      vehicleCheck.driver_out,
      vehicleCheck.driver_in,
      vehicleCheck.tractor_number,
      vehicleCheck.trailer_number,
      convertValue(vehicleCheck.maintenance)

    ]);

    generateExcelFile("Vehicle_Checks", vehicleHeaders, selectedData);
  };

  const downloadVehiclePDF = () => {
    const selectedData = list_Vehicleschecks.filter((vehicleCheck) =>
      selectedvehiclecheck.includes(vehicleCheck.id_verif)
    ).map((vehicleCheck) => [
      vehicleCheck.id_verif,
      toTimestamp(vehicleCheck.creation_date),
      vehicleCheck.checker,
      vehicleCheck.driver_out,
      vehicleCheck.driver_in,
      vehicleCheck.tractor_number,
      vehicleCheck.trailer_number,
      convertValue(vehicleCheck.maintenance)

    ]);

    generatePDFFile("Vehicle_Checks", vehicleHeaders, selectedData);
  };

  const onDownloadConfirm = (format: string) => {
    if (selectedvehiclecheck.length > 0) {
      handleDownloadConfirm(format, downloadVehicleExcel, downloadVehiclePDF);
    } else {
      toast.warn("Veuillez sélectionner au moins une vérification ", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleSelectvehicleCheck = (id: number) => {
    setSelectedvehiclecheck((prev) => {
      if (prev.includes(id)) {
        return prev.filter((vehicleCheckId) => vehicleCheckId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allWarningIds = list_Vehicleschecks.map((vehicleCheck) => vehicleCheck.id_verif);
      setSelectedvehiclecheck(allWarningIds);
    } else {
      setSelectedvehiclecheck([]);
    }
  };



  const handleSelectChange = (event: any) => {
    const newValue = event.target.value;
    setLimit(parseInt(newValue));
    setCurrentPage(1);
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
          <Link to="/vehicle-check" className="btn btn-primary mt-2 mr-1">
            <i className="las la-plus mr-3"></i>
            {translate("Add Verification")}
          </Link>
          <button
            className="btn btn-outline-secondary  mt-2 mr-1"
            onClick={() => setShowDownloadModal(true)}
          >
            <i className="las la-download"></i>
            Exporter
          </button>
        </div>

      </div>
      <div className="row">
        <div className="col-md-4" style={{ margin: '0px 0px 10px 0px', padding: '10px' }}>
          <div className="input-group">
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic" className="search-type-toggle">
                <i
                  className="fas fa-chevron-down"
                  style={{ fontSize: "20px" }}
                ></i>
              </Dropdown.Toggle>
              <Dropdown.Menu onClick={handleTypeSearch}>
                <Dropdown.Item>{translate("ID")}</Dropdown.Item>
                <Dropdown.Item>{translate("Checker")}</Dropdown.Item>
                <Dropdown.Item>{translate("Outgoing Driver")}</Dropdown.Item>
                <Dropdown.Item>{translate("Incoming Driver")}</Dropdown.Item>
                <Dropdown.Item>{translate("Tractor Registration")}</Dropdown.Item>
                <Dropdown.Item>{translate("Remorque Registration")}</Dropdown.Item>
                <Dropdown.Item>{translate("Maintenance")}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <input
              type="text"
              placeholder={` By ${searchType}`}
              onChange={handleAdvancedSearch}
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-8 d-flex justify-content-end align-items-center">
          {/* Dropdown Pour le Show du tableau */}
          <div className="dataTables_length">
            <label style={{ marginBottom: "0" }}>
              {translate("Show")}
              <select
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
                <span style={{ marginLeft: '10px' }}>{translate("Creation date")}</span>
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
      <div className="row m-1 responsive-table">
        <Table>
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th>
                <div className="form-check form-check-inline">
                  <input className="form-check-input"
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}

                  />
                  <label className="form-check-label"></label>
                </div>
              </th>
              {selectedColumns.id_verif && <th>Id</th>}
              {selectedColumns.creation_date && <th>{translate("Creation date")}</th>}
              {selectedColumns.Checker && <th>{translate("Checker")}</th>}
              {selectedColumns.Driver_out && <th>{translate("Outgoing Driver")}</th>}
              {selectedColumns.Driver_in && <th>{translate("Incoming Driver")}</th>}
              {selectedColumns.tractor_number && <th>{translate("Tractor Registration")}</th>}
              {selectedColumns.trailer_number && <th>{translate("Remorque Registration")}</th>}
              {selectedColumns.maintenance && <th>{translate("Maintenance")}</th>}
              <th>{translate("Actions")}</th>
            </tr>
          </thead>
          <tbody className="light-body">
            {loading ? (
              <tr style={{ textAlign: "center" }}>
                <td className="text-center"  colSpan={10}>
                <p>
                    <PropagateLoader
                      color={"#123abc"}
                      loading={loading}
                      size={20}
                    />
                  </p>
                </td>
              </tr>
            ) : Array.isArray(list_Vehicleschecks) && list_Vehicleschecks.length !== 0 ? (
              list_Vehicleschecks.map((data) => (
                <tr className="" key={data.id_verif}>
                  <td>
                    <div className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedvehiclecheck.includes(data.id_verif)}
                        onChange={() => handleSelectvehicleCheck(data.id_verif)}
                      />
                    </div>
                  </td>
                  {selectedColumns.id_verif && <td>{data.id_verif}</td>}
                  {selectedColumns.creation_date && <td>{toTimestamp(data.creation_date).split(' ')[0]}</td>}
                  {selectedColumns.Checker && <td>{data.checker}</td>}
                  {selectedColumns.Driver_out && <td>{data.driver_out}</td>}
                  {selectedColumns.Driver_in && <td>{data.driver_in}</td>}
                  {selectedColumns.tractor_number && <td>{data.tractor_number}</td>}
                  {selectedColumns.trailer_number && <td>{data.trailer_number}</td>}
                  {selectedColumns.maintenance && (
                    <td style={{ color: 'orange' }}>
                      {convertValue(data.maintenance)}
                    </td>
                  )}
                  <td>
                    <div className="d-flex align-items-center list-action">
                      <Link
                        to={`/Detail-vehicle-check/${data.id_verif}`}
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
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ri-delete-bin-line mr-0" style={{ fontSize: "1.2em" }}></i>
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr style={{ textAlign: "center" }}>
                <td colSpan={selectedColumns.length || 10}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </Table>
      </div>
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
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{translate("Confirm Delete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {translate("Are you sure you want to delete this vehicle check?")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {translate("Cancel")}
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            {translate("Delete")}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Le moodal est dans functions */}
      <DownloadModal
        show={showDownloadModal}
        onHide={() => setShowDownloadModal(false)}
        onDownloadConfirm={onDownloadConfirm}
      />
    </>
  );
}
