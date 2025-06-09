import { useEffect, useState, useCallback, useMemo } from "react";
import { Dropdown, Table, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../hooks/LanguageProvider";
import { PropagateLoader } from "react-spinners";
import ModalNewPiece from "../components/Piece/NewPiece";
import ModalEditPiece from "../components/Piece/EditPiece";

import { Link } from "react-router-dom";
import ModalShowPiece from "../components/Piece/ShowPiece";
import ModalDeletePiece from "../components/Piece/DeletePiece";

interface Piece {
    id_piece: number;
    type_operation_piece: string;
    id_vehicule_piece: string;
    source_piece: string;
    piece_id_piece: string;
    position_piece: string;
    technicien_piece: string;
    num_facture_piece: string;
    date_piece: string;
    duree_piece: string;
    cout_piece: string;
    details_piece: string;
    id_piece_stock: string;
    id_user_piece: string;
}

export function Piece() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { translate } = useTranslate();
    const [list_piece, setPiece] = useState<Piece[]>([]);
    const id_user = localStorage.getItem("GeopUserID") || "";
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_piece");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Configuration des colonnes
    const initialColumns = {
        Operation: true,
        Vehicle: true,
        Source: true,
        Date: true,
        Position: true,
    };

    const loadSelectedColumns = () => {
        const savedColumns = localStorage.getItem("selectedColumnsPiece");
        return savedColumns ? JSON.parse(savedColumns) : initialColumns;
    };
    
    const [selectedColumns, setSelectedColumns] = useState(loadSelectedColumns);
    
    // Calculs après la déclaration de selectedColumns
    const pageCount = useMemo(() => Math.ceil(total / limit), [total, limit]);
    const visibleColumnsCount = useMemo(() => 
        Object.values(selectedColumns).filter(Boolean).length, 
        [selectedColumns]
    );

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
    };

    // États des modales
    const [showNewPieceModal, setShowNewPieceModal] = useState(false);
    const [showEditPieceModal, setShowEditPieceModal] = useState(false);
    const [showShowPieceModal, setShowShowPieceModal] = useState(false);
    const [showDeletePieceModal, setShowDeletePieceModal] = useState(false);

    // Gestion des modales
    const handleShowNewPieceModal = () => setShowNewPieceModal(true);
    const handleCloseNewPieceModal = () => setShowNewPieceModal(false);

    const handleDeletePieceModal = (id: number) => {
        setSelectedPieceId(id);
        setShowDeletePieceModal(true);
    };
    const handleCloseDeletePieceModal = () => setShowDeletePieceModal(false);

    const handleEditPieceModal = (id: number) => {
        setSelectedPieceId(id);
        setShowEditPieceModal(true);
    };
    const handleCloseEditPieceModal = () => setShowEditPieceModal(false);

    const handleShowPieceModal = (id: number) => {
        setSelectedPieceId(id);
        setShowShowPieceModal(true);
    };
    const handleCloseShowPieceModal = () => setShowShowPieceModal(false);

    // Récupération des données
   const getCountPiece = async () => {
    try {
        setLoading(true);
        const response = await fetch(
            `${backendUrl}/api/geop/piece/count/${id_user}?searchTerm=${search}&searchType=${type}`
        );
        const result = await response.json();
        setTotal(result.count);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};

    const getPiece = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/piece/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );
            const data = await response.json();
            setPiece(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCountPiece();
        getPiece();
    }, [currentPage, limit, search, type, column, sort]);

    // Handlers UI
    const handleTypeSearch = (selectedValue: string) => {
        switch (selectedValue) {
            case translate("ID"):
                setType(0);
                break;
            case translate("Operation"):
                setType(1);
                break;
            case translate("Vehicle"):
                setType(2);
                break;
            case translate("Source"):
                setType(3);
                break;
           
            default:
                setType(0);
                break;
        }
        setTypeSearch(selectedValue);
    };

    const handleAdvancedSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(event.target.value));
        setCurrentPage(1);
    };

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected + 1);
    };

    const refreshData = () => {
        getCountPiece();
        getPiece();
    };

    // Formattage des données
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

     function formatDatetimeLocal(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }


    // Libellés spéciaux
    const operationLabels: Record<string, string> = {
        installation: translate("Installation"),
        replacement: translate("Replacement"),
        repair: translate("Repair"),
    };

      const translateOperationType = (type: string) => {
        switch (type) {
            case "add": return translate("Add");
            case "replace": return translate("Replace");
            default: return type;
        }
    };
    const translateSourceType = (source: string) => {
    switch (source) {
        case "internal":
            return translate("Internal");
        case "external":
            return translate("External");
        default:
            return source;
    }
};

    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Parts Replacement")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button 
                        onClick={handleShowNewPieceModal} 
                        className="btn btn-primary mt-2 mr-1"
                    >
                        <i className="las la-plus mr-3"></i>
                        {translate("New")}
                    </Button>
                </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="row">
                <div className="col-md-4" style={{ margin: "10px 0", padding: "10px" }}>
                    <div className="input-group">
                        <Dropdown>
                            <Dropdown.Toggle variant="link" id="dropdown-basic">
                                <i className="fas fa-chevron-down" style={{ fontSize: "20px" }}></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleTypeSearch(translate("ID"))}>
                                    {translate("ID")}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleTypeSearch(translate("Operation"))}>
                                    {translate("Operation")}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleTypeSearch(translate("Vehicle"))}>
                                    {translate("Vehicle")}
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleTypeSearch(translate("Source"))}>
                                    {translate("Source")}
                                </Dropdown.Item>
                               
                            </Dropdown.Menu>
                        </Dropdown>
                        <input
                            type="text"
                            placeholder={`${translate("Search by")} ${translate(typeSearch)}`}
                            onChange={handleAdvancedSearch}
                            className="form-control"
                            value={search}
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
                        <Dropdown.Toggle variant="link" id="dropdown-columns" title={translate("Display Columns")}>
                            <i className="las la-eye"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.keys(initialColumns).map((col) => (
                                <Dropdown.Item key={col} as="button">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedColumns[col as keyof typeof initialColumns]}
                                            onChange={() => handleColumnChange(col)}
                                            id={`check-${col}`}
                                        />
                                        <label 
                                            className="form-check-label" 
                                            htmlFor={`check-${col}`}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            {translate(col)}
                                        </label>
                                    </div>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Tableau des pièces */}
          <div className="row m-1">
    <Table className="dataTable" responsive>
        <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
                <th className="text-center">
                    <div className="form-check form-check-inline">
                        <input type="checkbox" className="form-check-input" />
                    </div>
                </th>

                {selectedColumns.Operation && (
                    <th className="sorting" onClick={() => handleSortingColumn("type_operation_piece")}>
                        {translate("Operation")}
                    </th>
                )}
                {selectedColumns.Vehicle && (
                    <th className="sorting" onClick={() => handleSortingColumn("id_vehicule_piece")}>
                        {translate("Vehicle")}
                    </th>
                )}
                {selectedColumns.Source && (
                    <th className="sorting" onClick={() => handleSortingColumn("source_piece")}>
                        {translate("Source")}
                    </th>
                )}
           
                {selectedColumns.Date && (
                    <th className="sorting" onClick={() => handleSortingColumn("date_piece")}>
                        {translate("Date")}
                    </th>
                )}
                {selectedColumns.Position && (
                    <th className="sorting" onClick={() => handleSortingColumn("position_piece")}>
                        {translate("Position")}
                    </th>
                )}
                <th>{translate("Actions")}</th>
            </tr>
        </thead>

        <tbody className="light-body">
            {loading ? (
                <td 
  className="text-center" 
  colSpan={visibleColumnsCount + 2}
  style={{ width: "100%" }}
>
  <div className="d-flex justify-content-center">
    <PropagateLoader 
      color={"#123abc"} 
      loading={loading} 
      size={20} 
    />
  </div>
</td>
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

                        {selectedColumns.Operation && (
                        <td>{translateOperationType(piece.type_operation_piece)}</td>
                    )}

                        {selectedColumns.Vehicle && <td>{piece.id_vehicule_piece}</td>}
                        {selectedColumns.Source && <td>{translateSourceType(piece.source_piece)}</td>}
                        {selectedColumns.Date && <td>{formatDatetimeLocal(piece.date_piece)}</td>}
                        {selectedColumns.Position && <td>{piece.position_piece}</td>}

                        <td className="text-center">
                            <div className="d-flex justify-content-center align-items-center list-action">
                                <Link
                                    to={""}
                                    className="badge bg-primary mr-2"
                                    title="View"
                                    onClick={() => handleShowPieceModal(piece.id_piece)}
                                >
                                    <i className="las la-eye" style={{ fontSize: "1.2em" }}></i>
                                </Link>
                                <Link
                                    to={""}
                                    className="badge badge-success mr-2"
                                    title="Edit"
                                    onClick={() => handleEditPieceModal(piece.id_piece)}
                                >
                                    <i className="las la-edit" style={{ fontSize: "1.2em" }}></i>
                                </Link>
                                <Link
                                    to={""}
                                    className="badge bg-danger mr-2"
                                    title="Delete"
                                    onClick={() => handleDeletePieceModal(piece.id_piece)}
                                >
                                    <i className="las la-trash" style={{ fontSize: "1.2em" }}></i>
                                </Link>
                            </div>
                        </td>
                    </tr>
                ))
            ) : (
                <tr style={{ textAlign: "center" }}>
                    <td colSpan={visibleColumnsCount + 2}>{translate("No parts found")}</td>
                </tr>
            )}
        </tbody>
    </Table>
</div>


            {/* Pagination */}
            <div className="row">
                <div className="col-md-6 d-flex align-items-center">
                    <span>
                        {translate("Showing")} {Math.min((currentPage - 1) * limit + 1, total)} {translate("to")}{" "}
                        {Math.min(currentPage * limit, total)} {translate("of")} {total} {translate("entries")}
                    </span>
                </div>
                <div className="col-md-6">
                    <ReactPaginate
                        previousLabel={translate("previous")}
                        nextLabel={translate("next")}
                        breakLabel="..."
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName="pagination justify-content-end"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        activeClassName="active"
                        forcePage={currentPage - 1}
                    />
                </div>
            </div>

            {/* Modales */}
            <ModalNewPiece 
                show={showNewPieceModal} 
                onHide={handleCloseNewPieceModal} 
                onSuccess={refreshData} 
            />
            <ModalEditPiece 
            show={showEditPieceModal} 
            onHide={handleCloseEditPieceModal} 
            id_piece={selectedPieceId} 
            onSuccess={refreshData} />
          
           
            <ModalDeletePiece 
                show={showDeletePieceModal} 
                onHide={handleCloseDeletePieceModal} 
                id_piece={selectedPieceId} 
                onSuccess={refreshData} 
            />
         
            
            <ModalShowPiece 
                show={showShowPieceModal} 
                onHide={handleCloseShowPieceModal} 
                id_piece={selectedPieceId} 
            />
           
        </>
    );
}

export default Piece;