import { useEffect, useState } from "react";
import { Dropdown, Table, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import { PropagateLoader } from "react-spinners";
import ModalShowCardManagement from "../components/CardManagement/ShowCardManagement";
import ModalShowCashManagement from "../components/CashManagement/ShowCashManagement";
import ModalShowTankManagement from "../components/TankManagement/ShowTankManagement";

interface FuelRecord {
    id: number;
    source: 'card' | 'cash' | 'tank';
    id_user: number;
    id_vehicule: number;
    date: string;
    fuel_type: string | null;
    quantity: number;
    cost: number | null;
    km: number | null;
    new_km: number | null;
    invoice: string | null;
    station: string | null;
    amortization: number | null;
    driver: string | null;
    tank: number | null;
    immatriculation_vehicule: string;
}

export function FuelManagement() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { translate } = useTranslate();
    const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("Immatriculation");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);

    // Gestion des modals
    const [activeModal, setActiveModal] = useState<{
        type: 'card' | 'cash' | 'tank' | null;
        recordId: number | null;
    }>({ type: null, recordId: null });

    const initialColumns = {
        "Source": true,
        "Immatriculation": true,
        "Type de carburant": true,
        "Date": true,
        "Coût": true,
        "Quantité (L)": true,
        "Station": true
    };

    const loadSelectedColumns = () => {
        const savedColumns = localStorage.getItem("selectedFuelColumns");
        return savedColumns ? JSON.parse(savedColumns) : initialColumns;
    };
    
    const [selectedColumns, setSelectedColumns] = useState(loadSelectedColumns);

    const sourceLabels = {
        card: translate("Carte carburant"),
        cash: translate("Paiement cash"),
        tank: translate("Citerne")
    };

    const modalComponents = {
        card: ModalShowCardManagement,
        cash: ModalShowCashManagement,
        tank: ModalShowTankManagement
    };

    const CurrentModal = activeModal.type ? modalComponents[activeModal.type] : null;

    const handleShowModal = (id: number, source: 'card' | 'cash' | 'tank') => {
        setActiveModal({ type: source, recordId: id });
    };

    const handleCloseModal = () => {
        setActiveModal({ type: null, recordId: null });
    };

    const getCountFuelRecords = async () => {
        try {
            setLoading(true);
            if (!id_user) throw new Error("User ID is missing");
            
            const response = await fetch(
                `${backendUrl}/api/geop/consumptions/count/${id_user}?searchTerm=${search}&searchType=${type}`
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

    const getFuelRecords = async () => {
        try {
            setLoading(true);
            if (!id_user) throw new Error("User ID is missing");
            
            const response = await fetch(
                `${backendUrl}/api/geop/consumptions/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );
            const data = await response.json();
            setFuelRecords(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCountFuelRecords();
        getFuelRecords();
    }, [currentPage, limit, search, type, column, sort]);

    const handleColumnChange = (column: string) => {
        const updatedColumns = {
            ...selectedColumns,
            [column]: !selectedColumns[column],
        };
        setSelectedColumns(updatedColumns);
        localStorage.setItem("selectedFuelColumns", JSON.stringify(updatedColumns));
    };

    const handleSortingColumn = (currentColumn: string) => {
        const newSortOrder = column === currentColumn && sort === "ASC" ? "DESC" : "ASC";
        setSortColumn(currentColumn);
        setSort(newSortOrder);
        getFuelRecords();
    };

    const handleTypeSearch = (event: any) => {
        const selectedValue = event.target.textContent;
        switch (selectedValue) {
            case translate("Immatriculation"): setType(1); break;
            case translate("Date"): setType(2); break;
            case translate("Type de carburant"): setType(3); break;
            case translate("Source"): setType(4); break;
            default: console.log("Unknown selection");
        }
        setTypeSearch(selectedValue);
    };

    const handleAdvancedSearch = (event: any) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    const handleSelectChange = (event: any) => {
        setLimit(parseInt(event.target.value));
        setCurrentPage(1);
    };

    const handlePageClick = (data: any) => {
        setCurrentPage(data.selected + 1);
    };

    const formatDatetimeLocal = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

   
        return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Gestion des carburants")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    {/* Vous pouvez ajouter un bouton "Nouvel enregistrement" ici si nécessaire */}
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
                                <Dropdown.Item>{translate("Immatriculation")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Date")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Type de carburant")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Source")}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <input
                            type="text"
                            placeholder={`${translate("Rechercher par")} ${translate(typeSearch)}`}
                            onChange={handleAdvancedSearch}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-md-8 d-flex justify-content-end align-items-center">
                    <div className="dataTables_length">
                        <label style={{ marginBottom: "0" }}>
                            {translate("Afficher")}
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
                                        checked={selectedColumns[col]}
                                        onChange={() => handleColumnChange(col)}
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
                            
                            {selectedColumns["Source"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("source")}>
                                    {translate("Source")}
                                </th>
                            )}
                            
                            {selectedColumns["Immatriculation"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("immatriculation_vehicule")}>
                                    {translate("Immatriculation")}
                                </th>
                            )}
                            
                            {selectedColumns["Type de carburant"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("fuel_type")}>
                                    {translate("Type carburant")}
                                </th>
                            )}
                            
                            {selectedColumns["Date"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("date")}>
                                    {translate("Date")}
                                </th>
                            )}
                            
                            {selectedColumns["Coût"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("cost")}>
                                    {translate("Coût")}
                                </th>
                            )}
                            
                            {selectedColumns["Quantité (L)"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("quantity")}>
                                    {translate("Quantité (L)")}
                                </th>
                            )}
                            
                            {selectedColumns["Station"] && (
                                <th className="sorting" onClick={() => handleSortingColumn("station")}>
                                    {translate("Station")}
                                </th>
                            )}
                            
                            <th>{translate("Actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="light-body">
                        {loading ? (
                            <tr style={{ textAlign: "center" }}>
                                <td className="text-center" colSpan={Object.keys(selectedColumns).filter(col => selectedColumns[col]).length + 2}>
                                    <PropagateLoader color="#36d7b7" />
                                </td>
                            </tr>
                        ) : fuelRecords.length > 0 ? (
                            fuelRecords.map((record) => (
                                <tr key={record.id}>
                                    <td className="text-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                            />
                                        </div>
                                    </td>
                                    
                                    {selectedColumns["Source"] && <td>{sourceLabels[record.source]}</td>}
                                    {selectedColumns["Immatriculation"] && <td>{record.immatriculation_vehicule}</td>}
                                    {selectedColumns["Type de carburant"] && <td>{record.fuel_type || '-'}</td>}
                                    {selectedColumns["Date"] && <td>{formatDatetimeLocal(record.date)}</td>}
                                    {selectedColumns["Coût"] && <td>{record.cost ? `${record.cost} €` : '-'}</td>}
                                    {selectedColumns["Quantité (L)"] && <td>{record.quantity} L</td>}
                                    {selectedColumns["Station"] && <td>{record.station || '-'}</td>}
                                    
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center align-items-center list-action">
                                            <Link
                                                to={``}
                                                className="badge bg-primary mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title={translate("Voir")}
                                                onClick={() => handleShowModal(record.id, record.source)}
                                            >
                                                <i className="las la-eye" style={{ fontSize: "1.2em" }}></i>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr style={{ textAlign: "center" }}>
                                <td colSpan={Object.keys(selectedColumns).filter(col => selectedColumns[col]).length + 2}>
                                    {translate("Aucune donnée disponible")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <div className="row">
                <div className="col-md-6 d-flex align-items-center">
                    <span>{translate("Affichage")} {((currentPage - 1) * limit) + 1} {translate("à")} {Math.min(currentPage * limit, total)} {translate("sur")} {total}</span>
                </div>
                <div className="col-md-6">
                    <ReactPaginate
                        previousLabel={translate("Précédent")}
                        nextLabel={translate("Suivant")}
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
            {CurrentModal && (
                <CurrentModal
                    show={true}
                    onHide={handleCloseModal}
                    recordId={activeModal.recordId ?? undefined}
                />
            )}
        </>
        );
}

export default FuelManagement;