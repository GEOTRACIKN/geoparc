import React, { useEffect, useState } from "react";
import { Button, Dropdown, Table } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { PropagateLoader } from "react-spinners";

import { useTranslate } from "../hooks/LanguageProvider";
import MissionReportDeleteModal from "../components/MissionReport/MissionReportDeleteModal";
import MissionReportPreview from "../components/MissionReport/MissionReportPreview";
import { useListPagePreferences } from "../hooks/useListPagePreferences";
import { useGpVisibleColumns } from "../hooks/useGpVisibleColumns";

interface MissionReport {
  id_misrap: number;
  ref_misrap: string;
  objt_misrap: string;
  carb_misrap: string;
  frais_misrap: number;
  immatriculation_vehicule: string;
  remorque_misrap: string;
  cond_misrap: string;
  acc_misrap: string;
  itnr_misrap: string;
  amort_misrap: number;
  dep_misrap: string;
  date_dep_misrap: string;
  lieu_misrap: string;
  date_arr_misrap: string;
  km_dep_misrap: number;
  nuit_misrap: number;
  immob_misrap: number;
  durr_misrap: number;
  km_ret_misrap: number;
  dist_misrap: number;
  id_vehicule: number;
  id_user: string;
}

type ReportingStatus =
  | "soumis"
  | "valide"
  | "refuse"
  | "disponible";

export function MissionReport() {
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL;

  const { translate } = useTranslate();

  const [limit, setLimit] =
    useState<number>(10);

  const [
    currentPage,
    setCurrentPage,
  ] = useState<number>(1);

  const id_user =
    localStorage.getItem("GeopUserID");

  const [
    selectedMissionReport,
    setSelectedMissionReport,
  ] = useState<MissionReport | null>(
    null
  );

  const [
    modalStatus,
    setModalStatus,
  ] = useState<string | null>(null);

  const [
    titleStatus,
    setTitleStatus,
  ] = useState<string | null>(null);

  const [
    IdUser,
    setIdUser,
  ] = useState<number>(0);

  const [
    isPreviewModalOpen,
    setIsPreviewModalOpen,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    pageCount,
    setPageCount,
  ] = useState(0);

  const [
    total,
    settotal,
  ] = useState(0);

  const [
    colum,
    setSortColum,
  ] = useState("id_misrap");

  const [
    sort,
    setSort,
  ] = useState("ASC");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    type,
    setType,
  ] = useState(2);

  const [
    typeSearch,
    setTypeSearch,
  ] = useState(
    translate("Last and first name")
  );

  const [
    IdMissionReport,
    setIdMissionReport,
  ] = useState<number>(0);

  const [
    list_MissionReport,
    setMissionReport,
  ] = useState<MissionReport[]>([]);

  /*
   * Permet d'éviter plusieurs clics
   * pendant la création de la notification.
   */
  const [
    statusLoadingId,
    setStatusLoadingId,
  ] = useState<number | null>(null);

  const {
    ready: listPreferencesReady,
  } = useListPagePreferences({
    pageKey: "mission-reports",

    pageSize: limit,
    setPageSize: setLimit,

    searchType: type,
    setSearchType: setType,

    searchTypeLabel: typeSearch,
    setSearchTypeLabel:
      setTypeSearch,

    searchText: search,
    setSearchText: setSearch,

    sortColumn: colum,
    setSortColumn:
      setSortColum,

    sortDirection: sort,
    setSortDirection: setSort,
  });

  /* ============================================================
     RECHERCHE / LISTE RAPPORTS
     ============================================================ */

  const getMissionReport = async (
    limitValue: number,
    pageValue: number,
    searchValue: string,
    typeValue: number,
    columnValue: string,
    sortValue: string
  ): Promise<MissionReport[]> => {
    try {
      setLoading(true);

      const bodyData =
        JSON.stringify({
          limitValue,
          currentPage:
            pageValue,
          search:
            searchValue,
          type:
            typeValue,
          id_user,
          colum:
            columnValue,
          sort:
            sortValue,
        });

      /*
       * TOTAL
       */
      const totalPagesResponse =
        await fetch(
          `${backendUrl}/api/geop/missionReportManage/totalpage`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              bodyData,

            mode:
              "cors",
          }
        );

      if (
        !totalPagesResponse.ok
      ) {
        throw new Error(
          "Erreur récupération total rapports"
        );
      }

      const totalPagesJson =
        await totalPagesResponse.json();

      const totalValue =
        Number(
          totalPagesJson.total ??
            totalPagesJson.count ??
            0
        );

      settotal(
        totalValue
      );

      /*
       * LISTE
       */
      const MissionReportResponse =
        await fetch(
          `${backendUrl}/api/geop/missionReportManage/search`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              bodyData,

            mode:
              "cors",
          }
        );

      if (
        !MissionReportResponse.ok
      ) {
        throw new Error(
          "Erreur récupération rapports"
        );
      }

      const data =
        await MissionReportResponse.json();

      const reports =
        Array.isArray(data)
          ? data
          : [];

      setPageCount(
        Math.ceil(
          totalValue /
            limitValue
        )
      );

      setMissionReport(
        reports
      );

      return reports;
    } catch (error) {
      console.error(
        "Error fetching mission reports:",
        error
      );

      setMissionReport(
        []
      );

      return [];
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     PAGINATION
     ============================================================ */

  const handlePageClick =
    async (data: any) => {
      const newPage =
        data.selected + 1;

      setCurrentPage(
        newPage
      );

      await getMissionReport(
        limit,
        newPage,
        search,
        type,
        colum,
        sort
      );

      window.scrollTo(
        0,
        0
      );
    };

  useEffect(() => {
    if (
      !listPreferencesReady
    ) {
      return;
    }

    getMissionReport(
      limit,
      currentPage,
      search,
      type,
      colum,
      sort
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    limit,
    currentPage,
    search,
    type,
    colum,
    sort,
    listPreferencesReady,
  ]);

  /* ============================================================
     NOMBRE DE LIGNES
     ============================================================ */

  const handleSelectChange =
    async (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const newValue =
        parseInt(
          event.target.value,
          10
        );

      setCurrentPage(1);
      setLimit(newValue);

      const reports =
        await getMissionReport(
          newValue,
          1,
          search,
          type,
          colum,
          sort
        );

      setMissionReport(
        reports
      );

      window.scrollTo(
        0,
        0
      );
    };

  /* ============================================================
     COLONNES
     ============================================================ */

  const [
    selectedColumns,
    setSelectedColumns,
  ] = useState({
    id_misrap: true,
    ref_misrap: true,
    objt_misrap: true,
    carb_misrap: true,
    frais_misrap: true,
    immatriculation_vehicule:
      true,
    remorque_misrap: true,
    cond_misrap: true,
    acc_misrap: true,
    itnr_misrap: true,
    amort_misrap: true,
    dep_misrap: true,
    date_dep_misrap: true,
    lieu_misrap: true,
    date_arr_misrap: true,
    km_dep_misrap: true,
    nuit_misrap: true,
    immob_misrap: true,
    durr_misrap: true,
    km_ret_misrap: true,
    dist_misrap: true,
    id_user: true,
  });

  useGpVisibleColumns(
    "mission-reports",
    selectedColumns,
    setSelectedColumns,
    listPreferencesReady
  );

  const handleColumnChange = (
    column: string
  ) => {
    setSelectedColumns(
      (
        prevState:
          any
      ) => ({
        ...prevState,

        [column]:
          !prevState[
            column
          ],
      })
    );
  };

  /* ============================================================
     TYPE RECHERCHE
     ============================================================ */

  const handleTypeSearch = (
    selectedValue: string
  ) => {
    switch (
      selectedValue
    ) {
      case translate(
        "ID"
      ):
        setType(0);
        break;

      case translate(
        "Object"
      ):
        setType(1);
        break;

      case translate(
        "Reference"
      ):
        setType(2);
        break;

      case translate(
        "Departure Date"
      ):
        setType(3);
        break;

      case translate(
        "Vehicle"
      ):
        setType(4);
        break;

      case translate(
        "Driver"
      ):
        setType(5);
        break;

      default:
        break;
    }

    setTypeSearch(
      selectedValue
    );
  };

  /* ============================================================
     RECHERCHE
     ============================================================ */

  const handleAdvancedSearch =
    async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newValue =
        event.target.value;

      setCurrentPage(1);
      setSearch(newValue);

      await getMissionReport(
        limit,
        1,
        newValue,
        type,
        colum,
        sort
      );
    };

  const handleResetSearch =
    async () => {
      setSearch("");
      setCurrentPage(1);

      await getMissionReport(
        limit,
        1,
        "",
        type,
        colum,
        sort
      );
    };

  /* ============================================================
     TRI
     ============================================================ */

  const handleSortingColum = (
    currentColumn: string
  ) => {
    const newSortOrder =
      sort === "ASC"
        ? "DESC"
        : "ASC";

    setSortColum(
      currentColumn
    );

    setSort(
      newSortOrder
    );

    getMissionReport(
      limit,
      currentPage,
      search,
      type,
      currentColumn,
      newSortOrder
    );
  };

  /* ============================================================
     SUPPRESSION
     ============================================================ */

  const handledeleteMissionReport =
    async (
      id_misrap: number
    ) => {
      try {
        setModalStatus(
          `${translate(
            "Do you want to delete this"
          )} ${translate(
            "Mission Report"
          )}?`
        );

        setTitleStatus(
          "Delete MissionReport"
        );

        setIdUser(
          parseInt(
            id_user ||
              "0",
            10
          )
        );

        setIdMissionReport(
          id_misrap
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  const closeModal =
    () => {
      setModalStatus(
        null
      );
    };

  const handleUpdateMissionReportList =
    () => {
      getMissionReport(
        limit,
        currentPage,
        search,
        type,
        colum,
        sort
      ).catch(
        (error) => {
          console.error(
            "Failed to update mission report list:",
            error
          );
        }
      );
    };

  /* ============================================================
     GD6 - NOTIFICATIONS REPORTING 28 → 31

     soumis      -> type 28
     valide      -> type 29
     refuse      -> type 30
     disponible  -> type 31
     ============================================================ */

  const handleMissionReportStatus =
    async (
      id_misrap: number,
      statut_misrap:
        ReportingStatus
    ) => {
      try {
        if (
          !id_user
        ) {
          alert(
            "Utilisateur introuvable"
          );

          return;
        }

        setStatusLoadingId(
          id_misrap
        );

        const response =
          await fetch(
            `${backendUrl}/api/geop/missionReportManage/status`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              mode:
                "cors",

              body:
                JSON.stringify(
                  {
                    id_misrap,
                    id_user,
                    statut_misrap,
                  }
                ),
            }
          );

        let data:
          any = null;

        try {
          data =
            await response.json();
        } catch {
          data =
            null;
        }

        if (
          !response.ok
        ) {
          throw new Error(
            data?.message ||
              data?.error ||
              `Erreur HTTP ${response.status}`
          );
        }

        console.log(
          "Notification Reporting créée:",
          data
        );

        /*
         * Message de confirmation.
         */
        switch (
          statut_misrap
        ) {
          case "soumis":
            alert(
              "Notification : Rapport soumis"
            );
            break;

          case "valide":
            alert(
              "Notification : Rapport validé"
            );
            break;

          case "refuse":
            alert(
              "Notification : Rapport refusé"
            );
            break;

          case "disponible":
            alert(
              "Notification : Rapport disponible"
            );
            break;
        }
      } catch (error) {
        console.error(
          "Erreur notification Reporting:",
          error
        );

        alert(
          error instanceof
            Error
            ? error.message
            : "Erreur lors de la création de la notification"
        );
      } finally {
        setStatusLoadingId(
          null
        );
      }
    };

  /* ============================================================
     MENU RECHERCHE
     ============================================================ */

  const menuItems = [
    translate("ID"),
    translate("Object"),
    translate("Reference"),
    translate(
      "Departure Date"
    ),
    translate("Vehicle"),
    translate("Driver"),
  ];

  /* ============================================================
     FORMAT DATE
     ============================================================ */

  function formatDatetimeLocal(
    dateString: string
  ): string {
    if (
      !dateString
    ) {
      return "";
    }

    const date =
      new Date(
        dateString
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return `${date.toLocaleDateString()} ${date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute:
          "2-digit",
      }
    )}`;
  }

  return (
    <>
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-tasks"></i>

            {" "}
            {translate(
              "Missions Report"
            )}{" "}

            <span>
              {total <
              10
                ? `0${total}`
                : total}
            </span>
          </h4>
        </div>

        <div className="col-md-6 col-sm-12 text-right">
          <NavLink
            to="/mission-report-manage/add"
            className="btn btn-primary mt-2 mr-1"
          >
            <i className="las la-plus mr-3"></i>

            {translate(
              "New"
            )}{" "}
            {translate(
              "Missions Report"
            )}
          </NavLink>
        </div>
      </div>

      {/* ======================================================
          RECHERCHE + OPTIONS
          ====================================================== */}

      <div className="row">
        <div
          className="col-md-4"
          style={{
            margin:
              "0px 0px 10px 0px",
            padding:
              "10px",
          }}
        >
          <div className="input-group">
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="mission-search-type"
                className="search-type-toggle"
              >
                <i
                  className="fas fa-chevron-down"
                  style={{
                    fontSize:
                      "20px",
                  }}
                ></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {menuItems.map(
                  (
                    item,
                    index
                  ) => (
                    <Dropdown.Item
                      key={
                        index
                      }
                      onClick={() =>
                        handleTypeSearch(
                          item
                        )
                      }
                      eventKey={
                        item
                      }
                      active={
                        typeSearch ===
                        item
                      }
                      className={
                        typeSearch ===
                        item
                          ? "select-active"
                          : ""
                      }
                    >
                      {
                        item
                      }
                    </Dropdown.Item>
                  )
                )}
              </Dropdown.Menu>
            </Dropdown>

            <input
              type="text"
              value={
                search
              }
              placeholder={` ${translate(
                "Search by"
              )} ${translate(
                typeSearch
              )}`}
              onChange={
                handleAdvancedSearch
              }
              className="form-control"
            />

            <Button
              variant="secondary"
              onClick={
                handleResetSearch
              }
              className="btn-reset"
            >
              <i
                className="las la-times"
                style={{
                  color:
                    "#fff",
                }}
              ></i>
            </Button>
          </div>
        </div>

        <div className="col-md-8 d-flex justify-content-end align-items-center">
          <div
            className="dataTables_length"
            id="DataTables_Table_0_length"
          >
            <label
              style={{
                marginBottom:
                  "0",
              }}
            >
              {translate(
                "Show"
              )}

              <select
                name="DataTables_Table_0_length"
                aria-controls="DataTables_Table_0"
                className="custom-select custom-select-sm form-control form-control-sm ml-2"
                style={{
                  width:
                    "66px",
                }}
                value={
                  limit
                }
                onChange={
                  handleSelectChange
                }
              >
                <option value="10">
                  10
                </option>

                <option value="20">
                  20
                </option>

                <option value="50">
                  50
                </option>

                <option value="100">
                  100
                </option>

                <option value="200">
                  200
                </option>

                <option value="500">
                  500
                </option>
              </select>
            </label>
          </div>

          <Dropdown>
            <Dropdown.Toggle
              variant=""
              id="mission-display-columns"
              title={translate(
                "Display columns"
              )}
            >
              <i className="las la-eye"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                as="button"
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    selectedColumns.id_misrap
                  }
                  onChange={() =>
                    handleColumnChange(
                      "id_misrap"
                    )
                  }
                />

                <span
                  style={{
                    marginLeft:
                      "10px",
                  }}
                >
                  {translate(
                    "ID"
                  )}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    selectedColumns.ref_misrap
                  }
                  onChange={() =>
                    handleColumnChange(
                      "ref_misrap"
                    )
                  }
                />

                <span
                  style={{
                    marginLeft:
                      "10px",
                  }}
                >
                  {translate(
                    "Reference"
                  )}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    selectedColumns.objt_misrap
                  }
                  onChange={() =>
                    handleColumnChange(
                      "objt_misrap"
                    )
                  }
                />

                <span
                  style={{
                    marginLeft:
                      "10px",
                  }}
                >
                  {translate(
                    "Object"
                  )}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    selectedColumns.cond_misrap
                  }
                  onChange={() =>
                    handleColumnChange(
                      "cond_misrap"
                    )
                  }
                />

                <span
                  style={{
                    marginLeft:
                      "10px",
                  }}
                >
                  {translate(
                    "Driver"
                  )}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    selectedColumns.date_dep_misrap
                  }
                  onChange={() =>
                    handleColumnChange(
                      "date_dep_misrap"
                    )
                  }
                />

                <span
                  style={{
                    marginLeft:
                      "10px",
                  }}
                >
                  {translate(
                    "Departure Date"
                  )}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                as="button"
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={
                    selectedColumns.immatriculation_vehicule
                  }
                  onChange={() =>
                    handleColumnChange(
                      "immatriculation_vehicule"
                    )
                  }
                />

                <span
                  style={{
                    marginLeft:
                      "10px",
                  }}
                >
                  {translate(
                    "Vehicle"
                  )}
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* ======================================================
          TABLE
          ====================================================== */}

      <div className="row m-1 table-responsive">
        <Table className="dataTable">
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                  />

                  <label className="form-check-label"></label>
                </div>
              </th>

              {selectedColumns.id_misrap && (
                <th
                  className="sorting"
                  onClick={() =>
                    handleSortingColum(
                      "id_misrap"
                    )
                  }
                >
                  {translate(
                    "ID"
                  )}
                </th>
              )}

              {selectedColumns.ref_misrap && (
                <th
                  className="sorting"
                  onClick={() =>
                    handleSortingColum(
                      "ref_misrap"
                    )
                  }
                >
                  {translate(
                    "Reference"
                  )}
                </th>
              )}

              {selectedColumns.objt_misrap && (
                <th
                  className="sorting"
                  onClick={() =>
                    handleSortingColum(
                      "objt_misrap"
                    )
                  }
                >
                  {translate(
                    "Object"
                  )}
                </th>
              )}

              {selectedColumns.date_dep_misrap && (
                <th
                  className="sorting"
                  onClick={() =>
                    handleSortingColum(
                      "date_dep_misrap"
                    )
                  }
                >
                  {translate(
                    "Departure Date"
                  )}
                </th>
              )}

              {selectedColumns.immatriculation_vehicule && (
                <th
                  className="sorting"
                  onClick={() =>
                    handleSortingColum(
                      "immatriculation_vehicule"
                    )
                  }
                >
                  {translate(
                    "Vehicle"
                  )}
                </th>
              )}

              {selectedColumns.cond_misrap && (
                <th
                  className="sorting"
                  onClick={() =>
                    handleSortingColum(
                      "cond_misrap"
                    )
                  }
                >
                  {translate(
                    "Driver"
                  )}
                </th>
              )}

              <th>
                {translate(
                  "Action"
                )}
              </th>
            </tr>
          </thead>

          <tbody
            key="#"
            className="ligth-body"
          >
            {loading ? (
              <tr
                style={{
                  textAlign:
                    "center",
                }}
              >
                <td
                  className="text-center"
                  colSpan={
                    10
                  }
                >
                  <p>
                    <PropagateLoader
                      color={
                        "#123abc"
                      }
                      loading={
                        loading
                      }
                      size={
                        20
                      }
                    />
                  </p>
                </td>
              </tr>
            ) : list_MissionReport.length >
              0 ? (
              list_MissionReport.map(
                (
                  missionReport
                ) => (
                  <tr
                    key={
                      missionReport.id_misrap
                    }
                  >
                    <td>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input"
                        />
                      </div>
                    </td>

                    {selectedColumns.id_misrap && (
                      <td>
                        {
                          missionReport.id_misrap
                        }
                      </td>
                    )}

                    {selectedColumns.ref_misrap && (
                      <td>
                        {
                          missionReport.ref_misrap
                        }
                      </td>
                    )}

                    {selectedColumns.objt_misrap && (
                      <td>
                        {
                          missionReport.objt_misrap
                        }
                      </td>
                    )}

                    {selectedColumns.date_dep_misrap && (
                      <td>
                        {formatDatetimeLocal(
                          missionReport.date_dep_misrap
                        )}
                      </td>
                    )}

                    {selectedColumns.immatriculation_vehicule && (
                      <td>
                        {
                          missionReport.immatriculation_vehicule
                        }
                      </td>
                    )}

                    {selectedColumns.cond_misrap && (
                      <td>
                        {
                          missionReport.cond_misrap
                        }
                      </td>
                    )}

                    {/* ==============================
                        ACTIONS
                        ============================== */}

                    <td>
                      <div className="d-flex align-items-center list-action flex-wrap">

                        {/* APERÇU */}
                        <button
                          type="button"
                          className="badge bg-primary mr-2 border-0"
                          onClick={() => {
                            setSelectedMissionReport(
                              missionReport
                            );

                            setIsPreviewModalOpen(
                              true
                            );
                          }}
                          title={
                            translate(
                              "Preview"
                            ) +
                            " " +
                            translate(
                              "Mission Order"
                            )
                          }
                        >
                          <i
                            className="las la-eye"
                            style={{
                              fontSize:
                                "1.2em",
                            }}
                          ></i>
                        </button>

                        {/* MODIFIER */}
                        <Link
                          to={`/mission-report-manage/edit/${missionReport.id_misrap}`}
                          className="badge badge-success mr-2"
                          data-toggle="tooltip"
                          data-placement="top"
                          title={
                            translate(
                              "Edit"
                            ) +
                            " " +
                            translate(
                              "Missions Report"
                            )
                          }
                        >
                          <i
                            className="las la-edit"
                            style={{
                              fontSize:
                                "1.2em",
                            }}
                          ></i>
                        </Link>

                        {/* ==========================
                            TYPE 28
                            RAPPORT SOUMIS
                            ========================== */}
                        <button
                          type="button"
                          className="badge bg-info mr-2 border-0"
                          disabled={
                            statusLoadingId ===
                            missionReport.id_misrap
                          }
                          onClick={() =>
                            handleMissionReportStatus(
                              missionReport.id_misrap,
                              "soumis"
                            )
                          }
                          title="Rapport soumis"
                        >
                          <i
                            className="las la-paper-plane"
                            style={{
                              fontSize:
                                "1.2em",
                            }}
                          ></i>
                        </button>

                        {/* ==========================
                            TYPE 29
                            RAPPORT VALIDÉ
                            ========================== */}
                        <button
                          type="button"
                          className="badge bg-success mr-2 border-0"
                          disabled={
                            statusLoadingId ===
                            missionReport.id_misrap
                          }
                          onClick={() =>
                            handleMissionReportStatus(
                              missionReport.id_misrap,
                              "valide"
                            )
                          }
                          title="Rapport validé"
                        >
                          <i
                            className="las la-check"
                            style={{
                              fontSize:
                                "1.2em",
                            }}
                          ></i>
                        </button>

                        {/* ==========================
                            TYPE 30
                            RAPPORT REFUSÉ
                            ========================== */}
                        <button
                          type="button"
                          className="badge bg-warning mr-2 border-0"
                          disabled={
                            statusLoadingId ===
                            missionReport.id_misrap
                          }
                          onClick={() =>
                            handleMissionReportStatus(
                              missionReport.id_misrap,
                              "refuse"
                            )
                          }
                          title="Rapport refusé"
                        >
                          <i
                            className="las la-times"
                            style={{
                              fontSize:
                                "1.2em",
                            }}
                          ></i>
                        </button>

                        {/* ==========================
                            TYPE 31
                            RAPPORT DISPONIBLE
                            ========================== */}
                        <button
                          type="button"
                          className="badge bg-secondary mr-2 border-0"
                          disabled={
                            statusLoadingId ===
                            missionReport.id_misrap
                          }
                          onClick={() =>
                            handleMissionReportStatus(
                              missionReport.id_misrap,
                              "disponible"
                            )
                          }
                          title="Rapport disponible"
                        >
                          <i
                            className="las la-file-alt"
                            style={{
                              fontSize:
                                "1.2em",
                            }}
                          ></i>
                        </button>

                        {/* SUPPRIMER */}
                        <button
                          type="button"
                          className="badge bg-danger mr-2 border-0"
                          onClick={() =>
                            handledeleteMissionReport(
                              missionReport.id_misrap
                            )
                          }
                          title={translate(
                            "Delete"
                          )}
                        >
                          <i
                            className="las la-trash"
                            style={{
                              fontSize:
                                "1.2em",
                            }}
                          ></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={9}>
                  No Mission Reports available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ======================================================
          PAGINATION
          ====================================================== */}

      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            {translate(
              "Displaying"
            )}{" "}
            {
              list_MissionReport.length
            }{" "}
            {translate(
              "on"
            )}{" "}
            {total}
          </span>
        </div>

        <div className="col-md-6 d-flex justify-content-end">
          <ReactPaginate
            previousLabel={translate(
              "previous"
            )}
            nextLabel={translate(
              "next"
            )}
            breakLabel={"..."}
            pageCount={
              pageCount
            }
            marginPagesDisplayed={
              2
            }
            pageRangeDisplayed={
              3
            }
            onPageChange={
              handlePageClick
            }
            containerClassName={
              "pagination justify-right"
            }
            pageClassName={
              "page-item"
            }
            pageLinkClassName={
              "page-link"
            }
            previousClassName={
              "page-item"
            }
            previousLinkClassName={
              "page-link"
            }
            nextClassName={
              "page-item"
            }
            nextLinkClassName={
              "page-link"
            }
            breakClassName={
              "page-item"
            }
            breakLinkClassName={
              "page-link"
            }
            activeClassName={
              "active"
            }
          />
        </div>

        {/* ====================================================
            MODAL SUPPRESSION
            ==================================================== */}

        <MissionReportDeleteModal
          show={
            modalStatus !==
            null
          }
          onHide={
            closeModal
          }
          status={
            modalStatus
          }
          title={
            titleStatus
          }
          IdUser={
            IdUser
          }
          IdMissionReport={
            IdMissionReport
          }
          updateMissionReportList={
            handleUpdateMissionReportList
          }
        />

        {/* ====================================================
            APERÇU
            ==================================================== */}

        <MissionReportPreview
          show={
            isPreviewModalOpen
          }
          onHide={() =>
            setIsPreviewModalOpen(
              false
            )
          }
          status={
            modalStatus
          }
          title={
            titleStatus
          }
          IdUser={
            IdUser
          }
          IdMissionReport={
            IdMissionReport
          }
          selectedMissionReport={
            selectedMissionReport
          }
          updateMissionReportList={
            handleUpdateMissionReportList
          }
        />
      </div>
    </>
  );
}