import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { NavLink } from "react-router-dom";
import { PagePermission } from "../utilities/permissions";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface SimcardsItem {
  id_groupe: number;
  nom_groupe: string;
  color_groupe: string;
  date_creation_groupe: string;
  totalVehicles: number;
  id_user: string;
}

interface DeletedSimcardsItem {
  id_groupe: number;
  nom_groupe: string;
  color_groupe: string;
}
// END interface

// Conatante api
const API_BASE_URL = `${backendUrl}/api`;
// FR: Pagination du tableau
let currentPage = 1;

export  function Simcards() {
  
  const page_permission_id = 6;

  const { translate } = useTranslate();
  const [list_puce, setItems] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  let [total, settotal] = useState(0);
  let [limitValue, setSelectedlimitValue] = useState(15);
  let currentPage=1;
  // Function to handle the change in the select element
  const handleSelectChange = async (event:any) => {
    const newValue = event.target.value;
    setSelectedlimitValue(newValue);
    const commentsFormServer = await fetchVehcles(currentPage,newValue);

    setItems(commentsFormServer);
  
  };


  

 
  const userID  = localStorage.getItem("userID");


  useEffect(() => { 
   

    const Permissions= hasPermission(userID,PagePermission.CartesSIM);


    const getSimcards = async () => {

      const total_pages = await fetch(
        `${API_BASE_URL}/puce/totalpage/${userID}`,
        {mode:'cors'}
      ); 
      const totalpages = await total_pages.json();
      total=totalpages[0]["totalpuces"];
      settotal(totalpages[0]["totalpuces"]);

      const res = await fetch(
        `${API_BASE_URL}/puce/1/${limitValue}/${userID}`,
        {mode:'cors'}
      ); 

      const data = await res.json();
      setpageCount(Math.ceil(total / limitValue));
      setItems(data);
    };

    getSimcards();
  }, [userID, limitValue]);

  const fetchVehcles = async (currentPage:any,limitValue:any) => {
    const res = await fetch(
      `${API_BASE_URL}/puce/${currentPage}/${limitValue}/${userID}`,
      {mode:'cors'}
    );
    const data = await res.json();
    return data;
  };

  async function getUserPermissions(userId:any) {
    try {
      const response = await fetch(`${API_BASE_URL}/permission/find/${userId}/${page_permission_id}`, {mode:'cors'});  
      const data = await response.json();
     
    
      return data;

    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  }
  
  // Function to check if the user has a specific permission
async function hasPermission(user_id:any, requiredPermission:any) {
  try {
    // Fetch user permissions
    const userPermissions = await getUserPermissions(user_id);


    // Check if the required permission is in the user's permissions 
    return userPermissions[0]["id_rel"] === requiredPermission;
  } catch (error) {
    // Handle errors, e.g., log the error or throw a custom error
    console.error('Error checking user permission:', error);
    throw error;
  }
}

  const handlePageClick = async (data:any) => { 
    currentPage = data.selected + 1;
    const commentsFormServer = await fetchVehcles(currentPage,limitValue);

    setItems(commentsFormServer);
    //window.scrollTo(0, 0)
  };

  return (
    <>
    <div className="row">
        <h4 className="col-sm-6 col-md-6">
          <i className="las la-car" data-rel="bootstrap-tooltip" title="Increased"></i>{translate('Simcards')} ({total})
        </h4>
        <div className="col-sm-6 col-md-6 " >
          <div id="DataTables_Table_0_filter" className="float-right dataTables_filter mr-3">
            <NavLink   to="/Simcard" className="btn btn-primary  mr-1">
              <i className="las la-plus mr-3"></i>
              {translate('New Carte SIM')}  
            </NavLink >
            <a href="#" className="btn btn-outline-secondary  mr-1">
              <i className="las la-plus mr-3"></i>
                {translate('Import CART')}
            </a>
            <a href="#" className="btn btn-outline-info ">
              <i className="las la-plus mr-3"></i> 
              {translate('Download')} CSV
            </a>
          </div>
        </div>
      </div>
      <div>
        <div className="row m-2">
      <label>
                {translate('Show')}  
                <select 
                  name="DataTables_Table_0_length"
                  aria-controls="DataTables_Table_0"
                  className="custom-select custom-select-sm form-control form-control-sm mr-2 ml-2"
                  style={{ width: "66px" }}
                  onChange={handleSelectChange}
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                  <option value="180">180</option>
                  <option value="300">300</option>
                  <option value="600">600</option>
                  <option value="900">900</option>
                </select>
                {translate('entries')}   
              </label>
         <Table>
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
                <th>
                  <div className="checkbox d-inline-block">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      id="checkbox1"
                    />
                    <label htmlFor="checkbox1" className="mb-0"></label>
                  </div>
                </th>
                <th style={{ width: "199px" }}>{translate("Phone")}</th>
                <th>{translate("Serial Number")}</th>
                <th>{translate("SIM Type")}</th>
                <th>{translate("Type Of Contract")}</th>
                <th>{translate("Creation Date")}</th>

                <th>{translate("Actions")}</th>
              </tr>
            </thead>

            {Array.isArray(list_puce) &&
              list_puce.length !== 0 &&
              list_puce.map((item) => {
                return (
                  <tbody key={item["id_puce"]} className="ligth-body">
                    <tr className={item["id_puce"]}>
                      <td>
                        <div className="checkbox d-inline-block">
                          <input
                            type="checkbox"
                            className="checkbox-input"
                            id="checkbox2"
                          />
                          <label htmlFor="checkbox2" className="mb-0"></label>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={`asset/images/operateur/${
                              item["operateur_puce"] !== ""
                                ? item["operateur_puce"] + ".png"
                                : "AucuneImage.PNG"
                            }`}
                            style={{
                              height: "20px",
                              width: "auto",
                              marginRight: "10px",
                              marginLeft: "-10px",
                            }}
                            alt={
                              item["operateur_puce"] !== ""
                                ? item["operateur_puce"]
                                : "Aucune image"
                            }
                          />
                          <div>
                            {item["numero_puce"]}
                            <p className="mb-0">
                              <small>{item["operateur_puce"]}</small>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td> {item["serial_number"]}</td>
                      <td>{item["contrat_puce"]}</td>
                      <td id="6">{item["contrat_puce"]}</td>
                      <td id="5">
                        {new Date(
                          item["date_creation_carte_sim"]
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <div className="d-flex align-items-center list-action">
                          <a
                            className="badge badge-info mr-2"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="View"
                          >
                            <i className="ri-eye-line mr-0"></i>
                          </a>
                          <a
                            className="badge bg-success mr-2"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="Edit"
                          >
                            <i className="ri-pencil-line mr-0"></i>
                          </a>
                          <a
                            className="badge bg-warning mr-2"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="Delete"
                          >
                            <i className="ri-delete-bin-line mr-0"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
          </Table>
        </div>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
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
        />
      </div>
    </>
  );
}