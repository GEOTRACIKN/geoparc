import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import { formatDateToTimestamp } from "../utilities/functions";
import ModalNewTankManagement from "../components/TankManagement/NewTankManagement";
import ModalShowTankManagement from "../components/TankManagement/ShowTankManagement";
import { PropagateLoader } from "react-spinners";
import ModalEditTankManagement from "../components/TankManagement/EditTankManagement";
import ModalDeleteTankManagement from "../components/TankManagement/DeleteTankManagement";

interface TankRecord {
    id_ft: number;
    immatriculation_vehicule: string;
    carb_ft: string;
    amort_ft: string;
    citerne_ft: string;
    total_ft: string;
    qte_ft: string;
    date_ft: string;
    km_ft: string;
    prix_ft: string;
    new_km_ft: string;
}

export function TankManagement() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { translate } = useTranslate();
    const [tankRecords, setTankRecords] = useState<TankRecord[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("Vehicle");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_ft");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);

    const initialColumns = {
        Vehicle: true,
        Date: true,
        "Fuel Type": true,
        Quantity: true,
        "Price/L": true,
        "Total Cost": true,
        "Tank Capacity": true
    };

    const loadSelectedColumns = () => {
        const savedColumns = localStorage.getItem("selectedTankColumns");
        return savedColumns ? JSON.parse(savedColumns) : initialColumns;
    };
    
    const [selectedColumns, setSelectedColumns] = useState(loadSelectedColumns);

    const handleColumnChange = (column: string) => {
        const updatedColumns = {
            ...selectedColumns,
            [column]: !selectedColumns[column],
        };
        setSelectedColumns(updatedColumns);
        localStorage.setItem("selectedTankColumns", JSON.stringify(updatedColumns));
    };

    const handleSortingColumn = (currentColumn: string) => {
        const newSortOrder = column === currentColumn && sort === "ASC" ? "DESC" : "ASC";
        setSortColumn(currentColumn);
        setSort(newSortOrder);
        getTankRecords();
    };

    const [showNewModal, setShowNewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showShowModal, setShowShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState<number | undefined>(undefined);

    const handleShowNewModal = () => setShowNewModal(true);
    const handleCloseNewModal = () => setShowNewModal(false);

    const handleDeleteModal = (id: number) => {
        setSelectedRecordId(id);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleEditModal = (id: number) => {
        setSelectedRecordId(id);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

    const handleShowModal = (id: number) => {
        setSelectedRecordId(id);
        setShowShowModal(true);
    };
    const handleCloseShowModal = () => setShowShowModal(false);

    const getCountTankRecords = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/tanks/count/${id_user}?searchTerm=${search}&searchType=${type}`
            );
            const result = await response.json();
            setTotal(result.count);
            setPageCount(Math.ceil(result.count / limit));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getTankRecords = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/tanks/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );
            const data = await response.json();
            setTankRecords(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCountTankRecords();
        getTankRecords();
    }, [currentPage, limit, search, type, column, sort]);

    const handleTypeSearch = (event: any) => {
        const selectedValue = event.target.textContent;
        switch (selectedValue) {
            case translate("Vehicle"):
                setType(1);
                break;
            case translate("Date"):
                setType(2);
                break;
            case translate("Fuel Type"):
                setType(3);
                break;
            case translate("Total Cost"):
                setType(4);
                break;
            default:
                console.log("Unknown selection");
                break;
        }
        setTypeSearch(selectedValue);
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
        getCountTankRecords();
        getTankRecords();
    };
    
    function formatDatetimeLocal(dateString: string): string {
        if (!dateString) return "";
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    const fuelTypeLabels: { [key: string]: string } = {
        diesel: translate("Diesel"),
        essence: translate("Gasoline"),
        gpl: translate("LPG"),
        electrique: translate("Electric")
    };

    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Tank Management")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShowNewModal} className="btn btn-primary mt-2 mr-1">
                        <i className="las la-plus mr-3"></i>
                        {translate("New Record")}
                    </Button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-4" style={{ margin: "0px 0px 10px 0px", padding: "10px" }}>
                    <div className="input-group">
                        <Dropdown>
                            <Dropdown.Toggle variant="link" id="dropdown-basic">
                                <i className="fas fa-chevron-down" style={{ fontSize: "20px" }}></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu onClick={handleTypeSearch}>
                                <Dropdown.Item>{translate("ID")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Vehicle")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Date")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Fuel Type")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Total Cost")}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <input
                            type="text"
                            placeholder={`${translate("By")} ${translate(typeSearch)}`}
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
                        <Dropdown.Toggle variant="link" id="dropdown-basic" title="Display Columns">
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
  
                            {selectedColumns.Vehicle && (
                                <th className="sorting" onClick={() => handleSortingColumn("immatriculation_vehicule")}>
                                    {translate("Vehicle")}
                                </th>
                            )}

                            {selectedColumns.Date && (
                                <th className="sorting" onClick={() => handleSortingColumn("date_ft")}>
                                    {translate("Date")}
                                </th>
                            )}

                            {selectedColumns["Fuel Type"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("carb_ft")}>
                                    {translate("Fuel Type")}
                                </th>
                            )}

                            {selectedColumns.Quantity && (
                                <th className="sorting" onClick={() => handleSortingColumn("qte_ft")}>
                                    {translate("Quantity")}
                                </th>
                            )}

                            {selectedColumns["Price/L"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("prix_ft")}>
                                    {translate("Price/L")}
                                </th>
                            )}

                            {selectedColumns["Total Cost"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("total_ft")}>
                                    {translate("Total Cost")}
                                </th>
                            )}

                            {selectedColumns["Tank Capacity"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("citerne_ft")}>
                                    {translate("Tank Capacity")}
                                </th>
                            )}
                            
                            <th>{translate("Actions")}</th>
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
                        ) : Array.isArray(tankRecords) && tankRecords.length !== 0 ? (
                            tankRecords.map((record, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                            />
                                        </div>
                                    </td>
                                   
                                    {selectedColumns.Vehicle && <td>{record.immatriculation_vehicule}</td>}
                                    {selectedColumns.Date && <td>{formatDatetimeLocal(record.date_ft)}</td>}
                                    {selectedColumns["Fuel Type"] && <td>{fuelTypeLabels[record.carb_ft] || record.carb_ft}</td>}
                                    {selectedColumns.Quantity && <td>{record.qte_ft} L</td>}
                                    {selectedColumns["Price/L"] && <td>{record.prix_ft} DZD/L</td>}
                                    {selectedColumns["Total Cost"] && <td>{record.total_ft} DZD</td>}
                                    {selectedColumns["Tank Capacity"] && <td>{record.citerne_ft || "-"} L</td>}
                                    
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center align-items-center list-action">
                                            {/* View Button */}
                                            <Link
                                                to={``}
                                                className="badge bg-primary mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={translate("Details")}
                                                onClick={() => handleShowModal(record.id_ft)}
                                            >
                                                <i className="las la-eye" style={{ fontSize: "1.2em" }}></i>
                                            </Link>

                                            {/* Edit Button */}
                                            <Link
                                                to={``}
                                                className="badge badge-success mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={translate("Edit")}
                                                onClick={() => handleEditModal(record.id_ft)}
                                            >
                                                <i className="las la-edit" style={{ fontSize: "1.2em" }}></i>
                                            </Link>

                                            {/* Delete Button */}
                                            <Link
                                                to={``}
                                                className="badge bg-danger mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={translate("Delete")}
                                                onClick={() => handleDeleteModal(record.id_ft)}
                                            >
                                                <i className="las la-trash" style={{ fontSize: "1.2em" }}></i>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ): (
                            <tr style={{ textAlign: "center" }}>
                                <td colSpan={Object.keys(selectedColumns).filter(col => selectedColumns[col]).length + 2}>
                                    {translate("No data available")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <div className="row">
                <div className="col-md-6 d-flex align-items-center">
                    <span>{translate("Showing")} 1 {translate("to")} {limit} {translate("of")} {total} </span>
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

            {/* Modals */}
            <ModalNewTankManagement 
                show={showNewModal} 
                onHide={handleCloseNewModal} 
                onSuccess={refreshData} 
            />
            <ModalEditTankManagement 
                show={showEditModal} 
                onHide={handleCloseEditModal} 
                recordId={selectedRecordId} 
                onSuccess={refreshData} 
            />
            <ModalDeleteTankManagement 
                show={showDeleteModal} 
                onHide={handleCloseDeleteModal} 
                recordId={selectedRecordId} 
                onSuccess={refreshData} 
            />
            <ModalShowTankManagement 
                show={showShowModal} 
                onHide={handleCloseShowModal} 
                recordId={selectedRecordId} 
            />
        </>
    );
}

export default TankManagement;