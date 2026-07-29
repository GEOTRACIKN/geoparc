import { useEffect, useRef, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link, useParams } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import ModalNewDeadline from "../components/Deadline/NewDeadline";
import CalendarDeadlineModal from "../components/Deadline/CalendarDeadline";
import ModalShowDeadline from "../components/Deadline/ShowDeadline";
import { PropagateLoader } from "react-spinners";
import ModalEditDeadline from "../components/Deadline/EditDeadline";
import ModalDeleteDeadline from "../components/Deadline/DeleteDeadline";
import { Calendar, momentLocalizer } from "react-big-calendar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import frLocale from "@fullcalendar/core/locales/fr";
import enLocale from "@fullcalendar/core/locales/en-gb";
import esLocale from '@fullcalendar/core/locales/es';
import arLocale from "@fullcalendar/core/locales/ar";
import interactionPlugin from "@fullcalendar/interaction";
import { DownloadModal, generateExcelFile, generatePDFFile, handleDownloadConfirm, toTimestamp, useClipboard } from "../utilities/functions";
import { set } from "lodash";
import { toast } from "react-toastify";
import { useGpPagePreferences } from "../hooks/useGpPagePreferences";

const deadlineDefaultColumns = {
  id_deadline: true,
  nom_type: true,
  date_deadline: true,
  date_creation: true,
  id_item: true,
};

const deadlinePreferenceDefaults = {
  visibleColumns: Object.keys(deadlineDefaultColumns),
  pageSize: 10,
  searchType: 0,
  searchText: "",
  sortColumn: "id_deadline",
  sortDirection: "DESC",
  filters: { view: "list" },
  selectedVehicleId: null as number | null,
};

interface DeadlineInterface {
  id_deadline: number;
  id_user: number;
  id_type: number;
  date_deadline: string;
  date_creation: string;
  status: string;
  description: string;
  nom_type: string;
  id_item: string;
  nom_conducteur: string;
  prenom_conducteur: string;
  immatriculation_vehicule: string;
  training_id_conducteur: number;
  training_nom_conducteur: string;
  training_prenom_conducteur: string;
  feu_id_vehicule: string;
  feu_immatriculation_vehicule: number;
  item_name: string;
}


export function Deadline() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { id_alarm } = useParams<{ id_alarm?: string }>();
  const { id_type } = useParams<{ id_type?: string }>();
  const typeId = id_type ? parseInt(id_type, 10) : null;
  const { lang, translate } = useTranslate();

  const localeMap = {
    en: enLocale,
    fr: frLocale,
    ar: arLocale,
    es: esLocale,
  };

  const [list_Deadline, setDeadline] = useState<DeadlineInterface[]>([]);
  const id_user = localStorage.getItem("GeopUserID");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState(0);
  const [typeSearch, setTypeSearch] = useState("ID");
  const [search, setSearch] = useState("");
  const [column, setSortColumn] = useState("id_deadline");
  const [sort, setSort] = useState("DESC");
  const [total, setTotal] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // For confirmation modal
  const [selectedDeadlineId, setSelectedDeadlineId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState("dayGridMonth"); // Vue par défauts
  const localizer = momentLocalizer(moment);
  type ModeType = "create" | "edit" | "yourModeValue"; // Add "yourModeValue" to the allowed types
  const [mode, setMode] = useState<ModeType>("create");
  const { copyToClipboard, copiedId } = useClipboard(translate("Matriculation Copied"));

  const [selectedDeadlines, setSelectedDeadlines] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);



  const onDownloadConfirm = (format: string) => {
    if (selectedDeadlines.length > 0) {
      handleDownloadConfirm(format, downloadVehicleExcel, downloadVehiclePDF);
    } else {
      toast.warn("Please select at least one driver", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };



  const driverHeaders = [
    translate("ID"),
    translate("Type deadline"),
    translate("Creation date"),
    translate("Deadline date"),
    translate("Deadline for"),
  ];



  const downloadVehicleExcel = () => {

    const selectedData = list_Deadline.filter((Deadline) =>
      selectedDeadlines.includes(Deadline.id_deadline.toString())
    ).map((deadline) => [
      deadline.id_deadline,
      deadline.nom_type,
      toTimestamp(deadline.date_creation),
      toTimestamp(deadline.date_deadline),
      generatePlainTextDescription(deadline)
    ]);


    generateExcelFile(translate("List") + ' ' + translate("Vehicles"), driverHeaders, selectedData);
  };

  const downloadVehiclePDF = () => {

    const selectedData = list_Deadline.filter((Deadline) =>
      selectedDeadlines.includes(Deadline.id_deadline.toString())
    ).map((deadline) => [
      deadline.id_deadline,
      deadline.nom_type,
      toTimestamp(deadline.date_creation),
      toTimestamp(deadline.date_deadline),
      generatePlainTextDescription(deadline)
    ]);

    generatePDFFile(translate("List") + ' ' + translate("Vehicles"), driverHeaders, selectedData);
  };





  const calendarRef = useRef<FullCalendar | null>(null);
  const changeView = (view: string) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
      setCurrentView(view);
    }
  };
  const viewTranslations: Record<string, string> = {
    timeGridDay: "day",
    timeGridWeek: "week",
    dayGridMonth: "month",
    listYear: "year",
  };

  // Define the calendar events (empty for now)
  const initialColumns = deadlineDefaultColumns;
  const [selectedColumns, setSelectedColumns] = useState(deadlineDefaultColumns);
  const {
    preferences: deadlinePreferences,
    setPreferences: saveDeadlinePreferences,
    loaded: deadlinePreferencesLoaded,
  } = useGpPagePreferences("deadlines", deadlinePreferenceDefaults);
  const deadlinePreferencesHydratedRef = useRef(false);
  const [deadlinePreferencesReady, setDeadlinePreferencesReady] =
    useState(false);

  useEffect(() => {
    if (
      !deadlinePreferencesLoaded ||
      deadlinePreferencesHydratedRef.current
    ) return;
    deadlinePreferencesHydratedRef.current = true;

    const visibleColumns = new Set(deadlinePreferences.visibleColumns);
    setSelectedColumns(
      Object.keys(deadlineDefaultColumns).reduce(
        (result, key) => ({
          ...result,
          [key]: visibleColumns.has(key),
        }),
        {} as typeof deadlineDefaultColumns
      )
    );
    setLimit(deadlinePreferences.pageSize);
    setType(deadlinePreferences.searchType);
    setTypeSearch(
      deadlinePreferences.searchType === 1
        ? translate("Type")
        : deadlinePreferences.searchType === 2
          ? translate("Deadline date")
          : deadlinePreferences.searchType === 3
            ? translate("Creation date")
            : deadlinePreferences.searchType === 4
              ? translate("Deadline for")
              : translate("ID")
    );
    setSearch(deadlinePreferences.searchText);
    setSortColumn(deadlinePreferences.sortColumn);
    setSort(deadlinePreferences.sortDirection);
    setIsGridView(deadlinePreferences.filters.view !== "calendar");
    setDeadlinePreferencesReady(true);
  }, [deadlinePreferences, deadlinePreferencesLoaded]);

  useEffect(() => {
    if (!deadlinePreferencesReady) return;

    void saveDeadlinePreferences({
      visibleColumns: Object.entries(selectedColumns)
        .filter(([, visible]) => visible)
        .map(([key]) => key),
      pageSize: limit,
      searchType: type,
      searchText: search,
      sortColumn: column,
      sortDirection: sort,
      filters: { view: isGridView ? "list" : "calendar" },
    });
  }, [
    column,
    deadlinePreferencesReady,
    isGridView,
    limit,
    saveDeadlinePreferences,
    search,
    selectedColumns,
    sort,
    type,
  ]);

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prevState: any) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };

  const refreshDeadline = () => {
    getDeadlines(limit, currentPage, search, type, column, "ASC");

  };


  const handleSortingColumn = (currentColumn: string) => {
    setSortColumn(currentColumn);
    setSort((currentSort) => currentSort === "ASC" ? "DESC" : "ASC");
    setCurrentPage(1);
  };

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showNewDeadlineModal, setShowNewDeadlineModal] = useState(false);
  const [showEditDeadlineModal, setShowEditDeadlineModal] = useState(false);
  const [showCalendarDeadlineModal, setShowCalendarDeadlineModal] =
    useState(false);

  const [showShowDeadlineModal, setShowShowDeadlineModal] = useState(false);
  const [showDeleteDeadlineModal, setShowDeleteDeadlineModal] = useState(false);
  const handleShowNewDeadlineModal = () => setShowNewDeadlineModal(true);
  const handleCloseNewDeadlineModal = () => setShowNewDeadlineModal(false);
  const handleDeleteDeadlineModal = (id: number) => {
    setSelectedDeadlineId(id);
    setShowDeleteDeadlineModal(true);
  };
  const handleCloseDeleteDeadlineModal = () =>
    setShowDeleteDeadlineModal(false);
  const handleEditDeadlineModal = (id: number) => {
    setSelectedDeadlineId(id);
    setShowEditDeadlineModal(true);
  };

  const handleCloseEditDeadlineModal = () => setShowEditDeadlineModal(false);
  const handleCalendarDeadlineModal = (id: number) => {
    setSelectedDeadlineId(id);
    setShowCalendarDeadlineModal(true);
  };
  const handleCloseCalendarDeadlineModal = () =>
    setShowCalendarDeadlineModal(false);

  const [DeadlineDetails, setDeadlineDetails] = useState(null);

  const handleShowShowDeadlineModal = (id: number) => {
    setSelectedDeadlineId(id);
    setShowShowDeadlineModal(true);
  };

  const handleCloseShowDeadlineModal = () => setShowShowDeadlineModal(false);

  const searchColumn: { [key: string]: number } = {
    id_deadline: 0,
    nom_type: 1,
    date_deadline: 2,
    date_creation: 3,
    status: 4,
    description: 5,
  };

  const getDeadlines = async (
    limitValue: number,
    currentPage: number,
    search: string,
    type: number,
    column: string,
    sort: string
  ) => {
    try {
      setLoading(true);

      // Preparing the data to send
      const bodyData = JSON.stringify({
        limitValue,
        currentPage,
        search,
        type,
        id_user,
        column: searchColumn[column],
        sort,
      });

      // Retrieve the total number of pages
      const totalPagesResponse = await fetch(
        `${backendUrl}/api/geop/deadline/totalpage`,
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

      // Retrieve driver data
      const DriversResponse = await fetch(
        `${backendUrl}/api/geop/deadline/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyData,
          mode: "cors",
        }
      );

      const data = await DriversResponse.json();
      setPageCount(Math.ceil(total / limitValue));
      setLimit(limitValue);
      setDeadline(data);


      // Formatter les données pour FullCalendar
      const formattedDeadlines = data.map((deadline: any) => ({
        id: deadline.id_deadline || "Sans ID",
        title: generatePlainTextDescription(deadline) || "Sans titre",
        start: deadline.date_deadline
          ? moment(deadline.date_deadline).format("YYYY-MM-DD")
          : null,
        end: deadline.date_creation
          ? moment(deadline.date_creation).format("YYYY-MM-DD")
          : null,
        type: deadline.nom_type,
        color: getColorByType(deadline.id_type),

      }));

      setEvents(formattedDeadlines)



      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  const generatePlainTextDescription = (deadline: any) => {
    switch (deadline.id_type) {
      case 1:
        return `The driving license of ${deadline.nom_conducteur} ${deadline.prenom_conducteur} will expire on ${deadline.date_deadline}`;
      case 2:
        return `The insurance for ${deadline.id_item} (${deadline.immatriculation_vehicule}) will expire on ${deadline.date_deadline}`;
      case 3:
        return `The next maintenance for vehicle ${deadline.immatriculation_vehicule} is due by ${deadline.date_deadline}`;
      case 4:
        return `The training certificate of ${deadline.training_nom_conducteur} ${deadline.training_prenom_conducteur} will expire on ${deadline.date_deadline}`;
      case 5:
        return `The fire extinguisher verification for vehicle ${deadline.feu_immatriculation_vehicule} is due by ${deadline.date_deadline}`;
      case 6:
        return `The technical inspection for vehicle ${deadline.immatriculation_vehicule} must be done before ${deadline.date_deadline}`;
      case 7:
        return `The vehicle sticker verification for ${deadline.immatriculation_vehicule} should be done by ${deadline.date_deadline}`;
      case 8:
        return `The draining verification for vehicle ${deadline.immatriculation_vehicule} is scheduled for ${deadline.date_deadline}`;
      default:
        return `The deadline for ${deadline.id_item} (${deadline.immatriculation_vehicule}) is set for ${deadline.date_deadline}`;
    }
  };

  const getColorByType = (type: string) => {
    const colors: Record<string, string> = {
      "1": "#FF5733", // Bright Red
      "2": "#1E7D22", // Dark Green 🍃
      "3": "#3357FF", // Classic Blue
      "4": "#FFC300", // Yellow
      "5": "#8E44AD", // Purple
      "6": "#E67E22", // Orange
      "7": "#2C3E50", // Midnight Blue
      "8": "#D35400", // Terracotta
      "9": "#16A085", // Emerald Green
    };

    return colors[type] || "#808080"; // Default color
  };


  const getCalendarDeadlines = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/geop/deadline/calendar/${id_user}`
      );
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error retrieving Deadlines :", error);
    }
  };

  useEffect(() => {
    if (!deadlinePreferencesReady) return;

    if (typeId) {
      const deadlineTypeName = getDeadlineTypeName(typeId);
      setSearch(deadlineTypeName);
      setType(1);
      setTypeSearch(translate("Type"));
      void getDeadlines(
        limit,
        currentPage,
        deadlineTypeName,
        1,
        column,
        sort
      );
      return;
    }

    void getDeadlines(
      limit,
      currentPage,
      id_alarm || search,
      type,
      column,
      sort
    );
  }, [
    column,
    currentPage,
    deadlinePreferencesReady,
    id_alarm,
    id_user,
    limit,
    search,
    sort,
    type,
    typeId,
  ]);

  const handleTypeSearch = (selectedValue: string) => {


    console.log(selectedValue);


    switch (selectedValue) {
      case translate("ID"):
        setType(0);
        break;
      case translate("Type"):
        setType(1);
        break;
      case translate("Creation date"):
        setType(3);
        break;
      case translate("Deadline date"):
        setType(2);
        break;
      case translate("Deadline for"):
        setType(4);
        break;
      default:
        console.log("Unknown selection");
        break;
    }
    setTypeSearch(selectedValue);
  };

  function getDeadlineTypeName(id_type: number): string {
    switch (id_type) {
      case 1:
        return 'Driving license';
      case 2:
        return 'Vehicle insurance';
      case 3:
        return 'Maintenance';
      case 4:
        return 'Training';
      case 5:
        return 'Extinguisher';
      case 6:
        return 'Technical control';
      case 7:
        return 'Sticker';
      case 8:
        return 'Draining';
      default:
        return 'Unknown type';
    }
  }




  const menuItems = [
    //  translate("ID"),
    translate("Type"),
    translate("Creation date"),
    translate("Deadline date"),
    translate("Deadline for")
  ];




  // Adjust end dates to match FullCalendar's display
  const adjustEndDate = (events: { start: string; end: string }[]) => {
    return events.map((event) => {
      const endDate = new Date(event.end);
      endDate.setDate(endDate.getDate() + 1); // Add one day for display
      return {
        ...event,
        end: endDate.toISOString().split("T")[0],
      };
    });
  };

  const adjustedEvents = adjustEndDate(events);

  // Count events per day (using local dates)
  const countEventsPerDay = (events: { start: string; end: string }[]) => {
    const eventsPerDay: Record<string, number> = {};

    events.forEach((event) => {
      let currentDate = new Date(event.start);
      const endDate = new Date(event.end);
      endDate.setDate(endDate.getDate() - 1); // Adjust for FullCalendar's display

      while (currentDate <= endDate) {
        const dateStr = currentDate.toLocaleDateString("en-CA"); // Local date string
        eventsPerDay[dateStr] = (eventsPerDay[dateStr] || 0) + 1;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return eventsPerDay;
  };

  const eventsPerDay = countEventsPerDay(adjustedEvents);

  // Render day cells with local dates
  const renderDayCellContent = (cellInfo: {
    date: Date;
    dayNumberText: string;
  }) => {
    const dateStr = cellInfo.date.toLocaleDateString("en-CA"); // Local date string
    const eventCount = eventsPerDay[dateStr] || 0;

    return (
      <div>
        <div>{cellInfo.dayNumberText}</div>
        {eventCount > 0 && <div>{eventCount} event(s)</div>}
      </div>
    );
  };
  const handleAdvancedSearch = (event: any) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectChange = (event: any) => {
    const newValue = event.target.value;
    setLimit(parseInt(newValue));
    setCurrentPage(1);
    window.scrollTo(0, 0);
  };
  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected + 1);
    window.scrollTo(0, 0);
  };


  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Toggle "Voir plus"
  const handleViewMore = (date: string) => {
    setExpandedDays((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  const renderEventList = (date: string) => {
    const dayEvents = events.filter((event) => event.date === date);
    const isExpanded = expandedDays[date];
    const displayedEvents = isExpanded ? dayEvents : dayEvents.slice(0, 3);

    return (
      <>
        {displayedEvents.map((event, index) => (
          <div key={index} className="event-item">
            {event.title}
          </div>
        ))}
        {dayEvents.length > 3 && (
          <button
            className="view-more-btn"
            onClick={() => handleViewMore(date)}
          >
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
        )}
      </>
    );
  };


  const columnsMap = {
    nom_type: "Type",
    date_creation: "Creation date",
    date_deadline: "Deadline date",
    id_item: "Deadline for",
  };



  const [isDeadlinesSelected, setIsDeadlinesSelected] = useState(false);


  const handleDeadlinesSelect = (DeadlineID: string) => {
    let updatedSetSelectedDeadlines: string[] = [];

    // If "Select All Deadlines" is enabled, selects or deselects all Deadlines
    if (selectAll) {
      updatedSetSelectedDeadlines = selectedDeadlines.includes(DeadlineID)
        ? selectedDeadlines.filter(id => id !== DeadlineID) //Deselect if already selected
        : list_Deadline.map(deadline => deadline.id_deadline.toString()); // Select all vehicles
    } else {
      //Managing selection/normal selection of an individual Deadline
      if (selectedDeadlines.includes(DeadlineID)) {
        updatedSetSelectedDeadlines = selectedDeadlines.filter(id => id !== DeadlineID);
      } else {
        updatedSetSelectedDeadlines = [...selectedDeadlines, DeadlineID];
      }
    }

    // Updates the list of selected Deadlines
    setSelectedDeadlines(updatedSetSelectedDeadlines);

    // Updates the Deadlines Selected state (activate if at least one is selected)
    setIsDeadlinesSelected(updatedSetSelectedDeadlines.length > 0);

    console.log(updatedSetSelectedDeadlines);
  };


  // In the handleSelectAllDrivers function
  const handleSelectAllDrivers = (checked: boolean) => {
    setSelectAll(checked);
    console.log(checked)
    if (checked) {
      // Select all POIs
      const allDeadlineIDs = list_Deadline.map((deadline) => deadline.id_deadline.toString());
      setSelectedDeadlines(allDeadlineIDs);
      setIsDeadlinesSelected(true);// Mark as selected
    } else {
      // Select all POIs
      setSelectedDeadlines([]);
      setIsDeadlinesSelected(false); // Mark as unselected
    }
  };



  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            {translate("Deadline")} ({total})
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right d-flex justify-content-end">
          <button
            className="btn btn-outline-secondary  mt-2 mr-1"
            onClick={() => setShowDownloadModal(true)}
          >
            <i className="las la-download"></i>
            {translate("Export")}
          </button>
          <Button
            onClick={() => setIsGridView(!isGridView)}
            style={{
              background: "no-repeat",
              color: "#000",
              border: "1px solid #ddd",
            }}
            className={`mt-2 ${isGridView ? "active" : ""}`}
          >
            {isGridView ? (
              <>
                <i className="las la-icons"></i>
                <span>{translate("Calendar View")}</span>
              </>
            ) : (
              <>
                <i className="las la-list"></i>
                <span>{translate("List view")}</span>
              </>
            )}
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
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                className="search-type-toggle"
                aria-label={`${translate("Search by")} ${typeSearch}`}
                title={typeSearch}
              >
                <i className="fas fa-chevron-down search-type-chevron" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {menuItems.map((item, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => handleTypeSearch(item)}
                    eventKey={item}
                    active={typeSearch === item}
                    className={typeSearch === item ? "select-active" : ""}
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <input
              type="text"
              //placeholder={` By ${typeSearch}`}
              placeholder={`by ${translate(typeSearch)}`}
              onChange={handleAdvancedSearch}
              value={search}
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
                value={limit}
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
              {Object.entries(columnsMap).map(([colKey, translation], idx) => (
                <Dropdown.Item
                  key={idx}
                  as="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedColumns[colKey as keyof typeof initialColumns]}
                    onChange={() =>
                      handleColumnChange(colKey as keyof typeof initialColumns)
                    }
                  />
                  <span style={{ marginLeft: "10px" }}>{translate(translation)}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {isGridView ? (
        <div className="row m-1">
          <Table className="dataTable" responsive>
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
                <th>
                  <div className="form-check" style={{paddingLeft: "0px"}}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAllDrivers(e.target.checked)}
                    />
                    <label className="form-check-label"></label>
                  </div>
                </th>

                {selectedColumns.id_deadline && id_user == "1" && (<th className="sorting " onClick={() => handleSortingColumn("id_deadline")} > {translate("ID")} </th>)}
                {selectedColumns.nom_type && (<th className="sorting " onClick={() => handleSortingColumn("nom_type")} > {translate("Type")} </th>)}
                {selectedColumns.date_creation && (<th className="sorting " onClick={() => handleSortingColumn("date_creation")}> {translate("Creation date")}</th>)}
                {selectedColumns.date_deadline && (<th className="sorting " onClick={() => handleSortingColumn("date_deadline")}> {translate("Deadline date")}</th>)}
                {selectedColumns.id_item && (<th className="sorting " onClick={() => handleSortingColumn("id_item")}> {translate("Deadline for")}</th>)}
                <th>{translate("Action")}</th>

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
              ) : Array.isArray(list_Deadline) && list_Deadline.length !== 0 ? (
                list_Deadline.map((Deadline, index) => (
                  <tr key={index}>
                    <td>
                      <div className="form-check form-check-inline"  style={{paddingLeft: "80px"}}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`checkbox-${Deadline.id_deadline}`}
                          checked={selectedDeadlines.includes(Deadline.id_deadline.toString())}
                          onChange={() => handleDeadlinesSelect(Deadline.id_deadline.toString())}
                        />
                        <label htmlFor={`checkbox-${Deadline.id_deadline}`} className="mb-0"></label>
                      </div>
                    </td>
                    {selectedColumns.id_deadline && id_user == "1" && (<td>{Deadline.id_deadline}</td>)}
                    {selectedColumns.nom_type && <td> {translate(Deadline.nom_type)} </td>}
                    {selectedColumns.date_creation && (<td>{toTimestamp(Deadline.date_creation)}</td>)}
                    {selectedColumns.date_deadline && (<td>{toTimestamp(Deadline.date_deadline)}</td>)}
                    {selectedColumns.id_item && (
                      <td
                        id={`vehicle-${Deadline.id_deadline}`}
                        style={{
                          cursor: 'pointer',
                          position: 'relative',
                          color: copiedId === Deadline.id_deadline?.toString() ? '#28a745' : '#007bff',
                        }}
                        title={translate("Click to copy")}
                        onClick={() => {
                          let textToCopy = '';
                          switch (Deadline.id_type) {
                            case 1: // Driving license (Conducteur)
                              textToCopy = `${Deadline.prenom_conducteur} ${Deadline.nom_conducteur}`;
                              break;
                            case 2: // Vehicle insurance
                              textToCopy = Deadline.immatriculation_vehicule;
                              break;
                            case 3: // Maintenance
                              textToCopy = Deadline.immatriculation_vehicule;
                              break;
                            case 4: // Training
                              textToCopy = `${Deadline.training_prenom_conducteur} ${Deadline.training_nom_conducteur}`;
                              break;
                            case 5: // Fire extinguisher
                              textToCopy = Deadline.feu_immatriculation_vehicule.toString();
                              break;
                            case 6: // Technical control
                              textToCopy = Deadline.immatriculation_vehicule;
                              break;
                            case 7: // Sticker
                              textToCopy = Deadline.immatriculation_vehicule;
                              break;
                            case 8: // Draining
                              textToCopy = Deadline.immatriculation_vehicule;
                              break;
                            default:
                              textToCopy = Deadline.item_name || "N/A";
                          }

                          if (textToCopy && Deadline.id_deadline?.toString()) {
                            copyToClipboard(textToCopy, Deadline.id_deadline.toString());
                          }
                        }}
                      >
                        <span
                          style={{
                            color: copiedId === Deadline.id_deadline?.toString() ? '#28a745' : '#007bff',
                          }}
                        >
                          {(() => {
                            switch (Deadline.id_type) {
                              case 1: // Driving license (Conducteur)
                                return `${Deadline.prenom_conducteur} ${Deadline.nom_conducteur}`;
                              case 2: // Vehicle insurance
                                return Deadline.immatriculation_vehicule;
                              case 3: // Maintenance
                                return Deadline.immatriculation_vehicule;
                              case 4: // Training
                                return `${Deadline.training_prenom_conducteur} ${Deadline.training_nom_conducteur}`;
                              case 5: // Fire extinguisher
                                return Deadline.feu_immatriculation_vehicule;
                              case 6: // Technical control
                                return Deadline.immatriculation_vehicule;
                              case 7: // Sticker
                                return Deadline.immatriculation_vehicule;
                              case 8: // Draining
                                return Deadline.immatriculation_vehicule;
                              default:
                                return Deadline.item_name || "N/A";
                            }
                          })()}
                        </span>

                        {copiedId === Deadline.id_deadline?.toString() && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '-20px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: '#28a745',
                              color: '#fff',
                              padding: '2px 5px',
                              borderRadius: '4px',
                              fontSize: '12px',
                            }}
                          >
                            {translate("Copied")}
                          </span>
                        )}
                      </td>
                    )}


                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center list-action">
                        <Link
                          to={``}
                          className="badge bg-primary mr-2"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Détail"
                          onClick={() =>
                            handleShowShowDeadlineModal(Deadline.id_deadline)
                          }
                        >
                          <i
                            className="las la-eye"
                            style={{ fontSize: "1.2em" }}
                          ></i>
                        </Link>


                        <Link
                          to={``}
                          className="badge bg-danger mr-2"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Delete"
                          onClick={() =>
                            handleDeleteDeadlineModal(Deadline.id_deadline)
                          }
                        >
                          <i
                            className="las la-trash"
                            style={{ fontSize: "1.2em" }}
                          ></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr style={{ textAlign: "center" }}>
                  <td colSpan={Object.keys(selectedColumns).length || 10}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="row">
            <div className="col-md-6 d-flex align-items-center">
              <span>
                {translate("Displaying")} {list_Deadline.length} {translate("on")}{" "}
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
                forcePage={currentPage - 1}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <FullCalendar
            ref={calendarRef}
            key={adjustedEvents.length}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
            ]}
            locale={localeMap[lang]}
            contentHeight={600}
            initialView="dayGridMonth"
            events={adjustedEvents}
            eventClick={(info: { event: { id: number } }) =>
              handleCalendarDeadlineModal(info.event.id)
            }

            dayCellContent={renderDayCellContent}
            dayRender={(info: any) => {
              const date = info.dateStr;
              return <div className="day-cell">{renderEventList(date)}</div>;
            }}
            eventContent={(arg: any) => (
              <div title={`Type: ${arg.event.extendedProps.type}\nDate de début: ${arg.event.start}\nDate de fin: ${arg.event.end}`}>
                <b>{arg.timeText}</b>
                <span>{arg.event.title}</span>
              </div>
            )}
            customButtons={{
              backToMonth: {
                text: "Retour",
                click: () => calendarRef.current?.getApi().changeView("dayGridMonth"),
              },
            }}
            headerToolbar={{
              left: "prev,next today backToMonth",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            moreLinkClick="day"
            dayMaxEvents={true}
            dayMaxEventRows={3}
            dayMinEventRows={3}
          />
        </div>
      )}

      {/* <ModalNewDeadline
        show={showNewDeadlineModal}
        onHide={handleCloseNewDeadlineModal}
        onSuccess={refreshData}
      />
      <CalendarDeadlineModal
        mode="create"
        show={showCalendarDeadlineModal}
        onHide={handleCloseCalendarDeadlineModal}
        id_deadline={selectedDeadlineId}
        onSuccess={refreshData}
      />
      <ModalEditDeadline
        show={showEditDeadlineModal}
        onHide={handleCloseEditDeadlineModal}
        id_deadline={selectedDeadlineId}
        onSuccess={refreshData}
      />
    */}
       <ModalDeleteDeadline
        show={showDeleteDeadlineModal}
        onHide={handleCloseDeleteDeadlineModal}
        id_deadline={selectedDeadlineId}
        onSuccess={refreshDeadline}
      />
      <ModalShowDeadline
        show={showShowDeadlineModal}
        onHide={handleCloseShowDeadlineModal}
        id_deadline={selectedDeadlineId}
      />
      <DownloadModal
        show={showDownloadModal}
        onHide={() => setShowDownloadModal(false)}
        onDownloadConfirm={onDownloadConfirm}
      />

    </>
  );
}
