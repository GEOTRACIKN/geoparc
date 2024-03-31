import { useEffect, useState } from "react";
import { Form,Button, Modal, Table, Dropdown } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link   } from "react-router-dom";
import { useTranslate } from "../components/LanguageProvider";
import { Bounce, toast } from 'react-toastify';
import ExcelJS from "exceljs";



type Driver = {
  id_conducteur: string;
  code_conducteur: string;
  nom_conducteur: string;
  prenom_conducteur: string;
  telephone_conducteur: string;
  premis_conducteur: string;
  nom_user: string;
  prenom_user: string;
  tag: string | null;
  id_tag: string | null;
};

interface DeletedDriversItem {
  id_conducteur: string;
  nom_conducteur: string;
  prenom_conducteur: string;
  telephone_conducteur: string;
}


export function Drivers() {

  const { translate } = useTranslate();
  const [list_driver, setItems] = useState<Driver[]>([]);
  const [pageCount, setpageCount] = useState(0);
  const [showModal, setModalIsOpen] = useState(false); 
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [limit,setLimit] = useState(15);
  const userID = localStorage.getItem("userID");
  let currentPage = 1;
  const [selectedDriverID, setSelectedDriverID] = useState<string | null>(null);
  const [deletedDriverCount, setdeletedDriverCount] = useState<number>(0);
  const [selectAll, setSelectAll] = useState(false); 
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [isDriverSelected, setIsDriverSelected] = useState(false);

 
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  //Start Intrash
  const [deletedDrivers, setDeletedDrivers] = useState<DeletedDriversItem[]>(
    []
  );
  const [showModalDriversDeleted, setShowModalDriversDeleted] = useState(false);
 //End Intrash



  const getDrivers = async (currentPage: number, limit: number) => {

    const total_pages = await fetch(
      `${backendUrl}/api/driver/totalpage/${userID}?searchTerm=${searchTerm}&searchType=${searchType}`,
      {mode:'cors'}
    ); 

    const totalpages = await total_pages.json();
    const total = totalpages[0].count; // Modifier ici pour accéder à count au lieu de total
    setTotal(total);

    const calculatedPageCount = Math.ceil(total / limit);
    setpageCount(calculatedPageCount);

    const res = await fetch(
      `${backendUrl}/api/driver/${userID}?page=${currentPage}&limit=${limit}&searchTerm=${searchTerm}&searchType=${searchType}`,

      {mode:'cors'}
    ); 
     
    const data = await res.json();
    setItems(data);

  };

  useEffect(() => {
    getDrivers(currentPage, limit);
  }, [userID,limit,searchTerm, searchType]);



const fetchDriver = async (currentPage:number,limit :number ) => {
  const res = await fetch(
    `${backendUrl}/api/driver/${userID}?page=${currentPage}&limit=${limit}`,
    
    {mode:'cors'}
  );
  const data = await res.json();
  return data;
};

const refreshUserData = async () => {
  getDrivers(currentPage, limit);
};

const fetchDeletedDrivers = async () => {
  try {
    const response = await fetch(
      `${backendUrl}/api/drivers/getDeleted/${userID}`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des conducteurs supprimés. Statut : ${response.status}`
      );
    }
    const data = await response.json();
    setDeletedDrivers(data);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des conducteurs supprimés :",
      error
    );
  }
};

const handleRestoreDeletedDriver = async (id_conducteur: string) => {
  try {
    const response = await fetch(
      `${backendUrl}/api/drivers/restoreDeleted/${id_conducteur}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la restauration du conducteurs supprimé. Statut : ${response.status}`
      );
    }
    if (response.ok) {
       
      toast.success("Driver Restore successfully !", {
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
      refreshUserData();
    }
    fetchDeletedDrivers();
    fetchDeletedDriverCount();
  } catch (error) {
    console.error(
      "Erreur lors de la restauration du conducteurs supprimé :",
      error
    );
  }
};


  const handlePageClick = async (data: any) => {
    let currentPage = data.selected + 1;
    const commentsFormServer = await fetchDriver(currentPage,limit);

    setItems(commentsFormServer );
   window.scrollTo(0,0)
  };
  
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };


  const handleDeleteClick = async (driverID: string) => {
    // Affichez le modal de confirmation avant la suppression
    setSelectedDriverID(driverID);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      const loggedInUserID = localStorage.getItem("userID");

      const response = await fetch(`${backendUrl}/api/delete/${selectedDriverID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loggedInUserID: loggedInUserID }),

      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression logique. Statut : ${response.status}`);
      }

      const result = await response.json();

      // Fermez le modal après la suppression
      setShowDeleteModal(false);

      if (response.ok) {
       
        toast.success("Driver Deleted successfully !", {
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
        refreshUserData();
      }

    } catch (error) {
      console.error(error);
    }
    

  };

    // Function to handle the change in the select element
    const handleSelectChange = async (event:any) => {
      const newValue = event.target.value;
      setLimit(newValue);
      const commentsFormServer = await fetchDriver(currentPage,newValue);
  
      setItems(commentsFormServer);
    
    };

    const fetchDeletedDriverCount = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/deleted-driver-count/${userID}`,
          { mode: "cors" }
        );
  
        if (!response.ok) {
          throw new Error(
            `Error fetching deleted Driver count. Status: ${response.status}`
          );
        }
  
        const data = await response.json();
        setdeletedDriverCount(data.count);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      fetchDeletedDriverCount(); // Fetch deleted users count on component mount
    }, [userID]);
  
    function copyToClipboard(tagValue :any) {
      // Créer un élément textarea temporaire pour copier le contenu
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = tagValue;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextArea);
    }

      // Dans la fonction handleDriverSelect
      const handleDriverSelect = (driverID: string) => {
        let updatedSelectedDrivers: string[] = [];

        // Si "Sélectionner tous les conducteurs" est activée, sélectionne ou désélectionne tous les conducteurs
        if (selectAll) {
          updatedSelectedDrivers = selectedDrivers.includes(driverID) ?
            selectedDrivers.filter(id => id !== driverID) :
            list_driver.map(driver => driver.id_conducteur);
        } else {
          // Sinon, gère la sélection/désélection normale des conducteurs individuels
          if (selectedDrivers.includes(driverID)) {
            updatedSelectedDrivers = selectedDrivers.filter(id => id !== driverID);
          } else {
            updatedSelectedDrivers = [...selectedDrivers, driverID];
          }
        }

        // Met à jour la liste des conducteurs sélectionnés
        setSelectedDrivers(updatedSelectedDrivers);

        // Met à jour l'état isDriverSelected
        setIsDriverSelected(updatedSelectedDrivers.length > 0 || !selectAll); // Mettre à jour en fonction de la sélection de tous les conducteurs

        // Met à jour le conducteur sélectionné uniquement si un seul conducteur est sélectionné
        if (updatedSelectedDrivers.length === 1 && !selectAll) {
          setSelectedDriverID(driverID);
        } else {
          setSelectedDriverID(null);
        }
      };

    
    // Si vous souhaitez désélectionner la case à cocher globale lorsque toutes les cases individuelles sont désélectionnées.
    useEffect(() => {
      if (selectedDrivers.length === 0) {
        setSelectAll(false);
      }
    }, [selectedDrivers]);

      // Dans la fonction handleSelectAllDrivers
      const handleSelectAllDrivers = (checked: boolean) => {
      setSelectAll(checked);
      if (checked) {
      const allDriverIDs = list_driver.map((driver) => driver.id_conducteur);
      setSelectedDrivers(allDriverIDs);
      } else {
      setSelectedDrivers([]);
      }

      // Met à jour l'état isDriverSelected
      setIsDriverSelected(checked || selectedDrivers.length > 0); // Mettre à jour en fonction de la sélection de tous les conducteurs
      };

    
    // Function to handle the change in the input field for search
      const handleSearchTermChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
        
        getDrivers(currentPage, limit);
      };
       // Fonction pour gérer le changement du type de recherche
        const handleSearchTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
          setSearchType(event.target.value);
        };

      const handleOpenDeletedDriversModal = () => {
        fetchDeletedDrivers();
        setShowModalDriversDeleted(true);
      };
    
      const handleCloseModel = () => {
        setShowModalDriversDeleted(false);
      };
      const clearSearchTerm = () => {
        setSearchTerm(''); // Réinitialise le terme de recherche à une chaîne vide
      };
      // Placeholder text based on search type
      let placeholderText = 'Recherche ...';
      if (searchType === 'name') {
        placeholderText = 'Recherche par nom';
      }else if (searchType === 'code') {
        placeholderText = 'Recherche par code conducteur';
      }else if (searchType === 'phone') {
        placeholderText = 'Recherche par téléphone';
      } else if (searchType === 'tag') {
        placeholderText = 'Recherche par tag';
      }

     // Fonction pour générer un fichier Excel pour les conducteurs sélectionnés ou tous les conducteurs
const downloadExcel = async () => {
  try {
    let driversToDownload = [];
    if (selectAll) {
      // Si "Sélectionner tous les conducteurs" est cochée, téléchargez tous les conducteurs
      driversToDownload = list_driver;
    } else {
      // Sinon, téléchargez seulement les conducteurs sélectionnés
      driversToDownload = list_driver.filter((driver) =>
        selectedDrivers.includes(driver.id_conducteur)
      );
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Drivers");

    // Définition des propriétés de la feuille de calcul pour un affichage plus esthétique
    worksheet.properties.defaultRowHeight = 30;
    worksheet.properties.defaultColWidth = 25;

    worksheet.addRow([
      "ID",
      "Nom conducteur",
      "Prénom conducteur",
      "Téléphone",
      "Permis",
      "Utilisateur",
      "Tag"
    ]).font = { bold: true };

    driversToDownload.forEach((driver) => {
      worksheet.addRow([
        driver.id_conducteur,
        driver.nom_conducteur,
        driver.prenom_conducteur,
        driver.telephone_conducteur,
        driver.premis_conducteur,
        driver.nom_user,
        driver.tag || "Aucun"
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drivers_info.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Le fichier Excel a été téléchargé avec succès.", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  } catch (error) {
    console.error("Erreur lors de la génération du fichier Excel :", error);
    toast.error("Une erreur s'est produite lors de la génération du fichier Excel.", {
      position: "bottom-right",
      autoClose: 3000,
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

    


  return (
    <>
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4>
          <i className="las la-user" data-rel="bootstrap-tooltip" title="Increased"></i>  {translate('Drivers')} ( {total} )
        </h4>
        <div>
        <Link to="/driver" className="btn btn-primary mt-2 mr-1">
            <i className="las la-plus mr-3"></i>
            {translate('New driver')}
          </Link>
          <Button
            className="btn btn-secondary mt-2 mr-1"
            onClick={handleOpenDeletedDriversModal}
          >
            <i className="las la-trash-alt" data-rel="bootstrap-tooltip" title="Increased"></i> {translate('Deleted Drivers')} ({deletedDriverCount})
          </Button>
          <Button
        className="btn btn-info mt-2 mr-1"
        onClick={downloadExcel}
        disabled={!isDriverSelected}
      >
        <i className="las la-file-excel mr-3"></i>
        {translate('Download Excel')}
      </Button>
        </div>
      </div>
      <div className="row">
      <div className="col-md-5">
        <div className="input-group">
          <Dropdown> {/* Utilisez Dropdown au lieu de div */}
          <Dropdown.Toggle variant="link" id="dropdown-basic">
          <i className="fas fa-chevron-down" style={{ color: 'black' }}></i>
          </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSearchType('name')}>Nom</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType('code')}>Code conducteur</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType('phone')}>Téléphone</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType('tag')}>Tag</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <input
            type="text"
            placeholder={placeholderText}
            className="form-control"
            onChange={handleSearchTermChange}
            value={searchTerm}
          />
          {searchTerm && (
            <button
              className="btn btn-light"
              style={{
                border: 'none',
                backgroundColor: '#B5C0D0',
              }}
              onClick={clearSearchTerm}
            >
              <i className="las la-times-circle" style={{ fontSize: '1.5em' ,color: 'black'  }}></i>
            </button>
          )}
        </div>
      </div>

        <div className="col-md-7 d-flex justify-content-end align-items-center">
          <div className="dataTables_length" id="DataTables_Table_0_length">
            <label className="mr-2">
              {translate('Show')}
              <select
                name="DataTables_Table_0_length"
                aria-controls="DataTables_Table_0"
                className="custom-select custom-select-sm form-control form-control-sm ml-2"
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
        </div>
        <div className="row m-2">
          <Table>
            <thead className="bg-white text-uppercase">
              <tr className="ligth ligth-data">
              <th>
                <div className="checkbox d-inline-block">
                <input
                className="form-check-input"
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAllDrivers(e.target.checked)}
                  />
                  <label className="mb-0"></label>
                </div>
              </th>
                <th>{translate('Driver code')}</th>
                <th>{translate('Name')}</th>
                <th>{translate('Phone')}</th>
                <th>{translate('License category')}</th>
                <th>{translate('User')}</th>
                <th>{translate('IButton')}</th>
                <th>{translate('Actions')}</th>
              </tr>
            </thead>
            <tbody key="Drivers" className="ligth-body">
            {Array.isArray(list_driver) && list_driver.length !== 0 && list_driver.map((item) =>  {
              return (
                  <tr className={item["id_conducteur"]}>
                  <td>
                      <div className="checkbox d-inline-block">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`checkbox-${item["id_conducteur"]}`}
                        checked={selectedDrivers.includes(item["id_conducteur"])}
                        onChange={() => handleDriverSelect(item["id_conducteur"])}
                      />
                    <label htmlFor={`checkbox-${item["id_conducteur"]}`} className="mb-0"></label>
                      </div>
                    </td>
                    <td> {item["code_conducteur"]}</td>
                    <td>{item["nom_conducteur"]} {item["prenom_conducteur"]}</td>
                    <td>{item["telephone_conducteur"]}</td>
                    <td >{item["premis_conducteur"]}</td>
                    <td>{item["nom_user"]} {item["prenom_user"]} </td>
                    <td 
                      id={`tag-${item["id_tag"]}`} 
                      onClick={() => copyToClipboard(item["tag"])}
                      title="Cliquez pour copier le tag"
                      style={{ cursor: 'pointer' }} 
                    >
                      {item["tag"] !== null && item["tag"] !== "Aucun" ? (
                        <>
                          <i className="las la-tags" style={{ marginRight: '4px' }}></i> 
                          <span style={{ color: '#007bff' }}>{item["tag"]}</span>
                        </>
                      ) : (
                        "Aucun"
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center list-action">
      
                      <Link
                            to={`/driver/${item["id_conducteur"]}`}
                            className="badge badge-success mr-2"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Modifier"
                          >
                      <i className="ri-pencil-line mr-0" style={{ fontSize: '1.2em' }}></i>
                          </Link>
                      <a
                        className="badge bg-warning mr-2"
                        onClick={() => handleDeleteClick(item["id_conducteur"])}

                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete"
                        data-original-title="Delete"
                      >
                      <i className="ri-delete-bin-line mr-0" style={{ fontSize: '1.2em' }}></i>
                      </a>
                      </div>
                    </td>
                  </tr>    
              );
            })}
             </tbody>
            <Modal
              show={showDeleteModal}
              onHide={() => setShowDeleteModal(false)}
              dialogClassName="modal-90w"
              aria-labelledby=""
              centered
              >
              <Modal.Header closeButton>
                <Modal.Title style={{ fontWeight: 'bold', color: 'grey' }}>{translate('Trash')}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
              {translate('Do you really want to remove this driver?')}
              </Modal.Body>
              <Modal.Footer className="d-flex">
              <button className="btn btn-outline-danger mt-2 mx-auto" onClick={() => setShowDeleteModal(false)}>
              {translate('Cancel')}  
              </button>
              <button className="btn btn-outline-success mt-2 mx-auto" onClick={handleConfirmDelete}>
              {translate('Confirm')} 
              </button>
              </Modal.Footer>
            </Modal>
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
     {/* Modele pour les conducteurs supprimé */}
     <Modal show={showModalDriversDeleted} onHide={handleCloseModel} centered size="lg">
          <Modal.Header closeButton >
            <Modal.Title>{translate('Deleted Drivers')}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: 'calc(80vh - 200px)', overflowY: 'auto' }}>
            <table className="table table-striped">
              <thead >
                <tr>
                  <th>{translate("ID")}</th>
                  <th className="text-center">{translate('Name')}</th>
                  <th className="text-center">{translate('Phone')}</th>
                  <th className="text-center">{translate("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {deletedDrivers.map((driver) => (
                  <tr key={driver.id_conducteur}>
                    <td>{driver.id_conducteur}</td>
                    <td className="text-center">{driver.nom_conducteur} {driver.prenom_conducteur}</td>
                    <td className="text-center">{driver.telephone_conducteur}</td>
                    <td className="text-right">
                      <Button
                        variant="success"
                        onClick={() => handleRestoreDeletedDriver(driver.id_conducteur)}
                      >
                        <i className="las la-trash-restore"></i> {translate("Restore")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModel}>
              {translate("Close")}
            </Button>
            {/* Autres boutons ou actions si nécessaire */}
          </Modal.Footer>
        </Modal>
    </>
  );
}
