import { useTranslate } from "../components/LanguageProvider";
import { useState, useEffect, useLayoutEffect } from "react";
import {  Table,  Modal,  Button,  Form,  Col,  Row,  Dropdown,} from "react-bootstrap";
import {  FaPlus,  FaRedo,  FaCar,  FaShieldAlt,  FaStickyNote,  FaTachometerAlt,  FaWrench,} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { PropagateLoader } from "react-spinners";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface VehiculeListInterface {
  id_vhc: number,
  type_vhc: string,
  model_vhc: string,
  license_vhc: string,
  color_vhc: string,
  cond_vhc: string,
  id_driver?: number,
  driver_first_name?: string,
  driver_last_name?: string
}

export function Vehicles() {
  const { translate } = useTranslate();
  const userID = localStorage.getItem("userID");
  const [vehiculeListList, setVehiculeListList] = useState<VehiculeListInterface[]>([]);
  const [limit, setLimit] = useState(10);
  const [selectedRows, setSelectedRows] = useState(new Map());
  const [pageCount, setPageCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("id_vehicule");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [searchValue, setSearchValue] = useState<null | string>(null);
  const [searchColumn, setSearchColumn] = useState('license_vhc')
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


  const handleSort = (type: string) => {
    let sortOrder = sortDirection === "asc" ? "desc" : "asc";
    if (type !== sortType) sortOrder = "asc";
    setSortType(type);
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
                {sortType === "id_vehicule" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {model && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              <span onClick={() => handleSort("model")} style={{ color: "#140A57" }}>
                Modèle
                {sortType === "model" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {imatriculation && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              <span onClick={() => handleSort("imatriculation")} style={{ color: "#140A57" }}>
                Immatriculation
                {sortType === "imatriculation" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {state && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              <span onClick={() => handleSort("state")} style={{ color: "#140A57" }}>
                État
                {sortType === "state" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {assignment && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              <span onClick={() => handleSort("assignment")} style={{ color: "#140A57" }}>
                Affectation
                {sortType === "assignment" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {conducteur && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              <span onClick={() => handleSort("conducteur")} style={{ color: "#140A57" }}>
                Conducteur
                {sortType === "conducteur" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
          {trailer && (
            <th style={{ width: "199px", cursor: "pointer" }} className="col-xs-3 text-center">
              <span onClick={() => handleSort("trailer")} style={{ color: "#140A57" }}>
                Remorque
                {sortType === "trailer" && (sortDirection === "asc" ? " ▲" : " ▼")}
              </span>
            </th>
          )}
         
        
          <th>{translate("Actions")}</th>
        </tr>
      </thead>
    );
  };

  const fetchVehiculeData = async (currentPage: number, limit: number,sortType:string,sortDirection:string, searchColumn: string, searchValue?:null | string) => {
    try {
      // setLoading(true); 
      // const [ contData, viheculeData ] = await Promise.all([
      //   fetch(`${backendUrl}/api/vehicles/count`)
      // ])
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false on data fetch completion
    }
    }

  const vehiclesData = [
    {
      id_vehicule: 1,
      model: "Model A",
      imatriculation: "ABC-123",
      state: "En bon état",
      assignment: "Livraison",
      conducteur: "Jean",
      trailer: "Remorque 1",

    },
    {
      id_vehicule: 2,
      model: "Model B",
      imatriculation: "DEF-456",
      state: "Besoin de maintenance",
      assignment: "Transport de marchandises",
      conducteur: "Marie",
      trailer: "Remorque 2",
    },
    {
      id_vehicule: 3,
      model: "Model C",
      imatriculation: "GHI-789",
      state: "En réparation",
      assignment: "Voyage longue distance",
      conducteur: "Pierre",
      trailer: "Remorque 3",
    },
  ];


  return (
    <>
    <style>
        {`
          .my-button {
            position: relative;
            display: inline-flex;
            align-items: center;
            padding: 10px;
          }

          .button-text {
            display: none; /* Initially hidden */
            opacity: 0;
            transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
            margin-left: 10px; /* Space between icon and text */
            transform: translateY(-10px); /* Initial offset for animation */
          }

          .my-button:hover .button-text {
            display: inline; /* Show the text */
            opacity: 1;
            transform: translateY(0); /* Move text to initial position */
          }
        `}
      </style>
      <div
        id="DataTables_Table_0_wrapper"
        className="dataTables_wrapper dt-bootstrap4 no-footer"
      >
        <div className="row">
          <div
            className="col-sm-12 col-md-5 dataTables_length"
            id="DataTables_Table_0_length"
          >
            <h4 className="mb-3">
              <i className="las la-car mr-2"></i>
              {translate("Vehicles")} ( )
            </h4>
            <div className="input-group">
              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-basic">
                  <i className="fas fa-chevron-down" style={{ color: 'black' }}></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item >Model</Dropdown.Item>
                  <Dropdown.Item >Immatriculation</Dropdown.Item>
                  <Dropdown.Item >Conducteur</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <input
                type="text"
                placeholder="test"
                className="form-control"
              />

            </div>
          </div>
          <div className="col-sm-12 col-md-7">
            <div>
              <div className=" text-right">
          
                <button 
                  className='btn btn-outline-primary mt-2 mr-1 my-button' 
                >
                  <FaPlus />
                  <span className='button-text' >
                    {translate("Ajouter un Vehicule")}
                  </span>
                </button>
                <button 
                  className='btn btn-outline-dark mt-2 mr-1 my-button' 
                >
                  <FaRedo />
                  <span className='button-text' >
                    {translate("Initialisation des Affectations")}
                  </span>
                </button>
                <button className="btn btn-outline-dark mt-2 mr-1 my-button">
                  <FaCar />
                  <span className="button-text">
                    {translate("Affectations Vehicule")}
                  </span>
                </button>
                <button className="btn btn-outline-dark mt-2 mr-1 my-button">
                  <FaShieldAlt />
                  <span className="button-text">
                    {translate("Maj Assurance")}
                  </span>
                </button>
                <button className="btn btn-outline-dark mt-2 mr-1 my-button">
                  <FaStickyNote />
                  <span className="button-text">
                    {translate("Maj Vignette")}
                  </span>
                </button>
                <button className="btn btn-outline-dark mt-2 mr-1 my-button">
                  <FaTachometerAlt />
                  <span className="button-text">
                    {translate("Maj Kilometrage")}
                  </span>
                </button>
                <button className="btn btn-outline-dark mt-2 mr-1 my-button">
                  <FaWrench />
                  <span className="button-text">
                    {translate("Maj Controle Thechnique")}
                  </span>
                </button>
              </div>
            </div>
            <div className="row justify-content-end">
              <div className="col-md-auto">
                <label>
                  {translate("Show")}
                  <select
                    name="DataTables_Table_0_length"
                    aria-controls="DataTables_Table_0"
                    className="custom-select custom-select-sm form-control form-control-sm"
                    style={{ width: "64px",lineHeight: "18px",height: "28px",margin:"4px" }}
                  >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                    <option value="120">120</option>
                  </select>
                  {translate("entries")}
                </label>
              </div>
              <div className="col-md-auto">
              <div>
                  <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                      Filtre
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
      </div>
      <div>
       
        <div className="row m-2">
          <Table className="table-fixed">
            <TableHeader />
            <tbody className="ligth-body">
              {vehiclesData.map((item) => (
                <tr key={item.id_vehicule}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      id={`checkbox-${item.id_vehicule}`}
                    />
                  </td>
                  {visibleColumns.id_vehicule && <td>{item.id_vehicule}</td>}
                  {visibleColumns.model && <td className="text-center">{item.model}</td>}
                  
                  {visibleColumns.imatriculation && (
                    <td className="text-center">{item.imatriculation}</td>
                  )}
                  {visibleColumns.state && (
                    <td className="text-center">
                      <span className="badge p-1 fs-6 btn">
                        {item.state}
                      </span>
                    </td>
                  )}
                  {visibleColumns.assignment && (
                    <td className="text-center">
                      {item.assignment}
                    </td>
                  )}
                  {visibleColumns.conducteur && (
                    <td className="text-center">
                      {item.conducteur}
                    </td>
                  )}
                  {visibleColumns.trailer && (
                    <td className="text-center">
                      {item.trailer}
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td>
                      <div className="d-flex align-items-center list-action">
                        <a
                          className="badge badge-info mr-2 btn"
                          data-toggle="tooltip"
                          title="Duplicate"
                        >
                          <i
                            className="las la-copy"
                            style={{ height: "12px", width: "12px" }}
                          ></i>
                        </a>
                        <a
                          className="badge badge-success mr-2 btn"
                          data-toggle="tooltip"
                          title="Update"
                        >
                          <i className="ri-pencil-line mr-0"></i>
                        </a>
                        <a
                          className="badge bg-warning mr-2 btn"
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
                position: "sticky",
                bottom: 0,
                backgroundColor: "#f0f0f0",
                zIndex: 1,
              }}
            >
              <tr>
                <td colSpan={6}>
                  <ReactPaginate 
                    previousLabel="previous"
                    nextLabel="next"
                    breakLabel="..."
                    pageCount={7}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
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
