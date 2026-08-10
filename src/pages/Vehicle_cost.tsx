import { Dropdown, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslate } from "../hooks/LanguageProvider";
import { useListPagePreferences } from "../hooks/useListPagePreferences";
import { useGpVisibleColumns } from "../hooks/useGpVisibleColumns";


type Vehicles = {
  id: number;
  vehicule: string;
  date: Date | null;
  vehicleCost: string;
};

const data: Vehicles[] = [
  { id: 1, vehicule: "Ford US Fiesta 19953-114-31 / F500", date: new Date(), vehicleCost: "1000$" },
  { id: 2, vehicule:"Renault Symbole 1111-114-31 /", date: new Date(), vehicleCost: "1000$" },
  { id: 3, vehicule: "Liebherr Liebherr 974 Pelle hydraulique 1083-215-37 /", date: new Date(), vehicleCost: "1000$" },
  { id: 4, vehicule: "Iveco Daily 3200-314-31 / 4055", date: new Date(), vehicleCost: "1000$" },
  { id: 5, vehicule: "Nissan Micra 02891-117-31 /", date: new Date(), vehicleCost: "1000$" },
  { id: 6, vehicule: "Ford US Fiesta 19953-114-31 / F500", date: new Date(), vehicleCost: "1000$" },
  { id: 7, vehicule: "Renault Symbole 1111-114-31 /", date: new Date(), vehicleCost: "1000$" },
  { id: 8, vehicule: "Ford US Fiesta 19953-114-31 / F500", date: new Date(), vehicleCost: "1000$" },
  { id: 9, vehicule: "Ford US Fiesta 19953-114-31 / F500", date: new Date(), vehicleCost: "1000$" },
  { id: 10, vehicule: "Liebherr Liebherr 974 Pelle hydraulique 1083-215-37 /", date: new Date(), vehicleCost: "1000$" },
  { id: 11, vehicule:"Iveco Daily 3200-314-31 / 4055", date: new Date(), vehicleCost: "1000$" },
  { id: 12, vehicule: "Ford US Fiesta", date: new Date(), vehicleCost: "1000$" },
  { id: 13, vehicule: "Liebherr Liebherr 974 Pelle hydraulique 1083-215-37 /", date: new Date(), vehicleCost: "1000$" },
  { id: 14, vehicule: "Ford US Fiesta 19953-114-31 ", date: new Date(), vehicleCost: "1000$" },
  { id: 15, vehicule: "Ford US Fiesta 19953-114-31 / F500", date: new Date(), vehicleCost: "1000$" },
  // Ajoutez les autres données statiques ici...
];

export function VehicleCost() {
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const { translate } = useTranslate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('vehicule');
  const { ready: listPreferencesReady } = useListPagePreferences({
    pageKey: "vehicle-costs",
    pageSize: limit, setPageSize: setLimit,
    searchType, setSearchType,
    searchText: searchTerm, setSearchText: setSearchTerm,
  });

  const [list_Vehiclescosts, setItems] = useState<Vehicles[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const initialColumns = {
    id:true,
    vehicule: true,
    Date: true,
    Vehiclecost: true,  
  };
  // Load selected columns from localStorage or use initial state
  const loadSelectedColumns = () => {
    const savedColumns = localStorage.getItem("selectedColumns");
    return savedColumns ? JSON.parse(savedColumns) : initialColumns;
  };
  const [selectedColumns, setSelectedColumns] = useState(loadSelectedColumns);
  useGpVisibleColumns("vehicle-costs", selectedColumns, setSelectedColumns, listPreferencesReady);


  const handleColumnChange = (column: string) => {
    const updatedColumns = {
      ...selectedColumns,
      [column]: !selectedColumns[column],
    };
    setSelectedColumns(updatedColumns);
    localStorage.setItem("selectedColumns", JSON.stringify(updatedColumns));  // Save selected columns to localStorage
  };


  const handlePageClick = async (data: any) => {
    // Gestion de la pagination ici...
  };

  useEffect(() => {
    // Remplacez la récupération de données par des données statiques ici...
    setItems(data);
    setPageCount(1); // Une seule page pour les données statiques
    setTotal(data.length);
  }, []);

  const options = [10, 20, 40, 60, 80, 100, 200, 500];


    // Function to handle search
    const searchOptions = ['vehicule','ID'];
    const handleSearch = (term: string, type: string) => {
      setSearchTerm(term);
      setSearchType(type);
    };
    const clearSearchTerm = () => {
      setSearchTerm('');
      // Call getVehicleschecks with empty search term to reset table data
    };
  

  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
          VehicleCost ({total})
          </h4>
        </div>
      </div>
      <div className="row">
      <div className="col-md-4" style={{ margin: '0px 0px 10px 0px', padding: '10px' }}>
        </div>
      <div className="col-md-8 d-flex justify-content-end align-items-right">
          {/* Dropdown Pour le Show du tableau */}
          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic" title="Résultats d'affichage">
              <i className="fas fa-list-alt"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {options.map((option) => (
                <Dropdown.Item key={option} onClick={() => setLimit(option)}>
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {/* Dropdown Pour le filtrage du tableau */}
          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic" title="Colonnes dʼaffichage">
              <i className="fas fa-eye"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.id}
                  onChange={() => handleColumnChange("id")}
                />
                <span style={{ marginLeft: '10px' }}>id</span>
              </Dropdown.Item>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.vehicule}
                  onChange={() => handleColumnChange("vehicule")}
                />
                <span style={{ marginLeft: '10px' }}>vehicule</span>
              </Dropdown.Item>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.Date}
                  onChange={() => handleColumnChange("Date")}
                />
                <span style={{ marginLeft: '10px' }}>{translate("Date")}</span>
              </Dropdown.Item>
              <Dropdown.Item as="button" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedColumns.Vehiclecost}
                  onChange={() => handleColumnChange("Vehiclecost")}
                />
                <span style={{ marginLeft: '10px' }}>{translate("Vehicle cost")}</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="row m-1">
        <Table>
          <thead className="bg-white text-uppercase">
          <tr className="ligth ligth-data">
              {selectedColumns.id && <th>N°</th>}
              {selectedColumns.vehicule && <th>Vehicle</th>}
              {selectedColumns.Date && <th>Date</th>}
              {selectedColumns.Vehiclecost && <th>Vehicle Cost</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody key="#" className="ligth-body">
            {Array.isArray(list_Vehiclescosts) && list_Vehiclescosts.length !== 0 && list_Vehiclescosts.map((data) => (
              <tr className={""} key={data.id}>
                {selectedColumns.id && <td>{data.id}</td>}
                {selectedColumns.vehicule && <td>{data.vehicule}</td>}
                {selectedColumns.Date && <td><DatePicker selected={data.date} onChange={(date: Date | null) => setStartDate(date)} /></td>}
                {selectedColumns.Vehiclecost && <td>{data.vehicleCost}</td>}
                <td>
                  <div className="d-flex align-items-center list-action">
                    <a
                      className="badge bg-primary mr-2"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Cost"
                      data-original-title="Cost"
                    >
                      <i className="las la-receipt" style={{ fontSize: '1.2em' }}></i>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>Affichage 1 à {limit} sur {total} </span>
        </div>
        <div className="col-md-6">
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
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
    </>
  );
}
