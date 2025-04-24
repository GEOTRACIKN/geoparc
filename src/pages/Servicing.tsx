import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import { formatDateToTimestamp } from "../utilities/functions";
import ModalShowServicing from "../components/Servicing/ShowServicing";
import { PropagateLoader } from "react-spinners";
import ModalEditServicing from "../components/Servicing/EditServicing";
import { Bounce, toast } from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const id_user = localStorage.getItem("GeopUserID");


interface Servicing {
    id_servicing: number;
    invoice_no_servicing: number;
    type_servicing: number;
    immatriculation_vehicule: string;
    date_servicing: string;
    place_servicing: string;
    cost_servicing: number;
    depreciation_servicing: number;
    km_servicing: number;
    next_oil_change_servicing: number;
    
}



export function Servicing() {

    const { translate } = useTranslate();
    const [list_servicing, setServicing] = useState<Servicing[]>([]);
        // Ajouter temporairement au début de votre composant
useEffect(() => {
    localStorage.removeItem("selectedColumns"); // À retirer après utilisation
}, []);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID Servicing");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_servicing");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // For confirmation modal

    
    

    const [selectedServicingId, setSelectedServicingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);



   ///voir avec Hichem + syntaxe
    const initialColumns = {
        ID: true,
        Date: true,
        Vehicle: true,
        KM: true,
        InvoiceNo: false,
        Service: false,
        Cost: false,
        Place: false,
        //Depreciation: true
    };
    
    const serviceMapping: { [key: number]: string } = {
        1: translate("Washing"),
        2: translate("Oil Change"),
        3: translate("Change filters (oil/air)"),
        4: translate("Drain + air filter"),
        5: translate("Oil change + oil filter"),
        6: translate("Oil change + Filter change (oil/air)"),
        7: translate("Wheel alignment"),
        8: translate("Tire rotation"),
        9: translate("Engine tuning"),
        10: translate("Brake adjustment"),
        11: translate("Electric adjustment"),
        12: translate("Control"),
        13: translate("Others"),
    };

    // Load selected columns from localStorage or use initial state
    /*const loadSelectedColumns = () => {
        const savedColumns = localStorage.getItem("selectedColumns");
        return savedColumns ? JSON.parse(savedColumns) : initialColumns;
    };*/

    const loadSelectedColumns = () => {
        const savedColumns = localStorage.getItem("selectedColumns");
        
        if (savedColumns) {
            const parsedColumns = JSON.parse(savedColumns);
            
            // Vérifier la structure des colonnes
            const isValid = [
                parsedColumns.ID !== undefined,
                parsedColumns.Vehicle !== undefined,
                parsedColumns.KM !== undefined
            ].every(Boolean);
    
            if (!isValid) {
                localStorage.removeItem("selectedColumns");
                return initialColumns;
            }
            
            return parsedColumns;
        }
        
        return initialColumns;
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
        getServicing();
    };
    

    const [showEditServicingModal, setShowEditServicingModal] = useState(false);
    const [showShowServicingModal, setShowShowServicingModal] = useState(false);



    const handleEditServicingModal = (id: number) => {
        setSelectedServicingId(id);
        setShowEditServicingModal(true);
    };
    const handleCloseEditServicingModal = () => setShowEditServicingModal(false);

    const handleShowShowServicingModal = (id: number) => {
        setSelectedServicingId(id);
        setShowShowServicingModal(true);
    };
    const handleCloseShowServicingModal = () => setShowShowServicingModal(false);


    const handleShowConfirmModal = (id: number) => {
        setSelectedServicingId(id); // Set the selected interview ID
        setShowConfirmModal(true); // Show the modal
    };

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false); // Close the modal without action
    };


    const getCountServicing = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/servicing/count/${id_user}?searchTerm=${search}&searchType=${type}`
            );
            const result = await response.json();

            // Assurez-vous que result est bien un nombre
            setTotal(result); // Accède directement au nombre
            setPageCount(Math.ceil(result / limit)); // Calcule le nombre de pages basé sur le nombre total et la limite

        } catch (error) {
            //console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const getServicing = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/servicing/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );

            const data = await response.json();
            console.log("Fetched data:", data);


            setServicing(data);
            console.log("Updated servicing list:", data);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getCountServicing();
        
        getServicing();
    }, [currentPage, limit, search, type, column, sort]);
   
    



    const handleTypeSearch = (event: any) => {
        const selectedValue = event.target.textContent;

        switch (selectedValue) {
            case translate("ID Servicing"):
                setType(0);
                break;
            case translate("Date"):
                setType(1);
                break;
            case translate("Vehicle"):
                setType(2);
                break;
            case translate("Place"):
                setType(3);
                break;
            case translate("Cost"):
                setType(4);
                break;
            case translate("Place"):
                setType(5);
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
        getCountServicing();
        getServicing();
    };

     const handleUpdateState = async () => {
            if (selectedServicingId) {
                try {
                    // Effectuer la mise à jour de l'état de l'entretien via l'API
                    const response = await fetch(`${backendUrl}/api/geop/Servicing/updatestate/${selectedServicingId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            statut: "Cloturé", // Le statut que vous souhaitez mettre à jour
                        }),
                    });
    
                    // Vérifier si la requête a réussi
                    if (response.ok) {
                        // Afficher une notification de succès
                        toast.success("Statut de l'entretien mis à jour avec succès!", {
                            position: "bottom-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
    
                        });
    
                        refreshData(); // Rafraîchir les données après la mise à jour
                    } else {
                        // Afficher une notification d'erreur si la requête a échoué
                        toast.error("Erreur lors de la mise à jour du statut de l'entretien.", {
                            position: "bottom-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
    
                        });
                    }
                } catch (error) {
                    console.error("Erreur lors de la clôture de l'entretien:", error);
    
                    // Afficher une notification d'erreur en cas d'exception
                    toast.error("Une erreur s'est produite. Veuillez réessayer.", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
    
                    });
                } finally {
                    setShowConfirmModal(false); // Fermer la modal après l'opération
                }
            }
        };
    


    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Servicing")} ({total})</h4>
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
                                <Dropdown.Item>{translate("ID Servicing")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Date")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Vehicle")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Place")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Cost")}</Dropdown.Item>

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
                                    // checked={selectAll}
                                    // onChange={handleSelectAll}
                                    />
                                </div>
                            </th>
                         
                            {selectedColumns.ID && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("id_servicing")}
                                >
                                    {translate("ID")}
                                </th>
                            )}
                           
                            {selectedColumns.Date && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("date_servicing")}
                                >
                                    {translate("Date")}
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
                             {selectedColumns.KM && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("km_servicing")}
                                >
                                    {translate("KM")}
                                </th>
                            )}
                             {selectedColumns.InvoiceNo && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("invoice_no_servicing")}
                                >
                                    {translate("Invoice No")}
                                </th>
                            )}
                            
                            {selectedColumns.Service && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("type_servicing")}
                                >
                                    {translate("Service")}
                                </th>
                            )}
                            
                            
                            {selectedColumns.Cost && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("cost_servicing")}
                                >
                                    {translate("Cost")}
                                </th>
                            )}
                            {selectedColumns.Place && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("place_servicing")}
                                >
                                    {translate("Place")}
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
                        ) : Array.isArray(list_servicing) && list_servicing.length !== 0 ? (
                            list_servicing.map((Servicing, index) => (
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
                                                <td>{Servicing.id_servicing}</td>
                                            )}
                                          
                                            {selectedColumns.Date && (
                                                <td>{formatDateToTimestamp(Servicing.date_servicing)}</td>

                                            )}
                                             {selectedColumns.Vehicle && (
                                                <td>{Servicing.immatriculation_vehicule}</td>
                                            )}
                                             {selectedColumns.KM && (
                                                <td>{Servicing.km_servicing}</td>
                                            )}
                                              {selectedColumns.InvoiceNo && (
                                                <td>{Servicing.invoice_no_servicing}</td>
                                            )}
                                            {selectedColumns.Service && (
                                                <td>
                                                    {serviceMapping[Servicing.type_servicing]}
                                                </td>
                                            )}
                                           
                                            {selectedColumns.Cost && (
                                                <td>{Servicing.cost_servicing}</td>
                                            )}
                                            {selectedColumns.Place && (
                                                <td>{Servicing.place_servicing}</td>
                                            )}
                                          
                                            
                                           
                                    

                                    <td className="text-center">
                                        <div className="d-flex justify-content-center align-items-center list-action">
                                            <Link
                                                to={``}
                                                className="badge badge-success mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Détail"
                                                onClick={() =>
                                                    handleShowShowServicingModal(
                                                        Servicing.id_servicing
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
                                                    handleEditServicingModal(
                                                        Servicing.id_servicing
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
                                                onClick={() => handleShowConfirmModal(Servicing.id_servicing)}

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
            <ModalEditServicing show={showEditServicingModal} onHide={handleCloseEditServicingModal} id_servicing={selectedServicingId} onSuccess={refreshData} />
            <ModalShowServicing show={showShowServicingModal} onHide={handleCloseShowServicingModal} id_servicing={selectedServicingId} />
            <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} responsive>
                <Modal.Header closeButton>
                    <Modal.Title>{translate("Confirmation")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {translate("Are you sure you want to close this interview?")}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirmModal}>
                        {translate("No")}
                    </Button>
                    <Button variant="primary" onClick={handleUpdateState}>
                        {translate("Yes")}
                    </Button>
                    </Modal.Footer>
                    </Modal>

        </>
    );
}
                  