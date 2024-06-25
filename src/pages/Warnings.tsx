import React, { useState, useEffect } from "react";
import { Button, Dropdown, Modal, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { PropagateLoader } from "react-spinners";
import ModalNewWaring from "../components/NewWarning";
import ModalEditWarning from "../components/EditWarning";

interface Warning {
  id_warning: number;
  id_driver: number;
  id_user: number;
  Type_Warning: string;
  Description: string;
  Date: string;
  draft: number;
  user_name: string;
  conducteur_prenom: string;
  conducteur_nom: string;
}

export function Warnings() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { translate } = useTranslate();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [list_Warnings, setWarnings] = useState<Warning[]>([]);
  const id_user = localStorage.getItem("GeopUserID");
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [column, setSortColumn] = useState("id_warning");
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [type, setType] = useState(0);
  const [typeSearch, setTypeSearch] = useState("ID");
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [warningToDelete, setWarningToDelete] = useState<number | null>(null);
const [warningToEdit, setWarningToEdit] = useState<number | null>(null);
const [showEditModal, setShowEditModal] = useState(false); // État pour gérer l'affichage du modal d'édition



  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getCountWarning = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/api/geop/warning/count/${id_user}?searchTerm=${search}&searchType=${type}`
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

  const getWarnings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/api/geop/warning/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}`
      );
      const data = await response.json();
      setWarnings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteWarning = async () => {
    if (warningToDelete !== null) {
      try {
        const response = await fetch(`${backendUrl}/api/geop/delete_warning/${id_user}/${warningToDelete}`, {
          method: "DELETE",
        });
        if (response.ok) {
          getWarnings();
          getCountWarning();


          setWarnings((prevWarnings) =>
            prevWarnings.filter((warning) => warning.id_warning !== warningToDelete)
          );
          handleCloseDeleteModal();
        } else {
          console.error("Erreur lors de la suppression de l'avertissement");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'avertissement", error);
      }
    }
  };
  

  useEffect(() => {
    getCountWarning();
    getWarnings();
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
      case translate("ID Warning"):
        setType(0);
        break;
      case translate("Driver"):
        setType(1);
        break;
      case translate("Type Warning"):
        setType(2);
        break;
      case translate("Description"):
        setType(3);
        break;
      case translate("Date"):
        setType(4);
        break;
      default:
        console.log("Unknown selection");
        break;
    }
    setTypeSearch(selectedValue);
  };

  const handleAdvancedSearch = (event: any) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleSortingColumn = (currentColumn: string) => {
    setSortColumn(currentColumn);
    setSort(sort === "ASC" ? "DESC" : "ASC");
  };

  const options = [10, 20, 40, 60, 80, 100, 200, 500]; // Page size options
  const initialColumns = {
    id_warning: true,
    Type_Warning: true,
    Description: true,
    Date: true,
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
const handleShowDeleteModal = (id_warning :number) => {
  setWarningToDelete(id_warning);
  setShowDeleteModal(true);
};
const handleEditWarning = (id_warning: number) => {
  setWarningToEdit(id_warning);
  setShowEditModal(true); // Ouvre le modal d'édition
};
// Gestion de la fermeture du modal d'édition
const handleCloseEditModal = () => {
  setShowEditModal(false);
  setWarningToEdit(null); // Réinitialise l'ID de l'avertissement à éditer
};

  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-exclamation-triangle"></i>
            {translate("Warnings")} ({total})
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">
          <Button variant="primary" className="mt-2 mr-1" onClick={handleShow}>
            <i className="las la-plus mr-3"></i>Add Warnings
          </Button>
          <Button variant="outline-info" className="mt-2 mr-1">
            <i className="las la-file-excel mr-3"></i>Import Warnings
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
                  style={{ fontSize: "20px" }}
                ></i>
              </Dropdown.Toggle>
              <Dropdown.Menu onClick={handleTypeSearch}>
                <Dropdown.Item>{translate("ID Warning")}</Dropdown.Item>
                <Dropdown.Item>{translate("Driver")}</Dropdown.Item>
                <Dropdown.Item>{translate("Type Warning")}</Dropdown.Item>
                <Dropdown.Item>{translate("Description")}</Dropdown.Item>
                <Dropdown.Item>{translate("Date")}</Dropdown.Item>
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
              {["id_warning", "driver", "type", "description", "date"].map(
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
        <Table className="dataTable">
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" />
                </div>
              </th>
              {selectedColumns.id_warning && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColumn("id_warning")}
                >
                  {translate("ID Warning")}
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
              {selectedColumns.type && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColumn("type")}
                >
                  {translate("Type Warning")}
                </th>
              )}
              {selectedColumns.description && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColumn("description")}
                >
                  {translate("Description")}
                </th>
              )}
              {selectedColumns.date && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColumn("date")}
                >
                  {translate("Date")}
                </th>
              )}
              <th>{translate("Actions")}</th>
            </tr>
          </thead>
          <tbody className="ligth-body">
            {list_Warnings.map((warning, idx) => (
              <tr key={idx}>
                <td>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" />
                  </div>
                </td>
                {selectedColumns.id_warning && <td>{warning.id_warning}</td>}
                {selectedColumns.driver && (
                  <td>
                    {warning.conducteur_nom} {warning.conducteur_prenom}
                  </td>
                )}
                {selectedColumns.type && <td>{warning.Type_Warning}</td>}
                {selectedColumns.description && <td>{warning.Description}</td>}
                {selectedColumns.date && (
                  <td>{new Date(warning.Date).toLocaleDateString()}</td>
                )}
                <td>
                  <div className="d-flex align-items-center list-action">
                    <a className="badge badge-success mr-2" title="Détail">
                      <i
                        className="fa fa-eye"
                        style={{ fontSize: "1.2em", cursor: "pointer" }}
                      ></i>
                    </a>
                    <a
  className="badge bg-primary mr-2"
  title="Edit"
  onClick={() => handleEditWarning(warning.id_warning)}
>
  <i className="las la-edit" style={{ fontSize: "1.2em", cursor: "pointer" }}></i>
</a>

                    <a
      className="badge bg-warning mr-2"
      title="Delete"
      style={{ cursor: "pointer" }}
      onClick={() => handleShowDeleteModal(warning.id_warning)}
    >
      <i
        className="ri-delete-bin-line mr-0"
        style={{ fontSize: "1.2em" }}
      ></i>
    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="row justify-content-between">
        <div className="col-md-4 d-flex align-items-center">
          {loading && <PropagateLoader color="#000" size={15} />}
        </div>
        <div className="col-md-8">
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
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
      <ModalNewWaring show={show} handleClose={handleClose} refreshwarning={() => getWarnings()}
      ></ModalNewWaring>
      <ModalEditWarning
  show={showEditModal}
  handleClose={handleCloseEditModal}
  warningId={warningToEdit}
  refreshWarning={getWarnings} // Propagez la fonction de rafraîchissement des avertissements si nécessaire
/>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirmer la suppression</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Êtes-vous sûr de vouloir supprimer cet avertissement ?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseDeleteModal}>
      Annuler
    </Button>
    <Button variant="danger" onClick={deleteWarning}>
      Supprimer
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
}
