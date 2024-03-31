
  import { Form, Nav, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { NavLink } from "react-router-dom";
import { PagePermission } from "../utilities/permissions";
const backendUrl = process.env.REACT_APP_BACKEND_URL;


interface UserInterface { 
  id_user: number;
  nom_user: string;
  prenom_user: string;
}

export  function Devices() {
  
  const page_permission_id = 6;

  const { translate } = useTranslate();
  const [list_Device, setItems] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  let [total, settotal] = useState(0);
  const [Users, setUsers] = useState<UserInterface[]>([]);
  const userID  = localStorage.getItem("userID");
  let [limitValue, setSelectedlimitValue] = useState(15);
  let currentPage=1;

  const findUserById = (id: number): { nom_user: string; prenom_user: null | string } | undefined => {
    const foundUser = Users.find((user) => user.id_user === id);

    if (foundUser) {
      const { nom_user, prenom_user } = foundUser;
      return { nom_user, prenom_user };
    }

    return undefined;
  };
  const handleSelectChange = async (event:any) => {
    const newValue = event.target.value;
    setSelectedlimitValue(newValue);
    const commentsFormServer = await fetchDevice(currentPage,newValue);

    setItems(commentsFormServer);
  
    console.log('Selected value:', newValue);
  };


  useEffect(() => { 
   
    const Permissions= hasPermission(userID,PagePermission.Devices);

    console.log("here "); 
    console.log(Permissions);  

    getUser(userID);

    const getDevices = async () => {

      const total_pages = await fetch(
        `${backendUrl}/api/device/totalpage/${userID}`,
        {mode:'cors'}
      ); 
      const totalpages = await total_pages.json();
      total=totalpages[0]["total"];
      settotal(totalpages[0]["total"]);

      const res = await fetch(
        `${backendUrl}/api/device/1/${limitValue}/${userID}`,
        {mode:'cors'}
      ); 

      const data = await res.json();
      setpageCount(Math.ceil(total / limitValue));
      console.log(Math.ceil(total/10));
      setItems(data);
    };

    getDevices();
  }, [userID, limitValue]);

  const fetchDevice = async (currentPage:any,limitValue:any) => { 
    const res = await fetch(
      `${backendUrl}/api/device/${currentPage}/${limitValue}/${userID}`,
      {mode:'cors'}
    );
    const data = await res.json();
    return data;
  };

  async function getUserPermissions(userId:any) {
    try {
      const response = await fetch(`${backendUrl}/api/permission/find/${userId}/${page_permission_id}`, {mode:'cors'});  
      const data = await response.json();
     
     
      return data;

    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  }
  

  
  const getUser = async (userId:any) => {
    try {
      const res = await fetch( `${backendUrl}/api/users/find/${userId}`, { mode: 'cors' });  
  
      if (!res.ok) {
        console.error('Erreur lors de la récupération des utilisateurs');
        return;
      }

      setUsers(await res.json()); 

  

    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
    }
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };


  

  
  // Function to check if the user has a specific permission
async function hasPermission(user_id:any, requiredPermission:any) {
  try {
    // Fetch user permissions
    const userPermissions = await getUserPermissions(user_id);

   console.log(userPermissions[0]["id_rel"]);

    // Check if the required permission is in the user's permissions 
    return userPermissions[0]["id_rel"] === requiredPermission;
  } catch (error) {
    // Handle errors, e.g., log the error or throw a custom error
    console.error('Error checking user permission:', error);
    throw error;
  }
}

  const handlePageClick = async (data:any) => { 
    console.log(data.selected);
    currentPage = data.selected + 1;
    const commentsFormServer = await fetchDevice(currentPage,limitValue);

    setItems(commentsFormServer);
    //window.scrollTo(0, 0)
  };

 


  const searchBy = async (search:string) => {

    const total_pages = await fetch(
      search.trim() !== ""
      ? `${backendUrl}/api/device/search/totalpage/${userID}/${search}/1`
      : `${backendUrl}/api/device/totalpage/${userID}`,
      {mode:'cors'}
    );  
    const totalpages = await total_pages.json();
    total=totalpages[0]["total"];
    settotal(totalpages[0]["total"]);
 
    const res = await fetch(
      search.trim() !== ""
      ? `${backendUrl}/api/device/search/1/${limitValue}/${userID}/${search}/1`
      : `${backendUrl}/api/device/1/${limitValue}/${userID}`
      ,  
      {mode:'cors'}
    ); 

    const data = await res.json();
    setpageCount(Math.ceil(total / limitValue));
    console.log(Math.ceil(total/10));
    setItems(data);
  };


  return (
    <>
    <div className="row"> 
        <h4 className="col-sm-6 col-md-6"> 
        <i  className="las la-compass"  data-rel="bootstrap-tooltip"   title="Devices"></i>{translate('Devices')} ({total})
        </h4>
        <div className="col-sm-6 col-md-6 " >
          <div id="DataTables_Table_0_filter" className="float-right dataTables_filter mr-3">
            <NavLink   to="/Device/add" className="btn btn-primary  mr-1">
              <i className="las la-plus mr-3"></i>
              {translate('New devices')}  
            </NavLink >
            <a href="#" className="btn btn-outline-secondary  mr-1">
              <i className="las la-plus mr-3"></i>
                {translate('Import Devices')}
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
        <div className="col-sm-6 col-md-6" style={{margin: "0px 0px 10px 0px",padding: "0px"}}> 

         <Form className="d-flex">
                   <button className="btn btn-default" type="button" name="dropdown_btn" data-toggle="dropdown">
                        <span className="las la-chevron-down"   data-toggle="tooltip" title="Search by PSN'"></span>
                   </button>

                  <Form.Control
                    type="search"
                    placeholder="Search by PSN"
                    className="me-2"
                    aria-label="Search by PSN"
                    onChange={(e) => searchBy(e.target.value ) }
                  />
          </Form>

         </div>
         <div className="col-sm-6 col-md-6">
          <label style={{float: "right"}}>
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
                <th>{translate('N°')}</th>
                <th>{translate('PSN')}</th>
                <th>{translate('Groupe')}</th>
                <th>{translate('Utilisateur')}</th>
                <th>{translate('Utilisateur GP')}</th>
                <th>{translate('Type Dispositif')}</th>
                <th>{translate('Modèle Dispositif')}</th>
                <th>{translate('N° SIM')}</th>
                <th>{translate('Type SIM')}</th>
                <th>{translate('Actions')}</th>

              </tr>
            </thead>

            {list_Device.length!==0 &&  list_Device.map((item) => {
              const foundUser  = findUserById(item["id_user"]);
            return (
              <tbody key={item["id_dispositif"]} className="ligth-body">
              <tr className={item["id_dispositif"]}>
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
                <td> {item["id_dispositif"]}</td> 
                <td> {item["psn_dispositif"]}</td> 
                <td>{item["nom_groupe"]}</td> 
                <td id="6">{ foundUser?.nom_user+' '+foundUser?.prenom_user }</td>
                <td id="5">{item["usergps"]}</td>
                <td>{item["type_dispositif"]}</td>
                <td>{item["model_dispositif"]}</td>
                <td>{item["serial_number"]}</td> 
                <td>{item["operateur_puce"]}</td>  
                <td>
                  <div className="d-flex align-items-center list-action">
                            
                   
 
                    <a className="badge bg-warning mr-2"  data-toggle="tooltip"  data-placement="top"  title="" data-original-title="Delete">
                  
                      <i className="ri-pencil-line mr-0"></i>
                    </a>
                   
                    <Nav.Link   to={`/Device/edit/${item["id_dispositif"]}`} className="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit" as={NavLink}>
                    <i className="ri-share-forward-fill  mr-0"></i>
                   </Nav.Link >


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