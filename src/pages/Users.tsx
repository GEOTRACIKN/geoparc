/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import { Table } from "react-bootstrap";
import React, { useEffect, Fragment } from "react";
import ReactPaginate from "react-paginate";
import { useTranslate } from "../components/LanguageProvider";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { PropagateLoader } from "react-spinners"; // Import the loader component
import ".././utilities/responsive.css";
import { Bounce, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExcelJS from "exceljs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

let currentPage = 1;
interface DeletedUser {
  id_user: number;
  name: string;
  // Add other properties if there are more
}

interface User {
  id_user: number;
  nom_user: string;
  prenom_user: string;
  username_user: string;
  email_user: string;
  phone_user: string;
  wilaya: string;
  date_creation_user: string; // Assurez-vous que le type de date_creation_user est correct, il est actuellement déclaré comme string
}

export function Users() {
  const { translate } = useTranslate();
  const [list_user, setListUser] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(15);
  const userID = localStorage.getItem("userID");
  const [loading, setLoading] = useState(true); // Add loading state

  const [showModal, setShowModal] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState<string | null>(null);
  const [showDeletedUsersModal, setShowDeletedUsersModal] = useState(false);
  const [deletedUsers, setDeletedUsers] = useState<DeletedUser[]>([]);
  const [deletedUsersCount, setDeletedUsersCount] = useState<number>(0);
  const [sortType, setSortType] = useState("id_user");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [list, setList] = useState<User[]>([]);

  const navigate = useNavigate(); // Utilisez useNavigate pour la navigation

  const handleSelectChange = async (event: any) => {
    const newValue = event.target.value;
    setLimit(newValue);
    const commentsFormServer = await fetchUser(currentPage, newValue);

    setListUser(commentsFormServer);
  };

  const fetchUserData = async (
    currentPage: number,
    limit: number,
    sortType: string,
    sortDirection: string
  ) => {
    try {
      setLoading(true); // Set loading to true on data fetch start

      const totalRes = await fetch(
        `${backendUrl}/api/user/totalpage/${userID}`,
        { mode: "cors" }
      );
      const totalData = await totalRes.json();
      const total = totalData[0].total;
      setTotal(total);

      const calculatedPageCount = Math.ceil(total / limit);
      setPageCount(calculatedPageCount);

      const res = await fetch(
        `${backendUrl}/api/users/iduser/${userID}?page=${currentPage}&limit=${limit}&sortColumn=${sortType}&sortOrder=${sortDirection}`,
        { mode: "cors" }
      );

      if (!res.ok) {
        throw new Error(
          `Erreur lors de la récupération des utilisateurs. Statut : ${res.status}`
        );
      }

      const data = await res.json();
      setListUser(data);
      setList(data);
    } catch (error) {
      console.error(error);
      // Gérer l'erreur, par exemple, afficher un message à l'utilisateur
    } finally {
      setLoading(false); // Set loading to false on data fetch completion
    }
  };

  useEffect(() => {
    fetchUserData(currentPage, limit, sortType, sortDirection);
  }, [userID, limit, sortType, sortDirection]);

  const fetchUser = async (currentPage: number, limit: any) => {
    const res = await fetch(
      `${backendUrl}/api/users/iduser/${userID}?page=${currentPage}&limit=${limit}&sortColumn=${sortType}&sortOrder=${sortDirection}`,
      { mode: "cors" }
    );
    const data = await res.json();
    return data;
  };

  const handlePageClick = async (data: { selected: number }) => {
    const currentPage = data.selected + 1;

    const commentsFormServer = await fetchUser(currentPage, limit);

    setListUser(commentsFormServer);

    fetchUserData(currentPage, limit, sortType, sortDirection);
  };

  const handleDeleteClick = async (userID: string) => {
    // Affichez le modal de confirmation avant la suppression
    setSelectedUserID(userID);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Fermez le modal
    setShowModal(false);
  };
  const refreshUserData = async () => {
    fetchUserData(currentPage, limit, sortType, sortDirection);
  };

  const handleConfirmDelete = async () => {
    try {
      // Logique de suppression ici
      const loggedInUserID = localStorage.getItem("userID");

      const response = await fetch(
        `${backendUrl}/api/softDeleteUser/${selectedUserID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ loggedInUserID: loggedInUserID }),
        }
      );
      toast.success(translate("User Deleted successfully !"), {
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

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la suppression logique. Statut : ${response.status}`
        );
      }

      const result = await response.json();

      // Fermez le modal après la suppression
      setShowModal(false);
      refreshUserData();
      fetchDeletedUsersCount();
    } catch (error) {
      console.error(error);
      // Gérer l'erreur, par exemple, afficher un message à l'utilisateur
    }

    try {
      const timestamp = new Date(Date.now() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const details = `Delete user: ${selectedUserID}`; // Details for the log

      await fetch(`${backendUrl}/api/log-user-action/${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "Delete",
          page: "Users",
          operation: "supprimer",
          timestamp,
          details,
        }),
      });
    } catch (error) {
      console.error("Error logging user action:", error);
    }
  };

  //get deleted users by ID
  const fetchDeletedUsers = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/deleted-users/${userID}`,
        { mode: "cors" }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching deleted users. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setDeletedUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowDeletedUsersModal = () => {
    fetchDeletedUsers(); // Fetch deleted users when modal is opened
    setShowDeletedUsersModal(true);
  };

  const handleCloseDeletedUsersModal = () => {
    setShowDeletedUsersModal(false);
  };

  const fetchDeletedUsersCount = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/deleted-users-count/${userID}`,
        { mode: "cors" }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching deleted users count. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setDeletedUsersCount(data.count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeletedUsersCount(); // Fetch deleted users count on component mount
  }, [userID]);

  // restor deleted users from the listes
  const handleRestore = async (id_user: number) => {
    try {
      const response = await fetch(`${backendUrl}/api/restoreUser/${id_user}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error restoring the user. Status: ${response.status}`);
      }

      const result = await response.json();

      // Optionally, you can refresh the list of deleted users after restoration
      fetchDeletedUsers();
      fetchDeletedUsersCount();
      refreshUserData();
    } catch (error) {
      console.error(error);
      // Handle the error, e.g., display a message to the user
    }
    toast.success(translate("User Restored successfully !"), {
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
  };

  //sort function for user data by id-user
  const handleSort = async (type: "id_user") => {
    let sortOrder: "asc" | "desc" = "asc";

    if (type === sortType) {
      sortOrder = sortDirection === "asc" ? "desc" : "asc";
    }

    setSortType(type);
    setSortDirection(sortOrder);
  };

  //excel js fnction
  const generateExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Users");

      // Définir les en-têtes avec style
      const headers = [
        { name: "ID", style: { font: { bold: true } } },
        { name: "Nom", style: { font: { bold: true } } },
        { name: "Nom d'utilisateur", style: { font: { bold: true } } },
        { name: "Email", style: { font: { bold: true } } },
        { name: "Téléphone", style: { font: { bold: true } } },
        { name: "Région", style: { font: { bold: true } } },
        { name: "Date d'inscription", style: { font: { bold: true } } },
      ];

      // Ajouter les en-têtes à la feuille Excel avec les styles
      const headerRow = worksheet.addRow(headers.map((header) => header.name));
      headerRow.eachCell((cell, index) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "DDDDDD" }, // Couleur grise
        };
        cell.font = headers[index - 1].style.font; // Appliquer le style de police pour chaque en-tête
      });

      // Ajoutez les données des utilisateurs
      list.forEach((user) => {
        worksheet.addRow([
          user.id_user,
          `${user.nom_user} ${user.prenom_user}`,
          user.username_user,
          user.email_user,
          user.phone_user,
          user.wilaya,
          new Date(user.date_creation_user).toLocaleDateString(),
        ]);
      });

      // Ajuster automatiquement la largeur des colonnes pour adapter le contenu
      worksheet.columns.forEach((column) => {
        column.width = Math.max(column.width ?? 0, 25); // Définir une largeur minimale de 100 pour chaque colonne
      });
      // Générer le fichier Excel
      const buffer = await workbook.xlsx.writeBuffer();

      const currentDate = new Date();
      const dateString = currentDate.toISOString().split("T")[0]; // Get the date part of the ISO string
      const timeString = currentDate
        .toTimeString()
        .split(" ")[0]
        .replace(/:/g, "-"); // Get the time part of the ISO string and replace colons with dashes
      const fileName = `Liste_users_${dateString}_${timeString}.xlsx`;

      // Télécharger le fichier Excel
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors de la génération du fichier Excel :", error);
    }
  };

  const handleUserSelection = async (id: number, username: string) => {
    try {
      // Fetch permissions for the user
      const permissionsResponse = await axios.get(
        `${backendUrl}/api/permission/all/${id}`
      );

      // Stockez les nouvelles permissions dans le stockage local
      localStorage.setItem(
        "userPermissions",
        JSON.stringify(permissionsResponse.data)
      );

     

      // Stockez les informations dans le stockage local
    
      localStorage.setItem("userID", id.toString()); // Convertissez id en chaîne avant de le stocker
      localStorage.setItem("username", username);

      // Redirigez l'utilisateur vers le tableau de bord ("/")
      navigate("/"); // Redirigez vers le chemin du tableau de bord
    } catch (error) {
      console.error("Erreur lors de la récupération des permissions :", error);
      // Gérer l'erreur, par exemple afficher un message à l'utilisateur
    }
  };

  return (
    <>
      <h4 className="mb-3">
        <i
          className="las la-user"
          data-rel="bootstrap-tooltip"
          title="Users"
        ></i>
        {translate("Users")} ( {total} )
      </h4>
      <div
        className="text-right"
        onClick={handleShowDeletedUsersModal}
        style={{ cursor: "pointer" }}
      >
        <h4 className="mb-8 cursor-pointer">
          <i className="las la-trash mb-2 mr-2"></i>
          {translate("Deleted Users")} ({deletedUsersCount})
        </h4>
      </div>

      <div
        id="DataTables_Table_0_wrapper"
        className="dataTables_wrapper dt-bootstrap4 no-footer"
      >
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_length" id="DataTables_Table_0_length">
              <label>
                {translate("Show")}
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
                {translate("entries")}
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div
              id="DataTables_Table_0_filter"
              className="dataTables_filter mr-3"
            >
              <Link to="/User" className="btn btn-primary mt-2 mr-1">
                <i className="las la-plus mr-3"></i>
                {translate("New Users")}
              </Link>
              <a className="btn btn-outline-info mt-2" onClick={generateExcel}>
                <i className="las la-plus mr-3"></i>
                {translate("Download CSV")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div></div>

      <div>
        <div className="row m-2">
          <Table responsive>
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
                <th style={{ width: "199px", cursor: "pointer" }}>
                  <span onClick={() => handleSort("id_user")}>
                    {translate("Id")}
                    {sortType === "id_user" && sortDirection === "asc" && " ▲"}
                    {sortType === "id_user" && sortDirection === "desc" && " ▼"}
                  </span>
                </th>
                <th>{translate("name")}</th>
                <th>{translate("User name")}</th>
                <th>{translate("Email")}</th>
                <th>{translate("Phone")}</th>
                <th>{translate("region")}</th>
                <th>{translate("Registration date")}</th>
                <th>{translate("Actions")}</th>
              </tr>
            </thead>
            {loading ? (
              <tr>
                <td colSpan={12}>
                  <div className="text-center">
                    <PropagateLoader
                      color={"#123abc"}
                      loading={loading}
                      size={20}
                    />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {Array.isArray(list_user) &&
                  list_user.length !== 0 &&
                  list_user.map((item) => {
                    return (
                      <tbody key={item["id_user"]} className="ligth-body">
                        <tr className={item["id_user"]}>
                          <td>
                            <div className="checkbox d-inline-block">
                              <input
                                type="checkbox"
                                className="checkbox-input"
                                id="checkbox2"
                              />
                              <label
                                htmlFor="checkbox2"
                                className="mb-0"
                              ></label>
                            </div>
                          </td>

                          <td> {item["id_user"]}</td>
                          <td>
                            {item["nom_user"]} {item["prenom_user"]}
                          </td>
                          <td>{item["username_user"]}</td>

                          <td id="5">{item["email_user"]}</td>
                          <td>{item["phone_user"]}</td>

                          <td>{item["wilaya"]}</td>
                          <td>
                            {" "}
                            {new Date(
                              item["date_creation_user"]
                            ).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="d-flex align-items-center list-action">
                              {userID === "1" && ( // Assuming "1" is the superadmin ID
                                <Fragment>
                                  <a
                                    className="badge bg-blue mr-2"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="GO"
                                    data-original-title="GO"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleUserSelection(
                                        item["id_user"],
                                        item["username_user"]
                                      )
                                    }
                                  >
                                    <i className="las la-caret-square-right"></i>
                                  </a>
                                </Fragment>
                              )}
                              <Link
                                to={`/User/${item["id_user"]}`}
                                className="badge badge-success mr-2"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Modifier"
                                style={{ cursor: "pointer" }}
                              >
                                <i className="ri-pencil-line mr-0"></i>
                              </Link>
                              <a
                                className="badge bg-warning mr-2"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Delete"
                                data-original-title="Delete"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleDeleteClick(item["id_user"])
                                }
                              >
                                <i className="ri-delete-bin-line mr-0"></i>
                              </a>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
              </>
            )}
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

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title>{translate("Confirmation of deletion.")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {translate("Do you really want to delete this user?")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {translate("Cancel")}
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            {translate("Delete")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeletedUsersModal}
        onHide={handleCloseDeletedUsersModal}
        dialogClassName="modal-lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {translate("Deleted Users")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display the list of deleted users in a table */}
          <table className="table">
            <thead>
              <tr>
                <th>{translate("ID")}</th>
                <th>{translate("Username")}</th>
                <th className="text-right">{translate("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {deletedUsers.map((user) => (
                <tr key={user.id_user}>
                  <td>{user.id_user}</td>
                  <td>{user.name}</td>
                  <td className="text-right">
                    {/* Buttons for restore and permanent deletion */}
                    <Button
                      variant="success"
                      className="mr-2"
                      onClick={() => handleRestore(user.id_user)}
                    >
                      <i className="las la-trash-restore"> Restore</i>
                    </Button>
                    {/* {userID === "1" && ( // Assuming "1" is the superadmin ID
                      <Button variant="danger">
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeletedUsersModal}>
            {translate("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
