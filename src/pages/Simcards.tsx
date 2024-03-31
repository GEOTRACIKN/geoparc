import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Button,
  Form,
  Col,
  Row,
  InputGroup,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import { PagePermission } from "../utilities/permissions";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface SimcardsItem {
  id_puce: number;
  numero_puce: string;
  operateur_puce: string;
  date_creation_carte_sim: string;
  contrat_puce: string;
  serial_number: string;
  totalpuces: number;
  id_user: string;
}

interface DeletedSimcardsItem {
  id_puce: number;
  numero_puce: string;
  operateur_puce: string;
  date_creation_carte_sim: string;
  contrat_puce: string;
  serial_number: string;
}
// END interface

// FR: Pagination du tableau
let currentPage = 1;

export function Simcards() {
  // Start State
  const { translate } = useTranslate();
  const userID = localStorage.getItem("userID");

  const [simcardsList, setSimcardsList] = useState<SimcardsItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(15);
  const [simcardNum, setSimcardNum] = useState("");
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState("+213");
  const updatePhoneNumberPrefix = (operator: string) => {
    let prefix = "+213";
    switch (operator) {
      case "5":
        prefix += "5";
        break;
      case "7":
        prefix += "7";
        break;
      case "6":
        prefix += "6";
        break;
      default:
        prefix = "+213"; // Par défaut, si l'opérateur n'est pas sélectionné
    }
    setPhoneNumberPrefix(prefix);
  };
  const [imeiNumber, setImeiNumber] = useState("");
  const [contratType, setContratType] = useState("");
  const [simcardType, setSimcardType] = useState("");
  const [simcardOperator, setSimcardOperator] = useState("");
  const [selectedUser, setSelectedUser] = useState("0");
  const [selectedSimcardID, setSelectedSimcardID] = useState<number>(0);

  const [affecteAOptions, setAffecteAOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [showModal, setShowModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [confirmUpdate, setConfirmUpdate] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [titleModal, setTitleModal] = useState("");

  // InTrash
  const [deletedSimcardCount, setDeletedSimcardCount] = useState<number>(0);
  const [deletedSimcards, setDeletedSimcards] = useState<DeletedSimcardsItem[]>(
    []
  );
  const [showDeletedSimcardsModal, setShowDeletedSimcardsModal] =
    useState(false);
  // END InTrash

  // Trie dans le tableux
  const [sortType, setSortType] = useState<
    | "id_puce"
    | "operateur_puce"
    | "numero_puce"
    | "contrat_puce"
    | "serial_number"
    | "date_creation_carte_sim"
  >("id_puce");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  // END State

  // Fonction pour recupure et affiche la data avec le nombre des puces
  const fetchSimcards = async (
    currentPage: number,
    limit: number,
    sortType: string,
    sortDirection: string
  ) => {
    try {
      const [totalData, simcardData] = await Promise.all([
        fetch(`${backendUrl}/api/simcards/total/${userID}`, {
          mode: "cors",
        }).then((res) => res.json()),
        fetch(
          `${backendUrl}/api/simcards/getsimcards/sort/${userID}?page=${currentPage}&limit=${limit}&sortColumn=${sortType}&sortOrder=${sortDirection}`,
          { mode: "cors" }
        ).then((res) => res.json()),
      ]);

      const total = totalData[0].total;
      setTotal(total);

      const calculatedPageCount = Math.ceil(total / limit);
      setPageCount(calculatedPageCount);

      setSimcardsList(simcardData);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshSimcardData = async () => {
    fetchSimcards(currentPage, limit, sortType, sortDirection);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([refreshSimcardData(), fetchDeletedSimcardCount()]);
    };

    fetchData();
  }, [userID, limit, sortType, sortDirection]);

  const handlePageClick = async (data: { selected: number }) => {
    currentPage = data.selected + 1;
    refreshSimcardData();
  };

  const isLuhnValid = (number: string) => {
    const digits = number.toString().split('').map(Number);
    let sum = 0;
    let alternate = false;
  
    for (let i = digits.length - 1; i >= 0; i--) {
      let currentDigit = digits[i];
  
      if (alternate) {
        currentDigit *= 2;
        if (currentDigit > 9) {
          currentDigit -= 9;
        }
      }
  
      sum += currentDigit;
      alternate = !alternate;
    }
  
    return sum % 10 === 0;
  };
  // Function New Simcarde Vehicules
  const handleConfirmSaveModal = async () => {
    if (!isLuhnValid(imeiNumber)) {
      setErrorMessage(translate("Invalid IMEI number."));
      return;
    }

    if (
      !simcardNum ||
      !simcardOperator ||
      !selectedUser ||
      !simcardOperator ||
      !contratType ||
      !imeiNumber
    ) {
      setErrorMessage(translate("Please complete all required fields."));
      return;
    }
    if (selectedUser === "0") {
      // Utilisateur non sélectionné
      setErrorMessage(translate("Please select a user."));
      return;
    }

    let operateur_puce = "";
    if (simcardOperator === "5") {
      operateur_puce = "Ooredoo";
    } else if (simcardOperator === "6") {
      operateur_puce = "Mobilis";
    } else if (simcardOperator === "7") {
      operateur_puce = "Djezzy";
    }

    // Vérifiez si tous les champs requis sont remplis
    try {
      const response = await fetch(`${backendUrl}/api/simcards/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: selectedUser,
          numero_puce: "0" + simcardOperator + simcardNum,
          operateur_puce: operateur_puce,
          type_puce: simcardOperator,
          contrat_puce: contratType,
          serial_number: imeiNumber,
        }),
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Status: ${response.status}`);
      }
      // const data = await response.json();
      alert(`Simcard successfully created`);
      handleCloseModal(); // Fermez le modal après la création réussie
      setSimcardNum("");
      setSimcardOperator("");
      setShowModal(false);
      fetchSimcards(currentPage, limit, sortType, sortDirection);
    } catch (error) {
      console.error("Erreur lors de la création du simcard:", error);
    }
  };

  // Selection option user
  const fetchAffecteAOptions = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/simcards/options/user/${userID}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setAffecteAOptions(
          data.map((user) => ({
            label: `${user.nom_user} ${user.prenom_user}`,
            value: user.id_user,
          }))
        );
      } else {
        console.error("La réponse de l'API n'est pas un tableau :", data);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des options du sélecteur",
        error
      );
    }
  };

  // Start Fonction pour le trie dans le tableau

  const handleSort = async (
    type:
      | "id_puce"
      | "operateur_puce"
      | "numero_puce"
      | "contrat_puce"
      | "serial_number"
      | "date_creation_carte_sim"
  ) => {
    let sortOrder: "asc" | "desc" = "asc";

    if (type === sortType) {
      sortOrder = sortDirection === "asc" ? "desc" : "asc";
    }
    setSortType(type);
    setSortDirection(sortOrder);
  };

  const TableHeader = () => {
    return (
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
            <span
              onClick={() => handleSort("id_puce")}
              style={{ color: "#140A57" }}
            >
              {translate("ID")}
              {sortType === "id_puce" && sortDirection === "asc" && " ▲"}
              {sortType === "id_puce" && sortDirection === "desc" && " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("operateur_puce")}
              style={{ color: "#140A57" }}
            >
              {translate("Operator")}
              {sortType === "operateur_puce" && sortDirection === "asc" && " ▲"}
              {sortType === "operateur_puce" &&
                sortDirection === "desc" &&
                " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("numero_puce")}
              style={{ color: "#140A57" }}
            >
              {translate("Phone")}
              {sortType === "numero_puce" && sortDirection === "asc" && " ▲"}
              {sortType === "numero_puce" && sortDirection === "desc" && " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("contrat_puce")}
              style={{ color: "#140A57" }}
            >
              {translate("Type Of Contract")}
              {sortType === "contrat_puce" && sortDirection === "asc" && " ▲"}
              {sortType === "contrat_puce" && sortDirection === "desc" && " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("serial_number")}
              style={{ color: "#140A57" }}
            >
              {translate("Serial Number")}
              {sortType === "serial_number" && sortDirection === "asc" && " ▲"}
              {sortType === "serial_number" && sortDirection === "desc" && " ▼"}
            </span>
          </th>
          <th style={{ width: "199px", cursor: "pointer" }}>
            <span
              onClick={() => handleSort("date_creation_carte_sim")}
              style={{ color: "#140A57" }}
            >
              {translate("Creation date")}
              {sortType === "date_creation_carte_sim" &&
                sortDirection === "asc" &&
                " ▲"}
              {sortType === "date_creation_carte_sim" &&
                sortDirection === "desc" &&
                " ▼"}
            </span>
          </th>

          <th>{translate("Actions")}</th>
        </tr>
      </thead>
    );
  };
  // END Fonction pour le trie dans le tableau

  // Fonction pour les modal New Simcarde Vehicules
  const handlOpenModalCreate = () => {
    fetchAffecteAOptions();
    setTitleModal(translate("New SIM card"));
    setSimcardOperator("");
    setSelectedUser("");
    setSimcardNum("");
    setShowModal(true);
    setConfirmUpdate(false);
  };

  // Function pour ferme le Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeletedModal(false);
    setErrorMessage("");
  };

  // Fumction Update And Duplicated Open Modal
  const handleUpdateAndDuplicatedClick = (
    simcardId: number,
    update: boolean
  ) => {
    // Get user option
    fetchAffecteAOptions();
    const selectedSimcard = simcardsList.find(
      (item) => item.id_puce === simcardId
    );

    if (selectedSimcard) {
      setSimcardOperator(selectedSimcard.operateur_puce);
      setSelectedUser(selectedSimcard.id_user);
      setSelectedSimcardID(simcardId);

      if (update) {
        setTitleModal(translate("Modifying a Simcard"));
        setSimcardNum(selectedSimcard.numero_puce);
        setShowModal(true);
        setConfirmUpdate(true);
      } else {
        setTitleModal(translate("Duplicate Simcard"));
        setSimcardNum("");
        setShowModal(true);
        setConfirmUpdate(false);
      }
    }
  };

  // Function Update Send Quary
  const handleConfirmUpdate = async () => {
    if (!simcardNum || !simcardOperator || !selectedUser) {
      setErrorMessage(translate("Please complete all required fields."));
      return;
    }
    if (selectedUser === "0") {
      // Utilisateur non sélectionné
      setErrorMessage(translate("Please select a user."));
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/simcards/update-simcard/${selectedSimcardID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numero_puce: simcardNum,
            id_user: selectedUser,
            operateur_puce: simcardOperator,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }
      alert(`Simcard updated successfully`);
      setConfirmUpdate(false);
      refreshSimcardData();
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du simcard :", error);
    }
  };

  // Function Deleted
  const handleDeleteClick = async (userID: string) => {
    setSelectedUser(userID);
    setShowDeletedModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Logique de suppression ici
      const loggedInUserID = localStorage.getItem("userID");

      const response = await fetch(
        `${backendUrl}/api/simcards/softDeletesimcard/${selectedUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ loggedInUserID: loggedInUserID }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la suppression logique. Statut : ${response.status}`
        );
      }
      // Fermez le modal après la suppression
      setShowDeletedModal(false);
      refreshSimcardData();
      fetchDeletedSimcardCount();
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour copier la color au click
  const handleClick = async (color: string) => {
    try {
      // Utiliser l'API Clipboard pour écrire le texte dans le presse-papiers
      await navigator.clipboard.writeText(color);

      // alert(`La couleur ${color} a été copiée avec succès!`);
    } catch (err) {
      console.error("Erreur lors de la copie dans le presse-papiers :", err);
    }
  };

  // fonction trash
  const fetchDeletedSimcardCount = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/simcards/get-deleted-count/user/ ${userID}`,
        { mode: "cors" }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching deleted users count. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setDeletedSimcardCount(data.count);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDeletedSimcards = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/simcards/getDeleted/user/${userID}`,
        { mode: "cors" }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des simcards supprimés. Statut : ${response.status}`
        );
      }
      const data = await response.json();
      setDeletedSimcards(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des simcards supprimés :",
        error
      );
    }
  };

  const handleRestoreDeletedSimcard = async (id_puce: number) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/simcards/restoreDeleted/${id_puce}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la restauration du simcard supprimé. Statut : ${response.status}`
        );
      }
      fetchDeletedSimcards();
      refreshSimcardData();
      fetchDeletedSimcardCount();
    } catch (error) {
      console.error(
        "Erreur lors de la restauration du simcard supprimé :",
        error
      );
    }
  };
  //  fonction pour ouvrir le modal de simcards supprimés
  const handleOpenDeletedSimcardsModal = async () => {
    fetchDeletedSimcards();
    setShowDeletedSimcardsModal(true);
  };

  return (
    <>
      <h4 className="mb-3">
        <i
          className="las la-car mr-2"
          data-rel="bootstrap-tooltip"
          title={translate("Increased")}
        ></i>
        {translate("SIM cards")} ( {total} )
      </h4>
      <div className="text-right" style={{ cursor: "pointer" }}>
        <h4
          className="mb-8 cursor-pointer"
          onClick={handleOpenDeletedSimcardsModal}
        >
          <i className="las la-trash mb-2 mr-2"> </i>
          {translate("Deleted Simcards")} ( {deletedSimcardCount} )
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
                  className="custom-select custom-select-sm form-control form-control-sm"
                  style={{ width: "66px" }}
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                    currentPage = 1;
                  }}
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
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
              <Link
                to="#"
                className="btn btn-primary mt-2 mr-1"
                onClick={handlOpenModalCreate}
              >
                <i className="las la-plus mr-3"></i>
                {translate("New SIM card")}
              </Link>
              <a href="#" className="btn btn-outline-secondary mt-2 mr-1">
                <i className="las la-plus mr-3"></i>
                {translate("Import Simcards")}
              </a>
              <a href="#" className="btn btn-outline-info mt-2">
                <i className="las la-plus mr-3"></i>
                {translate("Download CSV")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="row m-2">
          <Table>
            <TableHeader />
            {Array.isArray(simcardsList) &&
              simcardsList.length !== 0 &&
              simcardsList.map((item) => {
                return (
                  <tbody key={item.id_puce} className="ligth-body">
                    <tr className={`checkbox-${item.id_puce}`}>
                      <td>
                        <div className="checkbox d-inline-block">
                          <input type="checkbox" className="checkbox-input" />
                          <label className="mb-0"></label>
                        </div>
                      </td>
                      <td>{item.id_puce}</td>
                      <td>{item.operateur_puce}</td>
                      <td>{item.numero_puce}</td>
                      <td>{item.contrat_puce}</td>
                      <td>{item.serial_number}</td>
                      <td className="text-center">
                        {new Date(
                          item.date_creation_carte_sim
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        {/* Actions */}
                        <div className="d-flex align-items-center list-action">
                          <a
                            className="badge badge-info mr-2 btn"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Duplicate"
                            data-original-title="Duplicate"
                            onClick={() =>
                              handleUpdateAndDuplicatedClick(
                                item.id_puce,
                                false
                              )
                            }
                          >
                            <i
                              className="las la-copy"
                              style={{ height: "12px", width: "12px" }}
                            ></i>
                          </a>
                          <a
                            className="badge badge-success mr-2 btn"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Update"
                            data-original-title="Update"
                            onClick={() =>
                              handleUpdateAndDuplicatedClick(item.id_puce, true)
                            }
                          >
                            <i className="ri-pencil-line mr-0"></i>
                          </a>
                          <a
                            className="badge bg-warning mr-2 btn"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Delete"
                            data-original-title="Delete"
                            onClick={() =>
                              handleDeleteClick(item.id_puce.toString())
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
          </Table>
        </div>
        {/* Pagination */}
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
      </div>

      {/* Modale de Creation*/}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{titleModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Première ligne */}
            <Row>
              <Col>
                <Form.Group controlId="formSimcardOperator">
                  <Form.Label>{translate("Operator")}</Form.Label>
                  <Form.Select
                    value={simcardOperator}
                    onChange={(e) => {
                      setSimcardOperator(e.target.value);
                      updatePhoneNumberPrefix(e.target.value);
                    }}
                    required
                  >
                    <option value="">{translate("Select an operator")}</option>
                    <option value="5">Ooredoo</option>
                    <option value="6">Mobilis</option>
                    <option value="7">Djezzy</option>{" "}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Champ Téléphone */}
              <Col>
                <Form.Group controlId="formPhoneNumber">
                  <Form.Label>{translate("Phone")}</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="phone-addon">
                      {phoneNumberPrefix}
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Numéro de téléphone"
                      value={simcardNum}
                      onChange={(e) => setSimcardNum(e.target.value)}
                      pattern="[0-9]{8}"
                      title="Veuillez entrer un numéro de téléphone valide de 8 chiffres"
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              {/* Champ Nr. serie (IMEI) */}
            </Row>

            {/* Deuxième ligne */}
            <Row>
              <Col>
                <Form.Group controlId="formImeiNumber">
                  <Form.Label>{translate("IMEI")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Numéro IMEI (15-17 chiffres)"
                    value={imeiNumber}
                    onChange={(e) => setImeiNumber(e.target.value)}
                    pattern="[0-9]{15,17}"
                    title="Veuillez entrer un numéro IMEI valide de 15 à 17 chiffres"
                    required
                  />
                </Form.Group>
              </Col>
              {/* Champ Utilisateur */}
              <Col>
                <Form.Group controlId="formSimcardUser">
                  <Form.Label>{translate("User")}</Form.Label>
                  <Form.Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                  >
                    <option value="0">{translate("Select a user")}</option>
                    {affecteAOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Champ Opérateur */}
            </Row>

            {/* Troisième ligne */}
            <Row>
              {/* Champ Type de SIM */}
              <Col>
                <Form.Group controlId="formSimcardType">
                  <Form.Label>{translate("SIM Type")}</Form.Label>
                  <Form.Select
                    value={simcardType}
                    onChange={(e) => setSimcardType(e.target.value)}
                    required
                  >
                    <option value="">{translate("Select SIM type")}</option>
                    <option value="carteSIM">{translate("SIM Card")}</option>
                    <option value="SIMInterne">
                      {translate("Internal SIM")}
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Champ Contrat */}
              <Col>
                <Form.Group controlId="formContratType">
                  <Form.Label>{translate("Contract Type")}</Form.Label>
                  <Form.Select
                    value={contratType}
                    onChange={(e) => setContratType(e.target.value)}
                    required
                  >
                    <option value="">
                      {translate("Select contract type")}
                    </option>
                    <option value="Prepaye">{translate("Prepaid")}</option>
                    <option value="Abonnement">
                      {translate("Subscription")}
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div className="d-flex flex-column align-items-center m-auto">
            {errorMessage && (
              <div style={{ textAlign: "center", color: "red" }}>
                {errorMessage}
              </div>
            )}
          </div>
          <div className="d-flex">
            <Button
              variant="danger"
              onClick={handleCloseModal}
              className="me-2"
            >
              {translate("Cancel")}
            </Button>
            <Button
              variant="success"
              onClick={
                confirmUpdate ? handleConfirmUpdate : handleConfirmSaveModal
              }
            >
              {translate("Save")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      {/* Modal delete */}
      <Modal show={showDeletedModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{translate("Deletion confirmation")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {translate("Are you sure you want to delete this user?")}
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

      {/* trash */}
      <Modal
        show={showDeletedSimcardsModal}
        onHide={() => setShowDeletedSimcardsModal(false)}
        dialogClassName="modal-lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {translate("Deleted Simcards")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display the list of deleted groups in a table */}
          <table className="table">
            <thead>
              <tr>
                <th style={{ color: "#140A57" }}>{translate("id")}</th>
                <th className="text-center" style={{ color: "#140A57" }}>
                  {translate("Phone")}
                </th>
                <th className="text-center" style={{ color: "#140A57" }}>
                  {translate("Operator")}
                </th>
                <th className="text-right" style={{ color: "#140A57" }}>
                  {translate("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {deletedSimcards.map((simcard) => (
                <tr key={simcard.id_puce}>
                  <td>{simcard.id_puce}</td>
                  <td className="text-center">{simcard.numero_puce}</td>
                  <td className="text-center">{simcard.operateur_puce}</td>
                  <td className="text-center">{simcard.serial_number}</td>

                  <td className="text-right">
                    <Button
                      variant="success"
                      className=""
                      onClick={() =>
                        handleRestoreDeletedSimcard(simcard.id_puce)
                      }
                    >
                      <i className="las la-trash-restore">
                        {" "}
                        {translate("Restore")}
                      </i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => setShowDeletedSimcardsModal(false)}
          >
            {translate("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* END trash */}
    </>
  );
}