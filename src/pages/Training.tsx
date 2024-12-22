import { useEffect, useState } from "react";
import { Dropdown, Table, Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import ModalNewTraining from "../components/Training/NewTraining";

import ModalShowTraining from "../components/Training/ShowTraining";
import { PropagateLoader } from "react-spinners";
import ModalEditTraining from "../components/Training/EditTraining";
import ModalDeleteTraining from "../components/Training/DeleteTraining";



interface Training {
    id_training: number;
    nom_training: number;
    date_start_training: string;
    date_end_training: string;
    type_training: string;
}


export function Training() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const { translate } = useTranslate();
    const [list_training, setTraining] = useState<Training[]>([]);
    const id_user = localStorage.getItem("GeopUserID");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [typeSearch, setTypeSearch] = useState("ID");
    const [search, setSearch] = useState("");
    const [column, setSortColumn] = useState("id_training");
    const [sort, setSort] = useState("desc");
    const [total, setTotal] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // For confirmation modal

    
    
    const [selectedTrainingId, setSelectedTrainingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);



    const initialColumns = {
        ID: true,
        Name: true,
        Type: true,
       "Start Date": true, 
       "End Date": true,
       
    
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
        getTraining();
    };
    

    const [showNewTrainingModal, setShowNewTrainingModal] = useState(false);
    const [showEditTrainingModal, setShowEditTrainingModal] = useState(false);
    const [showShowTrainingModal, setShowShowTrainingModal] = useState(false);
    const [showDeleteTrainingModal, setShowDeleteTrainingModal] = useState(false);


    const handleShowNewTrainingModal = () => setShowNewTrainingModal(true);
    const handleCloseNewTrainingModal = () => setShowNewTrainingModal(false);

    
    const handleDeleteTrainingModal = (id: number) => {
        setSelectedTrainingId(id);
        setShowDeleteTrainingModal(true);
    };
    const handleCloseDeleteTrainingModal = () => setShowDeleteTrainingModal(false);


    

    const handleEditTrainingModal = (id: number) => {
        setSelectedTrainingId(id);
        setShowEditTrainingModal(true);
    };
    const handleCloseEditTrainingModal = () => setShowEditTrainingModal(false);

    const handleShowShowTrainingModal = (id: number) => {
        setSelectedTrainingId(id);
        setShowShowTrainingModal(true);
    };
    const handleCloseShowTrainingModal = () => setShowShowTrainingModal(false);

    const getCountTraining = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${backendUrl}/api/geop/training/count/${id_user}?searchTerm=${search}&searchType=${type}`
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


    const getTraining = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/geop/training/${id_user}/${currentPage}/${limit}?searchTerm=${search}&searchType=${type}&sortColumn=${column}&sortOrder=${sort}`
            );

            const data = await response.json();
            console.log("Fetched data:", data);


            setTraining(data);
            console.log("Updated training list:", data);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getCountTraining();
        
        getTraining();
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
            case translate("Start Date"):
                setType(2);
                    break;
            case translate("Type"):
                setType(3);
                break;
            case translate("End Date"):
                setType(4);
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
        getCountTraining();
        getTraining();
    };


    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <h4>{translate("Training")} ({total})</h4>
                </div>
                <div className="col-md-6 col-sm-12 text-right">
                    <Button onClick={handleShowNewTrainingModal} className="btn btn-primary mt-2 mr-1">
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
                                <Dropdown.Item>{translate("Name")}</Dropdown.Item>

                                <Dropdown.Item>{translate("Type")}</Dropdown.Item>
                                <Dropdown.Item>{translate("Start Date")}</Dropdown.Item>
                                <Dropdown.Item>{translate("End Date")}</Dropdown.Item>

                              
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
                                    onClick={() => handleSortingColumn("id_training")}
                                >
                                    {translate("ID")}
                                </th>
                            )}
                           
                       
                            
                             {selectedColumns.Name && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("nom_training")}
                                >
                                    {translate("Name")}
                                </th>
                            )}
                           
                            
                            {selectedColumns.Type && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("type_training")}
                                >
                                    {translate("Type")}
                                </th>
                            )}
                                 {selectedColumns["Start Date"] && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("date_start_training")}
                                >
                                    {translate("Start Date")}
                                </th>
                            )}
                            {selectedColumns["End Date"] && (
                                <th
                                    className="sorting "
                                    onClick={() => handleSortingColumn("date_end_training")}
                                >
                                    {translate("End Date")}
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
                        ) : Array.isArray(list_training) && list_training.length !== 0 ? (
                            list_training.map((Training, index) => (
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
                                                <td>{Training.id_training}</td>
                                            )}
                                          
                                           
                                            
                                              {selectedColumns.Name && (
                                                <td>{Training.nom_training}</td>
                                            )}

                                          
                                            {selectedColumns.Type && (
                                                <td>{Training.type_training}</td>
                                            )}
                                              {selectedColumns["Start Date"] && (
                                                <td>{(Training.date_start_training)}</td>

                                            )}
                                             {selectedColumns["End Date"] && (
                                                <td>{Training.date_end_training}</td>
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
                                                    onClick={() => handleShowShowTrainingModal(Training.id_training)}
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
                                                    onClick={() => handleEditTrainingModal(Training.id_training)}
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
                                                    onClick={() => handleDeleteTrainingModal(Training.id_training)}
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
            <ModalNewTraining show={showNewTrainingModal} onHide={handleCloseNewTrainingModal} onSuccess={refreshData} />
            <ModalEditTraining show={showEditTrainingModal} onHide={handleCloseEditTrainingModal} id_training={selectedTrainingId} onSuccess={refreshData} />
            <ModalDeleteTraining show={showDeleteTrainingModal} onHide={handleCloseDeleteTrainingModal} id_training ={selectedTrainingId} onSuccess={refreshData} />

            <ModalShowTraining show={showShowTrainingModal} onHide={handleCloseShowTrainingModal} id_training={selectedTrainingId} />

            
         
            

           

        </>
    );
}
                  