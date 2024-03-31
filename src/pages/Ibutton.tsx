import { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import SelectGroup from "../components/Vehicle/SelectGroup";
import { useTranslate } from "../components/LanguageProvider";
import { Link } from "react-router-dom";
import { Bounce, toast, ToastOptions } from 'react-toastify';



interface User{
  nom_user : string,
  prenom_user :string,
  id_user : string,
}

interface Driver{
  nom_conducteur : string,
  prenom_conducteur :string,
  id_conducteur : string,
}

interface RequestBody {
  NumSerie :string,
  Utilisateur :string,
  Conducteur :string,
  Note :string,
}

const  Ibutton : React.FC =() =>{
  const [IbuttonData, setIbuttonData] = useState({
    NumSerie :"",
    Utilisateur :"",
    Conducteur :"",
    Note :"",
  });

  const [showModal, setModalIsOpen] = useState(false); 
  const userID = localStorage.getItem("userID");
  const [total, setTotal] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  const [list_tags, setItems] = useState([]);
  const [limit, setLimit] = useState(15);
  let currentPage = 1;
  const [deletedTagCount, setdeletedTagCount] = useState<number>(0);
  const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
  const [driverOptions, setDriverOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedTagID, setSelectedTagID] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { translate } = useTranslate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');


  
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Fonction Pour Récupéré Les Tags
useEffect(() => {
  const fetchTagData = async () => {
    if (isEditMode) {   
      try {
        const response = await fetch(`${backendUrl}/api/Tagform/${selectedTagID}`);

        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données du Tag. Status: ${response.status}`);
        }
        const tagData  = await response.json();   
      
        setIbuttonData({
            NumSerie: tagData.tag,
            Utilisateur: tagData.id_user,
            Conducteur: tagData.lastaffectationid,
            Note: tagData.tag_note,
        });
    } catch (error: any) {
      console.error("Erreur FATAL", error.message);
  }   
  }
};
fetchTagData();
}, [isEditMode,selectedTagID]);


  const getTags = async (currentPage: number, limit: number) => {
    const total_pages = await fetch(
      `${backendUrl}/api/ibutton/totalpage/${userID}?searchTerm=${searchTerm}`,
      {mode:'cors'}
    ); 

    const totalpages = await total_pages.json();
    const total = totalpages[0].total;
    setTotal(total);

    const calculatedPageCount = Math.ceil(total / limit);
    setpageCount(calculatedPageCount);

    const res = await fetch(
      `${backendUrl}/api/ibutton/${userID}?page=${currentPage}&limit=${limit}&searchTerm=${searchTerm}`,

      {mode:'cors'}
    );  
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    getTags(currentPage, limit);
  }, [userID, limit,searchTerm]);
  
const fetchTag = async (currentPage:number,limit :number ) => {
  const res = await fetch(
    `${backendUrl}/api/ibutton/${userID}?page=${currentPage}&limit=${limit}`,
    
    {mode:'cors'}
  );
  const data = await res.json();
  return data;
};


const refreshTagData = async () => {
  getTags(currentPage, limit);
};



  
const handlePageClick = async (data: any) => {
  let currentPage = data.selected + 1;
  const commentsFormServer = await fetchTag(currentPage,limit);

  setItems(commentsFormServer );
  window.scrollTo(0,0)

};

// Function to handle the change in the select element
const handleSelectChange = async (event:any) => {
  const newValue = event.target.value;
  setLimit(newValue);
  const commentsFormServer = await fetchTag(currentPage,newValue);

  setItems(commentsFormServer);

};

const closeModal = () => {
  setModalIsOpen(false);
  // Réinitialiser les données du formulaire à leurs valeurs par défaut
  setIbuttonData({
    NumSerie: "",
    Utilisateur: "",
    Conducteur: "",
    Note: ""
  });
};
  

const fetchDeletedTagCount = async () => {
  try {
    
    const response = await fetch(
      `${backendUrl}/api/deletedcount/${userID}`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching deleted tag count. Status: ${response.status}`
      );
    }

    const data = await response.json();
    setdeletedTagCount(data.count);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchDeletedTagCount(); 
}, [userID]);
 

useEffect(() => {
  const fetchAffecteAOptions = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/options/${userID}`);
      const data: User[] = await response.json();

      // Traiter les données pour les convertir en format d'options
      const processedOptions = data.map(user => ({
        value: user.id_user.toString(),
        label: `${user.nom_user} ${user.prenom_user}`
      }));

      // Mettre à jour l'état avec les options traitées
      setUserOptions(processedOptions);

    } catch (error) {
      console.error("Erreur lors de la récupération des options du sélecteur", error);
    }
  };
  
  fetchAffecteAOptions();
}, [userID]);
  
  
const handleChange = (selectedOption: any) => {
  if (selectedOption) {
    const selectedUserId = selectedOption.value; 
    setSelectedUserId(selectedUserId);
    setIbuttonData(prevData => ({
      ...prevData,
      Utilisateur: selectedOption.value
    }));
  }
};

useEffect(() => {
  const fetchDriversForSelectedUser = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/optionsdrivers/${selectedUserId}`);
      const data = await response.json();    
      if (Array.isArray(data)) {
        setDriverOptions(data.map((driver: Driver) => ({
          label: `${driver.nom_conducteur} ${driver.prenom_conducteur}`,
          value: driver.id_conducteur,
        })));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des options du sélecteur de conducteurs", error);
    }
  };
    
  fetchDriversForSelectedUser();
}, [selectedUserId]);


const handleChangedriver = (selectedOption: any) => {
  if (selectedOption) {
    const selectedUserId = selectedOption.value;
    setIbuttonData(prevData => ({
      ...prevData,
      Conducteur: selectedUserId
    }));
  }
};

const handleModalClose = () => {
  refreshTagData();
  setShowSuccessModal(false);
  closeModal();
};
  
  
const handleSubmit = async () => {
   // Validation des champs requis
   setErrors([]);

    // Validation des champs requis
  if (
    IbuttonData.NumSerie === "" ||
    IbuttonData.Conducteur === "" ||
    IbuttonData.Utilisateur === "" 
  ) {
    setErrors(["Veuillez remplir tous les champs obligatoires (*) "]);
    return;
  } 

  try {
    const requestBody: RequestBody = {
      NumSerie: IbuttonData.NumSerie,
      Utilisateur: IbuttonData.Utilisateur,
      Conducteur: IbuttonData.Conducteur, 
      Note: IbuttonData.Note,
    };
    const response = await fetch(`${backendUrl}/api/addibutton`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    if (response.ok) {
      toast.success("Tag create successfully !", {
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
      refreshTagData();
      setModalIsOpen(false);
      return;
    }
  } catch (error) {
    toast.warn("Can't create Tag", { 
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


// Fonction pour mettre à jour le numéro de série dans IbuttonData
const handleNumSerieChange = (event: React.ChangeEvent<HTMLInputElement>) => {
const { value } = event.target;
setIbuttonData(prevData => ({
  ...prevData,
  NumSerie: value
}));
};

// Fonction pour mettre à jour la note dans IbuttonData
const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
const { value } = event.target;
setIbuttonData(prevData => ({
  ...prevData,
  Note: value
}));
};

const handleDeleteClick = async (TagID: string) => {
  // Affichez le modal de confirmation avant la suppression
  setSelectedTagID(TagID);
  setShowDeleteModal(true);
};

const handleConfirmDelete = async () => {
  try {
    const loggedInUserID = localStorage.getItem("userID");
    const response = await fetch(`${backendUrl}/api/deletetag/${selectedTagID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loggedInUserID: loggedInUserID }),
    });
    if (response.ok) {
      toast.success("Tag Deleted successfully !", {
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
      refreshTagData();
       // Fermez le modal après la suppression
      setShowDeleteModal(false);
      return;
    }
  } catch (error) {
    toast.warn("Can't Deleted Driver", {
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
  refreshTagData();
};

const handleUpdateTag = async () => {
  try {
    const requestBody: RequestBody = {
      NumSerie: IbuttonData.NumSerie,
      Utilisateur: IbuttonData.Utilisateur,
      Conducteur: IbuttonData.Conducteur,
      Note: IbuttonData.Note
    };
    
    const response = await fetch(`${backendUrl}/api/Tag/updateTag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_tag: selectedTagID,
        ...requestBody,
      }),
    });
    if (response.ok) {
      toast.success("Tag updated successfully !", {
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
      refreshTagData();
      setModalIsOpen(false);
      return;
    }
  } catch (error) {
    console.error("Erreur lors de l'appel de l'API pour la mise à jour", error);
  }
};

const openModal = (editMode = false) => {
  setIsEditMode(editMode);
  setModalIsOpen(true);
};

function copyToClipboard(tagValue :any) {
  // Créer un élément textarea temporaire pour copier le contenu
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = tagValue;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
}

const handleCancel = () => {
  // Réinitialiser les données du formulaire à leurs valeurs par défaut
  setIbuttonData({
      NumSerie: "",
      Utilisateur: "",
      Conducteur: "",
      Note: ""
  });
  // Effacer tous les messages d'erreur
  setErrors([]);
  // Fermer le modal
  setModalIsOpen(false);
};

 // Function to handle the change in the input field for search
 const handleSearchTermChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const term = event.target.value;
  setSearchTerm(term);
  getTags(currentPage, limit);
};

const clearSearchTerm = () => {
  setSearchTerm(''); // Réinitialise le terme de recherche à une chaîne vide
};

    return (
      <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4>
             <i className="las la-user-tag" data-rel="bootstrap-tooltip" title="Increased"></i> {translate('Tag Management')}   ({total}) 
            </h4>
            {/* <h4 style={{marginRight: '15px'}}>
             <i className="las la-trash-alt" data-rel="bootstrap-tooltip" title="Increased"></i> {translate('Deleted tag')}   ({deletedTagCount})
            </h4> */}
             <div>
            <button onClick={() => openModal(false)} className="btn btn-primary mt-2 mr-1">
              <i className="las la-plus mr-3"></i>
              {translate('New tag')}  
            </button>
            <Link to="/History-tag" className="btn btn-outline-secondary mt-2 mr-1">
            <i className="las la-history mr-3"></i>
           {translate('History Assignments')}
                </Link>
                </div>
          </div>
            <Modal
              show={showModal}
              onHide={closeModal}
              dialogClassName="modal-90w"
              aria-labelledby="example-custom-modal-styling-title"
              centered
            >
             <Modal.Header closeButton>
              <Modal.Title>{isEditMode ? 'Modifier le TAG' : 'Ajouter un nouveau TAG'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
            <div className="form-group row">
              <label htmlFor="NumSerie" className="col-sm-4 col-form-label" style={{ textAlign: 'left' }}>  {translate('Serial number')}*</label>
              <div className="col-sm-8">
                <input 
                  type="text" 
                  className="form-control" 
                  id="NumSerie" 
                  onChange={handleNumSerieChange}  
                  value={IbuttonData.NumSerie}     
                  placeholder="TAG Number"
                /> 
              </div>
              <div className="help-block with-errors"></div>
            </div>

            
            <SelectGroup
                controlId="Utilisateur"
                label="Utilisateur*"
                icon="user"
                options={userOptions}
                valueType={{
                  value: IbuttonData.Utilisateur,
                  label: userOptions.find(user => user.value === IbuttonData.Utilisateur)?.label || "Sélectionnez un utilisateur"
                }}
                onChange={handleChange}
              />
              <div className="help-block with-errors"></div>

            <div className="form-group  mb-3"> 
              <SelectGroup
                controlId="Conducteur"
                label="Conducteur*"
                icon="user"
                options={driverOptions}
                valueType={{
                  value: IbuttonData.Conducteur,
                  label: driverOptions.find(driver => driver.value === IbuttonData.Conducteur)?.label || "Sélectionnez un conducteur "
                }}
                onChange={handleChangedriver}
              />
              <div className="help-block with-errors"></div>
            </div>

            <div className="form-group row">
              <label htmlFor="Note" className="col-sm-4 col-form-label" style={{ textAlign: 'left' }}> {translate('Note')}</label>
              <div className="col-sm-8">
                <textarea 
                  className="form-control" 
                  id="Note" 
                  onChange={handleNoteChange}      
                  value={IbuttonData.Note}       
                  placeholder="Note"  
                />  
              </div>
            </div>
            </Modal.Body>
              <Modal.Footer className="d-flex justify-content-between">          
              <Button variant=" btn btn-outline-secondary" onClick={handleCancel}>
                  <i className="las la-times "></i>{translate('Cancel')}
              </Button>        
              <Button variant="btn btn-outline-success" onClick={isEditMode ? handleUpdateTag : handleSubmit}>
                  <i className={`fa ${isEditMode ? "fa-edit" : "las la-plus"}`} />
                  {isEditMode ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              <div className="col-sm-10">
                  {errors.map((error, index) => (
                      <p
                          key={index}
                          style={{ color: "red", fontSize: "1.2em", textAlign: "center" }}
                      >
                {error}
                          </p>
                      ))}
                  </div>
              </Modal.Footer>
                </Modal>
                <Modal
                  show={showSuccessModal}
                  onHide={handleModalClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>
                    {isEditMode
                        ? "TAG modifié avec succès"
                        : "TAG ajouté avec succès"}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  {isEditMode
                      ? "Vous avez modifié le TAG avec succès !"
                      : "Vous avez ajouté un nouvel TAG avec succès !"}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={handleModalClose}>
                       {translate('Close')}
                    </Button>
                  </Modal.Footer>
              </Modal>     
        <div>
        <div className="row">
            <div className="col-md-3">
              <div className="input-group">
                <input
                  type="text"
                  placeholder={'Recherche ...'}
                  className="form-control"
                  onChange={handleSearchTermChange}
                  value={searchTerm}
                />
                 {searchTerm && (
                  <button className="btn btn-light" style={{ border: 'none', backgroundColor: '#B5C0D0' }} onClick={clearSearchTerm}>
                    <i className="las la-times-circle"></i> 
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-9 d-flex justify-content-end align-items-center">
              <div className="dataTables_length" id="DataTables_Table_0_length">
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
              </div>
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
                            id="checkbox1"
                          />
                          <label htmlFor="checkbox1" className="mb-0"></label>
                        </div>
                      </th>
                      <th>TAG ibutton</th>
                      <th>{translate('Last Assignment')}</th>
                      <th>{translate('Note')}</th>
                      <th>{translate('User')}</th>
                      <th>{translate('Action')}</th>
                    </tr>
                  </thead>
                  <tbody  key="Ibutton" className="ligth-body">
                  {Array.isArray(list_tags) && list_tags.length!=0 && list_tags.map((item) =>  {
                    return(
                      <tr className={item["id_tag"]}>
                          <td>
                          <div className="checkbox d-inline-block">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="checkbox2"
                            />
                            <label htmlFor="checkbox2" className="mb-0"></label>
                          </div>
                        </td>
                        <td 
                          id={`tag-${item["id_tag"]}`} 
                          onClick={() => copyToClipboard(item["tag"])}
                          title="Cliquez pour copier le tag"
                          style={{ cursor: 'pointer' }}
                        >
                          {item["tag"] && (
                            <>
                              <i className="las la-tags" style={{ marginRight: '4px' }}></i> 
                              <span style={{ color: '#007bff' }}>{item["tag"]}</span> 
                            </>
                          )}
                        </td>

                        <td>{new Date(item["lastAffectation"]).toLocaleString()}</td>
                        <td>{item["tag_note"]}</td>
                        <td> {item["nom_user"]} {item["prenom_user"]}</td>
                        <td>
                        <div className="d-flex align-items-center list-action">                  
                        <a
                        className="badge badge-success mr-2"
                        onClick={() => {
                          setSelectedTagID(item["id_tag"]);
                          openModal(true);
                        }} 
                      >
                        <i className="ri-pencil-line mr-0" style={{ fontSize: '1.2em' }}></i>
                      </a>
                      <a
                        className="badge bg-warning mr-2"
                        onClick={() => handleDeleteClick(item["id_tag"])}

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
                          <Modal.Title style={{ fontWeight: 'bold', color: 'grey' }}>{translate('Deleted tag')}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                          {translate('Do you really want to remove this TAG ?')}
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
      </>
    )
  }

  export default Ibutton;