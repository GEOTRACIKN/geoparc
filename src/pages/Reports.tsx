/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { Modal, Button } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";
import { renderStateCell, getReportName } from "../utilities/functions";
import { Bounce, toast, ToastOptions } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

let currentPage = 1;

// Interface pour les données du rapport
interface ReportData {
  id_report: number;
  turn_report: number;
  date_creation: string;
  id_user: number;
  nom_user: string;
  prenom_user: string;
  date_debut: string;
  date_fin: string;
  PSN: string | null;
  immatriculation_vehicule: string | null;
  state_report: number;
  type_report: string;
  id_dispositif: number;
}

export function Reports() {
  const { translate } = useTranslate();
  const [list_reports, setListReports] = useState<ReportData[]>([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(15);
  const userID = localStorage.getItem("userID");
  const [loading, setLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");
  const [sortType, setSortType] = useState("turn_report");
  const [groupedReports, setGroupedReports] = useState<{
    [key: string]: ReportData[];
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedReportsData, setSelectedReportsData] = useState<ReportData[]>(
    []
  );
  const [selectedItems, setSelectedItems] = useState<ReportData[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("vehicule");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = parseInt(event.target.value, 15);
    setLimit(newValue);
    const commentsFormServer = await fetchRapport(currentPage, newValue);

    setListReports(commentsFormServer);
  };

  const handleSelectAll = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const isChecked = target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      // Sélection totale
      setSelectedItems(list_reports);
    } else {
      // Désélection totale
      setSelectedItems([]);
    }

    showTurnsForSelection();
  };

  const handleCheckboxChange = (
    { target }: ChangeEvent<HTMLInputElement>,
    report: ReportData
  ) => {
    const isChecked = target.checked;

    setSelectedItems((prevSelectedItems) => {
      if (isChecked) {
        // Ajouter l'élément à la liste des éléments sélectionnés
        return [...prevSelectedItems, report];
      } else {
        // Retirer l'élément de la liste des éléments sélectionnés
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem.id_report !== report.id_report
        );
      }
    });

    // Ajouter cette ligne pour consoler la ligne sélectionnée
    console.log("Ligne sélectionnée :", report);

    showTurnsForSelection();
  };

  const showTurnsForSelection = useCallback(() => {
    if (selectAll) {
      console.log("ID des rapports pour la sélection totale :");
      console.log(selectedItems.map((item) => item.id_report));
    } else {
    }
  }, [selectAll, selectedItems]);

  useEffect(() => {
    console.log("selectedItems mis à jour :", selectedItems);
  }, [selectedItems]);

  const fetchReportData = async (
    currentPage: number,
    limit: number,
    sortType: string,
    sortDirection: string,
    searchTerm: string | null,
    searchOption: string | null
  ) => {
    try {
      setLoading(true);

      // Utilisez l'API pour récupérer le total
      const totalRes = await fetch(
        `${backendUrl}/api/rapport/totalpage/${userID}`,
        { mode: "cors" }
      );
      const totalData = await totalRes.json();
      const total = totalData[0].total;
      setTotal(total);

      const calculatedPageCount = Math.ceil(total / limit);
      setPageCount(calculatedPageCount);

      // Continuez avec le chargement des rapports
      let url = `${backendUrl}/api/rapports/iduser/${userID}?page=${currentPage}&limit=${limit}&sortColumn=${sortType}&sortOrder=${sortDirection}`;
      if (searchTerm && searchOption) {
        url += `&searchTerm=${searchTerm}&searchOption=${searchOption}`;
      }
      const res = await fetch(url, { mode: "cors" });

      if (!res.ok) {
        throw new Error(
          `Erreur lors de la récupération des rapports. Statut : ${res.status}`
        );
      }

      const data = await res.json();
      setListReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRapport = async (currentPage: number, limit: any) => {
    let url = `${backendUrl}/api/rapports/iduser/${userID}?page=${currentPage}&limit=${limit}&sortColumn=${sortType}&sortOrder=${sortDirection}`;
    if (searchTerm && searchOption) {
      url += `&searchTerm=${searchTerm}&searchOption=${searchOption}`;
    }
    const res = await fetch(url, { mode: "cors" });

    const data = await res.json();
    return data;
  };

  useEffect(() => {
    fetchReportData(
      currentPage,
      limit,
      sortType,
      sortDirection,
      searchTerm,
      searchOption
    );
  }, [userID, limit, sortType, sortDirection, searchTerm, searchOption]);
  useEffect(() => {
    groupReportsByTurn(list_reports);
  }, [list_reports]);

  const handlePageClick = async (data: { selected: number }) => {
    const newPage = data.selected + 1;
    const commentsFromServer = await fetchRapport(newPage, limit);

    setListReports(commentsFromServer);
    fetchReportData(newPage, limit, sortType, sortDirection, null, null);
  };

  const handleSort = async (type: "turn_report") => {
    let sortOrder: "ASC" | "DESC" = "ASC";

    if (type === sortType) {
      sortOrder = sortDirection === "ASC" ? "DESC" : "ASC";
    }
    setSortType(type);
    setSortDirection(sortOrder);
    fetchReportData(currentPage, limit, type, sortOrder, null, null); // Passer type au lieu de sortType
  };

  const groupReportsByTurn = (reports: ReportData[]) => {
    const grouped: { [key: number]: ReportData[] } = {};

    reports.forEach((report) => {
      const turnKey = report.turn_report;

      if (!grouped[turnKey]) {
        grouped[turnKey] = [];
      }

      grouped[turnKey].push(report);
    });

    setGroupedReports(grouped);
  };

  // Fonction pour afficher la liste de type_report dans le Modal
  const showTypeReportList = async (turn_report: number) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/reports/byTurn/${turn_report}`,
        { mode: "cors" }
      );

      if (!res.ok) {
        throw new Error(
          `Erreur lors de la récupération des rapports pour le tour. Statut : ${res.status}`
        );
      }

      const data = await res.json();
      setSelectedReportsData(data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleItemClick = (report: ReportData) => {
    // Logique à exécuter lorsque l'élément est cliqué et activé
    console.log(`Rapport ${report.type_report} a été cliqué !`);

    // Construire l'URL avec les données du rapport et naviguer vers la page de rapport
    const url = `/report/${report.id_report}/${report.turn_report}/${report.type_report}`;
    window.location.href = url; // Vous pouvez également utiliser la navigation de réaction ici.
  };
  const supprimerRapportsSelectionnes = async () => {
    // Affiche la modal de confirmation avant la suppression
    setShowConfirmationModal(true);
  };

  const handleConfirmation = async () => {
    // Ferme la modal de confirmation
    setShowConfirmationModal(false);

    try {
      // Utilisez une boucle pour supprimer chaque rapport sélectionné
      for (const selectedReport of selectedItems) {
        const reportsToDelete = {
          turn_report: selectedReport.turn_report,
          id_dispositif: selectedReport.id_dispositif,
        };

        console.log("a supprimer :", reportsToDelete);

        const response = await fetch(`${backendUrl}/api/supprimer-rapports`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportsToDelete),
        });

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la suppression des rapports. Statut : ${response.status}`
          );
          
        }
        toast.success(translate("Reports Deleted successfully !"), {
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
        try {
          const timestamp = new Date(Date.now() + 60 * 60 * 1000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          const details = `Delete Reports turn: ${selectedReport.turn_report}`; // Details for the log

          await fetch(`${backendUrl}/api/log-user-action/${userID}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "Delete",
              page: "Reports",
              operation: "supprimer",
              timestamp,
              details,
            }),
          });
        } catch (error) {
          console.error("Error logging reports action:", error);
        }

        // Mise à jour de selectedItems après la suppression réussie
        setSelectedItems([]);
      }

      // Mettez à jour l'état ou effectuez d'autres actions en conséquence
      // Par exemple, rechargez la liste des rapports après la suppression
      fetchReportData(currentPage, limit, sortType, sortDirection, null, null);
      // ... autres mises à jour nécessaires
    } catch (error) {
      console.error(
        "Erreur lors de la suppression des rapports sélectionnés :",
        error
      );
    }
  };

  const handleCancelConfirmation = () => {
    // Annule la suppression en fermant la modal de confirmation
    setShowConfirmationModal(false);
  };

  let placeholderText = translate("Search by ");

  switch (searchOption) {
    case "vehicule":
      placeholderText += translate("Vehicle");
      break;
    case "user":
      placeholderText += translate("User");
      break;
    case "turn":
      placeholderText += translate("Turn Report");
      break;
    default:
      placeholderText += "...";
  }

  // Function to handle the change in the input field for search
  const handleSearchTermChange = async (event: any) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleSearchOptionChange = (option: string) => {
    setSearchOption(option);
    setDropdownOpen(false); // Ferme la liste déroulante après avoir sélectionné une option
  };

  const clearSearchTerm = () => {
    setSearchTerm("");
  };

  return (
    <>
      <div className="row m-2">
        <div className="col-sm-12 col-md-6">
          <h4 className="mb-3">
            <i
              className="las la-file-alt"
              data-rel="bootstrap-tooltip"
              title="Rapports"
            ></i>
            {translate("Rapports")}({total})
          </h4>
        </div>
        <div
          className="col-sm-12 col-md-6 float-right"
          style={{ textAlign: "right" }}
        >
          <Link to="/new-report" className="btn btn-outline-info">
            {" "}
            <i className="las la-plus mr-3"></i> {translate("New Report")}{" "}
          </Link>

          <Button
            className="btn ml-2"
            onClick={supprimerRapportsSelectionnes}
            disabled={selectedItems.length === 0}
          >
            <i className="las la-trash"></i> {translate("Delete")}
          </Button>
        </div>
      </div>
      <div>
        <div className="row m-2">
          <div
            className="col-sm-12 col-md-6"
            style={{ margin: "0px 0px 10px 0px", padding: "0px" }}
          >
            <div className="input-group" style={{ maxWidth: "600px" }}>
              <div
                className="btn-group"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)} // Ouvre la liste au survol
                onMouseLeave={() => setDropdownOpen(false)} // Ferme la liste au survol
              >
                <button
                  className="btn btn-default dropdown-toggle"
                  type="button"
                  name="dropdown_btn"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen ? "true" : "false"}
                >
                  <span
                    className="las la-chevron-down"
                    data-toggle="tooltip"
                    title="Rechercher"
                  ></span>
                </button>
                {dropdownOpen && (
                  <ul
                    className="dropdown-menu show-dropdown"
                    role="menu"
                    id="search_by"
                    style={{ padding: "4px" }}
                  >
                    <li className={searchOption === "vehicule" ? "active" : ""}>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSearchOptionChange("vehicule")}
                      >
                        {translate("Vehicle")}
                      </a>
                    </li>
                    <li className={searchOption === "user" ? "active" : ""}>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSearchOptionChange("user")}
                      >
                        {translate("User")}
                      </a>
                    </li>
                    <li className={searchOption === "turn" ? "active" : ""}>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSearchOptionChange("turn")}
                      >
                        {translate("Turn Report")}
                      </a>
                    </li>
                  </ul>
                )}
              </div>
              <input
                type="text"
                placeholder={placeholderText}
                className="form-control border-right-0 custom-search-input"
                onChange={handleSearchTermChange}
                value={searchTerm}
                style={{ borderRadius: "20px" }}
              />
              {searchTerm && (
                <div className="input-group-append">
                  <button
                    className="btn btn-light border-left-0"
                    onClick={clearSearchTerm}
                  >
                    <i
                      className="las la-times-circle"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="col-sm-12 col-md-6" style={{ textAlign: "right" }}>
            <div className="dataTables_length" id="DataTables_Table_0_length">
              <label>
                {translate("Show")}
                <select
                  name="DataTables_Table_0_length"
                  aria-controls="DataTables_Table_0"
                  className="custom-select custom-select-sm form-control form-control-sm mr-2 ml-2"
                  style={{ width: "66px" }}
                  onChange={handleSelectChange}
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                  <option value="180">180</option>
                  <option value="300">300</option>
                  <option value="600">600</option>
                  <option value="900">900</option>
                </select>
                {translate("entries")}
              </label>
            </div>
          </div>

          <Table>
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
                <th>
                  <div className="checkbox d-inline-block">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      id="checkbox1"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <label htmlFor="checkbox1" className="mb-0"></label>
                  </div>
                </th>
                <th style={{ width: "199px", cursor: "pointer" }}>
                  <span onClick={() => handleSort("turn_report")}>
                    {translate("Turn Report")}
                    {sortType === "turn_report" &&
                      sortDirection === "ASC" &&
                      " ▲"}
                    {sortType === "turn_report" &&
                      sortDirection === "DESC" &&
                      " ▼"}
                  </span>
                </th>
                <th>{translate("Vehicle")}</th>
                <th>{translate("User Name")}</th>
                <th>{translate("Creation Date")}</th>
                <th>{translate("Start date")}</th>
                <th>{translate("End date")}</th>
                <th>{translate("State")}</th>
                {/* Add other headers as needed */}
              </tr>
            </thead>
            {loading ? (
              <tr>
                <td colSpan={12}>
                  <div className="text-center">
                    <PropagateLoader
                      color={"#123abc"}
                      loading={loading}
                      size={20}
                    />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {Object.keys(groupedReports).map((turnKey) => {
                  const reportsForTurn = groupedReports[turnKey];
                  return (
                    <tbody key={turnKey} className="ligth-body">
                      {reportsForTurn.map((item: ReportData) => (
                        <tr key={item.turn_report}>
                          <td>
                            <div className="checkbox d-inline-block">
                              <input
                                type="checkbox"
                                className="checkbox-input"
                                id={`checkbox-${item.turn_report}`}
                                checked={selectedItems.some(
                                  (selectedItem) =>
                                    selectedItem.id_report === item.id_report
                                )}
                                onChange={(event) =>
                                  handleCheckboxChange(event, item)
                                }
                              />
                              <label
                                htmlFor={`checkbox-${item.turn_report}`}
                                className="mb-0"
                              ></label>
                            </div>
                          </td>
                          <td>{item.turn_report}</td>
                          <td>{item.immatriculation_vehicule}</td>
                          <td>{`${item.nom_user} ${item.prenom_user}`}</td>
                          <td>
                            {new Date(item.date_creation).toLocaleString()}
                          </td>
                          <td>{new Date(item.date_debut).toLocaleString()}</td>
                          <td>{new Date(item.date_fin).toLocaleString()}</td>
                          {renderStateCell(item.state_report, () =>
                            showTypeReportList(item.turn_report)
                          )}
                        </tr>
                      ))}
                    </tbody>
                  );
                })}
              </>
            )}
          </Table>
        </div>

        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{translate("Report List")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReportsData && selectedReportsData.length > 0 ? (
            <div>
              <h6>
                {translate("Turn Report")}: {selectedReportsData[0].turn_report}
              </h6>
              <ul>
                {selectedReportsData.map((report: ReportData) => (
                  <li
                    key={report.id_report}
                    style={{
                      cursor:
                        report.state_report === 1 ? "pointer" : "not-allowed",
                      color: report.state_report === 1 ? "blue" : "gray",
                    }}
                    onClick={() =>
                      report.state_report === 1 && handleItemClick(report)
                    }
                  >
                    {[
                      `[${report.type_report}] ${getReportName(
                        report.type_report,
                        translate
                      )}`,
                    ]}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No data available for selected turn report.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {translate("Close")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmationModal} onHide={handleCancelConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>{translate("Confirmation de suppression")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {translate(
            "Êtes-vous sûr de vouloir supprimer les rapports sélectionnés ?"
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelConfirmation}>
            {translate("Annuler")}
          </Button>
          <Button variant="danger" onClick={handleConfirmation}>
            {translate("Confirmer la suppression")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
