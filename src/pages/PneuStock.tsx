import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import ModalNewPneuStock from "../components/PneuStock/NewPneuStock";
import ModalShowPneuStock from "../components/PneuStock/ShowPneuStock";
import { PropagateLoader } from "react-spinners";
import ModalEditPneuStock from "../components/PneuStock/EditPneuStock";
import ModalDeletePneuStock from "../components/PneuStock/DeletePneuStock";

interface PneuStock {
    id_pneu_stock: number;
    type_pneu: string;
    modele_pneu: string;
    ref_pneu: string;
    num_serie_pneu: string;
    loc_pneu: string;
    date_achat_pneu: string;
    cout_pneu: number;
}

export function PneuStock() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { translate } = useTranslate();
    const [list_pneu, setPneuStock] = useState<PneuStock[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_pneu_stock");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedPneuStockId, setSelectedPneuStockId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);

    const initialColumns = {
        "ID": true,
        "Type": true,
        "Model": true,
        "Reference": true,
        "Serial": true,
        "Location": true,
        "Purchase Date": true,
        "Cost": true
    };

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
        localStorage.setItem("selectedColumns", JSON.stringify(updatedColumns));
    };

    const handleSortingColumn = (currentColumn: string) => {
        const newSortOrder = column === currentColumn && sort === "ASC" ? "DESC" : "ASC";
        setSortColumn(currentColumn);
        setSort(newSortOrder);
        getPneuStock();
    };

    const [showNewPneuStockModal, setShowNewPneuStockModal] = useState(false);
    const [showEditPneuStockModal, setShowEditPneuStockModal] = useState(false);
    const [showShowPneuStockModal, setShowShowPneuStockModal] = useState(false);
    const [showDeletePneuStockModal, setShowDeletePneuStockModal] = useState(false);

    const handleShowNewPneuStockModal = () => setShowNewPneuStockModal(true);
    const handleCloseNewPneuStockModal = () => setShowNewPneuStockModal(false);

    const handleDeletePneuStockModal = (id: number) => {
        setSelectedPneuStockId(id);
        setShowDeletePneuStockModal(true);
    };
    const handleCloseDeletePneuStockModal = () => setShowDeletePneuStockModal(false);

    const handleEditPneuStockModal = (id: number) => {
        setSelectedPneuStockId(id);
        setShowEditPneuStockModal(true);
    };
    const handleCloseEditPneuStockModal = () => setShowEditPneuStockModal(false);

    const handleShowShowPneuStockModal = (id: number) => {
        setSelectedPneuStockId(id);
        setShowShowPneuStockModal(true);
    };
    const handleCloseShowPneuStockModal = () => setShowShowPneuStockModal(false);

    const getCountPneuStock = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/pneu_stock/count/${id_user}?searchTerm=${search}&searchType=${type}`
            );
            const result = await response.json();
    
            if (typeof result === "number") {
                setTotal(result);
                setPageCount(Math.ceil(result / limit));
            } else {
                console.error("Unexpected count response:", result);
                setTotal(0);
            }
        } catch (error) {
            console.error(error);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };
    

    const getPneuStock = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/pneu_stock/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );
            const data = await response.json();
    
            if (Array.isArray(data)) {
                setPneuStock(data);
            } else {
                console.error("Unexpected API response:", data);
                setPneuStock([]); // ou afficher un message d'erreur
            }
        } catch (error) {
            console.error(error);
            setPneuStock([]); // fallback
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        getCountPneuStock();
        getPneuStock();
    }, [currentPage, limit, search, type, column, sort]);

    const handleTypeSearch = (event: any) => {
        const selectedValue = event.target.textContent;
        switch (selectedValue) {
            case translate("ID"):
                setType(0);
                break;
            case translate("Reference"):
                setType(1);
                break;
            case translate("Model"):
                setType(2);
                break;
           
            case translate("Serial"):
                setType(3);
                break;

            case translate("Location"):
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
        getCountPneuStock();
        getPneuStock();
    };
     const typePneuLabels: { [key: string]: string } = {
            utilitaire: "Utility/Van",
            "poids lourd": "Heavy Truck",
            suv: "SUV / 4x4",
            remorque: "Trailer (small luggage)",
            voiture: "Car/Passenger",
            agricole: "Agricultural",
          };
          
          const positionLabels: { [key: string]: string } = {
            front_left: "Front Left",
            front_right: "Front Right",
            rear_left: "Rear Left",
            rear_right: "Rear Right",
            spare: "Spare Tire",
          };

          function formatDatetimeLocal(dateString: string): string {
            if (!dateString) return "";
            const date = new Date(dateString);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        

    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                <h4>{translate("Tire")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShowNewPneuStockModal} className="btn btn-primary mt-2 mr-1">
                        <i className="las la-plus mr-3"></i>
                        {translate("New Request")}
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
                                <Dropdown.Item>{translate("Reference")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Model")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Serial")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Location")}</Dropdown.Item>
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
                            {selectedColumns.ID && (
                                <th className="sorting" onClick={() => handleSortingColumn("id_pneu_stock")}>
                                    {translate("ID")}
                                </th>
                            )}
                            {selectedColumns.Type && (
                                <th className="sorting" onClick={() => handleSortingColumn("type_pneu")}>
                                    {translate("Type")}
                                </th>
                            )}
                            {selectedColumns.Model && (
                                <th className="sorting" onClick={() => handleSortingColumn("modele_pneu")}>
                                    {translate("Model")}
                                </th>
                            )}
                            {selectedColumns.Reference && (
                                <th className="sorting" onClick={() => handleSortingColumn("ref_pneu")}>
                                    {translate("Reference")}
                                </th>
                            )}
                            {selectedColumns.Serial && (
                                <th className="sorting" onClick={() => handleSortingColumn("num_serie_pneu")}>
                                    {translate("Serial")}
                                </th>
                            )}
                            {selectedColumns.Location && (
                                <th className="sorting" onClick={() => handleSortingColumn("loc_pneu")}>
                                    {translate("Location")}
                                </th>
                            )}
                            {selectedColumns["Purchase Date"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("date_achat_pneu")}>
                                    {translate("Purchase Date")}
                                </th>
                            )}
                            {selectedColumns.Cost && (
                                <th className="sorting" onClick={() => handleSortingColumn("cout_pneu")}>
                                    {translate("Cost")}
                                </th>
                            )}
                            <th>{translate("Actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    <PropagateLoader color="#0059b3" size={15} />
                                </td>
                            </tr>
                        ) : Array.isArray(list_pneu) && list_pneu.length !== 0 ? (
                            list_pneu.map((PneuStock, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                            />
                                        </div>
                                    </td>
                                   
                                    
                                    
                                    {selectedColumns.ID && <td>{PneuStock.id_pneu_stock}</td>}
                                    {selectedColumns.Type && <td>{typePneuLabels[PneuStock.type_pneu] || PneuStock.type_pneu}</td>}
                                    {selectedColumns.Model && <td>{PneuStock.modele_pneu}</td>}
                                    {selectedColumns.Reference && <td>{PneuStock.ref_pneu}</td>}
                                    {selectedColumns.Serial && <td>{PneuStock.num_serie_pneu}</td>}
                                    {selectedColumns.Location && <td>{positionLabels[PneuStock.loc_pneu] || PneuStock.loc_pneu}</td>}
                                    {selectedColumns["Purchase Date"] && <td>{formatDatetimeLocal(PneuStock.date_achat_pneu)}</td>}
                                    {selectedColumns.Cost && <td>{PneuStock.cout_pneu} </td>}
                                    <td className="text-center">
                                            <div className="d-flex justify-content-center align-items-center list-action">
                                                {/* View Button */}
                                                <Link
                                                    to={``}
                                                    className="badge bg-primary mr-2"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Détail"
                                                    onClick={() => handleShowShowPneuStockModal(PneuStock.id_pneu_stock)}
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
                                                    onClick={() => handleEditPneuStockModal(PneuStock.id_pneu_stock)}
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
                                                    onClick={() => handleDeletePneuStockModal(PneuStock.id_pneu_stock)}
                                                >
                                                    <i className="las la-trash" style={{ fontSize: "1.2em" }}></i>
                                                </Link>
                                            </div>
                                        </td>
                                </tr>
                            ))
                        ): (
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
          <ModalNewPneuStock show={showNewPneuStockModal} onHide={handleCloseNewPneuStockModal} onSuccess={refreshData} />
          <ModalShowPneuStock show={showShowPneuStockModal} onHide={handleCloseShowPneuStockModal} id_pneu_stock={selectedPneuStockId} />

          <ModalEditPneuStock show={showEditPneuStockModal} onHide={handleCloseEditPneuStockModal} id_pneu_stock={selectedPneuStockId} onSuccess={refreshData} />
        <ModalDeletePneuStock show={showDeletePneuStockModal} onHide={handleCloseDeletePneuStockModal} id_pneu_stock ={selectedPneuStockId} onSuccess={refreshData} />

           
        </>
    );
}

export default PneuStock;
