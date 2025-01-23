import { useTranslate } from "../hooks/LanguageProvider";
import { useState, useEffect, useLayoutEffect } from "react";
import {  Table,  Modal,   Form,  Col,  Row,  Dropdown,} from "react-bootstrap";
import {  FaPlus,  FaRedo,  FaCar,  FaShieldAlt,  FaStickyNote,  FaTachometerAlt,  FaWrench,} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { Link, NavLink } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { ButtonCustomHover } from "../components/ButtonHover";
import { useNavigate } from 'react-router-dom';



const backendUrl = process.env.REACT_APP_BACKEND_URL+'/api/geop';
const options = [10, 20, 40, 60, 80, 100, 200, 500]; 
interface VehiculeListInterface {
  id_vehicule: number,
  vehicule_type: string,
  modele_vehicule: string,
  immatriculation_vehicule: string,
  couleur_vehicule: string,
  etat_vehicule: string,
  id_conducteur_vehicule?: number,
  driver_first_name?: string,
  driver_last_name?: string
  affectation?: string,
}

// let currentPage = 1;

export function Vehicles() {
  const searchOptions = ['vehicule_type', 'immatriculation_vehicule', 'modele_vehicule',"etat_vehicule"];
  const { translate } = useTranslate();
   const userID = localStorage.getItem("GeopUserID");
  //const userID = 1;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [vehiculeListList, setVehiculeListList] = useState<VehiculeListInterface[]>([]);
  const [limit, setLimit] = useState(10);
  const [selectedRows, setSelectedRows] = useState(new Map());
  const [pageCount, setPageCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState("id_vehicule");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [showText, setShowText] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id_vehicule: true,
    model: true,
    imatriculation: true,
    state: true,
    assignment: true,
    conducteur: true,
    trailer: true,
    actions: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState(searchOptions[0]);
  const navigate = useNavigate();

  const handleClickLink = (navigateTo: string) => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  const handleSearch = (term: string, type: string) => {
    setSearchTerm(term);
    setSearchType(type);
};

const clearSearchTerm = () => {
    setSearchTerm("");
};

  const handleSort = (type: string) => {
    let sortOrder = sortDirection === "asc" ? "desc" : "asc";
    if (type !== sortColumn) sortOrder = "asc";
    setSortColumn(type);
    setSortDirection(sortOrder);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAllChecked(e.target.checked);
    setSelectedRows(new Map()); // or handle setting all items as selected
  };

  const handleColumnVisibilityChange = (
    column: keyof typeof visibleColumns
  ) => {
    setVisibleColumns((prevState) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };

  const TableHeader = () => {
    const { id_vehicule, model, imatriculation, state, assignment, conducteur, trailer } = visibleColumns;
  
    return (
      <thead className="bg-white text-uppercase">
        <tr className="ligth ligth-data">
          <th className="col-xs-3">
            <div className="checkbox d-inline-block">
              <input type="checkbox" checked={selectAllChecked} onChange={handleSelectAll} />
            </div>
          </th>
          {id_vehicule && (
            <th style={{ width: "60px", cursor: "pointer" }} className="col-xs-3">
              <span onClick={() => handleSort("id_vehicule")} style={{ color: "#140A57" }}>
                ID
                {sortColumn === "id_vehicule" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {model && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              <span onClick={() => handleSort("vehicule_type")} style={{ color: "#140A57" }}>
                  {translate("Model")}
                {sortColumn === "vehicule_type" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {imatriculation && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              <span onClick={() => handleSort("immatriculation_vehicule")} style={{ color: "#140A57" }}>
                {translate("Immatriculation")}
                {sortColumn === "immatriculation_vehicule" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {state && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              <span onClick={() => handleSort("etat_vehicule")} style={{ color: "#140A57" }}>
                        {translate("Status")}
                {sortColumn === "etat_vehicule" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {assignment && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              <span onClick={() => handleSort("affectation")} style={{ color: "#140A57" }}>

                {translate("Assignment")}
                {sortColumn === "affectation" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {conducteur && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              {/* <span onClick={() => handleSort("conducteur")} style={{ color: "#140A57" }}> */}
                
                {translate("Driver")}
                {/* {sortColumn === "conducteur" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span> */}
            </th>
          )}
          {trailer && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              {/* <span onClick={() => handleSort("trailer")} style={{ color: "#140A57" }}> */}
                    {translate("Trailer")}
                {/* {sortColumn === "trailer" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span> */}
            </th>
          )}
         
        
          <th>{translate("Actions")}</th>
        </tr>
      </thead>
      
    );
  };

  const fetchVehiculeData = async (currentPage: number, limit: number,sortColumn:string,sortDirection:string, searchColumn: string, searchValue?:null | string) => {
    try {
      setLoading(true); 
      const [ countData, viheculeData ] = await Promise.all([
        fetch(`${backendUrl}/vehicles/count/${userID}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              searchTerm: searchValue,
              searchType: searchColumn
          })
        }).then((res) =>res.json()),
        fetch(`${backendUrl}/vehicles`,{
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({
            id_user:userID,
            page:currentPage,
            limit:limit,
            sortColumn:sortColumn,
            sortOrder:sortDirection,
            searchColumn:searchColumn,
            searchValue:searchValue
          })
        }).then((res) => res.json())
      ]);

      const total = countData[0].total;
      setTotal(total);

      const calculatedPageCount = Math.ceil(total / limit);
      setPageCount(calculatedPageCount);
      setVehiculeListList(viheculeData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false on data fetch completion
    }
    }

  const refreshVehiculeData = async () => {
    fetchVehiculeData(currentPage, limit,sortColumn,sortDirection,searchType,searchTerm);
  }

  useLayoutEffect(()=> {
    refreshVehiculeData()
  }, [userID, limit, sortColumn, sortDirection,searchType,searchTerm,currentPage])

  const handlePageClick = async (data: { selected: number }) => {
    const pageSelect = data.selected + 1;
    await setCurrentPage(pageSelect); // Attendez la mise à jour de l'état
};

const handleClick = () => {
  console.log("Button clicked!");
};

 

  return (
    <>
      <div   id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" >
        <div className="row">
          <div
            className="col-sm-12 col-md-4 dataTables_length"
            id="DataTables_Table_0_length"
          >
            <h4 className="mb-3 text-nowrap">
              <i className="las la-car mr-2"></i>
              {translate("Vehicles")} {total}
            </h4>
          </div>
          <div className="col-sm-12 col-md-8">
          <div className="text-right">
              <ButtonCustomHover text={translate("Ajouter un Vehicule")} icon={<FaPlus />} ClasStyle='bg-success'   onClick={() => handleClickLink('/vehicles-forms')}/> 

              <ButtonCustomHover text={translate("Initialisation des Affectations")} icon={<FaRedo />} />
              <ButtonCustomHover text={translate("Affectations Vehicule")} icon={<FaCar />} />
              <ButtonCustomHover text={translate("Maj Assurance")} icon={<FaShieldAlt />} />
              <ButtonCustomHover text={translate("Maj Vignette")} icon={<FaStickyNote />} />
              <ButtonCustomHover text={translate("Maj Kilometrage")} icon={<FaTachometerAlt />} />
              <ButtonCustomHover text={translate("Maj Controle Thechnique")} icon={<FaWrench />} /> 
          </div>

            <div className="row justify-content-end">
            <div className="col-md-8 d-flex justify-content-end align-items-center">
                 {/* Dropdown Pour le Show du tableau */}
                  <Dropdown>
                    <Dropdown.Toggle variant="" id="dropdown-basic" title="Résultats d'affichage">
                      <i className="fas fa-list-alt"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {options.map((option) => (
                        <Dropdown.Item key={option} 
                        onClick={() => {
                          setLimit(option);
                          setCurrentPage(1)
                          }}>
                          {option}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                    <i className="fas fa-eye"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {/* <Dropdown.Item as="div">
                        <Form.Check
                          type="checkbox"
                          label={translate("Show Id")}
                          checked={visibleColumns.id_vehicule}
                          onChange={() => handleColumnVisibilityChange("id_vehicule")}
                        />
                      </Dropdown.Item> */}
                      <Dropdown.Item as="div">
                        <Form.Check
                          type="checkbox"
                          label={translate("Show Model")}
                          checked={visibleColumns.model}
                          onChange={() => handleColumnVisibilityChange("model")}
                        />
                      </Dropdown.Item>
                      <Dropdown.Item as="div">
                        <Form.Check
                          type="checkbox"
                          label={translate("Show imatriculation")}
                          checked={visibleColumns.imatriculation}
                          onChange={() => handleColumnVisibilityChange("imatriculation")}
                        />
                      </Dropdown.Item>
                      <Dropdown.Item as="div">
                        <Form.Check
                          type="checkbox"
                          label={translate("Show State")}
                          checked={visibleColumns.state}
                          onChange={() => handleColumnVisibilityChange("state")}
                        />
                      </Dropdown.Item>
                      <Dropdown.Item as="div">
                        <Form.Check
                          type="checkbox"
                          label={translate("Show Assignment")}
                          checked={visibleColumns.assignment}
                          onChange={() =>
                            handleColumnVisibilityChange("assignment")
                          }
                        />
                      </Dropdown.Item>
                      <Dropdown.Item as="div">
                        <Form.Check
                          type="checkbox"
                          label={translate("Show Conducteur")}
                          checked={visibleColumns.conducteur}
                          onChange={() =>
                            handleColumnVisibilityChange("conducteur")
                          }
                        />
                      </Dropdown.Item>
                      <Dropdown.Item as="div">
                        <Form.Check
                          type="checkbox"
                          label={translate("Show Trailer")}
                          checked={visibleColumns.trailer}
                          onChange={() =>
                            handleColumnVisibilityChange("trailer")
                          }
                        />
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
       
        <div className="row">
          <Table striped responsive className="table-fixed">
            <TableHeader />
            <tbody className="ligth-body">
              {vehiculeListList.map((item) => (
                <tr key={item.id_vehicule}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      id={`checkbox-${item.id_vehicule}`}
                    />
                  </td>
                  {visibleColumns.id_vehicule && <td>{item.id_vehicule}</td>}
                  {visibleColumns.model && <td className="text-center">{item.modele_vehicule}</td>}
                  
                  {visibleColumns.imatriculation && (
                    <td className="text-center">{item.immatriculation_vehicule}</td>
                  )}
                  {visibleColumns.state && (
                    <td className="text-center">
                      <span className="badge p-1 fs-6 btn">
                        {item.etat_vehicule}
                      </span>
                    </td>
                  )}
                  {visibleColumns.assignment && (
                    <td className="text-center">
                      {item.affectation}
                    </td>
                  )}
                  {visibleColumns.conducteur && (
                    <td className="text-center">
                      {item.driver_first_name} - {item.driver_last_name}
                    </td>
                  )}
                  {visibleColumns.trailer && (
                    <td className="text-center">
                      {/* {item.trailer} */}
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td>
                      <div className="d-flex align-items-center list-action">
                        
                        <NavLink to={`/vehicle/edit/${item.id_vehicule}`} className="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title={translate("Edit")}>
                            <i className="ri-pencil-line mr-0"></i>
                          </NavLink>
                        <a
                          className="badge bg-warning mr-2 nav-link"
                          data-toggle="tooltip"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line mr-0"></i>
                        </a>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot
              style={{
                // position: "sticky",
                bottom: 0,
                // backgroundColor: "#f0f0f0",
                // zIndex: 1,
              }}
            >
              <tr>
                <td colSpan={6} align="left" >
                  <div className="text-nowrap">
                       
                        <span>  {translate("Displaying")} {limit} {translate("on")}{" "}</span>
                    {total}
                  
                  
                  </div>
                </td>
                <td colSpan={3} align="right" >
                  <ReactPaginate
                    previousLabel={translate("previous")}
                    nextLabel={translate("next")}
                    breakLabel="..."
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    // pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                    forcePage={currentPage -1} // Rendre la page actuelle active visuellement
                  />
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    </>
  );
}
