import { useEffect, useRef, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import ModalNewDeadline from "../components/Deadline/NewDeadline";
import CalendarDeadlineModal from "../components/Deadline/CalendarDeadline";
import ModalShowDeadline from "../components/Deadline/ShowDeadline";
import { PropagateLoader } from "react-spinners";
import ModalEditDeadline from "../components/Deadline/EditDeadline";
import ModalDeleteDeadline from "../components/Deadline/DeleteDeadline";
import { Calendar, momentLocalizer } from "react-big-calendar";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import moment from "moment";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import frLocale from "@fullcalendar/core/locales/fr";
import enLocale from "@fullcalendar/core/locales/en-gb";
import deLocale from "@fullcalendar/core/locales/de";
import arLocale from "@fullcalendar/core/locales/ar";
import interactionPlugin from "@fullcalendar/interaction";

interface DeadlineInterface {
    id_deadline: number;
    conducteur_prenom: string;
    conducteur_nom: string;
    date_start_Deadline: string;
    date_end_Deadline: string;
    type_Deadline: string;
}

export function Deadline() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { lang, translate } = useTranslate();
    const [list_Deadline, setDeadline] = useState<DeadlineInterface[]>([]);
    const id_user = localStorage.getItem("GeopUserID");




    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_deadline");
    const [sort, setSort] = useState("desc");
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
    const initialColumns = {
        ID: true,
        Name: true,
        Type: true,
        "Start Date": true,
        "End Date": true,
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
        getDeadline();
    };

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showNewDeadlineModal, setShowNewDeadlineModal] = useState(false);
    const [showEditDeadlineModal, setShowEditDeadlineModal] = useState(false);
    const [showCalendarDeadlineModal, setShowCalendarDeadlineModal] = useState(false);

    const [showShowDeadlineModal, setShowShowDeadlineModal] = useState(false);
    const [showDeleteDeadlineModal, setShowDeleteDeadlineModal] = useState(false);
    const handleShowNewDeadlineModal = () => setShowNewDeadlineModal(true);
    const handleCloseNewDeadlineModal = () => setShowNewDeadlineModal(false);
    const handleDeleteDeadlineModal = (id: number) => {
        setSelectedDeadlineId(id);
        setShowDeleteDeadlineModal(true);
    };
    const handleCloseDeleteDeadlineModal = () => setShowDeleteDeadlineModal(false);
    const handleEditDeadlineModal = (id: number) => {
        setSelectedDeadlineId(id);
        setShowEditDeadlineModal(true);
    };

    const handleCloseEditDeadlineModal = () => setShowEditDeadlineModal(false);
    const handleCalendarDeadlineModal = (id: number) => {
        setSelectedDeadlineId(id);
        setShowCalendarDeadlineModal(true);
    };
    const handleCloseCalendarDeadlineModal = () => setShowCalendarDeadlineModal(false);

    const [DeadlineDetails, setDeadlineDetails] = useState(null);

    const handleShowShowDeadlineModal = (id: number) => {
        setSelectedDeadlineId(id);
        setShowShowDeadlineModal(true);
    };
    const handleCloseShowDeadlineModal = () => setShowShowDeadlineModal(false);

    const getCountDeadline = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/deadline/count/${id_user}?searchTerm=${search}&searchType=${type}`
            );
            const result = await response.json(); 
            setTotal(result);
            setPageCount(Math.ceil(result / limit)); 

        } catch (error) {
            //console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getDeadline = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/deadline/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );
            const data = await response.json();
            console.log("Fetched data:", data);
            setDeadline(data);

            console.log("Updated Deadline list:", data);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    const getCalendarDeadlines = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/geop/calendar/${id_user}`);
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des Deadlines :", error);
        }
    };

    useEffect(() => {
        getCountDeadline();
        getDeadline();
        getCalendarDeadlines();
    }, [currentPage, limit, search, type, column, sort]);

    const handleTypeSearch = (event: any) => {
        const selectedValue = event.target.textContent;

        switch (selectedValue) {
            case translate("ID"):
                setType(0);
                break;
            case translate("Name"):
                setType(1);
                break;
            case translate("Type"):
                setType(2);
                break;
            case translate("Start Date"):
                setType(3);
                break;
            case translate("End Date"):
                setType(4);
                break;

            default:
                console.log("Unknown selection");
                break;
        }
        setTypeSearch(selectedValue);
    }

    // Adjust end dates to match FullCalendar's display
    const adjustEndDate = (events: { start: string; end: string }[]) => {
        return events.map(event => {
            const endDate = new Date(event.end);
            endDate.setDate(endDate.getDate() + 1); // Add one day for display
            return {
                ...event,
                end: endDate.toISOString().split('T')[0],
            };
        });
    };

    const adjustedEvents = adjustEndDate(events);

    // Count events per day (using local dates)
    const countEventsPerDay = (events: { start: string; end: string }[]) => {
        const eventsPerDay: Record<string, number> = {};

        events.forEach(event => {
            let currentDate = new Date(event.start);
            const endDate = new Date(event.end);
            endDate.setDate(endDate.getDate() - 1); // Adjust for FullCalendar's display

            while (currentDate <= endDate) {
                const dateStr = currentDate.toLocaleDateString('en-CA'); // Local date string
                eventsPerDay[dateStr] = (eventsPerDay[dateStr] || 0) + 1;
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        return eventsPerDay;
    };

    const eventsPerDay = countEventsPerDay(adjustedEvents);

    // Render day cells with local dates
    const renderDayCellContent = (cellInfo: { date: Date; dayNumberText: string }) => {
        const dateStr = cellInfo.date.toLocaleDateString('en-CA'); // Local date string
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
    };
    const handlePageClick = (data: any) => {
        setCurrentPage(data.selected + 1);
    };

    const refreshData = () => {
        getCountDeadline();
        getDeadline();
        getCalendarDeadlines();

    };


    const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({});

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
            <button className="view-more-btn" onClick={() => handleViewMore(date)}>
              {isExpanded ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </>
      );
    };

    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Deadline")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right d-flex justify-content-end">
                    <Button
                        onClick={() => setIsGridView(!isGridView)}
                        style={{ background: "no-repeat", color: "#000", border: "1px solid #ddd" }}
                        className={`mt-2 ${isGridView ? 'active' : ''}`}
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
                            <Dropdown.Toggle variant="link" id="dropdown-basic">
                                <i
                                    className="fas fa-chevron-down"
                                    style={{ fontSize: "20px" }}
                                ></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu onClick={handleTypeSearch}>
                                <Dropdown.Item>{translate("ID")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Name")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Type")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Start Date")}</Dropdown.Item>
                                <Dropdown.Item>{translate("End Date")}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <input
                            type="text"
                            //placeholder={` By ${typeSearch}`}
                            placeholder={`by ${translate(typeSearch)}`}
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
                            {Object.keys(initialColumns).map((col, idx) => (
                                <Dropdown.Item
                                    key={idx}
                                    as="button"
                                    style={{ display: "flex", alignItems: "center" }}
                                >
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedColumns[col as keyof typeof initialColumns]}
                                        onChange={() => handleColumnChange(col as keyof typeof initialColumns)}
                                    />
                                    <span style={{ marginLeft: "10px" }}>{translate(col)}</span>
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
                                <th className="text-center">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"

                                        />
                                    </div>
                                </th>

                                {selectedColumns.ID && (
                                    <th
                                        className="sorting "
                                        onClick={() => handleSortingColumn("id_deadline")}
                                    >
                                        {translate("ID")}
                                    </th>
                                )}

                                {selectedColumns.Name && (
                                    <th
                                        className="sorting "
                                        onClick={() => handleSortingColumn("conducteur_nom")}
                                    >
                                        {translate("Name")}
                                    </th>
                                )}
                                {selectedColumns.Type && (
                                    <th
                                        className="sorting "
                                        onClick={() => handleSortingColumn("type_Deadline")}
                                    >
                                        {translate("Type")}
                                    </th>
                                )}
                                {selectedColumns["Start Date"] && (
                                    <th
                                        className="sorting "
                                        onClick={() => handleSortingColumn("date_start_Deadline")}
                                    >
                                        {translate("Start Date")}
                                    </th>
                                )}
                                {selectedColumns["End Date"] && (
                                    <th
                                        className="sorting "
                                        onClick={() => handleSortingColumn("date_end_Deadline")}
                                    >
                                        {translate("End Date")}
                                    </th>
                                )}


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
                                        <td className="text-center">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"

                                                />
                                            </div>
                                        </td>

                                        {selectedColumns.ID && (
                                            <td>{Deadline.id_deadline}</td>
                                        )}

                                        {selectedColumns.Name && (
                                            <td>{Deadline.conducteur_nom} {Deadline.conducteur_prenom}</td>
                                        )}


                                        {selectedColumns.Type && (
                                            <td>{Deadline.type_Deadline}</td>
                                        )}
                                        {selectedColumns["Start Date"] && (
                                            <td>{(Deadline.date_start_Deadline)}</td>

                                        )}
                                        {selectedColumns["End Date"] && (
                                            <td>{Deadline.date_end_Deadline}</td>
                                        )}

                                        <td className="text-center">
                                            <div className="d-flex justify-content-center align-items-center list-action">
                                                {/* View Button */}
                                                <Link
                                                    to={``}
                                                    className="badge bg-primary mr-2"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Détail"
                                                    onClick={() => handleShowShowDeadlineModal(Deadline.id_deadline)}
                                                >
                                                    <i className="las la-eye" style={{ fontSize: "1.2em" }}></i>
                                                </Link>

                                                {/* Edit Button */}
                                                <Link
                                                    to={``}
                                                    className="badge badge-success mr-2"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Edit"
                                                    onClick={() => handleEditDeadlineModal(Deadline.id_deadline)}
                                                >
                                                    <i className="las la-edit" style={{ fontSize: "1.2em" }}></i>
                                                </Link>

                                                {/* Delete Button */}
                                                <Link
                                                    to={``}
                                                    className="badge bg-danger mr-2"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Delete"
                                                    onClick={() => handleDeleteDeadlineModal(Deadline.id_deadline)}
                                                >
                                                    <i className="las la-trash" style={{ fontSize: "1.2em" }}></i>
                                                </Link>
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

                    <div className="row">
                        <div className="col-md-6 d-flex align-items-center">
                            <span>{translate("Displaying")} {limit} {translate("on")} {total} </span>
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
                            />
                        </div>
                    </div>

                </div>
            ) : (

                <div>
                    <div style={{ marginBottom: "10px" }}>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-view">
                                {translate(viewTranslations[currentView] || currentView)}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => changeView("timeGridDay")}>
                                    {translate("day")}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => changeView("timeGridWeek")}>
                                    {translate("week")}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => changeView("dayGridMonth")}>
                                    {translate("month")}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => changeView("listYear")}>
                                    {translate("year")}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <FullCalendar
                        ref={calendarRef}
                        key={adjustedEvents.length}
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                        locale={lang}
                        contentHeight={600}
                        initialView="dayGridMonth"
                        events={adjustedEvents}
                        eventClick={(info: { event: { id: number } }) => handleCalendarDeadlineModal(info.event.id)}
                        dayCellContent={renderDayCellContent} 
                        dayRender={(info:any) => {
                            const date = info.dateStr;
                            return (
                              <div className="day-cell">
                                {renderEventList(date)}
                              </div>
                            );
                          }} // Custom rendering for day cells
                    />

                </div>
            )}


            <ModalNewDeadline
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
            <ModalDeleteDeadline
                show={showDeleteDeadlineModal}
                onHide={handleCloseDeleteDeadlineModal}
                id_deadline={selectedDeadlineId}
                onSuccess={refreshData}
            />
            <ModalShowDeadline
                show={showShowDeadlineModal}
                onHide={handleCloseShowDeadlineModal}
                id_deadline={selectedDeadlineId}
            />

        </>
    );
}
