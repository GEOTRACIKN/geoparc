import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import ModalNewPiece from "../components/Piece/NewPiece";
import ModalShowPieceStock from "../components/PieceStock/ShowPieceStock";
import { PropagateLoader } from "react-spinners";
import ModalEditPieceStock from "../components/PieceStock/EditPieceStock";
import ModalDeletePieceStock from "../components/PieceStock/DeletePieceStock";

interface Piece {
    id_piece_stock: number;
    type_piece_ps: string;
    reference_ps: string;
    marque_ps: string;
    modele_ps: string;
    quantite_ps: number;
    cout_achat_ps: number;
    date_achat_ps: string;
}

export function Piece() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { translate } = useTranslate();
    const [list_piece, setPieceStock] = useState<Piece[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_piece_stock");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedPieceStockId, setSelectedPieceStockId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);

    const initialColumns = {
        "ID": true,
        "Type": true,
        "Reference": true,
        "Brand": true,
        "Model": true,
        "Quantity": true,
        "Purchase Cost": true,
        "Purchase Date": true
    };

    const loadSelectedColumns = () => {
        const savedColumns = localStorage.getItem("selectedColumnsPiece");
        return savedColumns ? JSON.parse(savedColumns) : initialColumns;
    };
    
    const [selectedColumns, setSelectedColumns] = useState(loadSelectedColumns);

    const handleColumnChange = (column: string) => {
        const updatedColumns = {
            ...selectedColumns,
            [column]: !selectedColumns[column],
        };
        setSelectedColumns(updatedColumns);
        localStorage.setItem("selectedColumnsPiece", JSON.stringify(updatedColumns));
    };

    const handleSortingColumn = (currentColumn: string) => {
        const newSortOrder = column === currentColumn && sort === "ASC" ? "DESC" : "ASC";
        setSortColumn(currentColumn);
        setSort(newSortOrder);
        getPieceStock();
    };

    const [showNewPieceModal, setShowNewPieceModal] = useState(false);
    const [showEditPieceStockModal, setShowEditPieceStockModal] = useState(false);
    const [showShowPieceStockModal, setShowShowPieceStockModal] = useState(false);
    const [showDeletePieceStockModal, setShowDeletePieceStockModal] = useState(false);

    const handleShowNewPieceModal = () => setShowNewPieceModal(true);
    const handleCloseNewPieceModal = () => setShowNewPieceModal(false);

    const handleDeletePieceStockModal = (id: number) => {
        setSelectedPieceStockId(id);
        setShowDeletePieceStockModal(true);
    };
    const handleCloseDeletePieceStockModal = () => setShowDeletePieceStockModal(false);

    const handleEditPieceStockModal = (id: number) => {
        setSelectedPieceStockId(id);
        setShowEditPieceStockModal(true);
    };
    const handleCloseEditPieceStockModal = () => setShowEditPieceStockModal(false);

    const handleShowShowPieceStockModal = (id: number) => {
        setSelectedPieceStockId(id);
        setShowShowPieceStockModal(true);
    };
    const handleCloseShowPieceStockModal = () => setShowShowPieceStockModal(false);

    const getCountPieceStock = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/piece_stock/count/${id_user}?searchTerm=${search}&searchType=${type}`
            );
            const result = await response.json();
            
            if (result && typeof result.count === "number") {
                setTotal(result.count);
                setPageCount(Math.ceil(result.count / limit));
            } else {
                console.error("Unexpected count structure:", result);
                setTotal(0);
            }
        } catch (error) {
            console.error(error);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const getPieceStock = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/piece_stock/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );
            const data = await response.json();
    
            if (Array.isArray(data)) {
                setPieceStock(data);
            } else {
                console.error("Unexpected API response:", data);
                setPieceStock([]);
            }
        } catch (error) {
            console.error(error);
            setPieceStock([]);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        getCountPieceStock();
        getPieceStock();
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
            case translate("Brand"):
                setType(2);
                break;
            case translate("Model"):
                setType(3);
                break;
            case translate("Type"):
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
        getCountPieceStock();
        getPieceStock();
    };

  
const categories: { [key: string]: string } = {
    freinage: translate("Braking"),
    filtration: translate("Filtration"),
    moteur: translate("Engine"),
    suspension_direction: translate("Suspension/Steering"),
    echappement: translate("Exhaust"),
    electricite: translate("Electricity"),
    chauffage_refroidissement: translate("Heating/Cooling"),
    carrosserie: translate("Bodywork"),
    accessoires: translate("Accessories"),
    liquide_lubrifiant: translate("Fluids/Lubricants"),
    autres: translate("OTHERS"),
};

// List of part types
const typesPiece: { [key: string]: string } = {
    origine: translate("Original part"),
    apresmarket: translate("Aftermarket part"),
    reconditionne: translate("Refurbished"),
    occasion: translate("Used"),
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
                    <h4>{translate("Parts")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShowNewPieceModal} className="btn btn-primary mt-2 mr-1">
                        <i className="las la-plus mr-3"></i>
                        {translate("New Part")}
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
                                <Dropdown.Item>{translate("Brand")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Model")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Type")}</Dropdown.Item>
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
                                <th className="sorting" onClick={() => handleSortingColumn("id_piece_stock")}>
                                    {translate("ID")}
                                </th>
                            )}
                            {selectedColumns.Type && (
                                <th className="sorting" onClick={() => handleSortingColumn("type_piece_ps")}>
                                    {translate("Type")}
                                </th>
                            )}
                            {selectedColumns.Reference && (
                                <th className="sorting" onClick={() => handleSortingColumn("reference_ps")}>
                                    {translate("Reference")}
                                </th>
                            )}
                            {selectedColumns.Brand && (
                                <th className="sorting" onClick={() => handleSortingColumn("marque_ps")}>
                                    {translate("Brand")}
                                </th>
                            )}
                            {selectedColumns.Model && (
                                <th className="sorting" onClick={() => handleSortingColumn("modele_ps")}>
                                    {translate("Model")}
                                </th>
                            )}
                            {selectedColumns.Quantity && (
                                <th className="sorting" onClick={() => handleSortingColumn("quantite_ps")}>
                                    {translate("Quantity")}
                                </th>
                            )}
                            {selectedColumns["Purchase Cost"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("cout_achat_ps")}>
                                    {translate("Purchase Cost")}
                                </th>
                            )}
                            {selectedColumns["Purchase Date"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("date_achat_ps")}>
                                    {translate("Purchase Date")}
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
                        ) : Array.isArray(list_piece) && list_piece.length !== 0 ? (
                            list_piece.map((piece, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                            />
                                        </div>
                                    </td>
                                    {selectedColumns.ID && <td>{piece.id_piece_stock}</td>}
                                    {selectedColumns.Type && <td>{typesPiece[piece.type_piece_ps]}</td>}
                                    {selectedColumns.Reference && <td>{piece.reference_ps}</td>}
                                    {selectedColumns.Brand && <td>{piece.marque_ps}</td>}
                                    {selectedColumns.Model && <td>{piece.modele_ps}</td>}
                                    {selectedColumns.Quantity && <td>{piece.quantite_ps}</td>}
                                    {selectedColumns["Purchase Cost"] && <td>{piece.cout_achat_ps}</td>}
                                    {selectedColumns["Purchase Date"] && <td>{formatDatetimeLocal(piece.date_achat_ps)}</td>}
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center align-items-center list-action">
                                            <Link
                                                to={``}
                                                className="badge bg-primary mr-2"
                                                onClick={() => handleShowShowPieceStockModal(piece.id_piece_stock)}
                                            >
                                                <i className="las la-eye" style={{ fontSize: "1.2em" }}></i>
                                            </Link>
                                            <Link
                                                to={``}
                                                className="badge badge-success mr-2"
                                                onClick={() => handleEditPieceStockModal(piece.id_piece_stock)}
                                            >
                                                <i className="las la-edit" style={{ fontSize: "1.2em" }}></i>
                                            </Link>
                                            <Link
                                                to={``}
                                                className="badge bg-danger mr-2"
                                                onClick={() => handleDeletePieceStockModal(piece.id_piece_stock)}
                                            >
                                                <i className="las la-trash" style={{ fontSize: "1.2em" }}></i>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ): (
                            <tr style={{ textAlign: "center" }}>
                                <td colSpan={Object.keys(selectedColumns).length + 2}>
                                    {translate("No data available")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <div className="row">
                <div className="col-md-6 d-flex align-items-center">
                    <span>{translate("Displaying 1 to")} {limit} {translate("of")} {total} </span>
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

           <ModalNewPiece show={showNewPieceModal} onHide={handleCloseNewPieceModal} onSuccess={refreshData} />
            <ModalShowPieceStock show={showShowPieceStockModal} onHide={handleCloseShowPieceStockModal} id_piece_stock={selectedPieceStockId} />
            <ModalEditPieceStock show={showEditPieceStockModal} onHide={handleCloseEditPieceStockModal} id_piece_stock={selectedPieceStockId} onSuccess={refreshData} />
            <ModalDeletePieceStock show={showDeletePieceStockModal} onHide={handleCloseDeletePieceStockModal} id_piece_stock={selectedPieceStockId} onSuccess={refreshData} />
        </>
    );
}

export default Piece;