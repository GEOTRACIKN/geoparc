import { useState, useEffect } from "react";
import { Button, Dropdown, Table } from "react-bootstrap";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { formatToTimestamp } from "../utilities/functions";
import PropagateLoader from "react-spinners/PropagateLoader";
import { toast, Bounce } from "react-toastify";
import { useTranslate } from "../hooks/LanguageProvider";


interface PermissionProps {
  id_permission: number;
  nom_permission: string;
  date_creation_permission: string;
}

interface PermissionUserProps {
  id_permission: number;
  nom_permission: string;
  date_creation_permission: string;
  can_create: number;
  can_read: number;
  can_update: number;
  can_delete: number;
}

interface SelectedColumns {
  id_permission: boolean;
  nom_permission: boolean;
  date_creation_permission: boolean;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface ColumnItem {
  key: keyof SelectedColumns;
  label: string;
}

export function Permissions() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { id_role } = useParams<{ id_role?: string }>();
  const id_user = localStorage.getItem("GeopUserID");
  const { translate } = useTranslate();
  const navigate = useNavigate();
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState<number>(1);
  const [list_Permission, setPermissions] = useState<PermissionProps[]>([]);

  const [permissionsUser, setPermissionsUser] = useState<PermissionUserProps[]>([]);
  const [selectAll, setSelectAll] = useState<{
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
  }>({
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  });

  const [colum, setSortColum] = useState("id_permission");
  const [sort, setSort] = useState("DESC");
  const [search, setSearch] = useState("");
  const [type, setType] = useState(0);
  const [typeSearch, setTypeSearch] = useState(translate("Permission") + " id");
  const [loading, setLoading] = useState(true);

  const [showCreatePermissionModal, setShowCreatePermissionModal] = useState(false);
  const handleShowCreatePermissionModal = () => setShowCreatePermissionModal(true);
  const handleCloseCreatePermissionModal = () => setShowCreatePermissionModal(false);
  const [id_permission, setIdPermission,] = useState(0);

  const handleCreatePermission = async (id_permission: number, id_user: string) => {
    try {
      console.log(id_permission);
      setIdPermission(id_permission);
    } catch (error) {
      console.error(error);
    }
  };


  const getSelectedPermissionsForUser = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/geop/role/permission/${id_user}/${id_role}`);
      const data = await response.json();
      setPermissionsUser(data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };


  const getPermission = async (
    limit: number,
    page: number,
    search: string,
    type: number,
    colum: string,
    sort: string
  ) => {
    try {
      setLoading(true);

      // Preparing the data to send
      const bodyData = JSON.stringify({
        limit,
        page,
        search,
        type,
        id_user: parseInt(id_user || "0"),
        colum: Columns[colum],
        sort,
      });

      // Retrieve the total number of pages
      const totalPagesResponse = await fetch(
        `${backendUrl}/api/geop/permission/totalpage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyData,
          mode: "cors",
        }
      );

      const totalPagesJson = await totalPagesResponse.json();
      const total = totalPagesJson[0]["count"];
      setTotal(total);

      // Retrieving alarm data
      const PermissionsResponse = await fetch(
        `${backendUrl}/api/geop/permission/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
        mode: "cors",
      });

      const data = await PermissionsResponse.json();
      setPageCount(Math.ceil(total / limit));
      setLimit(limit);
      setPermissions(data);
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const refreshPermissions = () => {
    getPermission(limit, page, search, type, colum, sort);
  };

  const handlePageClick = async (data: any) => {
    let page = data.selected + 1;
    const commentsFormServer = await getPermission(limit, page, search, type, colum, sort);
    setPermissions(commentsFormServer);
    window.scrollTo(0, 0);
  };

  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setPage(1);
    setLimit(newValue);
    const commentsFormServer = await getPermission(
      parseInt(newValue),
      1,
      search,
      type,
      colum,
      sort
    );
    setPermissions(commentsFormServer);
    window.scrollTo(0, 0);
  };

  const handleSortingColum = (currentColumn: string) => {
    setSortColum(currentColumn);
    sort === "ASC" ? setSort("DESC") : setSort("ASC");
    setPage(1)
    getPermission(limit, 1, search, type, colum, sort);
  };


  useEffect(() => {
    getPermission(limit, page, search, type, colum, sort);

    getSelectedPermissionsForUser()
  }, []);

  const [selectedColumns, setSelectedColumns] = useState({
    id_permission: true,
    nom_permission: true,
    date_creation_permission: true,
    create: true,
    read: true,
    update: true,
    delete: true
  });

  const Columns: { [key: string]: number } = {
    "id_permission": 0,
    "nom_permission": 1
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prevState: any) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };

  const handleTypeSearch = (selectedValue: string) => {

    switch (selectedValue) {
      case translate("Permission") + " id":
        setType(0);
        break;
      case translate("Permission name"):
        setType(1);
        break;
      case translate("Date creation"):
        setType(2);
        break;
      default:
        console.log("Unknown selection");
        break;
    }

    setTypeSearch(selectedValue);
    console.log("Selected value:", selectedValue);
  };

  const handleAdvancedSearch = async (event: any) => {
    const newValue = event.target.value;
    setSearch(newValue);
    await getPermission(limit, page, newValue, type, colum, sort);
  };

  const handleResetSearch = async () => {
    setSearch("")

    await getPermission(limit, page, search, type, colum, sort)
  };

  const menuItems = [
    translate("Permission id"),
    translate("Permission name"),
    // translate("Date creation"),
  ];

  const displayColumns: ColumnItem[] = [
    { key: "id_permission", label: translate("Permission") + " id" },
    { key: "nom_permission", label: translate("Permission name") },
    { key: "date_creation_permission", label: translate("date creation") },
  ];

  const handlePermissionRowCheckboxChange = (id: number, select: boolean) => {
    console.log('id_permission :' + id)
    setPermissionsUser((prevPermissions) =>
      prevPermissions.map((item) =>
        item.id_permission === id
          ? {
            ...item,
            can_create: select ? 1 : item.can_create === 0 ? 1 : 0,
            can_read: select ? 1 : item.can_read === 0 ? 1 : 0,
            can_update: select ? 1 : item.can_update === 0 ? 1 : 0,
            can_delete: select ? 1 : item.can_delete === 0 ? 1 : 0,
          }
          : item
      )
    );
  };

  const handleResetChanges = () => {
    setPermissions(permissionsUser);
    setSelectAll({
      can_create: false,
      can_read: false,
      can_update: false,
      can_delete: false,
    });
  };

  const handleCreateDeleteCheckboxChange = (id: number) => {
    setPermissionsUser((prevPermissions) =>
      prevPermissions.map((item) =>
        item.id_permission === id
          ? {
            ...item,
            create: item.can_create === 1 ? 0 : 1,
            read: 1,
            update: item.can_create === 1 ? 0 : 1,
            delete: item.can_create === 1 ? 0 : 1,
          }
          : item
      )
    );
  };

  const handleReadCheckboxChange = (id: number) => {
    setPermissionsUser((prevPermissions) =>
      prevPermissions.map((item) =>
        item.id_permission === id ? { ...item, read: item.can_read === 1 ? 0 : 1 } : item
      )
    );
  };

  const handleUpdateCheckboxChange = (id: number) => {
    setPermissionsUser((prevPermissions) =>
      prevPermissions.map((item) =>
        item.id_permission === id
          ? {
            ...item,
            update: item.can_update === 1 ? 0 : 1,
            read: item.can_update === 1 ? 0 : 1,
          }
          : item
      )
    );
  };

  const handlePermissionCheckboxChange = (
    can_column: "can_create" | "can_read" | "can_update" | "can_delete" | "all"
  ) => {
    if (can_column === "all") {
      // Reverse all permissions for all users
      setPermissionsUser((prevPermissions) =>
        prevPermissions.map((item) => ({
          ...item,
          can_create: item.can_create === 1 ? 0 : 1,  // Reverse can_create
          can_read: item.can_read === 1 ? 0 : 1,      // Reverse can_read
          can_update: item.can_update === 1 ? 0 : 1,  // Reverse can_update
          can_delete: item.can_delete === 1 ? 0 : 1   // Reverse can_delete
        }))
      );
    } else {
      // Reverse a single permission for all users
      setPermissionsUser((prevPermissions) =>
        prevPermissions.map((item) => ({
          ...item,
          [can_column]: item[can_column] === 1 ? 0 : 1,  // Reverse targeted permission
        }))
      );
    }
  };




  const handleUpdateChanges = async () => {
    try {

      const permissionsPayload = {
        id_user,
        id_role,
        permissions: permissionsUser.map(({ id_permission, can_create, can_read, can_update, can_delete }) => ({
          id_permission,
          can_create,
          can_read,
          can_update,
          can_delete,
        })),
      };

      // Send the object in a single request
      const response = await fetch(`${backendUrl}/api/geop/role/permissions/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permissionsPayload),
      });

      // Check if the request is successful
      if (response.ok) {
        console.log("Changes saved successfully");
      } else {
        console.error("Error saving changes:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };


  const handleCreateChanges = async () => {
    try {

      const permissionsPayload = {
        id_user,
        id_role,
        permissions: permissionsUser.map(({ id_permission, can_create, can_read, can_update, can_delete }) => ({
          id_permission,
          can_create,
          can_read,
          can_update,
          can_delete,
        })),
      };

      // Send the object in a single request
      const response = await fetch(`${backendUrl}/api/geop/role/permissions/create`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permissionsPayload),
      });

      // Check if the request is successful
      if (response.ok) {
        console.log("Changes saved successfully");


        toast.success(translate("Permissions update successfully"), {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });


      } else {
        console.error("Error saving changes:", response.statusText);

        toast.warn(translate("Can't update permissions"), {
          position: "bottom-right",
          autoClose: 2400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.warn(translate("Can't update permissions"), {
        position: "bottom-right",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };


  const findPermissionById = (id: number) => {
    return permissionsUser.find(permission => permission.id_permission === id);
  };



  const handleButtonClick = () => {
    navigate("/role");
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i
              className="las la-Permission-alt"
              data-rel="bootstrap-tooltip"
              title="Permission"
            ></i>{" "}
            {translate("Permissions")} ({total})
          </h4>
        </div>
        <div className="col-md-6 col-sm-12 text-right">


          <button onClick={handleButtonClick} className="btn btn-outline-secondary mt-2 mr-1">
            <i className="las la-check-circle"></i>
            {translate('Go to role')}
          </button>

          <button type="button" className="btn btn-outline-primary mt-2 mr-1" onClick={handleCreateChanges}>
            <i className="las la-save mr-3"></i>
            {translate('Save')}
          </button>
          {/* <button type="button" className="btn btn-outline-danger mt-2 mr-1" onClick={handleResetChanges}>
            <i className="la-las la-redo-alt mr-3"></i>
            {translate("Rest")}
          </button> */}

          {/* <Button
            variant="primary"
            className="mt-2 mr-1"
            onClick={handleShowCreatePermissionModal}
          >
            <i className="las la-plus mr-3"></i>{translate("Create Permission")}
          </Button> */}
        </div>
      </div>
      <div className="row">
        <div className="col-md-4" style={{ margin: "0px 0px 10px 0px", padding: "10px" }} >
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
            <Dropdown.Toggle variant="" id="dropdown-basic" title={translate("Display columns")}>
              <i className="las la-list-ol"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {displayColumns.map((column) => (
                <Dropdown.Item
                  key={column.key}
                  as="button"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedColumns[column.key]}
                    onChange={() => handleColumnChange(column.key)}
                  />
                  <span style={{ marginLeft: "10px" }}>
                    {translate(column.label)}
                  </span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="table-responsive">
        <Table className="dataTable">
          <thead className="bg-white text-uppercase">
            <tr className="ligth ligth-data">
              <th>
                <div className="form-check form-check-inline">
                  <input type="checkbox" className="form-check-input"
                    checked={Object.values(selectAll).every((value) => value)}
                    onChange={() => handlePermissionCheckboxChange("all")}
                  />
                </div>
              </th>
              {selectedColumns.id_permission && <th className="sorting">{translate("Permission") + " ID"}</th>}
              {selectedColumns.nom_permission && <th className="sorting">{translate("Permission name")}</th>}
              {selectedColumns.nom_permission && <th className="sorting">{translate("Date creation")}</th>}
              <th>{translate("Actions")}</th>
            </tr>
          </thead>
          <tbody key="#" className="ligth-body">
            {loading ? (
              <tr>
                <td className="text-center" colSpan={11}>
                  <p>
                    <PropagateLoader
                      color={"#123abc"}
                      loading={loading}
                      size={20}
                    /></p>
                </td>
              </tr>
            ) : list_Permission.length > 0 ? (
              list_Permission.map((permission) => (
                <tr key={permission.id_permission}>
                  <td>
                    <div className="form-check form-check-inline">
                      <input type="checkbox" className="form-check-input"
                        checked={findPermissionById(permission.id_permission)?.can_create === 1 || findPermissionById(permission.id_permission)?.can_read === 1 || findPermissionById(permission.id_permission)?.can_update === 1 || findPermissionById(permission.id_permission)?.can_delete === 1}
                        onChange={(e) => handlePermissionRowCheckboxChange(findPermissionById(permission.id_permission)?.id_permission || 0, e.target.checked)}
                      />
                    </div>
                  </td>
                  {selectedColumns.id_permission && <td>{permission.id_permission}</td>}
                  {selectedColumns.nom_permission && <td>{permission.nom_permission}</td>}
                  {selectedColumns.date_creation_permission && <td>{formatToTimestamp(permission.date_creation_permission)}</td>}
                  <td>
                    <div className="form-check form-check-inline">
                      <input
                        type="checkbox" className="form-check-input"
                        checked={findPermissionById(permission.id_permission)?.can_create === 1}
                        onChange={() => handleCreateDeleteCheckboxChange(permission.id_permission)}
                      />

                      <input
                        type="checkbox" className="form-check-input"
                        checked={findPermissionById(permission.id_permission)?.can_read === 1}
                        onChange={() => handleReadCheckboxChange(permission.id_permission)}
                      />

                      <input
                        type="checkbox" className="form-check-input"
                        checked={findPermissionById(permission.id_permission)?.can_update === 1}
                        onChange={() => handleUpdateCheckboxChange(permission.id_permission)}
                      />

                      <input
                        type="checkbox" className="form-check-input"
                        checked={findPermissionById(permission.id_permission)?.can_delete === 1}
                        onChange={() => handleCreateDeleteCheckboxChange(permission.id_permission)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11}>No permission available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center">
          <span>
            {translate("Displaying")} {list_Permission.length} {translate("out")}{" "}
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
          />
        </div>
      </div>
    </>
  );
}
