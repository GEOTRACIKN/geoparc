import { useState,  useLayoutEffect,useEffect  } from "react";
import { Table} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import { PropagateLoader } from 'react-spinners';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface RoleState {
  roles: any[];
  loading: boolean;
  error: string | null;
}
interface Role {
  id_role: string;
  nom_role: string;
  date_creation_role: string;
  date_modification_role: string;
  date_suppression_role: string;
}

const initialRoleState: RoleState = {
  roles: [],
  loading: false,
  error: null
};

function Role() {
  const { translate } = useTranslate();
  const id_user: string = localStorage.getItem("userID") ?? "";
  const [roles, setRoles] = useState<RoleState>(initialRoleState);


const getDatas = async () => {
    try {
      setRoles({ ...roles, loading: true });
      const response = await fetch(`${backendUrl}/api/roles`);
      const data = await response.json();
      console.log(data);
      
      setRoles({
        roles: data,
        loading: false,
        error: null as string | null,
      });
    } catch (error) {
      setRoles({
        ...roles,
        loading: false,
        error: translate('Erreur lors de la récupération des données de rapport'),
      });
    }
  };
    useEffect(() => {
      getDatas();
    }, []);


  return (
    <>
      <div  style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
      </div>

      <div
        id="DataTables_Table_0_wrapper"
        className="dataTables_wrapper dt-bootstrap4 no-footer"
      >
        <div className="row">
          <div className="col-sm-12 col-md-6">
          </div>
        </div>
      </div>
      <div>
        <div className="row m-2">
        {roles.loading && (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
          <PropagateLoader color={"#123abc"} loading={roles.loading} size={20} />
        </div>
        )}
        {/* {roles.error &&(<div className="alert alert-danger" role="alert">
        {translate('Error')}: {roles.error}
        </div>)} */}
        
      <Table>
        <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              {/* <th style={{ width: "5%" }}>
                <div className="checkbox d-inline-block">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    id="checkbox1"
                  />
                </div>
              </th> */}
              <th style={{ cursor: "pointer" }}>
                <span
                  style={{ color: "#140A57" }}
                >
                  {translate("Id")}
                </span>
              </th>
              <th style={{ cursor: "pointer" }}>
                <span
                  style={{ color: "#140A57" }}
                >
                  {translate("Name")}
                </span>
              </th>
              <th style={{  }} className="text-center">
                {translate("Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="ligth-body">
          {roles.roles.map((role) => (
          <tr key={role.id}>
            {/* <td>
              <div className="checkbox d-inline-block">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  id={`checkbox-${role.id}`}
                />
              </div>
            </td> */}
            <td>{role.id_role}</td>
            <td>{role.nom_role}</td>
            <td>
              <Link to={`/role/permission/${id_user}/${role.id_role}`}>
                <i className="las la-pen"></i>
              </Link>
            </td>
          </tr>
        ))}
          </tbody>
      </Table>
        </div>
        </div>
      
    </>
  )
}

export default Role