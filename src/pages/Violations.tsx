import React, { useState, useEffect } from "react";
import { Button, Dropdown, Modal, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { PropagateLoader } from "react-spinners";
import ModalNewVilation from "../components/NewViolation"
import ModalEditVilation from "../components/EditViolations";
import { Bounce, toast } from "react-toastify";
import { DownloadModal, formatDateToTimestamp, generateExcelFile, generatePDFFile, handleDownloadConfirm, toTimestamp } from "../utilities/functions";

interface Violations {
  id_violation: number;
  id_driver: number;
  id_user: number;
  type_violation: string;
  vehicule: string;
  cost: string;
  description: string;
  date_violation: string;
  draft: number;
  user_name: string;
  conducteur_prenom: string;
  conducteur_nom: string;
}


export function Violations() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { translate } = useTranslate();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [list_violation, setviolation] = useState<Violations[]>([]);
  const id_user = localStorage.getItem("GeopUserID");
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [column, setSortColumn] = useState("id_violation");
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [type, setType] = useState(0);
  const [typeSearch, setTypeSearch] = useState("ID Violation");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [violationToDelete, setViolationToDelete] = useState<number | null>(null);
  const [ViolationToEdit, setViolationToEdit] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedViolations, setSelectedViolations] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);



  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getCountViolation = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/api/geop/violation/count/${id_user}?searchTerm=${search}&searchType=${type}`
      );
      const result = await response.json();
      setTotal(result.count);
      setPageCount(Math.ceil(result.count / limit));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getViolation = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/api/geop/violation/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
      );
      const data = await response.json();
      setviolation(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getCountViolation();
    getViolation();
  }, [currentPage, limit, search, type, column, sort]);

  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  const handleSelectChange = (event: any) => {
    const newValue = event.target.value;
    setLimit(parseInt(newValue));
    setCurrentPage(1);
  };
  const handleTypeSearch = (event: any) => {
    const selectedValue = event.target.textContent;

    switch (selectedValue) {
      case translate("ID Violation"):
        setType(0);
        break;
      case translate("Driver"):
        setType(1);
        break;
      case translate("Vehicule"):
        setType(2);
        break;
      case translate("Type Violation"):
        setType(3);
        break;
      case translate("Description"):
        setType(4);
        break;
      case translate("Date"):
        setType(5);
        break;
      default:
        console.log("Unknown selection");
        break;
    }
    setTypeSearch(selectedValue);

  }


  const handleAdvancedSearch = (event: any) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleSortingColumn = (currentColumn: string) => {
    const newSortOrder = column === currentColumn && sort === "ASC" ? "DESC" : "ASC";
    setSortColumn(currentColumn);
    setSort(newSortOrder);
    getViolation();
  };

  const initialColumns = {
    id_violation: true,
    vehicule: true,
    cost: true,
    type_violation: true,
    description: true,
    date_violation: true,
    driver: true,
  };
  // Load selected columns from localStorage or use initial state
  const loadSelectedColumns = () => {
    const savedColumns = localStorage.getItem("selectedColumns");
    return savedColumns ? JSON.parse(savedColumns) : initialColumns;
  };
  const [selectedColumns, setSelectedColumns] = useState(loadSelectedColumns);

  const handleColumnChange = (column: string) => {
    const updatedColumns = {
      ...selectedColumns,
      [column]: !selectedColumns[column],
    };
    setSelectedColumns(updatedColumns);
    localStorage.setItem("selectedColumns", JSON.stringify(updatedColumns)); // Save selected columns to localStorage
  };
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (id_violation: number) => {
    setViolationToDelete(id_violation);
    setShowDeleteModal(true);
  };
  const handleEditViolation = (id_violation: number) => {
    setViolationToEdit(id_violation);
    setShowEditModal(true); // Ouvre le modal d'édition
  };
  // Gestion de la fermeture du modal d'édition
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setViolationToEdit(null); // Réinitialise l'ID de l'avertissement à éditer
  };

  const deleteViolation = async () => {
    if (violationToDelete !== null) {
      try {
        const response = await fetch(
          `${backendUrl}/api/geop/delete_violation/${id_user}/${violationToDelete}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Afficher une notification de succès
          toast.success("Violation supprimée avec succès.", {
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

          // Actualiser les violations après la suppression
          getViolation();
          getCountViolation();

          setviolation((prevViolation) =>
            prevViolation.filter(
              (violation) => violation.id_violation !== violationToDelete
            )
          );

          handleCloseDeleteModal();
        } else {
          // Afficher une notification d'erreur si la suppression échoue
          toast.error("Erreur lors de la suppression de la violation.", {
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
          console.error("Erreur lors de la suppression de la violation");
        }
      } catch (error) {
        // Afficher une notification d'erreur en cas d'exception
        toast.error(
          `Erreur lors de la suppression de la violation: ${error instanceof Error ? error.message : "Erreur inattendue"
          }`,
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          }
        );
        console.error("Erreur lors de la suppression de la violation", error);
      }
    }
  };

  //**** Partie Excel ****
  const ViolationsHeaders = [
    "ID Warning",
    "Driver",
    "Type Warning",
    "Description",
    "Date",
  ];



  const downloadViolationsExcel = () => {
    const selectedData = list_violation.filter((Violations) =>
      selectedViolations.includes(Violations.id_violation)
    ).map((Violations) => [
      Violations.id_violation,
      `${Violations.conducteur_nom} ${Violations.conducteur_prenom}`,
      Violations.type_violation,
      Violations.description,
      formatDateToTimestamp(Violations.date_violation),
    ]);

    generateExcelFile("Violations", ViolationsHeaders, selectedData);
  };

  const downloadViolationsPDF = () => {
    const selectedData = list_violation.filter((Violations) =>
      selectedViolations.includes(Violations.id_violation)
    ).map((Violations) => [
      Violations.id_violation,
      `${Violations.conducteur_nom} ${Violations.conducteur_prenom}`,
      Violations.type_violation,
      Violations.description,
      formatDateToTimestamp(Violations.date_violation),
    ]);

    generatePDFFile("Violations", ViolationsHeaders, selectedData);
  };
  const onDownloadConfirm = (format: string) => {
    if (selectedViolations.length > 0) {
      handleDownloadConfirm(format, downloadViolationsExcel, downloadViolationsPDF);
    } else {
      toast.warn("Veuillez sélectionner au moins une Violation", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleSelectViolation = (id: number) => {
    setSelectedViolations((prev) => {
      if (prev.includes(id)) {
        return prev.filter((violationId) => violationId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allWarningIds = list_violation.map((violation) => violation.id_violation);
      setSelectedViolations(allWarningIds);
    } else {
      setSelectedViolations([]);
    }
  };


  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-ban"></i>
            {translate("Violations")} ({total})
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">
          <Button variant="primary" className="mt-2 mr-1" onClick={handleShow}>
            <i className="las la-plus mr-3"></i>Add violation
          </Button>
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
        <div
          className="col-md-4"
          style={{ margin: "0px 0px 10px 0px", padding: "10px" }}
        >
          <div className="input-group">
            <Dropdown>
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                <i
                  className="fas fa-chevron-down"
                  style={{ fontSize: "20px" }}
                ></i>
              </Dropdown.Toggle>
              <Dropdown.Menu onClick={handleTypeSearch}>
                <Dropdown.Item>{translate("ID Violation")}</Dropdown.Item>
                <Dropdown.Item>{translate("Driver")}</Dropdown.Item>
                <Dropdown.Item>{translate("Vehicule")}</Dropdown.Item>
                <Dropdown.Item>{translate("Type Violation")}</Dropdown.Item>
                <Dropdown.Item>{translate("Description")}</Dropdown.Item>
                <Dropdown.Item>{translate("Date Violation")}</Dropdown.Item>
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
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              id="dropdown-basic"
              title="Display Columns"
            >
              <i className="las la-eye"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {["ID", "driver", "vehicule", "type", "description", "cost", "date"].map(
                (col, idx) => (
                  <Dropdown.Item
                    key={idx}
                    as="button"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedColumns[col]}
                      onChange={() => handleColumnChange(col)}
                    />
                    <span style={{ marginLeft: "10px" }}>{translate(col)}</span>
                  </Dropdown.Item>
                )
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="row m-1">
        <Table className="dataTable" responsive>
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th className="text-center">
                <div className="form-check form-check-inline">
                  <input className="form-check-input"
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              {selectedColumns.ID && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColumn("id_violation")}
                >
                  {translate("ID")}
                </th>
              )}
              {selectedColumns.date && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColumn("date_violation")}
                >
                  {translate("Date and time")}
                </th>
              )}
              {selectedColumns.driver && (
                <th
                  className="sorting"

                  onClick={() => handleSortingColumn("driver")}
                >
                  {translate("Driver")}
                </th>
              )}
              {selectedColumns.vehicule && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColumn("vehicule")}
                >
                  {translate("Vehicule")}
                </th>
              )}
              {selectedColumns.type && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColumn("type_violation")}
                >
                  {translate("Violation type")}
                </th>
              )}
              {selectedColumns.cost && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColumn("cost")}
                >
                  {translate("Cost")}
                </th>
              )}
              {selectedColumns.description && (
                <th
                className="sorting"

                >
                  {translate("Description")}
                </th>
              )}
              <th >{translate("Actions")}</th>
            </tr>
          </thead>
          <tbody className="light-body">
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
            ) : (
              list_violation.map((violation, idx) => (
                <tr key={idx}>
                  <td  className="text-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedViolations.includes(violation.id_violation)}
                        onChange={() => handleSelectViolation(violation.id_violation)}
                      />
                    </div>
                  </td>
                  {selectedColumns.ID && <td>{violation.id_violation}</td>}
                  {selectedColumns.date && (
                    <td>{formatDateToTimestamp(violation.date_violation)}</td>
                  )}
                  {selectedColumns.driver && (
                    <td>
                      {violation.conducteur_nom} {violation.conducteur_prenom}
                    </td>
                  )}
                  {selectedColumns.vehicule && <td>{violation.vehicule}</td>}
                  {selectedColumns.type && <td>{violation.type_violation}</td>}
                  {selectedColumns.cost && <td>{violation.cost}</td>}
                  {selectedColumns.description && <td>{violation.description}</td>}
                  <td>
                    <div className="d-flex align-items-center list-action">
                      <a
                        className="badge bg-primary mr-2"
                        title="Edit"
                        onClick={() => handleEditViolation(violation.id_violation)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="las la-edit" style={{ fontSize: "1.2em" }}></i>
                      </a>
                      <a
                        className="badge bg-warning mr-2"
                        title="Delete"
                        onClick={() => handleShowDeleteModal(violation.id_violation)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ri-delete-bin-line mr-0" style={{ fontSize: "1.2em" }}></i>
                      </a>
                    </div>
                  </td>
                </tr>
              ))
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
      <ModalNewVilation show={show} handleClose={handleClose} refreshviolation={() => { getViolation() }}></ModalNewVilation>

      <ModalEditVilation
        show={showEditModal}
        handleClose={handleCloseEditModal}
        violationId={ViolationToEdit}
        refreshviolation={getViolation} // Propagez la fonction de rafraîchissement si nécessaire
      />
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cet violation ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={deleteViolation}>
            Supprimer
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
