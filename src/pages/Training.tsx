import { useEffect, useRef, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import ModalNewTraining from "../components/Training/NewTraining";
import CalendarTrainingModal from "../components/Training/CalendarTraining";
import ModalShowTraining from "../components/Training/ShowTraining";
import { PropagateLoader } from "react-spinners";
import ModalEditTraining from "../components/Training/EditTraining";
import ModalDeleteTraining from "../components/Training/DeleteTraining";
import { DownloadModal } from "../functions";
import { generateExcelFile, generatePDFFile, handleDownloadConfirm, toTimestamp } from "../utilities/functions";

import { Calendar, momentLocalizer } from "react-big-calendar";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import moment from "moment";
import timeGridPlugin from "@fullcalendar/timegrid"; // Pour la vue semaine/jour
import listPlugin from "@fullcalendar/list"; // Pour la vue liste (année)
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";


interface Training {
    id_training: number;
    conducteur_prenom: string;
    conducteur_nom: string;
    date_start_training: string;
    date_end_training: string;
    type_training: string;
}

export function Training() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { translate } = useTranslate();
    const [list_training, setTraining] = useState<Training[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_training");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // For confirmation modal
    const [selectedTrainingId, setSelectedTrainingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const [isGridView, setIsGridView] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [selectedTraining, setSelectedTraining] = useState<number[]>([]);
    const [showDownloadModal, setShowDownloadModal] = useState(false); // État pour le modal de téléchargement
      const [selectAll, setSelectAll] = useState(false);
    
    
    const [currentView, setCurrentView] = useState("dayGridMonth"); // Vue par défauts
    const localizer = momentLocalizer(moment);
    type ModeType = "create" | "edit" | "yourModeValue"; // Add "yourModeValue" to the allowed types
const [mode, setMode] = useState<ModeType>("create");

const trainingOptions = [
    { value: "DT", label: translate("Driving Test")}, 
  ];

  const mapTrainingType = (type: string) => {
    const found = trainingOptions.find(option => option.value === type);
    return found ? found.label : type; // Retourne le label ou la valeur brute si non trouvée
};


const customLocale = {
    code: "custom", // A custom code for your locale
    buttonText: {
      month: translate("Month"),
      week: translate("Week"),
      day: translate("Day"),
      list: translate("Year"),
      today: translate("Today"),
    },
    dayNames: [
      translate("Sunday"),
      translate("Monday"),
      translate("Tuesday"),
      translate("Wednesday"),
      translate("Thursday"),
      translate("Friday"),
      translate("Saturday"),
    ],
    dayNamesShort: [
      translate("Sun"),
      translate("Mon"),
      translate("Tue"),
      translate("Wed"),
      translate("Thu"),
      translate("Fri"),
      translate("Sat"),
    ],
    monthNames: [
      translate("January"),
      translate("February"),
      translate("March"),
      translate("April"),
      translate("May"),
      translate("June"),
      translate("July"),
      translate("August"),
      translate("September"),
      translate("October"),
      translate("November"),
      translate("December"),
    ],

  };

 
  
  
  const getColorByType = (type: string) => {
    const colors: Record<string, string> = {
      "1": "#FF5733", // Rouge vif
      "2": "#1E7D22", // Vert foncé 🍃
      "3": "#3357FF", // Bleu classique
      "4": "#FFC300", // Jaune
      "5": "#8E44AD", // Violet
    };
    return colors[type] || "#808080"; // Gris par défaut
  };



    const calendarRef = useRef<FullCalendar | null>(null);
    // Fonction pour changer la vue
    const changeView = (view: string) => {
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.changeView(view);
          setCurrentView(view); // Met à jour le texte du Dropdown
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
        getTraining();
    };

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showNewTrainingModal, setShowNewTrainingModal] = useState(false);
    const [showEditTrainingModal, setShowEditTrainingModal] = useState(false);
    const [showCalendarTrainingModal, setShowCalendarTrainingModal] = useState(false);

    const [showShowTrainingModal, setShowShowTrainingModal] = useState(false);
    const [showDeleteTrainingModal, setShowDeleteTrainingModal] = useState(false);
    const handleShowNewTrainingModal = () => setShowNewTrainingModal(true);
    const handleCloseNewTrainingModal = () => setShowNewTrainingModal(false);
    const handleDeleteTrainingModal = (id: number) => {
        setSelectedTrainingId(id);
        setShowDeleteTrainingModal(true);
    };
    const handleCloseDeleteTrainingModal = () => setShowDeleteTrainingModal(false);
    const handleEditTrainingModal = (id: number) => {
        setSelectedTrainingId(id);
        setShowEditTrainingModal(true);
    };

    const handleCloseEditTrainingModal = () => setShowEditTrainingModal(false);
    const handleCalendarTrainingModal = (id: number) => {
        setSelectedTrainingId(id);
        setShowCalendarTrainingModal(true);
    };
    const handleCloseCalendarTrainingModal = () => setShowCalendarTrainingModal(false);
    
    const [trainingDetails, setTrainingDetails] = useState(null); // For storing the selected training data

    const handleShowShowTrainingModal = (id: number) => {
        setSelectedTrainingId(id);
        setShowShowTrainingModal(true);
    };
    const handleCloseShowTrainingModal = () => setShowShowTrainingModal(false);
    
    const getCountTraining = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/training/count/${id_user}?searchTerm=${search}&searchType=${type}`
            );
            const result = await response.json();
            // Assurez-vous que result est bien un nombre
            setTotal(result); // Accède directement au nombre
            setPageCount(Math.ceil(result / limit)); // Calcule le nombre de pages basé sur le nombre total et la limite

        } catch (error) {
            //console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getTraining = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/training/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );
            const data = await response.json();
            console.log("Fetched data:", data);
            setTraining(data);
            
            console.log("Updated training list:", data);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    
    const getCalendarTrainings = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/geop/calendar/${id_user}`);
            const data = await response.json();
            console.log("Fetched calendar data:", data); // Vérifie ce que l'API retourne
    
            if (Array.isArray(data)) {
                setEvents(data);
            } else {
                console.error("Invalid data format:", data);
                setEvents([]); 
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des trainings :", error);
            setEvents([]); 
        }
    };
    
    

    useEffect(() => {
        getCountTraining();
        getTraining();
        getCalendarTrainings();
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
    console.log("Events received:", events); // Débogage
    if (!Array.isArray(events)) {
        console.error("Error: events is not an array!", events);
        return []; // Retourner un tableau vide pour éviter l'erreur
    }
  
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
     //**** Partie Excel ****
      const TrainingHeaders = [
        translate("IDTraining"),
        translate("Driver"),
        translate("Type Training"),
        translate("Start Date"),
        translate("End Date"),
      ];
    
    
      const downloadTrainingExcel = () => {
        const selectedData = list_training.filter((training) =>
          selectedTraining.includes(training.id_training)
        ).map((training) => [
          training.id_training,
          `${training.conducteur_nom} ${training.conducteur_prenom}`,
          training.type_training,
          training.date_start_training,
          (training.date_end_training),
        ]);
    
        generateExcelFile("Training", TrainingHeaders, selectedData);
      };
    
    
      const downloadTrainingPDF = () => {
        const selectedData = list_training.filter((training) =>
          selectedTraining.includes(training.id_training)
        ).map((training) => [
          training.id_training,
          `${training.conducteur_nom} ${training.conducteur_prenom}`,
          training.type_training,
          training.date_start_training,
          (training.date_end_training),
        ]);
    
        generatePDFFile("Training", TrainingHeaders, selectedData);
      };
    
    
    
      const onDownloadConfirm = (format: string) => {
        if (selectedTraining.length > 0) {
          handleDownloadConfirm(format, downloadTrainingExcel, downloadTrainingPDF);
        } else {
          toast.warn("Veuillez sélectionner au moins un Training", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      };
    
      const handleSelectTraining = (id: number) => {
        setSelectedTraining((prev: number[]) => {
          if (prev.includes(id)) {
            return prev.filter((trainingId: number) => trainingId !== id);
          } else {
            return [...prev, id];
          }
        });
      };

      
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allWarningIds = list_training.map((Training) => Training.id_training);
      setSelectedTraining(allWarningIds);
    } else {
      setSelectedTraining([]);
    }
  };
    
    
   
    const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>(
        {}
      );
    const handleViewMore = (date: string) => {
        setExpandedDays((prevState) => ({
          ...prevState,
          [date]: !prevState[date],
        }));
      };
    
      const renderEventList = (date: string) => {
        const dayEvents = events.filter((event) => event.date === date);
        const isExpanded = expandedDays[date];
    
        // 👉 Corriger le problème en s'assurant que tous les événements sont bien affichés
        const displayedEvents = isExpanded ? dayEvents : dayEvents.slice(0, 3);
    
        return (
          <>
          {displayedEvents.map((event, index) => (
  <div key={index} className="event-item">
    {mapTrainingType(event.title)}
  </div>
))}
            {/* 👉 Vérifier si TOUS les événements sont bien affichés */}
            {dayEvents.length > displayedEvents.length && (
              <button
                className="view-more-btn"
                onClick={() => handleViewMore(date)}
              >
                {isExpanded ? "Voir moins" : `Voir plus (${dayEvents.length - displayedEvents.length})`}
              </button>
            )}
          </>
        );
    };
    
      
      const refreshData = () => {
        getCountTraining();
        getTraining();
        getCalendarTrainings();


    };

    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Training")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right d-flex justify-content-end">
    <Button 
        onClick={handleShowNewTrainingModal} 
        className="btn btn-primary mt-2 mr-1"
    >
        <i className="las la-plus mr-3"></i>
        {translate("New Request")}
      
    </Button>
    <Button
    className="btn mt-2 me-1"
    style={{ backgroundColor: "#6c757d", color: "white", border: "none" }}
    onClick={() => setShowDownloadModal(true)}
>
    <i className="las la-download"></i>
    {translate("Export")}
</Button>


    <Button 
        onClick={() => setIsGridView(!isGridView)}  
        style={{background: "no-repeat", color: "#000", border: "1px solid #ddd"}}   
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
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                      
                                
                                    />
                                </div>
                            </th>
                        
                            {selectedColumns.ID && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("id_training")}
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
                                    onClick={() => handleSortingColumn("type_training")}
                                >
                                    {translate("Type")}
                                </th>
                            )}
                                {selectedColumns["Start Date"] && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("date_start_training")}
                                >
                                    {translate("Start Date")}
                                </th>
                            )}
                            {selectedColumns["End Date"] && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("date_end_training")}
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
                        ) : Array.isArray(list_training) && list_training.length !== 0 ? (
                            list_training.map((Training, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={selectedTraining.includes(
                                                    Training.id_training
                                                  )}
                                                  onChange={() =>
                                                    handleSelectTraining(Training.id_training)
                                                  }
                                        
                                            />
                                        </div>
                                    </td>
                                    
                                            {selectedColumns.ID && (
                                                <td>{Training.id_training}</td>
                                            )}
                                                            
                                            {selectedColumns.Name && (
                                                <td>{Training.conducteur_nom} {Training.conducteur_prenom}</td>
                                            )}


                                            {selectedColumns.Type && (
                                                <td>{mapTrainingType(Training.type_training)}</td>
                                            )}
                                            {selectedColumns["Start Date"] && (
                                                <td>{(Training.date_start_training)}</td>

                                            )}
                                            {selectedColumns["End Date"] && (
                                                <td>{Training.date_end_training}</td>
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
                                                    onClick={() => handleShowShowTrainingModal(Training.id_training)}
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
                                                    onClick={() => handleEditTrainingModal(Training.id_training)}
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
                                                    onClick={() => handleDeleteTrainingModal(Training.id_training)}
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
                    <span>Affichage 1 à {limit} sur {total} </span>
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
                
      </div>
      <FullCalendar
      ref={calendarRef}
      key={adjustedEvents.length}
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      locale={customLocale} // Use the custom locale object
      contentHeight={600}
      initialView="dayGridMonth"
      events={adjustedEvents}
      eventClick={(info: { event: { id: number } }) =>
        handleCalendarTrainingModal(info.event.id)
      }
      dayCellContent={renderDayCellContent}
      dayRender={(info: any) => {
        const date = info.dateStr;
        return <div className="day-cell">{renderEventList(date)}</div>;
      }}
      eventContent={(arg: any) => (
        <div title={`Type: ${arg.event.extendedProps.type}\nStart Date: ${arg.event.start}\nEnd Date: ${arg.event.end}`}>
            
          <b>{arg.timeText}</b>
          <span>{mapTrainingType(arg.event.title)}</span>
        </div>
      )}
      
      customButtons={{
        backToMonth: {
          text: translate("Back"),
          click: () => calendarRef.current?.getApi().changeView("dayGridMonth"),
        },
      }}
      headerToolbar={{
        left: "prev,next today backToMonth",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listYear",
      }}
      moreLinkClick={(info: any) => {
        calendarRef.current?.getApi().changeView("dayGridDay", info.date);
      }}
            dayMaxEventRows={true}  
      dayMaxEvents={true}  
      
    />

              </div>        
             )}

            
            <ModalNewTraining
  show={showNewTrainingModal} onHide={handleCloseNewTrainingModal} onSuccess={refreshData} // Refresh when a new training is successfully added
  
/>
<CalendarTrainingModal mode="create" show={showCalendarTrainingModal} onHide={handleCloseCalendarTrainingModal} id_training={selectedTrainingId} onSuccess={refreshData} />


            <ModalEditTraining show={showEditTrainingModal} onHide={handleCloseEditTrainingModal} id_training={selectedTrainingId} onSuccess={refreshData} />
            <ModalDeleteTraining show={showDeleteTrainingModal} onHide={handleCloseDeleteTrainingModal} id_training ={selectedTrainingId} onSuccess={refreshData} />
            <ModalShowTraining show={showShowTrainingModal} onHide={handleCloseShowTrainingModal} id_training={selectedTrainingId} />
            <DownloadModal
                    show={showDownloadModal}
                    onHide={() => setShowDownloadModal(false)}
                    onDownloadConfirm={onDownloadConfirm}
                  />

        </>
    );
}
                  