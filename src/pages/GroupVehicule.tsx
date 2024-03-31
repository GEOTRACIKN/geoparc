import  { useState, useEffect, useLayoutEffect } from "react";
import { Table, Modal, Button, Form, Col, Row } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import { PropagateLoader } from 'react-spinners'
import ExcelJS from "exceljs";


const backendUrl = process.env.REACT_APP_BACKEND_URL;


interface GroupeVehiclesItem {
  id_groupe: number;
  nom_groupe: string;
  color_groupe: string;
  date_creation_groupe: string;
  totalVehicles: number;
  id_user: string;
}

interface DeletedGroupeVehiclesItem {
  id_groupe: number;
  nom_groupe: string;
  color_groupe: string;
}

let currentPage = 1;

export function GroupeVehicles() {
  // Start State
  const { translate } = useTranslate();
  const userID = localStorage.getItem("userID");
  const [groupeVehiclesList, setGroupeVehiclesList] = useState<GroupeVehiclesItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(15);
  const [loading, setLoading] = useState(true); // Add loading state
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState("");
  const [selectedUser, setSelectedUser] = useState("0");
  const [selectedGroupID, setSelectedGroupID] = useState<number>(0);
  const [affecteAOptions, setAffecteAOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [searchValue, setSearchValue] = useState<null | string>(null);
  const [searchColumn, setSearchColumn] = useState('nom_groupe')
  const [errorMessage, setErrorMessage] = useState("");
  const [titleModal, setTitleModal] = useState("");
  // InTrash
  const [deletedGroupCount, setDeletedGroupCount] = useState<number>(0);
  const [deletedGroups, setDeletedGroups] = useState<
    DeletedGroupeVehiclesItem[]
  >([]);
  const [showDeletedGroupsModal, setShowDeletedGroupsModal] = useState(false);
  // Trie dans le tableux
  const [sortType, setSortType] = useState<"id_groupe" | "date_creation_groupe" | 'nom_groupe' | 'totalVehicles'>("id_groupe");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState(false); // État pour suivre si toutes les lignes sont sélectionnées


  // Fonction pour gérer le changement de la case à cocher pour sélectionner toutes les lignes
  const handleSelectAllCheckboxChange = (isChecked: boolean) => {
    setSelectAllChecked(isChecked); // Mettre à jour l'état de la case à cocher pour sélectionner toutes les lignes
    const newSelectedRows = new Set<number>(); // Initialiser un nouvel ensemble de lignes sélectionnées

    if (isChecked) {
      // Si la case à cocher est cochée, sélectionner toutes les lignes
      groupeVehiclesList.forEach((item, index) => {
        newSelectedRows.add(index); // Ajouter l'index de la ligne à l'ensemble des lignes sélectionnées
      });
    } else {
      // Si la case à cocher est décochée, désélectionner toutes les lignes
      setSelectedRows(newSelectedRows); // Mettre à jour les lignes sélectionnées pour les vider
      return; // Sortir de la fonction car aucune autre action n'est nécessaire
    }

    setSelectedRows(newSelectedRows); // Mettre à jour les lignes sélectionnées
  };

  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (isChecked) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    setSelectedRows(newSelectedRows);
  };

 

  async function exportToExcel() {
    // Convertir le Set en tableau en utilisant Array.from()
    const selectedIndexes = Array.from(selectedRows);
    
      // Utiliser map() sur le tableau pour obtenir les ids des groupes
    const selectedGroupIds = selectedIndexes.map(index => groupeVehiclesList[index].id_groupe);
    let data:any = []
      try {
        const response = await fetch(
          `${backendUrl}/api/groups-vehicule/id`,
          {method: "POST",
          headers: {  "Content-Type": "application/json"},
          body: JSON.stringify({"id_groupes":selectedGroupIds})
        }
        );
        if (!response.ok) {
          throw new Error(
            `Error fetching deleted users count. Status: ${response.status}`
            )
          }
         data = await response.json();
        }  catch (error) {
          console.error(error);
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Groups Vehicules");
        
        // Define headers with style
        const headers = [
          { name: "Groups Name", style: { font: { bold: true } } },
          { name: "Color", style: { font: { bold: true } } },
          { name: "Nombre of Vehicules", style: { font: { bold: true } } },
          { name: "Date Of Creation", style: { font: { bold: true } } },
        ];
    
        worksheet.addRow(headers.map((header) => header.name));
        worksheet.getRow(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "DDDDDD" }, // Gray color
        };
      for (let i = 0; i < data.length; i++) {
        worksheet.addRow([
        data[i].nom_groupe,
        data[i].color_groupe,
        new Date(data[i].date_creation_groupe),
        data[i].totalVehicles,])
      }
       // Auto adjust column widths to fit the content
    worksheet.columns.forEach((column) => {
      column.width = Math.max(column.width ?? 0, 20); // Use 0 as the default width if column.width is undefined
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split("T")[0]; // Get the date part of the ISO string
    const timeString = currentDate
      .toTimeString()
      .split(" ")[0]
      .replace(/:/g, "-"); // Get the time part of the ISO string and replace colons with dashes
    const fileName = `groups_vehicules_Repport_${dateString}_${timeString}.xlsx`;

    // Create download link and click it to trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

  }
  


  // Fonction pour recupure et affiche la data avec le numbre Vehicule et groupe vehicule
  const fetchGroupeVehiclesData = async (currentPage: number, limit: number,sortType:string,sortDirection:string, searchColumn: string,
    searchValue?:null | string) => {
    try {
       setLoading(true); 
    
      const [totalData, groupData] = await Promise.all([
        fetch(`${backendUrl}/api/groups-vehicule/total/${userID}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            searchValue: searchValue,
            searchColumn: searchColumn
          })
        }).then((res)=> res.json()),
        fetch(`${backendUrl}/api/groups-vehicule/group-and-number-vehicule/sort/${userID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            page: currentPage,
            limit: limit,
            sortColumn: sortType,
            sortOrder: sortDirection,
            searchValue: searchValue,
            searchColumn: searchColumn
          })
        }).then((res) => res.json())
      ]);

      const total = totalData[0].total;
      setTotal(total);

      const calculatedPageCount = Math.ceil(total / limit);
      setPageCount(calculatedPageCount);

      setGroupeVehiclesList(groupData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false on data fetch completion
    }
  };
  
  const refreshGroupData = async () => {
    fetchGroupeVehiclesData(currentPage, limit,sortType,sortDirection, searchColumn, searchValue);
  };
  
  useLayoutEffect(() => {
    const fetchData = async () => {
      await Promise.all([refreshGroupData(), fetchDeletedGroupCount()]);
    };
    fetchData();
  }, [userID, limit, sortType, sortDirection, searchColumn, searchValue]);

  const handlePageClick = async (data: { selected: number }) => {
    currentPage = data.selected + 1;   
    refreshGroupData();
  };

  // Function New Groupe Vehicules
  const handleConfirmSaveModal = async () => {
    
    if (!groupName || !groupColor || !selectedUser) {
      setErrorMessage(translate("Please complete all required fields."));
      return;
    }
    if (selectedUser === "0") {
      // Utilisateur non sélectionné
      setErrorMessage(translate("Please select a user."));
      return;
    }

    // Vérifiez si tous les champs requis sont remplis
    try {
      const response = await fetch(`${backendUrl}/api/groups-vehicule/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: selectedUser,
          nom_groupe: groupName,
          color_groupe: groupColor,
        }),
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Status: ${response.status}`);
      }
      // const data = await response.json();
      alert(`Group successfully created`);
      handleCloseModal(); // Fermez le modal après la création réussie
      setGroupName("");
      setGroupColor("");
      setShowModal(false);
      fetchGroupeVehiclesData(currentPage, limit,sortType,sortDirection, searchColumn, searchValue);
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
    }
  };

  // Selection option user
    const fetchAffecteAOptions = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/groups-vehicule/options/user/${userID}`);
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
    const handleSort = async (type: "id_groupe" | "date_creation_groupe" | 'nom_groupe' | 'totalVehicles') => {
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
                    checked={selectAllChecked} // Vérifie si toutes les lignes sont sélectionnées
                    onChange={(event) =>
                      handleSelectAllCheckboxChange(event.target.checked)
                    } // Gère le changement de la case à cocher pour sélectionner toutes les lignes
                  />
          </div>
        </th>
        <th style={{ width: "199px", cursor: "pointer" }} >
          <span onClick={() => handleSort('id_groupe')} style={{color:'#140A57'}}>
            {translate("Id")}
            {sortType === 'id_groupe' && sortDirection === 'asc' && ' ▲'}
            {sortType === 'id_groupe' && sortDirection === 'desc' && ' ▼'}
          </span>
        </th>
 
        <th style={{ width: "199px", cursor: "pointer" }} >
          <span onClick={() => handleSort('nom_groupe')} style={{color:'#140A57'}}>
          {translate("Groups Name")}
            {sortType === 'nom_groupe' && sortDirection === 'asc' && ' ▲'}
            {sortType === 'nom_groupe' && sortDirection === 'desc' && ' ▼'}
          </span>
        </th>
        <th className="text-center">{translate("Color")}</th>
        <th className="text-center"  style={{ cursor: "pointer" }}>
          <span onClick={() => handleSort('totalVehicles')} style={{color:'#140A57'}}>
            {translate("Number Of Vehicles")}
            {sortType === 'totalVehicles' && sortDirection === 'asc' && ' ▲'}
            {sortType === 'totalVehicles' && sortDirection === 'desc' && ' ▼'}
            </span>
        </th>
        <th className="text-center" style={{ cursor: "pointer" }}>
          <span onClick={() => handleSort('date_creation_groupe')} style={{color:'#140A57'}}>
            {translate("Date Of Creation")}
            {sortType === 'date_creation_groupe' && sortDirection === 'asc' && ' ▲'}
            {sortType === 'date_creation_groupe' && sortDirection === 'desc' && ' ▼'}
          </span>
        </th>
        <th>{translate("Actions")}</th>
      </tr>
    </thead>
    );
  };
  // END Fonction pour le trie dans le tableau

  // Fonction pour le modal New Groupe Vehicules
  const handlOpenModalCreate = () => {
    fetchAffecteAOptions();
    setTitleModal(translate("New Groupe Vehicule"));
    setGroupColor("");
    setSelectedUser("");
    setGroupName("");
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
  const handleUpdateAndDuplicatedClick = (groupId: number, update: boolean) => {
    // Get user option
    fetchAffecteAOptions();
    const selectedGroup = groupeVehiclesList.find(
      (item) => item.id_groupe === groupId
    );

    if (selectedGroup) {
      setGroupColor(selectedGroup.color_groupe);
      setSelectedUser(selectedGroup.id_user);
      setSelectedGroupID(groupId);

      if (update) {
        setTitleModal(translate("Modifying a Vehicle Group"));
        setGroupName(selectedGroup.nom_groupe);
        setShowModal(true);
        setConfirmUpdate(true);
      } else {
        setTitleModal(translate("Duplicate Group"));
        setGroupName(selectedGroup.nom_groupe + " 001");
        setShowModal(true);
        setConfirmUpdate(false);
      }
    }
  };

  // Function Update Send Quary
  const handleConfirmUpdate = async () => {
    if (!groupName || !groupColor || !selectedUser) {
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
        `${backendUrl}/api/groups-vehicule/update-group/${selectedGroupID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom_groupe: groupName,
            id_user: selectedUser,
            color_groupe: groupColor,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }
      alert(`Group updated successfully`);
      setConfirmUpdate(false);
      refreshGroupData();
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du groupe :", error);
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
        `${backendUrl}/api/groups-vehicule/softDeletegroupe/${selectedUser}`,
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
      refreshGroupData();
      fetchDeletedGroupCount();
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
  const fetchDeletedGroupCount = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/groups-vehicule/get-deleted-count/user/${userID}`,
        { mode: "cors" }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching deleted users count. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setDeletedGroupCount(data.count);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDeletedGroups = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/groups-vehicule/getDeleted/user/${userID}`,
        { mode: "cors" }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des groupes supprimés. Statut : ${response.status}`
        );
      }
      const data = await response.json();
      setDeletedGroups(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des groupes supprimés :",
        error
      );
    }
  };

  const handleRestoreDeletedGroup = async (id_groupe: number) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/groups-vehicule/restoreDeleted/${id_groupe}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la restauration du groupe supprimé. Statut : ${response.status}`
        );
      }
      fetchDeletedGroups();
      refreshGroupData();
      fetchDeletedGroupCount();
    } catch (error) {
      console.error(
        "Erreur lors de la restauration du groupe supprimé :",
        error
      );
    }
  };

  //  fonction pour ouvrir le modal de groupes supprimés
  const handleOpenDeletedGroupsModal = async () => {
    try {
      await fetchDeletedGroups(); 
      setShowDeletedGroupsModal(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes supprimés :', error);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
        <h4 className="mb-3">
          <i
            className="las la-car mr-2"
            data-rel="bootstrap-tooltip"
            title={translate("Increased")}
          ></i>
          {translate("Groupe Vehicles")} ( {total} )
        </h4>
          <div id="DataTables_Table_0_filter"  className="dataTables_filter" >
            <Link
              to="#"
              className="btn btn-primary mt-2 mr-1"
              onClick={handlOpenModalCreate}
            >
              <i className="las la-plus mr-3"></i>
              {translate("New Groupe Vehicles")}
            </Link>
            <a href="#" className="btn btn-outline-secondary mt-2 mr-1">
              <i className="las la-plus mr-3"></i>
              {translate("Import Groupe Vehicles")}
            </a>
            <button className="btn btn-outline-info mt-2" onClick={exportToExcel}>
              <i className="las la-plus"></i>
              {translate("Download Excel")}
            </button>
          </div>
      </div>
      <div
        id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
        <div className="row">
            <div className="col-sm-12 col-md-5 dataTables_length" id="DataTables_Table_0_length">
            <Form className="d-flex mb-3">
            <Form.Control
                type="search"
                placeholder={`${translate('Search by')} ${translate('Groups Name')}`}  
                className="me-2 " 
                aria-label={`${translate('Search by')} ${translate('Groups Name')}`}     
                onChange={(e) => setSearchValue(e.target.value)} 
              /> 
            </Form>
          </div>
          <div className="col-sm-12 col-md-7 ">
            <div className="text-right" style={{ cursor: "pointer" }}>
            <Button
            className="btn btn-secondary mt-2 mr-1"
            onClick={handleOpenDeletedGroupsModal}
          >
            <i className="las la-trash-alt" data-rel="bootstrap-tooltip" title="Increased"></i> {translate("Deleted Groups")} ( {deletedGroupCount} )
          </Button>
            </div>
              <div className="text-right mt-2">
                <label>
                  {translate("Show")}
                  <select
                    name="DataTables_Table_0_length"
                    aria-controls="DataTables_Table_0"
                    className="custom-select custom-select-sm form-control form-control-sm"
                    style={{ width: "66px" }}
                    value={limit}
                    onChange={(e) => {setLimit(parseInt(e.target.value));currentPage=1}}
                  >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                  </select>
                  {translate("entries")}
                </label>
              </div>
          </div>

        </div>
      </div>
      <div>
      <div className="row m-2">
          <Table>
            <TableHeader />
              <tbody className="ligth-body">
                {loading ? (
                <tr>
                <td colSpan={6}>
                  <div style={{ margin: 'auto',padding:'10px' }}>
                    <PropagateLoader color={'#123abc'} loading={loading} size={20} />
                  </div>
                </td>
              </tr>
                ) : (
              Array.isArray(groupeVehiclesList) &&
              groupeVehiclesList.length !== 0 &&
              groupeVehiclesList.map((item,index) => (
              <tr key={index} data-id={`row_${index}`}>
                <td>
                    <input
                    type="checkbox"
                    className="checkbox-input"
                    id={`checkbox-${item.id_groupe}`}
                    checked={selectedRows.has(index)} // Vérifie si la ligne est sélectionnée
                    onChange={(event) => handleCheckboxChange(index, event.target.checked)
                    } // Gère le changement de la case à cocher
                    />
                </td>
                <td>{item.id_groupe}</td>
                <td>{item.nom_groupe}</td>
                <td className="text-center">
                  <span
                    className="badge p-1 fs-6 btn"
                    style={{
                      backgroundColor: item.color_groupe,
                      color: "white",
                    }}
                    onClick={() => handleClick(item.color_groupe)}
                  >
                    {item.color_groupe}
                  </span>
                </td>
                <td className="text-center">{item.totalVehicles}</td>
                <td className="text-center">
                  {new Date(item.date_creation_groupe).toLocaleDateString()}
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
                        item.id_groupe,
                        false
                      )
                    }
                  >
                    <i className="las la-copy" style={{height:'12px',width:'12px'}}></i>
                  </a>
                  <a
                    className="badge badge-success mr-2 btn"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Update"
                    data-original-title="Update"
                    onClick={() =>
                      handleUpdateAndDuplicatedClick(
                        item.id_groupe,
                        true
                      )
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
                      handleDeleteClick(item.id_groupe.toString())
                    }
                  >
                    <i className="ri-delete-bin-line mr-0"></i>
                  </a>
                </div>
              </td>
            </tr>
          ))
        )}
        </tbody>
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
            <Row>
              <Col>
                  <Form.Label>{translate("Name of the group")}</Form.Label>
                <Form.Group controlId="formGroupName" style={{display:'flex'}}>
                  <Form.Control
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                  />
                    <div className="input-group-prepend">
                    <span className="input-group-text" style={{backgroundColor:'white'}}>
                      <i className="las la-car"></i>
                    </span>
                  </div>
                  <div className="help-block with-errors"></div>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formGroupColor">
                  <Form.Label>{translate("Color")}</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="color"
                      value={groupColor}
                      onChange={(e) => setGroupColor(e.target.value)}
                      required
                      style={{
                        width: "80px",
                      }}
                    />
                    <Form.Control
                      type="text"
                      value={groupColor}
                      onChange={(e) => setGroupColor(e.target.value)}
                      style={{
                        marginLeft: "10px",
                        width: "120px",
                        fontSize: "18px", 
                      }}
                      pattern="#[0-9a-fA-F]{6}"
                      title="Please enter a valid hexadecimal color code (e.g. #00ff00)"
                      required
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col>              
                <Form.Label>{translate("User")}</Form.Label>
                <Form.Group controlId="formGroupUser" style={{display:'flex'}}>
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
                    <div className="input-group-prepend">
                      <span className="input-group-text" style={{backgroundColor:'white'}}>
                        <i className="las la-user"></i>
                      </span>
                    </div>
                    <div className="help-block with-errors"></div>
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
          <Modal.Title>{translate("Delete confirmation")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {translate("Are you sure you want to delete this user?")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {translate("Cancel")}
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            {translate("DELETE")}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* trash */}
      <Modal
        show={showDeletedGroupsModal}
        onHide={() => setShowDeletedGroupsModal(false)}
        dialogClassName="modal-lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {translate("Deleted Groups")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display the list of deleted groups in a table */}
          <table className="table">
            <thead>
              <tr>
                <th style={{color:'#140A57'}}>{translate("id")}</th>
                <th className="text-center" style={{color:'#140A57'}}>{translate("Groups Name")}</th>
                <th className="text-center" style={{color:'#140A57'}}>{translate("Color")}</th>
                <th className="text-right" style={{color:'#140A57'}}>{translate("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {deletedGroups.map((group) => (
                <tr key={group.id_groupe}>
                  <td>{group.id_groupe}</td>
                  <td className="text-center">{group.nom_groupe}</td>
                  <td className="text-center">
                    <span
                      className="badge p-1 fs-6 btn"
                      style={{
                        backgroundColor: group.color_groupe,
                        color: "white"
                      }}
                      onClick={() => handleClick(group.color_groupe)}
                    >
                      {group.color_groupe}
                    </span>
                  </td>
                  <td className="text-right">
                    <Button
                      variant="success"
                      className=""
                      onClick={() => handleRestoreDeletedGroup(group.id_groupe)}>
                      <i className="las la-trash-restore">  {translate('Restore')}</i>
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
            onClick={() => setShowDeletedGroupsModal(false)}
          >
            {translate("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* END trash */}
    </>
  );
}