import { Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { useState, useEffect } from "react";
import AdvancedSearch from "../components/AdvancedSearch";

type Sinister = {
  id_sinistre: number;
  sinister_type: string;
  vehicle_license: string;
  sinister_cost: string;
  sinister_detail: string;
  sinister_datetime: string;
  vehicle_registration_2: string;
  sinister_location: string;
  // Add other properties as needed
};


export function VehicleSinister() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const userID = 21;
  let currentPage = 1;
  const { translate } = useTranslate();
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [list_Sinisters, setSinisters] = useState<Sinister[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('sinister_type'); // Default search type

  // API call to get total count of sinisters
  const getTotalCount = async (searchTerm: string, searchType: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/sinister/count/${21}?searchTerm=${searchTerm}&searchType=${searchType}`);
      const data = await res.json();
      setTotal(data.total_count);
      setPageCount(Math.ceil(data.total_count / limit));
    } catch (error) {
      console.error("Erreur lors du chargement du nombre total de sinistres :", error);
    }
  };

  // API call to get sinisters
  const getSinisters = async (currentPage: number, limit: number, searchTerm: string, searchType: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/sinister/${21}/${currentPage}/${limit}?searchTerm=${searchTerm}&searchType=${searchType}`);
      const data = await res.json();
      setSinisters(data);

    } catch (error) {
      console.error("Erreur lors du chargement des sinistres :", error);
    }
  };


  useEffect(() => {
    getTotalCount(searchTerm, searchType);
    getSinisters(currentPage, limit, searchTerm, searchType);
  }, [limit, searchTerm, searchType]);
  
console.log(list_Sinisters);
  const handlePageClick = async (data: any) => {
    let selectedPage = data.selected + 1;
    await getSinisters(selectedPage, limit, searchTerm, searchType);
    window.scrollTo(0, 0);
  };

  const handleSearch = (term: string, type: string) => {
    setSearchTerm(term);
    setSearchType(type);
  };
  const clearSearchTerm = () => {
    setSearchTerm('');
    // Call getSinisters with empty search term to reset table data
    getSinisters(currentPage, limit, '', searchType);
  };

  const options = [10, 20, 40, 60, 80, 100, 200, 500]; // Page size options
  const searchOptions = ['sinister_type', 'vehicle_license', 'sinister_location'];
  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-car" data-rel="bootstrap-tooltip" title="Increased"></i>
            {translate("Vehicles Sinister")} ({total})
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">
          <Link to="#" className="btn btn-primary mt-2 mr-1">
            <i className="las la-plus mr-3"></i>
            {translate("Add Verification")}
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4" style={{ margin: '0px 0px 10px 0px', padding: '10px' }}>
          <AdvancedSearch
            searchOptions={searchOptions}
            onSearch={handleSearch}
            clearSearchTerm={clearSearchTerm}
            placeholderText={`${searchType}`}
          />
        </div>
        <div className="col-md-8 d-flex justify-content-end align-items-center">
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
        </div>
      </div>
      <div className="row m-1">
        <Table>
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label"></label>
                </div>
              </th>
              <th>N°</th>
              <th>{translate("Type")}</th>
              <th>{translate("Date")}</th>
              <th>{translate("Location")}</th>
              <th>{translate("Vehicle 1")}</th>
              <th>{translate("Sinister Detail")}</th>
              <th>{translate("Sinister Cost")}</th>
              <th>{translate("Actions")}</th>
            </tr>
          </thead>
          <tbody key="#" className="ligth-body">
            {list_Sinisters && list_Sinisters.length > 0 ? (
              
              list_Sinisters.map((sinister) => (
                <tr key={sinister.id_sinistre}>
                  <td>
                    <div className="form-check form-check-inline">
                      <input type="checkbox" className="form-check-input" />
                    </div>
                  </td>
                  <td>{sinister.id_sinistre}</td>
                  <td>{sinister.sinister_type}</td>
                  <td>{new Date(sinister.sinister_datetime).toLocaleString()}</td>
                  <td>{sinister.sinister_location}</td>
                  <td>{sinister.vehicle_license}</td>
                  <td>{sinister.sinister_detail}</td>
                  <td>{sinister.sinister_cost}</td>
                  <td>
                    <div className="d-flex align-items-center list-action">
                      <Link
                        to={`#`}
                        className="badge badge-success mr-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Détail"
                      >
                        <i className="fa fa-eye" style={{ fontSize: "1.2em" }}></i>
                      </Link>
                      <a
                        className="badge bg-warning mr-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete"
                        data-original-title="Delete"
                      >
                        <i className="ri-delete-bin-line mr-0" style={{ fontSize: "1.2em" }}></i>
                      </a>
                      <a
                        className="badge bg-primary mr-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="download"
                        data-original-title="download"
                      >
                        <i className="las la-download" style={{ fontSize: "1.2em" }}></i>
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">No sinisters found.</td>
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
