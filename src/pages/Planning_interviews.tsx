import { useEffect, useState } from "react";
import { Dropdown, Table} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import { formatDateToTimestamp } from "../utilities/functions";
import { PropagateLoader } from "react-spinners";
import ModalEditPlanninginterviews from "../components/EditPlanning_interviews";


interface Schedule {
    id_planning: number;
    date_entretien: string;
    vehicule: string;
    km: number;
    service: number;
    type_entretien: string,
    interview_date: string,
}


export function InterviewSchedule() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const { translate } = useTranslate();
    const [list_Schedule, setSchedule] = useState<Schedule[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID Schedule");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_planning");
    const [sort, setSort] = useState("ASC");
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const [selectedPlanninginterviewsId, setSelectedPlanninginterviewsId] = useState<number | null>(null);


    const initialColumns = {
        Planningdate: true,
        vehicle: true,
        km: true,
        TypeInterview: true,
        Interviewdate: true
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
        getSchedule();
    };


    const getCountSchedule = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/InterviewSchedule/count/${id_user}?searchTerm=${search}&searchType=${type}`
            );
            const result = await response.json();

            // Assurez-vous que result est bien un nombre
            setTotal(result); // Accède directement au nombre
            setPageCount(Math.ceil(result / limit)); // Calcule le nombre de pages basé sur le nombre total et la limite

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const getSchedule = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/InterviewSchedule/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );

            const data = await response.json();
            console.log('Intervention data:', data);

            setSchedule(data);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getCountSchedule();
        getSchedule();
    }, [currentPage, limit, search, type, column, sort]);


    const [showEditPlanninginterviewsModal, setshowEditPlanninginterviewsModal] = useState(false);
    const handleCloseEditPlanninginterviewsModal = () => setshowEditPlanninginterviewsModal(false);

    const handleEditPlanninginterviewsModal = (id: number) => {
        setSelectedPlanninginterviewsId(id);
        setshowEditPlanninginterviewsModal(true);
    }; 


    const handleTypeSearch = (event: any) => {
        const selectedValue = event.target.textContent;

        switch (selectedValue) {
            case translate("ID Intervention"):
                setType(0);
                break;

            case translate("Vehicule"):
                setType(2);
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

    const handleSelectChange = (event: any) => {
        const newValue = event.target.value;
        setLimit(parseInt(newValue));
        setCurrentPage(1);
    };
    const handlePageClick = (data: any) => {
        setCurrentPage(data.selected + 1);
    };

    const refreshData = () => {
        getCountSchedule();
        getSchedule();
    };


    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Planned interviews")} ({total})</h4>
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
                                <Dropdown.Item>{translate("ID Intervention")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Vehicule")}</Dropdown.Item>
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

            <div className="row m-1">
                <Table className="dataTable" responsive>
                    <thead className="bg-white text-uppercase">
                        <tr className="ligth ligth-data">
                            <th className="text-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                    // checked={selectAll}
                                    // onChange={handleSelectAll}
                                    />
                                </div>
                            </th>

                            {selectedColumns.Planningdate && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("Planningdate")}
                                >
                                    {translate("Planning date")}
                                </th>
                            )}

                            {selectedColumns.vehicle && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("vehicle")}
                                >
                                    {translate("Vehicle")}
                                </th>
                            )}
                            {selectedColumns.km && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("km")}
                                >
                                    {translate("KM")}
                                </th>
                            )}
                            {selectedColumns.InterviewDate && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("InterviewDate")}
                                >
                                    {translate("Interview date")}
                                </th>
                            )}

                            {selectedColumns.TypeInterview && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("TypeInterview")}
                                >
                                    {translate("Type of interview")}
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
                        ) : (
                            list_Schedule.map((Schedule, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                            // checked={selectedViolations.includes(violation.id_violation)}
                                            // onChange={() => handleSelectViolation(violation.id_violation)}
                                            />
                                        </div>
                                    </td>

                                    {selectedColumns.Planningdate && (
                                        <td>
                                            {formatDateToTimestamp(Schedule.date_entretien)}
                                        </td>
                                    )}

                                    {selectedColumns.vehicle && (
                                        <td>
                                            {Schedule.vehicule}
                                        </td>
                                    )}
                                    {selectedColumns.km && (
                                        <td>
                                            {Schedule.km}
                                        </td>
                                    )}
                                    {selectedColumns.InterviewDate && (
                                        <td>
                                            {Schedule.interview_date ? (
                                                Schedule.interview_date
                                            ) : (
                                                <span style={{ color: "orange" }}>En attente</span>
                                            )}
                                        </td>
                                    )}

                                    {selectedColumns.TypeInterview && (
                                        <td>
                                            {Schedule.type_entretien ? (
                                                Schedule.type_entretien
                                            ) : (
                                                <span style={{ color: "orange" }}>En attente</span>
                                            )}
                                        </td>
                                    )}



                                    <td className="text-center">
                                        <div className="d-flex justify-content-center align-items-center list-action">
                                           
                                            <Link
                                                to={``}
                                                className="badge badge-primary mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Edit"
                                                onClick={() =>
                                                    handleEditPlanninginterviewsModal(
                                                        Schedule.id_planning
                                                    )
                                                }
                                            >
                                                <i
                                                    className="fa fa-edit"
                                                    style={{ fontSize: "1.2em" }}
                                                ></i>
                                            </Link>
                                            <Link
                                                to={``}
                                                className="badge badge-warning mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Mettre à jour l'état"
                                            // onClick={() =>
                                            //     //handleUpdateStatus(Schedule.id_planning)
                                            // }
                                            >
                                                <i
                                                    className="fa fa-sync"
                                                    style={{ fontSize: "1.2em" }}
                                                ></i>
                                            </Link>
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
            <ModalEditPlanninginterviews show={showEditPlanninginterviewsModal} onHide={handleCloseEditPlanninginterviewsModal}  id_planning={selectedPlanninginterviewsId} onSuccess={refreshData}/>

        </>
    );
}
