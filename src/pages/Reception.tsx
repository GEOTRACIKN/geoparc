import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import ModalNewIntervention from "../components/Reception/NewIntervention"
import { formatDateToTimestamp } from "../utilities/functions";
import ModalShowIntervention from "../components/Reception/ShowIntervention";
import { PropagateLoader } from "react-spinners";
import ModalEditIntervention from "../components/Reception/EditIntervention";


interface Intervention {
    id_intervention: number;
    date_intervention: string;
    priority: string;
    statut: string;
    vehicule: string;
    km: number;
    subject: string;
    client: string;
    phone_client: string;
    receptionist_name: string;
    service: number;
}


export function Reception() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const { translate } = useTranslate();
    const [list_intervention, setintervention] = useState<Intervention[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID Intervention");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_intervention");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [selectedInterventionId, setSelectedInterventionId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);




    const initialColumns = {
        ID: true,
        Date: true,
        priority: true,
        statut: true,
        vehicule: true,
        km: true,
        client: true,
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
        getIntervention();
    };

    const [showNewInterventionModal, setShowNewInterventionModal] = useState(false);
    const [showEditInterventionModal, setShowEditInterventionModal] = useState(false);
    const [showShowInterventionModal, setShowShowInterventionModal] = useState(false);

    const handleShowNewInterventionModal = () => setShowNewInterventionModal(true);
    const handleCloseNewInterventionModal = () => setShowNewInterventionModal(false);

    const handleEditInterventionModal = (id: number) => {
        setSelectedInterventionId(id);
        setShowEditInterventionModal(true);
    };
    const handleCloseEditInterventionModal = () => setShowEditInterventionModal(false);

    const handleShowShowInterventionModal = (id: number) => {
        setSelectedInterventionId(id);
        setShowShowInterventionModal(true);
    };
    const handleCloseShowInterventionModal = () => setShowShowInterventionModal(false);

    const getCountIntervention = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/intervention/count/${id_user}?searchTerm=${search}&searchType=${type}`
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


    const getIntervention = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/intervention/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );

            const data = await response.json();


            setintervention(data);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getCountIntervention();
        getIntervention();
    }, [currentPage, limit, search, type, column, sort]);




    const handleTypeSearch = (event: any) => {
        const selectedValue = event.target.textContent;

        switch (selectedValue) {
            case translate("ID Intervention"):
                setType(0);
                break;
            case translate("Client"):
                setType(1);
                break;
            case translate("Vehicule"):
                setType(2);
                break;
            case translate("Priority"):
                setType(3);
                break;
            case translate("Status"):
                setType(4);
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
        getCountIntervention();
        getIntervention();
    };


    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Intervention Requests")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShowNewInterventionModal} className="btn btn-primary mt-2 mr-1">
                        <i className="las la-plus mr-3"></i>
                        {translate("New Request")}
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
                                <Dropdown.Item>{translate("ID Intervention")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Client")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Vehicule")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Priority")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Status")}</Dropdown.Item>
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
                            {selectedColumns.ID && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("ID")}
                                >
                                    {translate("ID")}
                                </th>
                            )}
                            {selectedColumns.Date && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("Date")}
                                >
                                    {translate("Date")}
                                </th>
                            )}


                            {selectedColumns.vehicule && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("vehicule")}
                                >
                                    {translate("Vehicle")}
                                </th>
                            )}
                            {selectedColumns.km && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("km")}
                                >
                                    {translate("km")}
                                </th>
                            )}
                            {selectedColumns.client && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("client")}
                                >
                                    {translate("client")}
                                </th>
                            )}
                            {selectedColumns.priority && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("priority")}
                                >
                                    {translate("Priority")}
                                </th>
                            )}
                            {selectedColumns.statut && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("statut")}
                                >
                                    {translate("Status")}
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
                        ) : Array.isArray(list_intervention) && list_intervention.length !== 0 ? (
                            list_intervention.map((Intervention, index) => (
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
                                    {selectedColumns.ID && (
                                        <td>
                                            {Intervention.id_intervention}
                                        </td>
                                    )}
                                    {selectedColumns.Date && (
                                        <td>
                                            {formatDateToTimestamp(
                                                Intervention.date_intervention
                                            )}
                                        </td>
                                    )}


                                    {selectedColumns.vehicule && (
                                        <td>
                                            {Intervention.vehicule}
                                        </td>
                                    )}
                                    {selectedColumns.km && (
                                        <td>
                                            {Intervention.km}
                                        </td>
                                    )}
                                    {selectedColumns.client && (
                                        <td>
                                            {Intervention.client}
                                        </td>
                                    )}
                                    {selectedColumns.priority && (
                                        <td>
                                            {Intervention.priority}
                                        </td>
                                    )}
                                    { selectedColumns.statut && (
                                    <td
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {Intervention.statut === "Cloturé" ? (
                                            <>
                                                <i className="fas fa-check-circle" style={{ marginRight: "5px", color: "#28a745" }}></i>
                                                Clôturé
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-hourglass-start" style={{ marginRight: "5px", color: "#ffc107" }}></i>
                                                Demande
                                            </>
                                        )}
                                    </td>
                                   ) }
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center align-items-center list-action">
                                            <Link
                                                to={``}
                                                className="badge badge-success mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Détail"
                                                onClick={() =>
                                                    handleShowShowInterventionModal(
                                                        Intervention.id_intervention
                                                    )
                                                }
                                            >
                                                <i
                                                    className="fa fa-eye"
                                                    style={{ fontSize: "1.2em" }}
                                                ></i>
                                            </Link>
                                            <Link
                                                to={``}
                                                className="badge badge-primary mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Edit"
                                                onClick={() =>
                                                    handleEditInterventionModal(
                                                        Intervention.id_intervention
                                                    )
                                                }
                                            >
                                                <i
                                                    className="fa fa-edit"
                                                    style={{ fontSize: "1.2em" }}
                                                ></i>
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
            <ModalNewIntervention show={showNewInterventionModal} onHide={handleCloseNewInterventionModal} onSuccess={refreshData} />
            <ModalEditIntervention show={showEditInterventionModal} onHide={handleCloseEditInterventionModal} id_intervention={selectedInterventionId} onSuccess={refreshData} />
            <ModalShowIntervention show={showShowInterventionModal} onHide={handleCloseShowInterventionModal} id_intervention={selectedInterventionId} />

        </>
    );
}
