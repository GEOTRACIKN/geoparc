import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import { useListPagePreferences } from "../hooks/useListPagePreferences";
import { useGpVisibleColumns } from "../hooks/useGpVisibleColumns";
import ModalNewFire from "../components/Fire/NewFire";

import ModalShowFire from "../components/Fire/ShowFire";
import { PropagateLoader } from "react-spinners";
import ModalEditFire from "../components/Fire/EditFire";
import ModalDeleteFire from "../components/Fire/DeleteFire";


const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface Fire {
    id_fire: number;
    ref_fire: string;
    volume_fire: number;
    product_fire: number;
    purch_date_fire: string;
    exp_date_fire: string;
    cost_fire: string;
    type_fire: string;
    immatriculation_vehicule: string;
      
}


export function Fire() {

    const { translate } = useTranslate();
    const [list_fire, setFire] = useState<Fire[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_fire");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // For confirmation modal

    
    
    const [selectedFireId, setSelectedFireId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const { ready: listPreferencesReady } = useListPagePreferences({
        pageKey: "fire-extinguishers",
        pageSize: limit, setPageSize: setLimit,
        searchType: type, setSearchType: setType,
        searchTypeLabel: typeSearch, setSearchTypeLabel: setTypeSearch,
        searchText: search, setSearchText: setSearch,
        sortColumn: column, setSortColumn,
        sortDirection: sort, setSortDirection: setSort,
    });



    const initialColumns = {
        ID: true,
        Reference: true,
        Volume: true,
        Type: true,
        Vehicle: true,
       "Purchase Date": true, 
       "Expiration Date": true,
        Cost: true,
    
    };

    const trainingOptions = [
        { value: "A", label: translate("Class A fires: dry materials (wood, paper)") }, 
        { value: "B", label: translate("Class B fires: flammable liquids") },
        { value: "C", label: translate("Class C fires: flammable gases") },
        { value: "D", label: translate("Class D fires: combustible metals") },
        { value: "E", label: translate("Class E fires: electrical equipment") },
        { value: "F", label: translate("Class F fires: oils and fats") },
    ];
    
    const mapFireType = (type: string) => {
        const found = trainingOptions.find(option => option.value === type);
        return found ? found.label : type; // Retourne le label ou la valeur brute si non trouvée
    };
    
    

    // Load selected columns from localStorage or use initial state
    const loadSelectedColumns = () => {
        const savedColumns = localStorage.getItem("selectedColumns");
        return savedColumns ? JSON.parse(savedColumns) : initialColumns;
    };

    const [selectedColumns, setSelectedColumns] = useState(loadSelectedColumns);
    useGpVisibleColumns("fire-extinguishers", selectedColumns, setSelectedColumns, listPreferencesReady);

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
        getFire();
    };
    

    const [showNewFireModal, setShowNewFireModal] = useState(false);
    const [showEditFireModal, setShowEditFireModal] = useState(false);
    const [showShowFireModal, setShowShowFireModal] = useState(false);
    const [showDeleteFireModal, setShowDeleteFireModal] = useState(false);


    const handleShowNewFireModal = () => setShowNewFireModal(true);
    const handleCloseNewFireModal = () => setShowNewFireModal(false);

    
    const handleDeleteFireModal = (id: number) => {
        setSelectedFireId(id);
        setShowDeleteFireModal(true);
    };
    const handleCloseDeleteFireModal = () => setShowDeleteFireModal(false);


    

    const handleEditFireModal = (id: number) => {
        setSelectedFireId(id);
        setShowEditFireModal(true);
    };
    const handleCloseEditFireModal = () => setShowEditFireModal(false);

    const handleShowShowFireModal = (id: number) => {
        setSelectedFireId(id);
        setShowShowFireModal(true);
    };
    const handleCloseShowFireModal = () => setShowShowFireModal(false);

    const getCountFire = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/fire/count/${id_user}?searchTerm=${search}&searchType=${type}`
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


    const getFire = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/fire/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );

            const data = await response.json();
            console.log("Fetched data:", data);


            setFire(data);
            console.log("Updated fire list:", data);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!listPreferencesReady) return;
        getCountFire();
        
        getFire();
    }, [currentPage, limit, search, type, column, sort, listPreferencesReady]);
   
    



    const handleTypeSearch = (event: any) => {
        const selectedValue = event.target.textContent;

        switch (selectedValue) {
            case translate("ID"):
                setType(0);
                break;
            case translate("Volume"):
                setType(1);
                    break;
       
            case translate("Vehicle"):
                setType(3);
                break;
            case translate("Expiration Date"):
                setType(4);
                break;
            case translate("Cost"):
                setType(5);
                break;
            case translate("Type"):
                setType(6);
                break;
          
            case translate("Reference"):
                setType(8);
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
        getCountFire();
        getFire();
    };


    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Fire extinguisher management")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShowNewFireModal} className="btn btn-primary mt-2 mr-1">
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
                            <Dropdown.Toggle variant="link" id="dropdown-basic" className="search-type-toggle">
                                <i
                                    className="fas fa-chevron-down"
                                    style={{ fontSize: "20px" }}
                                ></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu onClick={handleTypeSearch}>
                                <Dropdown.Item>{translate("ID")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Reference")}</Dropdown.Item>

                                <Dropdown.Item>{translate("Volume")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Type")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Vehicle")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Purchase Date")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Expiration Date")}</Dropdown.Item>  
                            </Dropdown.Menu>
                        </Dropdown>
                        <input
                            type="text"
                            //placeholder={` By ${typeSearch}`}
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
                                    onClick={() => handleSortingColumn("id_fire")}
                                >
                                    {translate("ID")}
                                </th>
                            )}
                            {selectedColumns.Type && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("type_fire")}
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
                             {selectedColumns["Purchase Date"] && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("purch_date_fire")}
                                >
                                    {translate("Purchase Date")}
                                </th>
                            )}
                            {selectedColumns["Expiration Date"] && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("exp_date_fire")}
                                >
                                    {translate("Expiration Date")}
                                </th>
                            )}
                             {selectedColumns.Reference && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("ref_fire")}
                                >
                                    {translate("Reference")}
                                </th>
                            )}
                            
                             {selectedColumns.Volume && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("volume_fire")}
                                >
                                    {translate("Volume")}
                                </th>
                            )}
                            
                             {selectedColumns.Cost && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("cost_fire")}
                                >
                                    {translate("Cost")}
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
                        ) : Array.isArray(list_fire) && list_fire.length !== 0 ? (
                            list_fire.map((Fire, index) => (
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
                                                <td>{Fire.id_fire}</td>
                                            )}
                                              {selectedColumns.Type && (
                                                <td>{mapFireType(Fire.type_fire)}</td>
                                            )}
                                               {selectedColumns.Vehicle && (
                                                <td>{Fire.immatriculation_vehicule}</td>
                                            )}
                                             
                                             {selectedColumns["Purchase Date"] && (
                                                <td>{(Fire.purch_date_fire)}</td>

                                            )}
                                             {selectedColumns["Expiration Date"] && (
                                                <td>{Fire.exp_date_fire}</td>
                                            )}
                                             {selectedColumns.Reference && (
                                                <td>{Fire.ref_fire}</td>
                                            )}
                                         
                                              {selectedColumns.Volume && (
                                                <td>{Fire.volume_fire}</td>
                                            )}

                                         
                                            {selectedColumns.Cost && (
                                                <td>{Fire.cost_fire}</td>
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
                                                    onClick={() => handleShowShowFireModal(Fire.id_fire)}
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
                                                    onClick={() => handleEditFireModal(Fire.id_fire)}
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
                                                    onClick={() => handleDeleteFireModal(Fire.id_fire)}
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
            <ModalNewFire show={showNewFireModal} onHide={handleCloseNewFireModal} onSuccess={refreshData} />
            <ModalEditFire show={showEditFireModal} onHide={handleCloseEditFireModal} id_fire={selectedFireId} onSuccess={refreshData} />
            <ModalDeleteFire show={showDeleteFireModal} onHide={handleCloseDeleteFireModal} id_fire ={selectedFireId} onSuccess={refreshData} />

            <ModalShowFire show={showShowFireModal} onHide={handleCloseShowFireModal} id_fire={selectedFireId} />

            
         
            

           

        </>
    );
}
