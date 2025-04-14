import React, { useState, useEffect } from "react";
import { Dropdown, Table } from "react-bootstrap";
import { Link, NavLink, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { formatToTimestamp } from "../utilities/functions";
import { PropagateLoader } from "react-spinners";

interface NotificationsProps {
  id_notification: number;
  id_groupe_alarme: number;
  name_groupe_alarme: string;
  name_alarme: string;
  id_user: number;
  id_item: number;
  id_type: number;
  message: string;
  severity: number;
  timestamp: string;
  state: number;
  attached: number;
  date_start: string;
  immatriculation_vehicule: string;
  training_prenom_conducteur: string;
  feu_immatriculation_vehicule: string;
  prenom_conducteur: string;
  training_nom_conducteur: string;
  nom_conducteur: string;
  id_alarm: number;
}

export function Notifications() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { translate } = useTranslate();
  let [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [list_Alarms, setAlarms] = useState<NotificationsProps[]>([]);
  const id_user = localStorage.getItem("GeopUserID");
  const [showCreateAlarmModal, setShowCreateAlarmModal] = useState(false);
  const handleshowCreateAlarmModal = () => setShowCreateAlarmModal(true);
  const handleCloseCreateAlarmModal = () => setShowCreateAlarmModal(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [pageCount, setPageCount] = useState(0);
  let [total, setTotal] = useState(0);
  const [colum, setSortColum] = useState("0");
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [type, setType] = useState(0);
  const [typeSearch, setTypeSearch] = useState("Notification ID");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = () => {
    // Votre logique de soumission ici
  };

  const getNotifications = async (
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
        `${backendUrl}/api/geop/notification/totalpage`,
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

      // Récupération des données d'alarmes
      const alarmsResponse = await fetch(
        `${backendUrl}/api/geop/notification/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyData,
          mode: "cors",
        }
      );

      const data = await alarmsResponse.json();
      setPageCount(Math.ceil(total / limitValue));
      setLimit(limitValue);
      setAlarms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAlarms = () => {
    getNotifications(limit, currentPage, search, type, colum, sort);
  };

  const getNotificationsLimitValue = async (
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
        `${backendUrl}/api/alarm/totalpage`,
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

      // Récupération des données d'alarmes
      const alarmsResponse = await fetch(`${backendUrl}/api/alarm/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
        mode: "cors",
      });

      const data = await alarmsResponse.json();
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
    await getNotifications(limit, currentPage, search, type, colum, sort);
    // setAlarms(commentsFormServer);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getNotifications(limit, currentPage, search, type, colum, sort);
  }, []);

  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setCurrentPage(1); //
    setLimit(newValue);
    const commentsFormServer = await getNotificationsLimitValue(
      parseInt(newValue),
      1,
      search,
      type,
      colum,
      sort
    );
    setAlarms(commentsFormServer);
    window.scrollTo(0, 0);
  };

  const [selectedColumns, setSelectedColumns] = useState({
    id_notification: id_user=="1" ? true : false,
    id_groupe_alarme: true,
    name_groupe_alarme: true,
    name_alarme: true,
    type: true,
    message: true,
    severity: true,
    timestamp: true,
    infos: true,
    attached: true,
    date_start: true,
    date_end: true,
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
      case translate("Notification ID"):
        setType(0);
        break;
      case translate("Groupe"):
        setType(1);
        break;
      case translate("Alertes"):
        setType(2);
        break;
      case translate("Details"):
        setType(3);
        break;
      case translate("Attaché à"):
        setType(4);
        break;
      case translate("Date de début"):
        setType(5);
        break;
      case translate("Date de fin"):
        setType(6);
        break;
      default:
        // console.log("Unknown selection");
        break;
    }

    setTypeSearch(selectedValue);
    // console.log("Selected value:", selectedValue);
  };

  const handleAdvancedSearch = async (event: any) => {
    const newValue = event.target.value;
    setSearch(newValue);
    await getNotifications(limit, currentPage, newValue, type, colum, sort);
  };

  const handleSortingColum = (currentColumn: string) => {
    setSortColum(currentColumn);
    sort == "ASC" ? setSort("DESC") : setSort("ASC");
    setCurrentPage(1);
    getNotifications(limit, 1, search, type, colum, sort);
  };

  const generateDescription = (alarme: NotificationsProps) => {
    const highlight = (value: any) => (
      <span style={{color:"#3b82f6"}} className="text-blue-500 font-semibold">{value}</span>
    );

    switch (alarme.id_type) {
      case 1: // Driving license
        return (
          <>
            {translate("The driving license of")}{" "}
            {highlight(alarme.nom_conducteur)}{" "}
            {highlight(alarme.prenom_conducteur)} {translate("will expire on")}{" "}
            {highlight(alarme.timestamp.split("T")[0].split("T")[0])}
          </>
        );

      case 2: // Vehicle insurance
        return (
          <>
            {translate("The insurance for")} {highlight(alarme.id_item)} 
            {highlight(alarme.immatriculation_vehicule)}{" "}
            {translate("will expire on")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 3: // Maintenance
        return (
          <>
            {translate("The next maintenance for vehicle")}{" "}
            {highlight(alarme.immatriculation_vehicule)}{" "}
            {translate("is due by")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 4: // Training
        return (
          <>
            {translate("The training certificate of")}{" "}
            {highlight(alarme.training_nom_conducteur)}{" "}
            {highlight(alarme.training_prenom_conducteur)}{" "}
            {translate("will expire on")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 5: // Fire extinguisher verification
        return (
          <>
            {translate("The fire extinguisher verification for vehicle")}{" "}
            {highlight(alarme.feu_immatriculation_vehicule)}{" "}
            {translate("is due by")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 6: // Technical control
        return (
          <>
            {translate("The technical inspection for vehicle")}{" "}
            {highlight(alarme.immatriculation_vehicule)}{" "}
            {translate("must be done before")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 7: // Sticker
        return (
          <>
            {translate("The vehicle sticker verification for")}{" "}
            {highlight(alarme.immatriculation_vehicule)}{" "}
            {translate("should be done by")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 8: // Draining
        return (
          <>
            {translate("The draining verification for vehicle")}{" "}
            {highlight(alarme.immatriculation_vehicule)}{" "}
            {translate("is scheduled for")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      default:
        return (
          <>
            {translate("The deadline for")} {highlight(alarme.id_item)} (
            {highlight(alarme.immatriculation_vehicule)}){" "}
            {translate("is set for")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-bell"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </span>
            {translate("Notifications")} ({total})
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right"></div>
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
                <Dropdown.Item>{translate("Notification ID")}</Dropdown.Item>
                <Dropdown.Item>{translate("Groupe")}</Dropdown.Item>
                <Dropdown.Item>{translate("Alertes ")}</Dropdown.Item>
                <Dropdown.Item>{translate("Détails")}</Dropdown.Item>
                <Dropdown.Item>{translate("Attaché à")}</Dropdown.Item>
                <Dropdown.Item>{translate("Date de début")}</Dropdown.Item>
                <Dropdown.Item>{translate("Date de fin")}</Dropdown.Item>
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
                  checked={selectedColumns.id_notification}
                  onChange={() => handleColumnChange("id_notification")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Notification ID")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.name_groupe_alarme}
                  onChange={() => handleColumnChange("name_groupe_alarme")}
                />
                <span style={{ marginLeft: "10px" }}>{translate("Group")}</span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.name_alarme}
                  onChange={() => handleColumnChange("name_alarme")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Alarms")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.message}
                  onChange={() => handleColumnChange("message")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Détails")}
                </span>
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.attached}
                  onChange={() => handleColumnChange("attached")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Attached to")}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.date_start}
                  onChange={() => handleColumnChange("date_start")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Creation date")}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.date_end}
                  onChange={() => handleColumnChange("date_end")}
                />
                <span style={{ marginLeft: "10px" }}>
                  {translate("Date end")}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{ display: "flex", alignItems: "center" }}
              ></Dropdown.Item>
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
              {selectedColumns.id_notification && id_user=="1" && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColum("id_notification")}
                >
                  {translate("Notification ID")}
                </th>
              )}
              {/* {selectedColumns.name_groupe_alarme && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColum("name_groupe_alarme")}
                >
                  {translate("Group")}
                </th>
              )} 
              {selectedColumns.name_alarme && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColum("name_alarme")}
                >
                  {translate("Alarmes")}
                </th>
              )} */}
              {selectedColumns.message && (
                <th
                  style={{ minWidth: "250px" }}
                  className="sorting"
                  onClick={() => handleSortingColum("message")}
                >
                  {translate("Détails")}
                </th>
              )}
              {/* {selectedColumns.attached && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColum("attached")}
                >
                  {translate("Attaché à ")}
                </th>
              )} */}
              {selectedColumns.date_start && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColum("date_start")}
                >
                  {translate("Creation date")}
                </th>
              )}

              {/* {selectedColumns.date_end && (
                <th
                  className="sorting"
                  onClick={() => handleSortingColum("date_end")}
                >
                  {translate("Date end ")}
                </th>
              )} */}
              {<th>{translate("Infos")}</th>}
            </tr>
          </thead>
          <tbody key="#" className="ligth-body">
            {loading ? (
              <tr>
                <td className="text-center" colSpan={7}>
                  <p>
                    <PropagateLoader
                      color={"#123abc"}
                      loading={loading}
                      size={20}
                    />
                  </p>
                </td>
              </tr>
            ) : list_Alarms.length > 0 ? (
              list_Alarms.map((alarme) => (
                <tr key={alarme.id_notification}>
                  <td>
                    <div className="form-check form-check-inline">
                      <input type="checkbox" className="form-check-input" />
                    </div>
                  </td>
                  {selectedColumns.id_notification && id_user=="1" && (
                    <td>{alarme.id_notification}</td>
                  )}
                  {/* {selectedColumns.name_groupe_alarme && <td>{alarme.name_groupe_alarme}</td>}
                  {selectedColumns.name_alarme && <td>{alarme.name_alarme}</td>} */}
                  {selectedColumns.message && (
                    <td>{generateDescription(alarme)}</td>
                  )}
                  {/* {selectedColumns.attached && (<td>{alarme.immatriculation_vehicule}</td>)} */}
                  {selectedColumns.date_start && (
                    <td>{formatToTimestamp(alarme.timestamp.split("T")[0])}</td>
                  )}
                  {/* {selectedColumns.date_end && (<td>{formatToTimestamp(alarme.timestamp.split("T")[0])}</td>)} */}
                  <td>
                    <div className="d-flex align-items-center list-action">
                      <Link
                        to={`/deadline/${alarme.id_alarm}/0`}
                        className="badge badge-success mr-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="View alarm"
                      >
                        <i
                          className="ri-share-forward-fill  mr-0"
                          style={{ fontSize: "1.2em" }}
                        ></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No notification available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            {translate("Displaying")} {list_Alarms.length} {translate("out of")}{" "}
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
    </>
  );
}
