import { Table } from "react-bootstrap";
import { useEffect, useState, useLayoutEffect } from "react";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import LineChartComponent from "../components/Charts/Gpsactivity";
import { PropagateLoader } from "react-spinners"; // Import the loader component
import ".././utilities/responsive.css";
import ExcelJS from "exceljs";

import {
  engineStat,
  BarreReseau,
  ValiderPosition,
  getAddressFromCoordinates,
  getAdressesFromCoords,
  formatDateForAlgeriaTimeZone,
} from "../utilities/functions";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export function Fleet() {
  interface Vehicle {
    id: number;
    immatriculation_vehicule: string;
    psn_dispositif: string;
    nom_groupe: string;
    nom_user: string;
    prenom_user: string;
    nom_conducteur: string;
    prenom_conducteur: string;
    TIMESTAMP: string; // Assuming TIMESTAMP is of type string, update if necessary
    GPSDIST: number; // Assuming GPSDIST is of type number, update if necessary
    GSMLVL: number | null; // Assuming GSMLVL is of type number or null, update if necessary
    NST: number; // Assuming NST is of type number, update if necessary
    ENGINESTAT: number; // Assuming ENGINESTAT is of type number, update if necessary
    LAT: number; // Assuming LAT is of type number, update if necessary
    LON: number; // Assuming LON is of type number, update if necessary
    vehicule_type: string; // Assuming vehicule_type is of type string, update if necessary
    telephone_conducteur: string; // Assuming telephone_conducteur is of type string, update if necessary
    SOG: number; // Assuming SOG is of type number, update if necessary
  }

  const { translate } = useTranslate();
  const [list_Fleet, setItems] = useState<Vehicle[]>([]);
  const [pageCount, setpageCount] = useState(0);
  let [total, settotal] = useState(0);
  let [limitValue, setSelectedlimitValue] = useState(15);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const [selectedHeader, setSelectedHeader] = useState("");
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("PSN");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState(false); // État pour suivre si toutes les lignes sont sélectionnées

  let currentPage = 1;

  const handleRowClick = async (rowId: string, lat: number, lon: number) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);

    if (expandedRow !== rowId) {
      try {
        setLoadingAddress(true); // Indicate the start of loading
        const address = await getAddressFromCoordinates(lat, lon);
        setAddress(address);
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoadingAddress(false); // Indicate the end of loading, whether there was an error or not
      }
    }
  };

  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setSelectedlimitValue(newValue);
    const commentsFormServer = await fetchFleet(currentPage, newValue);

    setItems(commentsFormServer);
  };

  const userID = localStorage.getItem("userID");
  useEffect(() => {
    const getFleet = async () => {
      try {
        setLoadingTable(true); // Début du chargement de la table
        const total_pages = await fetch(
          `${backendUrl}/api/fleet/totalpage/${userID}`,
          { mode: "cors" }
        );
        const totalpages = await total_pages.json();
        total = totalpages[0]["total"];
        settotal(totalpages[0]["total"]);

        // Remplacez l'appel de l'ancien API par le nouvel appel avec searchTerm
        const res = await fetch(
          `${backendUrl}/api/fleet/1/${limitValue}/${userID}?searchTerm=${searchTerm}&searchOption=${searchOption}`,
          { mode: "cors" }
        );

        const data = await res.json();
        setpageCount(Math.ceil(total / limitValue));

        setItems(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de la table :",
          error
        );
      } finally {
        setLoadingTable(false); // Fin du chargement de la table, qu'il y ait eu une erreur ou non
      }
    };

    getFleet();
  }, [userID, limitValue, searchTerm]);

  const fetchFleet = async (currentPage: any, limitValue: any) => {
    const res = await fetch(
      `${backendUrl}/api/fleet/${currentPage}/${limitValue}/${userID}`,
      { mode: "cors" }
    );
    const data = await res.json();
    return data;
  };

  const fetchUserFleet = async (page: any, limit: any) => {
    const res = await fetch(
      `${backendUrl}/api/fleet/${userID}/${page}/${limit}`,
      { mode: "cors" }
    );
    const data = await res.json();
    return data;
  };
  // function for page click handler
  const handlePageClick = async (data: any) => {
    currentPage = data.selected + 1;
    const commentsFormServer = await fetchFleet(currentPage, limitValue);

    setItems(commentsFormServer);
  };

  // Function to handle the change in the input field for search
  const handleSearchTermChange = async (event: any) => {
    const term = event.target.value;
    setSearchTerm(term);
  };
  //function for search option change
  const handleSearchOptionChange = (option: string) => {
    setSearchOption(option);
    setDropdownOpen(false); // Ferme la liste déroulante après avoir sélectionné une option
  };

  const clearSearchTerm = () => {
    setSearchTerm("");
  };
  //check box selection for excel
  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (isChecked) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    setSelectedRows(newSelectedRows);
  };

  // Fonction pour gérer le changement de la case à cocher pour sélectionner toutes les lignes
  const handleSelectAllCheckboxChange = (isChecked: boolean) => {
    setSelectAllChecked(isChecked); // Mettre à jour l'état de la case à cocher pour sélectionner toutes les lignes
    const newSelectedRows = new Set<number>(); // Initialiser un nouvel ensemble de lignes sélectionnées

    if (isChecked) {
      // Si la case à cocher est cochée, sélectionner toutes les lignes
      list_Fleet.forEach((item, index) => {
        newSelectedRows.add(index); // Ajouter l'index de la ligne à l'ensemble des lignes sélectionnées
      });
    } else {
      // Si la case à cocher est décochée, désélectionner toutes les lignes
      setSelectedRows(newSelectedRows); // Mettre à jour les lignes sélectionnées pour les vider
      return; // Sortir de la fonction car aucune autre action n'est nécessaire
    }

    setSelectedRows(newSelectedRows); // Mettre à jour les lignes sélectionnées
  };

  // function for export to excel file
  async function exportToExcel() {
    const selectedData = list_Fleet.filter((item, index) =>
      selectedRows.has(index)
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Fleet Data");

    // Define headers with style
    const headers = [
      { name: "Date Time", style: { font: { bold: true } } },
      { name: "Vehicle", style: { font: { bold: true } } },
      { name: "PSN", style: { font: { bold: true } } },
      { name: "Vehicles Groups", style: { font: { bold: true } } },
      { name: "User", style: { font: { bold: true } } },
      { name: "Driver", style: { font: { bold: true } } },
      { name: "Distance", style: { font: { bold: true } } },
      { name: "GSM", style: { font: { bold: true } } },
      { name: "State", style: { font: { bold: true } } },
      { name: "ENGINESTAT", style: { font: { bold: true } } },
      { name: "Address", style: { font: { bold: true } } }, // Add Address column
    ];
    worksheet.addRow(headers.map((header) => header.name));
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "DDDDDD" }, // Gray color
    };

    // Get addresses for each location
    const locations = selectedData.map((item) => ({
      id: item.id,
      lat: item.LAT,
      lon: item.LON,
    }));
    const addresses = await getAdressesFromCoords(locations);

    // Add data rows
    for (let i = 0; i < selectedData.length; i++) {
      const item = selectedData[i];
      const address = addresses[i].address; // Assuming the address is returned in the 'address' property

      const engineState =
        item["ENGINESTAT"] === 0
          ? "Engine off"
          : item["ENGINESTAT"] === 1 && item["SOG"] > 5
          ? "Engine running"
          : item["ENGINESTAT"] === 1
          ? "Engine on"
          : "Unknown";

      worksheet.addRow([
        formatDateForAlgeriaTimeZone(item["TIMESTAMP"]),
        item["immatriculation_vehicule"],
        item["psn_dispositif"],
        item["nom_groupe"],
        `${item["nom_user"]} ${item["prenom_user"]}`,
        `${item["nom_conducteur"]} ${item["prenom_conducteur"]}`,
        `${Math.floor(item["GPSDIST"] / 1000)} km`,
        item["GSMLVL"] !== null ? Number(item["GSMLVL"]).toFixed(0) + "%" : "0",
        item["NST"] === 1 ? "Valid position" : "Invalid position",
        engineState,
        address, // Add address to the row
      ]);
    }

    // Auto adjust column widths to fit the content
    worksheet.columns.forEach((column) => {
      column.width = Math.max(column.width ?? 0, 20); // Use 0 as the default width if column.width is undefined
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split("T")[0]; // Get the date part of the ISO string
    const timeString = currentDate
      .toTimeString()
      .split(" ")[0]
      .replace(/:/g, "-"); // Get the time part of the ISO string and replace colons with dashes
    const fileName = `fleet_Repport_${dateString}_${timeString}.xlsx`;

    // Create download link and click it to trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  let placeholderText = translate("Search by ");

  switch (searchOption) {
    case "PSN":
      placeholderText += translate("PSN");
      break;
    case "vehicule":
      placeholderText += translate("Vehicle");
      break;
    case "user":
      placeholderText += translate("User");
      break;
    case "conducteur":
      placeholderText += translate("Driver");
      break;
    default:
      placeholderText += "...";
  }

  return (
    <>
      <div className="row">
        <h4 className="col-sm-6 col-md-6">
          <i
            className="las la-chart-line"
            data-rel="bootstrap-tooltip"
            title="Increased"
          ></i>
          {translate("Fleet view")} ({total})
        </h4>
        <div className="col-sm-6 col-md-6 ">
          <div
            id="DataTables_Table_0_filter"
            className="float-right dataTables_filter mr-3"
          >
            <button
              className="btn btn-outline-info btn-generate-csv"
              onClick={exportToExcel}
              disabled={selectedRows.size === 0} // Désactive le bouton si aucune sélection n'est faite
            >
              <i className="las la-file-alt mr-3"></i>
              {translate("Generate rapport CSV")}
            </button>
            <br />
            <div>
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
        </div>
        <div className="input-group" style={{ maxWidth: "400px" }}>
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
                <li className={searchOption === "PSN" ? "active" : ""}>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSearchOptionChange("PSN")}
                  >
                    {translate("PSN")}
                  </a>
                </li>
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
                <li className={searchOption === "conducteur" ? "active" : ""}>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSearchOptionChange("conducteur")}
                  >
                    {translate("Driver")}
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
      <div>
        <div className="row m-2">
          <Table className="responsive bordered hover">
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
                <th>
                  <input
                    type="checkbox"
                    checked={selectAllChecked} // Vérifie si toutes les lignes sont sélectionnées
                    onChange={(event) =>
                      handleSelectAllCheckboxChange(event.target.checked)
                    } // Gère le changement de la case à cocher pour sélectionner toutes les lignes
                  />
                </th>

                <th>{translate("Vehicle")}</th>
                <th>{translate("PSN")}</th>
                <th>{translate("Vehicles Groups")}</th>
                <th>{translate("User")}</th>
                <th>{translate("Driver")}</th>
                <th>{translate("Date Time")}</th>
                <th>{translate("Distance")}</th>
                <th>{translate("GSM")}</th>
                <th>{translate("State")}</th>
              </tr>
            </thead>
            {loadingTable ? (
              <tr>
                <td colSpan={12}>
                  <div className="text-center mt-3">
                    <PropagateLoader
                      color={"#123abc"}
                      loading={loadingTable}
                      size={20}
                    />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {list_Fleet.map((item: any, index: number) => {
                  const rowId = `row_${index}`;
                  return (
                    <tbody key={item.id_vehicule} className="ligth-body">
                      <tr data-id={rowId}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.has(index)} // Vérifie si la ligne est sélectionnée
                            onChange={(event) =>
                              handleCheckboxChange(index, event.target.checked)
                            } // Gère le changement de la case à cocher
                          />
                        </td>
                        <td>
                          <div
                            className="d-flex align-items-center"
                            onClick={() =>
                              handleRowClick(rowId, item.LAT, item.LON)
                            }
                          >
                            <span
                              className="icon-chevron"
                              style={{
                                background: "#FFff",
                                cursor: "pointer",
                                marginRight: "10px",
                                fontSize: "20px",
                              }}
                            >
                              <i
                                className={`las ${
                                  expandedRow === rowId
                                    ? "la-chevron-down"
                                    : "la-chevron-right"
                                }`}
                              ></i>
                            </span>

                            <div>
                              {item["immatriculation_vehicule"]}
                              <p className="mb-0">
                                <small>{item["vehicule_type"]}</small>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{item["psn_dispositif"]}</td>
                        <td>{item["nom_groupe"]}</td>
                        <td>
                          {item["nom_user"]} {item["prenom_user"]}{" "}
                        </td>
                        <td>
                          {item["nom_conducteur"]} {item["prenom_conducteur"]}
                        </td>
                        <td>
                          {formatDateForAlgeriaTimeZone(item["TIMESTAMP"])}
                        </td>
                        <td>{Math.floor(item["GPSDIST"] / 1000)} km</td>

                        <td>
                          {item["GSMLVL"] !== null
                            ? item["GSMLVL"].toFixed(0)
                            : "0"}
                          %{""}
                          {item["GSMLVL"] !== null && (
                            <i
                              style={{
                                color: BarreReseau(item["GSMLVL"])
                                  .split("color:")[1]
                                  .slice(0, -1),
                              }}
                              className={`las la-signal ${BarreReseau(
                                item["GSMLVL"]
                              )}`}
                            ></i>
                          )}
                        </td>

                        <td>
                          {item["NST"] === 1 ? (
                            <i className={ValiderPosition(item["NST"])}></i>
                          ) : (
                            <i className={ValiderPosition(item["NST"])}></i>
                          )}
                          <img
                            src={
                              engineStat(
                                item["ENGINESTAT"],
                                item["SOG"],
                                translate
                              ).iconState
                            }
                            alt=""
                            title={
                              engineStat(
                                item["ENGINESTAT"],
                                item["SOG"],
                                translate
                              ).tooltipMessage
                            }
                          />
                        </td>
                      </tr>
                      {expandedRow === rowId && (
                        <tr>
                          <td colSpan={12}>
                            <div className="table-responsive table-bordered table-hover">
                              <Table>
                                <thead>
                                  <tr>
                                    <td
                                      style={{
                                        cursor: "pointer",
                                        textAlign: "center",
                                      }}
                                      className={`h6 ${
                                        selectedHeader === "additionalInfo"
                                          ? "table-active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setSelectedHeader("additionalInfo")
                                      }
                                    >
                                      {translate(
                                        "informations_supplementaires"
                                      )}
                                    </td>
                                    <td
                                      style={{
                                        cursor: "pointer",
                                        textAlign: "center",
                                      }}
                                      className={`h6 ${
                                        selectedHeader === "gpsActivity"
                                          ? "table-active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setSelectedHeader("gpsActivity")
                                      }
                                    >
                                      {translate("activite_gps")}
                                    </td>

                                    {/* <td
                                      style={{
                                        cursor: "pointer",
                                        textAlign: "center",
                                      }}
                                      className={`h6 ${
                                        selectedHeader === "report"
                                          ? "table-active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setSelectedHeader("report")
                                      }
                                    >
                                      {translate("Report")}
                                    </td> */}
                                  </tr>
                                </thead>
                              </Table>
                              <Table className="overflow-auto">
                                <tbody>
                                  {selectedHeader === "additionalInfo" && (
                                    <>
                                      <tr>
                                        <td colSpan={12}>
                                          {translate("Vehicle")}:
                                        </td>
                                        <td colSpan={12}>
                                          {item["immatriculation_vehicule"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colSpan={12}>
                                          {translate("Vehicles Groups")}:
                                        </td>
                                        <td colSpan={12}>
                                          {item["nom_groupe"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colSpan={12}>
                                          {translate("Phone")}:
                                        </td>
                                        <td colSpan={12}>
                                          {item["telephone_conducteur"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colSpan={12}>
                                          {translate("Date Time")}:
                                        </td>
                                        <td colSpan={12}>
                                          {item["TIMESTAMP"]}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colSpan={12}>
                                          {translate("Vitesse")}:
                                        </td>
                                        <td colSpan={12}>{item["SOG"]} km/h</td>
                                      </tr>
                                      <tr>
                                        <td colSpan={12}>
                                          {translate("Address")}:
                                        </td>
                                        <td colSpan={12}>
                                          {loadingAddress
                                            ? "Loading address..."
                                            : address}
                                        </td>
                                      </tr>
                                    </>
                                  )}

                                  {selectedHeader === "gpsActivity" && (
                                    <>
                                      <td colSpan={12}>
                                        <LineChartComponent
                                          psnDispositif={item["psn_dispositif"]}
                                        />
                                      </td>
                                    </>
                                  )}

                                  {/* {selectedHeader === "statistics" && (
                                  <tr>
                                    <td colSpan={12}>
                                      {translate("No statistics available")}
                                    </td>
                                  </tr>
                                )} */}
                                  {/* {selectedHeader === "report" && (
                                    <tr>
                                      <td colSpan={12}>
                                        {translate("No report available")}
                                      </td>
                                    </tr>
                                  )} */}
                                </tbody>
                              </Table>
                            </div>
                          </td>
                        </tr>
                      )}
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
    </>
  );
}
