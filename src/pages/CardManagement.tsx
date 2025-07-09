import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import { formatDateToTimestamp } from "../utilities/functions";
import ModalNewCardManagement from "../components/CardManagement/NewCardManagement";
import ModalShowCardManagement from "../components/CardManagement/ShowCardManagement";
import { PropagateLoader } from "react-spinners";
import ModalEditCardManagement from "../components/CardManagement/EditCardManagement";
import ModalDeleteCardManagement from "../components/CardManagement/DeleteCardManagement";

interface FuelCard {
    id_fc: number;
    facture_fc: string;
    immatriculation_vehicule: string;
    carb_fc: string;
    cout_fc: string;
    qte_fc: string;
    date_fc: string;
    carte_fc: string;
    station_fc: string;
    amort_fc: string;
    km_fc: string;
    new_km_fc: string;
}

export function CardManagement() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { translate } = useTranslate();
    const [fuelCards, setFuelCards] = useState<FuelCard[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_fc");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);

    const initialColumns = {
        Vehicle: true,
        Date: true,
        "Fuel Type": true,
        Quantity: true,
        Cost: true,
        "Invoice Number": true,
        "Card Number": true
    };

    const loadSelectedColumns = () => {
        const savedColumns = localStorage.getItem("selectedFuelCardColumns");
        return savedColumns ? JSON.parse(savedColumns) : initialColumns;
    };
    
    const [selectedColumns, setSelectedColumns] = useState(loadSelectedColumns);

    const handleColumnChange = (column: string) => {
        const updatedColumns = {
            ...selectedColumns,
            [column]: !selectedColumns[column],
        };
        setSelectedColumns(updatedColumns);
        localStorage.setItem("selectedFuelCardColumns", JSON.stringify(updatedColumns));
    };

    const handleSortingColumn = (currentColumn: string) => {
        const newSortOrder = column === currentColumn && sort === "ASC" ? "DESC" : "ASC";
        setSortColumn(currentColumn);
        setSort(newSortOrder);
        getFuelCards();
    };

    const [showNewModal, setShowNewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showShowModal, setShowShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedCardId, setSelectedCardId] = useState<number | undefined>(undefined);
    const handleShowNewModal = () => setShowNewModal(true);
    const handleCloseNewModal = () => setShowNewModal(false);

    const handleDeleteModal = (id: number) => {
        setSelectedCardId(id);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleEditModal = (id: number) => {
        setSelectedCardId(id);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

    const handleShowModal = (id: number) => {
        setSelectedCardId(id);
        setShowShowModal(true);
    };
    const handleCloseShowModal = () => setShowShowModal(false);

    const getCountFuelCards = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/fuelcards/count/${id_user}?searchTerm=${search}&searchType=${type}`
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

    const getFuelCards = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/fuelcards/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );
            const data = await response.json();
            setFuelCards(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCountFuelCards();
        getFuelCards();
    }, [currentPage, limit, search, type, column, sort]);

    const handleTypeSearch = (event: any) => {
        const selectedValue = event.target.textContent;
        switch (selectedValue) {
            case translate("ID"):
                setType(0);
                break;
            case translate("Vehicle"):
                setType(1);
                break;
            case translate("Date"):
                setType(2);
                break;
            case translate("Fuel Type"):
                setType(3);
                break;
            case translate("Invoice Number"):
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
        getCountFuelCards();
        getFuelCards();
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
                    <h4>{translate("Fuel Card Management")} ({total})</h4>
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
                                <Dropdown.Item>{translate("Invoice Number")}</Dropdown.Item>
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
                                <th className="sorting" onClick={() => handleSortingColumn("date_fc")}>
                                    {translate("Date")}
                                </th>
                            )}

                            {selectedColumns["Fuel Type"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("carb_fc")}>
                                    {translate("Fuel Type")}
                                </th>
                            )}

                            {selectedColumns.Quantity && (
                                <th className="sorting" onClick={() => handleSortingColumn("qte_fc")}>
                                    {translate("Quantity")}
                                </th>
                            )}

                            {selectedColumns.Cost && (
                                <th className="sorting" onClick={() => handleSortingColumn("cout_fc")}>
                                    {translate("Cost")}
                                </th>
                            )}

                            {selectedColumns["Invoice Number"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("facture_fc")}>
                                    {translate("Invoice Number")}
                                </th>
                            )}

                            {selectedColumns["Card Number"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("carte_fc")}>
                                    {translate("Card Number")}
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
                        ) : Array.isArray(fuelCards) && fuelCards.length !== 0 ? (
                            fuelCards.map((card, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                            />
                                        </div>
                                    </td>
                                   
                                    {selectedColumns.Vehicle && <td>{card.immatriculation_vehicule}</td>}
                                    {selectedColumns.Date && <td>{formatDatetimeLocal(card.date_fc)}</td>}
                                    {selectedColumns["Fuel Type"] && <td>{fuelTypeLabels[card.carb_fc] || card.carb_fc}</td>}
                                    {selectedColumns.Quantity && <td>{card.qte_fc} L</td>}
                                    {selectedColumns.Cost && <td>{card.cout_fc} €</td>}
                                    {selectedColumns["Invoice Number"] && <td>{card.facture_fc || "-"}</td>}
                                    {selectedColumns["Card Number"] && <td>{card.carte_fc || "-"}</td>}
                                    
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center align-items-center list-action">
                                            {/* View Button */}
                                            <Link
                                                to={``}
                                                className="badge bg-primary mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={translate("Details")}
                                                onClick={() => handleShowModal(card.id_fc)}
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
                                                onClick={() => handleEditModal(card.id_fc)}
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
                                                onClick={() => handleDeleteModal(card.id_fc)}
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
            <ModalNewCardManagement 
                show={showNewModal} 
                onHide={handleCloseNewModal} 
                onSuccess={refreshData} 
            />
            <ModalEditCardManagement 
                show={showEditModal} 
                onHide={handleCloseEditModal} 
                recordId={selectedCardId} 
                onSuccess={refreshData} 
            />
            <ModalDeleteCardManagement 
                show={showDeleteModal} 
                onHide={handleCloseDeleteModal} 
                recordId={selectedCardId} 
                onSuccess={refreshData} 
            />
            <ModalShowCardManagement 
                show={showShowModal} 
                onHide={handleCloseShowModal} 
                recordId={selectedCardId} 
            />
        </>
    );
}

export default CardManagement;