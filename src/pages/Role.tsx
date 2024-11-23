import { useState, useLayoutEffect, useEffect } from "react";
import { Button, Dropdown, Table } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import { PropagateLoader } from 'react-spinners';
import ReactPaginate from "react-paginate";
import { toTimestamp } from "../utilities/functions";
import RoleModal from "../components/Role/RoleModal";

const backendUrl = process.env.REACT_APP_BACKEND_URL;


interface RoleProps {
  id_role: number;
  id_user: string;
  nom_role: string;
  username_user: string;
  date_creation_role: string;
  date_modification_role: string;
  date_suppression_role: string;
}




function Role() {
  const { translate } = useTranslate();
  const id_user: string = localStorage.getItem("userID") ?? "";
  const [roles, setRoles] = useState<RoleProps[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [colum, setSortColum] = useState("id_role");
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [type, setType] = useState(0);
  const [typeSeach, setTypeSeach] = useState("ID role");
  const [selectedSearch, setSelectedSearch] = useState(translate("ID role"));
  const [idRole, setIdRole] = useState(0);
  const [loading, setLoading] = useState(true);
  let [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  let [limit, setLimit] = useState(10);
  const [typeSearch, setTypeSearch] = useState(translate("Name"));



  const [showRoleModal, setShowRoleModal] = useState(false);
  const handleShowRoleModal = () => setShowRoleModal(true);
  const handleCloseRoleModal = () => setShowRoleModal(false);

  const getRoles = async (
    limit: number,
    currentPage: number,
    search: string,
    type: number,
    colum: string,
    sort: string
  ) => {

    const bodyData = JSON.stringify({
      id_user: id_user,
      limit: limit,
      page: currentPage,
      search: search,
      type: type,
      colum: colum,
      sort: sort,
    });

    try {
      setLoading(true);


      const total_pages = await fetch(`${backendUrl}/api/geop/role/totalpage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
        mode: "cors",
      });

      const totalPages = await total_pages.json();
      const total = totalPages[0]["count"];
      setTotal(totalPages[0]["count"]);


      const rolesResponse = await fetch(`${backendUrl}/api/geop/role/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
        mode: "cors",
      });

      if (!rolesResponse.ok) {
        console.error("Error retrieving list of roles");
        setLoading(false);
        return;
      }

      const data = await rolesResponse.json();
      setPageCount(Math.ceil(total / limit));
      setRoles(data);
      return data;

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles(limit, currentPage, search, type, colum, sort);
  }, []);


  const refreshRoles = () => {
    getRoles(limit, currentPage, search, type, colum, sort);
  };

  const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1;
    await getRoles(limit, parseInt(currentPage), search, type, colum, sort);
    setCurrentPage(currentPage)
    window.scrollTo(0, 0)
  };



  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setCurrentPage(1);
    setLimit(newValue);
    const commentsFormServer = await getRoles(parseInt(newValue), 1, search, type, colum, sort);
    setRoles(commentsFormServer);
    window.scrollTo(0, 0);
  };


  const [selectedColumns, setSelectedColumns] = useState({
    id_role: true,
    nom_role: true,
    username_user: true,
    date_creation_role: true,
  });

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prevState: any) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };


  const searchColum: { [key: string]: number } = {
    id_role: 0,
    nom_role: 1,
    username_user: 2,
    date_creation_role: 3,
  };


  const handleTypeSearch = (selectedValue: string) => {

    console.log(selectedValue)
    switch (selectedValue) {
      case translate("ID"):
        console.log(0)
        setType(0);
        break;
      case translate("Name"):
        console.log(1)
        setType(1);
        break;

      case translate("User"):
        console.log(2)
        setType(2);
        break;

      case translate("Creation date"):
        console.log(3)
        setType(3);
        break;
      default:
        console.log('Unknown selection');
        console.log(selectedValue)
        break;
    }
    setTypeSearch(selectedValue);
    console.log('Selected value:', selectedValue);
  };

  const handleAdvancedSearch = async (event: any) => {

    const newValue = event.target.value;
    setSearch(newValue)
    await getRoles(limit, currentPage, newValue, type, colum, sort);
  };


  const handleSortingColum = (curentColum: string) => {

    setSortColum(curentColum)
    sort === "ASC" ? setSort("DESC") : setSort("ASC");
    getRoles(limit, currentPage, search, type, colum, sort);
  };


  const handleResetSearch = async () => {
    setSearch("")

    await getRoles(limit, currentPage, search, type, colum, sort)
  };


  const menuItems = [
    translate("ID"),
    translate("Name"),
    translate("User"),
    translate("Creation date"),
  ];

  return (
    <>
      <div>
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <h4>
              <i className="las la-check-circle"></i>
              {" "}{translate("Roles")} <span>{total}</span>
            </h4>
          </div>
          <div className="col-md-6 col-sm-12 text-right">

            <Button
              variant=""
              className="mr-1 btn btn-outline-secondary"
              onClick={handleShowRoleModal}
            >
              <i className="las la-plus mr-3"></i>  {translate("Add role")}
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
                <Dropdown.Toggle variant="link" id="dropdown-basic" >
                  <i
                    className="fas fa-chevron-down"
                    style={{ fontSize: "20" }}
                  ></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {menuItems.map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleTypeSearch(item)}
                      eventKey={item}
                      active={typeSearch === item}
                      className={typeSearch === item ? "select-active" : ""}
                    >
                      {item}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <input type="text" placeholder={` ${translate("Search by")} ${translate(typeSearch)}`} onChange={handleAdvancedSearch} className="form-control" />
              <Button
                variant="secondary"
                onClick={handleResetSearch}
                className="btn-reset"
              >
                <i className="las la-times" style={{ color: "#fff" }}></i>
              </Button>
            </div>
          </div>
          <div className="col-md-8 d-flex justify-content-end align-items-center">
            <div className="dataTables_length" id="DataTables_Table_0_length">
              <label style={{ marginBottom: "0" }}>
                {translate("Show")}
                <select
                  name="DataTables_Table_0_length"
                  aria-controls="DataTables_Table_0"
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
                variant=""
                id="dropdown-basic"
                title={translate("Display columns")}
              >
                <i className="las la-eye"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  as="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedColumns.id_role}
                    onChange={() => handleColumnChange("id_role")}
                  />
                  <span style={{ marginLeft: "10px" }}>
                    {translate("ID")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedColumns.nom_role}
                    onChange={() => handleColumnChange("nom_role")}
                  />
                  <span style={{ marginLeft: "10px" }}>
                    {translate("Name")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedColumns.username_user}
                    onChange={() => handleColumnChange("username_user")}
                  />
                  <span style={{ marginLeft: "10px" }}>
                    {translate("User")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedColumns.date_creation_role}
                    onChange={() => handleColumnChange("date_creation_role")}
                  />
                  <span style={{ marginLeft: "10px" }}>
                    {translate("Creation date")}
                  </span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="row">
          <div className="table-responsive">
            <Table className="dataTable">
              <thead className="bg-white text-uppercase">
                <tr className="ligth ligth-data">
                  <th style={{ width: "5%" }}>
                    <div className="checkbox d-inline-block">
                      <input
                        type="checkbox"
                        className="checkbox-input"
                        id="checkbox1"
                      />
                    </div>
                  </th>
                  {selectedColumns.id_role && (<th className="sorting" onClick={() => handleSortingColum("id_role")}> {translate("Id")}</th>)}
                  {selectedColumns.nom_role && (<th className="sorting" onClick={() => handleSortingColum("nom_role")}> {translate("Name")} </th>)}
                  {selectedColumns.username_user && (<th className="sorting" onClick={() => handleSortingColum("username_user")}> {translate("User")}</th>)}
                  {selectedColumns.date_creation_role && (<th className="sorting" onClick={() => handleSortingColum("date_creation_role")}> {translate("Creation date")}</th>)}
                  <th className="text-center"> {translate("Actions")}</th>
                </tr>
              </thead>
              <tbody className="ligth-body">
                {loading ? (
                  <tr>
                    <td className="text-center" colSpan={7}>
                      <p>
                        <PropagateLoader
                          color={"#123abc"}
                          loading={loading}
                          size={20}
                        /></p>
                    </td>
                  </tr>
                ) : roles.length > 0 ? (
                  roles.map((role) => (
                    <tr key={role.id_role}>
                      <td>
                        <div className="checkbox d-inline-block">
                          <input
                            type="checkbox"
                            className="checkbox-input"
                            id={`checkbox-${role.id_role}`}
                          />
                        </div>
                      </td>
                      {selectedColumns.id_role && <td>{role.id_role}</td>}
                      {selectedColumns.nom_role && <td>{role.nom_role}</td>}
                      {selectedColumns.username_user && <td>{role.username_user}</td>}
                      {selectedColumns.date_creation_role && (<td>{toTimestamp(role.date_creation_role)}</td>)}
                      <td>
                        <Link
                          to={`/role/permission/${id_user}/${role.id_role}`}
                          className="badge bg-success mr-2"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Edit permission"
                        >
                          <i className="las la-check-circle"></i>
                        </Link>

                        <Link
                          className="badge bg-warning mr-2"
                          to="#"
                          onClick={() => {
                            setIdRole(role.id_role);
                            handleShowRoleModal();
                            setIdRole(role.id_role);
                          }}
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Edit roles"
                        >
                          <i className="las la-pen"></i>
                        </Link>
                      </td>
                    </tr>
                  ))

                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No role available
                    </td>
                  </tr>
                )}

              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            {translate("Displaying")} {roles.length} {translate("out of")}{" "}
            {total}
          </span>
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
            forcePage={currentPage - 1}
          />
        </div>
        <RoleModal
          show={showRoleModal}
          onHide={handleCloseRoleModal}
          refreshRoles={refreshRoles}
          idRole={idRole}
        />
      </div>
    </>
  )
}

export default Role