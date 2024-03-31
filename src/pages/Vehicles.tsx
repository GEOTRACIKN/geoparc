import { Form, Nav, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { NavLink } from "react-router-dom";
import { PropagateLoader } from 'react-spinners'; // Import the loader component
import { Distance } from "../utilities/functions";
import VehicleModal from "../components/Vehicle/VehicleModal";
import { Bounce, toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export function Vehicles() {


  const { translate } = useTranslate();
  const [list_vehicle, setItems] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  let [total, settotal] = useState(0);
  let [limitValue, setSelectedlimitValue] = useState(10);
  const [loading, setLoading] = useState(true); // Add loading state
  const [modalStatus, setModalStatus] = useState<string | null>(null);
  const [titleStatus, setTitleStatus] = useState<string | null>(null);
  const [IdUser, setIdUser] = useState<number>(0);
  const [IdVehicule, setIdVehicule] = useState<number>(0); 
  
  
  const [showDropdown, setShowDropdown] = useState<string>("");  

  const [inputAdvenceSearch, setinputAdvenceSearch] = useState<string>("Vehicle"); 
  const [inputTypeSearch, setInputTypeSearch] = useState<number>(0); 
  
 
  let currentPage = 1;

  interface MenuItem {
    id: number;
    fieldName: string;
    label: string;
  }

  const MenuItems: MenuItem[] = [ 
    { id: 0, fieldName: translate('Vehicle'), label: translate('Vehicle') },
    { id: 1, fieldName: translate('Group'), label: translate('Vehicles group') },
    { id: 2, fieldName: 'PSN', label: 'PSN' },  
    { id: 3, fieldName: translate('User'), label:  translate('User') }, 
  ];


  const handleAdvenceClick = () => {
    
    console.log('Clicked on list:');
    
    showDropdown=="" ? setShowDropdown("show-dropdown"):setShowDropdown("") ;   


  };

  

  const handleItemClick = (fieldId: number, fieldName: string) => {
    
    console.log('Clicked on:', fieldName);
    
    setinputAdvenceSearch(fieldName);   
    setInputTypeSearch(fieldId);
    setShowDropdown("") ;   

  };


  // Function to handle the change in the select element
  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setSelectedlimitValue(newValue);
    const commentsFormServer = await fetchVehcles(currentPage, newValue);

    setItems(commentsFormServer);

  };

  const userID = localStorage.getItem("userID");


  useEffect(() => {



    const getVehicles = async () => {
      try {
        setLoading(true);
        const total_pages = await fetch(
          `${backendUrl}/api/vehicle/totalpage/${userID}`,
          { mode: 'cors' }
        );
        const totalpages = await total_pages.json();
        total = totalpages[0]["total"];
        settotal(totalpages[0]["total"]);

        const res = await fetch(
          `${backendUrl}/api/vehicle/1/${limitValue}/${userID}`,
          { mode: 'cors' }
        );

        const data = await res.json();
        setpageCount(Math.ceil(total / limitValue));
        setItems(data);
      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
    };

    getVehicles();
  }, [userID, limitValue]);

  const fetchVehcles = async (currentPage: any, limitValue: any) => {
    const res = await fetch(
      `${backendUrl}/api/vehicle/${currentPage}/${limitValue}/${userID}`,
      { mode: 'cors' }
    );
    const data = await res.json();
    return data;
  };



  const handlePageClick = async (data: any) => {
    currentPage = data.selected + 1;
    const commentsFormServer = await fetchVehcles(currentPage, limitValue);

    setItems(commentsFormServer);
    window.scrollTo(0, 0)
  };



  const handledeleteVehicle = async (id_vehicule: number, id_user: number) => {


    console.log(id_vehicule);  
    setModalStatus('Do you want to delete this vehicle');
    setTitleStatus('Delete vehicule'); 
    setTitleStatus('Delete vehicule'); 
    setIdUser(id_user); 
    setIdVehicule(id_vehicule); 

   

  };

 
  const closeModal = () => {
    setModalStatus(null);
  };

  useEffect(() => {

  


    if (modalStatus === 'success') {

      const timeoutId = setTimeout(() => {
        setModalStatus(null);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [modalStatus]);

  const searchBy = async (search: string, type: number) => {

    console.log(search === undefined);
    try {
      setLoading(true);
      const total_pages = await fetch(
        search.trim() !== ""
          ? `${backendUrl}/api/vehicle/search/totalpage/${userID}/${search}/${type}`
          : `${backendUrl}/api/vehicle/totalpage/${userID}`,
        { mode: 'cors' }
      );
      const totalpages = await total_pages.json();
      total = totalpages[0]["total"];
      settotal(totalpages[0]["total"]);

      const res = await fetch(
        search.trim() !== ""
          ? `${backendUrl}/api/vehicle/search/1/${limitValue}/${userID}/${search}/${type}`
          : `${backendUrl}/api/vehicle/1/${limitValue}/${userID}`,
        { mode: 'cors' }
      );

      const data = await res.json();
      setpageCount(Math.ceil(total / limitValue));
      setItems(data);
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row">
        <h4 className="col-sm-6 col-md-6">
          <i className="las la-car" data-rel="bootstrap-tooltip" title="Increased"></i>{translate('Vehicles')} ({total})
        </h4>
        <div className="col-sm-6 col-md-6 " >
          <div id="DataTables_Table_0_filter" className="float-right dataTables_filter mr-3">
            <NavLink to="/Vehicle/add" className="btn btn-primary  mr-1">
              <i className="las la-plus mr-3"></i>
              {translate('New vehicle')}
            </NavLink >
            <a href="#" className="btn btn-outline-secondary  mr-1">
              <i className="las la-plus mr-3"></i>
              {translate('Import vehicles')}
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
          <div className="col-sm-6 col-md-6" style={{ margin: "0px 0px 10px 0px", padding: "0px" }}>

            <Form className="d-flex">

            <div className="dropdown">
              <button
                className="btn btn-default dropdown-toggle"
                type="button"
                name="dropdown_btn"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={() => handleAdvenceClick()}
              > 
                <span className="las la-chevron-down" data-toggle="tooltip" title="Search by vehicle"></span>
              </button> 
              <ul style={{padding: "4px"}}  className={`dropdown-menu  ${showDropdown}`}  role="menu" id="search_by"> 
                {MenuItems.map((item) => ( 
                  <li key={item.id} className={item.id === 1 ? 'active' : ''}> 
                    <a
                      onClick={() => handleItemClick(item.id, item.fieldName)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <Form.Control
                type="search"
                placeholder={`${translate('Search by')} ${translate(inputAdvenceSearch)}`}  
                className="me-2" 
                aria-label={`${translate('Search by')} ${translate(inputAdvenceSearch)}`}     
                onChange={(e) => searchBy(e.target.value, inputTypeSearch)} 
              />
            </Form>

          </div>
          <div className="col- 
             -6 col-md-6">
            <label style={{ float: "right" }}>
              {translate('Show')}
              <select
                name="DataTables_Table_0_length"
                aria-controls="DataTables_Table_0"
                className="custom-select custom-select-sm form-control form-control-sm mr-2 ml-2"
                style={{ width: "66px" }}
                onChange={handleSelectChange}
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="60">60</option>
                <option value="90">90</option>
                <option value="180">180</option>
                <option value="300">300</option>
                <option value="600">600</option>
                <option value="900">900</option>
                <option value="2000">2000</option>
              </select>
              {translate('entries')}
            </label>
          </div>
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
                <th>{translate('Type')}</th>
                <th>{translate('Matriculation')}</th>
                <th>PSN</th>
                <th>{translate('Driver')}</th>
                <th>{translate('User')}</th>
                <th>{translate('Group')}</th>
                <th>iButton</th>
                <th>{translate('Odometer')}</th>
                <th>{translate('Actions')}</th>
              </tr>
            </thead>

            {list_vehicle.length !== 0 && list_vehicle.map((item) => {
              return (
                <tbody key={item["id_vehicule"]} className="ligth-body">
                  <tr className={item["id_vehicle"]}>
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
                      <div className="align-items-center">
                        <span className="icon icon-Aucun" style={{ background: "#FF0000" }} ></span>
                        <div>
                          {item["vehicule_type"]}
                          <p className="mb-0">
                            <small>{item["category_vehicule"]}</small>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td> {item["immatriculation_vehicule"]}</td>
                    <td>{item["PSN"]}</td>
                    <td id="6">{item["nom_conducteur"] != "none" ? item["nom_conducteur"] + ' ' + item["prenom_conducteur"] : translate('None')}</td>
                    <td id="7">{item["nom_user"] != "none" ? item["nom_user"] + ' ' + item["prenom_user"] : translate('None')}</td>
                    <td id="5">{item["nom_groupe"] != "none" ? item["nom_groupe"] : translate('None')} </td>
                    <td id="tag-8" title="Cliquez pour copier le tag" style={{ cursor: "pointer" }}>
                      <i className="las la-tags" style={{ marginRight: "4px" }}></i>
                      <span style={{ color: "rgb(0, 123, 255)" }}>{item["IB_CODE"] != "none" ? item["IB_CODE"] : translate('None')}</span>
                    </td>
                    <td>{Distance(item["GPSDIST"])}</td>
                    <td>
                      <div className="d-flex align-items-center list-action">

                        <Nav.Link to={`/Vehicle/edit/${item["id_vehicule"]}`} className="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit" as={NavLink}>
                          <i className="ri-pencil-line mr-0"></i>
                        </Nav.Link >

                        <a className="badge bg-warning mr-2" onClick={() => userID && handledeleteVehicle(item["id_vehicule"], parseInt(userID))} data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete">
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
        {loading ? (
          <div className="text-center">
            <PropagateLoader color={'#123abc'} loading={loading} size={20} />
          </div>
        ) : (
          <>
            <ReactPaginate
              previousLabel={translate("previous")}
              nextLabel={translate("next")}
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
          </>
        )} 
        <VehicleModal 
        show={modalStatus !== null} 
        onHide={closeModal} 
        status={modalStatus} 
        title={titleStatus}
        IdUser= {IdUser} 
        IdVehicule= {IdVehicule} 
        />
        
      </div>
    </>
  );
}