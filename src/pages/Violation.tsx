
import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import { formatDateToTimestamp } from "../utilities/functions";
import ModalNewViolation from "../components/Violation/NewViolation";
import ModalShowViolation from "../components/Violation/ShowViolation";
import { PropagateLoader } from "react-spinners";
import ModalEditViolation from "../components/Violation/EditViolation";
import ModalDeleteViolation from "../components/Violation/DeleteViolation";

interface Violation {

    id_violation: number;
    id_conducteur: number;
    type_violation: string;
    immatriculation_vehicule: string;
    cost: string;
    description: string;
    date_violation: string;
    conducteur_prenom: string;
    conducteur_nom: string;  
}

export function Violation() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { translate } = useTranslate();
    const [list_violation, setViolation] = useState<Violation[]>([]);
    const [count, setCount] = useState<number>();

    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_violation");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // For confirmation modal
    const [selectedViolationId, setSelectedViolationId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const [error, setError] = useState<string | null>(null);


    const initialColumns = {
        ID: true,
        Driver: true,
        Type: true,
        Vehicle: true,
        Date: true, 
        Description: true,
        Cost: true,
    
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
        getViolation();
    };
    const [showNewViolationModal, setShowNewViolationModal] = useState(false);
    const [showEditViolationModal, setShowEditViolationModal] = useState(false);
    const [showShowViolationModal, setShowShowViolationModal] = useState(false);
    const [showDeleteViolationModal, setShowDeleteViolationModal] = useState(false);
    const handleShowNewViolationModal = () => setShowNewViolationModal(true);
    const handleCloseNewViolationModal = () => setShowNewViolationModal(false);
    const handleDeleteViolationModal = (id: number) => {
        setSelectedViolationId(id);
        setShowDeleteViolationModal(true);
    };
    const handleCloseDeleteViolationModal = () => setShowDeleteViolationModal(false);
    const handleEditViolationModal = (id: number) => {
        setSelectedViolationId(id);
        setShowEditViolationModal(true);
    };
    const handleCloseEditViolationModal = () => setShowEditViolationModal(false);
    const handleShowShowViolationModal = (id: number) => {
        setSelectedViolationId(id);
        setShowShowViolationModal(true);
    };
    const handleCloseShowViolationModal = () => setShowShowViolationModal(false);
    const getCountViolation = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/violation/count/${id_user}?searchTerm=${search}&searchType=${type}`
            );
            const result = await response.json();
    
            // Make sure to extract the count if the API returns an object
            const count = result.count || 0; // Default to 0 if count is undefined
            setTotal(count); // Pass the count value directly
            setPageCount(Math.ceil(count / limit)); // Calculate the number of pages
    
        } catch (error) {
            console.error("Error fetching violation count:", error);
        } finally {
            setLoading(false);
        }
    };
    

    
    const getViolation = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/violation/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Fetched data:", data);
            setViolation(data);
    
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error in getViolation:", error.message);
                setError(error.message || "Failed to fetch violations");
            } else {
                console.error("Unknown error in getViolation:", error);
                setError("An unexpected error occurred while fetching violations");
            }
        } finally {
            setLoading(false);
        }
    };
    
    
    useEffect(() => {
        getViolation();
        getCountViolation();
        
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
            case translate("Date"):
                setType(3);
                break;
            case translate("Cost"):
                setType(4);
                break;
            case translate("Type"):
                setType(6);
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
        getCountViolation();
        getViolation();
    };

    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Violations")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShowNewViolationModal} className="btn btn-primary mt-2 mr-1">
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
                                <Dropdown.Item>{translate("ID")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Driver")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Type")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Vehicle")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Date")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Description")}</Dropdown.Item>
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
                                    onClick={() => handleSortingColumn("id_violation")}
                                >
                                    {translate("ID")}
                                </th>
                            )}
                            {selectedColumns.Driver && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("conducteur_nom")}
                                >
                                    {translate("Driver")}
                                </th>
                            )}
                             {selectedColumns.Cost && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("cost_violation")}
                                >
                                    {translate("Cost")}
                                </th>
                            )}
                            {selectedColumns.Type && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("type_violation")}
                                >
                                    {translate("Type")}
                                </th>
                            )}
                            {selectedColumns.Vehicle && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("immatriculation_vehicule")}
                                >
                                    {translate("Vehicle")}
                                </th>
                            )}
                            {selectedColumns.Date && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("date_violation")}
                                >
                                    {translate("Date")}
                                </th>
                            )}
                            {selectedColumns.Description && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("description")}
                                >
                                    {translate("Description")}
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
                        ) : Array.isArray(list_violation) && list_violation.length !== 0 ? (
                            list_violation.map((Violation, index) => (
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
                                                <td>{Violation.id_violation}</td>
                                            )}
                                          
                                          {selectedColumns.Driver && (
                                         <td>{Violation.conducteur_prenom} {Violation.conducteur_nom}</td>
      
                                            )}
                                            {selectedColumns.Cost && (
                                                <td>{Violation.cost}</td>
                                            )}
                                            {selectedColumns.Type && (
                                                <td>{Violation.type_violation}</td>
                                            )}
                                               {selectedColumns.Vehicle && (
                                                <td>{Violation.immatriculation_vehicule}</td>
                                            )}
                                              {selectedColumns.Date && (
                                                <td>{(Violation.date_violation)}</td>

                                            )}
                                             {selectedColumns.Description && (
                                                <td>{Violation.description}</td>
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
                                                    onClick={() => handleShowShowViolationModal(Violation.id_violation)}
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
                                                    onClick={() => handleEditViolationModal(Violation.id_violation)}
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
                                                    onClick={() => handleDeleteViolationModal(Violation.id_violation)}
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
            </div>

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
            <ModalNewViolation show={showNewViolationModal} onHide={handleCloseNewViolationModal} onSuccess={refreshData} />
            <ModalDeleteViolation show={showDeleteViolationModal} onHide={handleCloseDeleteViolationModal} id_violation ={selectedViolationId} onSuccess={refreshData} />
            <ModalEditViolation show={showEditViolationModal} onHide={handleCloseEditViolationModal} id_violation ={selectedViolationId} onSuccess={refreshData} />



           

        </>
    );
}

        