import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import { formatDateToTimestamp } from "../utilities/functions";
import ModalNewPneu from "../components/Pneu/NewPneu";
import ModalShowPneu from "../components/Pneu/ShowPneu";
import { PropagateLoader } from "react-spinners";
import ModalEditPneu from "../components/Pneu/EditPneu";
import ModalDeletePneu from "../components/Pneu/DeletePneu";

interface Pneu {
    id_pneu: number;
    num_facture_pneu: string;
    date_achat_pneu: string;
    cout_pneu: string;
    km_pneu: string;
    immatriculation_vehicule: string;
}

export function Pneu() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { translate } = useTranslate();
    const [list_pneu, setPneu] = useState<Pneu[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_pneu");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedPneuId, setSelectedPneuId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);

    const initialColumns = {
        "Inv. No.": true,
        Km: true,
        Vehicle: true,
        "Purchase Date": true,
        Cost: true,
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
        getPneu();
    };

    const [showNewPneuModal, setShowNewPneuModal] = useState(false);
    const [showEditPneuModal, setShowEditPneuModal] = useState(false);
    const [showShowPneuModal, setShowShowPneuModal] = useState(false);
    const [showDeletePneuModal, setShowDeletePneuModal] = useState(false);

    const handleShowNewPneuModal = () => setShowNewPneuModal(true);
    const handleCloseNewPneuModal = () => setShowNewPneuModal(false);

    const handleDeletePneuModal = (id: number) => {
        setSelectedPneuId(id);
        setShowDeletePneuModal(true);
    };
    const handleCloseDeletePneuModal = () => setShowDeletePneuModal(false);

    const handleEditPneuModal = (id: number) => {
        setSelectedPneuId(id);
        setShowEditPneuModal(true);
    };
    const handleCloseEditPneuModal = () => setShowEditPneuModal(false);

    const handleShowShowPneuModal = (id: number) => {
        setSelectedPneuId(id);
        setShowShowPneuModal(true);
    };
    const handleCloseShowPneuModal = () => setShowShowPneuModal(false);

    const getCountPneu = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/pneu/count/${id_user}?searchTerm=${search}&searchType=${type}`
            );
            const result = await response.json();
            setTotal(result);
            setPageCount(Math.ceil(result / limit));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getPneu = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/pneu/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );
            const data = await response.json();
            setPneu(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCountPneu();
        getPneu();
    }, [currentPage, limit, search, type, column, sort]);

    const handleTypeSearch = (event: any) => {
        const selectedValue = event.target.textContent;
        switch (selectedValue) {
            case translate("ID"):
                setType(0);
                break;
            case translate("Inv. No."):
                setType(1);
                break;
            case translate("Km"):
                setType(2);
                break;
           
            case translate("Cost"):
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
        getCountPneu();
        getPneu();
    };

    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Pneus")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShowNewPneuModal} className="btn btn-primary mt-2 mr-1">
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
                                <Dropdown.Item>{translate("Inv. No.")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Km")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Vehicle")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Purchase Date")}</Dropdown.Item>
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
                                <th className="sorting" onClick={() => handleSortingColumn("id_pneu")}>
                                    {translate("ID")}
                                </th>
                            )}
                            {selectedColumns["Inv. No."] && (
                                <th className="sorting" onClick={() => handleSortingColumn("num_facture_pneu")}>
                                    {translate("Inv. No.")}
                                </th>
                            )}
                            {selectedColumns.Vehicle && (
                                <th className="sorting" onClick={() => handleSortingColumn("immatriculation_vehicule")}>
                                    {translate("Vehicle")}
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
                            {selectedColumns.Km && (
                                <th className="sorting" onClick={() => handleSortingColumn("km_pneu")}>
                                    {translate("Km")}
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
                            list_pneu.map((Pneu, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                            />
                                        </div>
                                    </td>
                                    {selectedColumns.ID && 
                                    <td>{Pneu.id_pneu}
                                    </td>}
                                    {selectedColumns["Inv. No."] && <td>{Pneu.num_facture_pneu}</td>}
                                    {selectedColumns.Vehicle && <td>{Pneu.immatriculation_vehicule}</td>}
                                    {selectedColumns["Purchase Date"] && <td>{formatDateToTimestamp(Pneu.date_achat_pneu)}</td>}
                                    {selectedColumns.Cost && <td>{Pneu.cout_pneu}</td>}
                                    {selectedColumns.Km && <td>{Pneu.km_pneu}</td>}
                                    <td className="text-center">
                                            <div className="d-flex justify-content-center align-items-center list-action">
                                                {/* View Button */}
                                                <Link
                                                    to={``}
                                                    className="badge bg-primary mr-2"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Détail"
                                                    onClick={() => handleShowShowPneuModal(Pneu.id_pneu)}
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
                                                    onClick={() => handleEditPneuModal(Pneu.id_pneu)}
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
                                                    onClick={() => handleDeletePneuModal(Pneu.id_pneu)}
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
            <ModalNewPneu show={showNewPneuModal} onHide={handleCloseNewPneuModal} onSuccess={refreshData} />
            <ModalEditPneu show={showEditPneuModal} onHide={handleCloseEditPneuModal} id_pneu={selectedPneuId} onSuccess={refreshData} />
            <ModalDeletePneu show={showDeletePneuModal} onHide={handleCloseDeletePneuModal} id_pneu ={selectedPneuId} onSuccess={refreshData} />

            <ModalShowPneu show={showShowPneuModal} onHide={handleCloseShowPneuModal} id_pneu={selectedPneuId} />

           
        </>
    );
}

export default Pneu;
