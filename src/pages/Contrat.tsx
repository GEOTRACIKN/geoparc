import React, { useState, useEffect } from "react";
import { Button, Dropdown, Modal, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { PropagateLoader } from "react-spinners";
import ModalNewContrat from "../components/NewContart";
import ModalEditContrat from "../components/EditContratModal";

interface Contrats {
  id_contrat: number;
  date_debut_contrat: string;
  date_fin_contrat: string;
  conducteur_prenom: string;
  conducteur_nom: string;
  type_contrat: string;
  ref_rh: string;
  id_parc: string;
}

export function Contrat() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { translate } = useTranslate();
  let [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [list_Contrat, setContrat] = useState<Contrats[]>([]);
  const geopuserID = localStorage.getItem("GeopUserID");
  const [loading, setLoading] = useState(true); // Add loading state
  const [pageCount, setPageCount] = useState(0);
  let [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [column, setSortColumn] = useState("id_contrat");
  const [sort, setSort] = useState("ASC");
  const [typeSearch, setTypeSearch] = useState("id_contrat");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [contratToDelete, setContratToDelete] = useState<number | null>(null);
  const [contratToEdit, setContratToEdit] = useState<Contrats | null>(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleDeleteClose = () => setShowDeleteModal(false);
  const handleDeleteShow = (id_contrat: number) => {
    setContratToDelete(id_contrat);
    setShowDeleteModal(true);
  };
  const handleEditClose = () => setShowEditModal(false);
  const handleEditShow = (contrat: Contrats) => {
    setContratToEdit(contrat);
    setShowEditModal(true);
  };

  const fetchData = async (
    page: number,
    limit: number,
    searchTerm: string,
    searchType: string
  ) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/api/geop/contrat/${geopuserID}/${page}/${limit}?searchTerm=${searchTerm}&searchType=${searchType}&sortColumn=${column}&sortOrder=${sort}`
      );
      const data = await response.json();
      setContrat(data);
      const countResponse = await fetch(
        `${backendUrl}/api/geop/contrat/count/${geopuserID}?searchTerm=${searchTerm}&searchType=${searchType}`
      );
      const countData = await countResponse.json();
      console.log(countData[0]);

      setTotal(countData[0].total_count);
      console.log(countData[0].total_count);

      setPageCount(Math.ceil(countData[0].total_count / limit));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un sinistre
  const handleDeleteContrat = async () => {
    try {
      if (contratToDelete !== null) {
        const res = await fetch(
          `${backendUrl}/api/geop/delete_Contrat/${geopuserID}/${contratToDelete}`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          // Suppression réussie, mettez à jour l'état ou rechargez les données si nécessaire
          // Par exemple, rechargez la liste des sinistres
          fetchData(currentPage, limit, search, typeSearch);
        } else {
          console.error(
            "Erreur lors de la suppression du sinistre :",
            res.statusText
          );
          // Affichez un message d'erreur ou gérez l'erreur de manière appropriée
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du sinistre :", error);
      // Affichez un message d'erreur ou gérez l'erreur de manière appropriée
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handlePageClick = (data: any) => {
    let selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    fetchData(selectedPage, limit, search, typeSearch);
  };

  useEffect(() => {
    fetchData(currentPage, limit, search, typeSearch);
  }, [currentPage, limit, search, typeSearch,column,sort]);

  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setLimit(newValue);
    setCurrentPage(1); // Reset to first page when limit changes
  };

  const handleTypeSearch = (event: any) => {
    const selectedValue = event.target.textContent;
    setTypeSearch(selectedValue);
    setSearch(""); // Reset search term when type changes
  };

  const handleAdvancedSearch = (event: any) => {
    const newValue = event.target.value;
    setSearch(newValue);
  };
  const options = [10, 20, 40, 60, 80, 100, 200, 500]; // Page size options
  const initialColumns = {
    id_contrat: true,
    conducteur: true,
    date_debut_contrat: true,
    date_fin_contrat: true,
    type_contrat: true,
    ref_rh: true,
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
  const handleSortingColumn = (currentColumn: string) => {
    const newSortOrder = column === currentColumn && sort === "ASC" ? "DESC" : "ASC";
    setSortColumn(currentColumn);
    setSort(newSortOrder);
    fetchData(currentPage, limit, search, typeSearch);
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
          <Button variant="primary" className="mt-2 mr-1" onClick={handleShow}>
            <i className="las la-plus mr-3"></i>Add Contrat
          </Button>
          <Button variant="outline-info" className="mt-2 mr-1">
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
              <Dropdown.Toggle variant="link" id="dropdown-basic">
                <i
                  className="fas fa-chevron-down"
                  style={{ fontSize: "20" }}
                ></i>
              </Dropdown.Toggle>
              <Dropdown.Menu onClick={handleTypeSearch}>
                <Dropdown.Item>{translate("id_contrat")}</Dropdown.Item>
                <Dropdown.Item>{translate("conducteur_nom")}</Dropdown.Item>
                <Dropdown.Item>{translate("type_contrat")}</Dropdown.Item>
                <Dropdown.Item>{translate("ref_rh")}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <input
              type="text"
              placeholder={`By ${typeSearch}`}
              onChange={handleAdvancedSearch}
              className="form-control"
            />
          </div>
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
          {/* <label>
              {translate("Show")}
              <select className="custom-select custom-select-sm form-control form-control-sm ml-2" style={{ width: "66px" }} onChange={handleSelectChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label> */}
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
                  checked={selectedColumns.id_contrat}
                  onChange={() => handleColumnChange("id_contrat")}
                />
                <span style={{ marginLeft: "10px" }}>ID</span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.date_debut_contrat}
                  onChange={() => handleColumnChange("date_debut_contrat")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("CONTRACT START DATE")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.date_fin_contrat}
                  onChange={() => handleColumnChange("date_fin_contrat")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("CONTRACT END DATE")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.conducteur}
                  onChange={() => handleColumnChange("conducteur")}
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
                  checked={selectedColumns.type_contrat}
                  onChange={() => handleColumnChange("type_contrat")}
                />
                <span style={{ marginLeft: "10px" }}>{translate("TYPE")}</span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.ref_rh}
                  onChange={() => handleColumnChange("ref_rh")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("HR REFERENCE")}
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="row m-1">
        <Table className="dataTable" responsive>
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label"></label>
                </div>
              </th>
              {selectedColumns.id_contrat && (
                <th className="sorting"  onClick={() => handleSortingColumn("id_contrat")}>{translate("N° contrat")}</th>
              )}
              {selectedColumns.conducteur && <th>{translate("Driver")}</th>}
              {selectedColumns.date_debut_contrat && (
                <th className="sorting" onClick={() => handleSortingColumn("date_debut_contrat")}>{translate("contract start date")}</th>
              )}
              {selectedColumns.date_fin_contrat && (
                <th className="sorting" onClick={() => handleSortingColumn("date_fin_contrat")}>{translate("contract end date")}</th>
              )}
              {selectedColumns.type_contrat && <th className="sorting" onClick={() => handleSortingColumn("type_contrat")}>{translate("Type")}</th>}
              {selectedColumns.ref_rh && <th className="sorting" onClick={() => handleSortingColumn("ref_rh")}>{translate("HR reference")}</th>}
              <th >{translate("Action")}</th>
            </tr>
          </thead>
          <tbody className="light-body">
            {loading ? (
              <tr>
                <td className="text-center" colSpan={8}>
                  <PropagateLoader
                    color={"#123abc"}
                    loading={loading}
                    size={20}
                  />
                </td>
              </tr>
            ) : list_Contrat.length > 0 ? (
              list_Contrat.map((contrat) => (
                <tr key={contrat.id_contrat}>
                  <td>
                    <div className="form-check form-check-inline">
                      <input type="checkbox" className="form-check-input" />
                    </div>
                  </td>
                  {selectedColumns.id_contrat && <td>{contrat.id_contrat}</td>}
                  {selectedColumns.conducteur && (
                    <td>
                      {contrat.conducteur_nom} {contrat.conducteur_prenom}
                    </td>
                  )}
                  {selectedColumns.date_debut_contrat && (
                    <td>
                      {new Date(
                        contrat.date_debut_contrat
                      ).toLocaleDateString()}
                    </td>
                  )}
                  {selectedColumns.date_fin_contrat && (
                    <td>
                      {new Date(contrat.date_fin_contrat).toLocaleDateString()}
                    </td>
                  )}
                  {selectedColumns.type_contrat && (
                    <td>{contrat.type_contrat}</td>
                  )}
                  {selectedColumns.ref_rh && <td>{contrat.ref_rh}</td>}
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
                        onClick={() => handleEditShow(contrat)}
                      >
                        <i
                          className="las la-edit"
                          style={{ fontSize: "1.2em", cursor: "pointer" }}
                        ></i>
                      </a>
                      <a
                        className="badge bg-warning mr-2"
                        title="Delete"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteShow(contrat.id_contrat)}
                      >
                        <i
                          className="ri-delete-bin-line mr-0"
                          style={{ fontSize: "1.2em" }}
                        ></i>
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>No contrat available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            {translate("Displaying")} {currentPage} {translate("out of")}{" "}
            {pageCount}
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
      </div>
      <ModalNewContrat
        show={showModal}
        handleClose={handleClose}
        refreshContrat={() => fetchData(currentPage, limit, search, typeSearch)}
      />
      <ModalEditContrat
        show={showEditModal}
        handleClose={handleEditClose}
        refreshContrat={() => fetchData(currentPage, limit, search, typeSearch)}
        contratId={contratToEdit?.id_contrat || null}
      />
      <Modal show={showDeleteModal} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>{translate("Confirmation de suppression")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {translate("Êtes-vous sûr de vouloir supprimer ce contrat ?")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            {translate("Annuler")}
          </Button>
          <Button variant="danger" onClick={handleDeleteContrat}>
            {translate("Supprimer")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
