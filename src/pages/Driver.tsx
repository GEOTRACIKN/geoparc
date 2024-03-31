import React,{ useEffect, useState } from "react";
import { Button, Modal, Nav } from "react-bootstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {format,parseISO} from 'date-fns';
import { useTranslate } from "../components/LanguageProvider";
import { Bounce, toast, ToastOptions } from 'react-toastify';

const backendUrl = process.env.REACT_APP_BACKEND_URL;


interface UserOption{
  label : string,
  value : string,
}
interface User{
  nom_user : string,
  prenom_user :string,
  id_user : string,
}

interface RequestBody {
  code_emp: string,
  first_name: string,
  middle_name: string,
  phone: string | null;  
  email: string | null;  
  adresse: string | null;  
  datenaiss: string | null;  
  nationnalite: string | null; 
  pi: string | null,
  num_pi: string | null,
  datedeliv_pi: string | null,
  lieudeliv_pi: string | null,
  category_permis: string | null,
  num_permis: string | null,
  datedeliv_permis: string | null,
  dateexpir_permis: string | null,
  id_user:string,
}
const  AddFormDrivers: React.FC =() => {
  const [formData, setFormData] = useState({
    code_emp: "",
    first_name: "",
    middle_name: "",
    phone: "",
    email: "",
    adresse: "",
    datenaiss: "",
    nationnalite: "",
    pi: "",
    num_pi: "",
    datedeliv_pi: "",
    lieudeliv_pi: "",
    category_permis: "",
    num_permis: "",
    datedeliv_permis: "",
    dateexpir_permis: "",
    affecteA:"",
  });

  const [activeTab, setActiveTab] = useState("driverData");
  const userID = localStorage.getItem("userID");
  const [affecteAOptions, setAffecteAOptions] = useState<UserOption[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { translate } = useTranslate();
  const navigate = useNavigate();


  const { id_conducteur } = useParams();
  const isEditMode = !!id_conducteur;

  const handleTabClick = (tabKey : string) => {
    setActiveTab(tabKey);
  };
 
  // Fonction Pour Récupéré Les Conducteurs
  useEffect(() => {
    const fetchDriverData = async () => {
      if (isEditMode) {
        try {
          const response = await fetch(
            `${backendUrl}/api/driverform/${id_conducteur}`
          );
          if (!response.ok) {
            throw new Error(
              "Erreur lors de la récupération des données du conducteur"
            );
          }
          const formData = await response.json();        
         
          
          
        setFormData({
          code_emp: formData.code_conducteur,
          first_name: formData.nom_conducteur,
          middle_name: formData.prenom_conducteur,
          phone: formData.telephone_conducteur,
          email: formData.email_conducteur,
          adresse: formData.adresse_conducteur,
          datenaiss: formData.date_naissance_conducteur,
          nationnalite: formData.nationalite_conducteur,
          pi: formData.piece_identite_conducteur,
          num_pi: formData.numero_piece_identite_conducteur,
          datedeliv_pi: formData.date_delivrance_pi_conducteur,
          lieudeliv_pi: formData.lieu_delivrance_pi_conducteur,
          category_permis: formData.premis_conducteur,
          num_permis: formData.numero_permis_conducteur,
          datedeliv_permis:formData.date_delivrance_permis_conducteur,
          dateexpir_permis: formData.date_expir_permis_conducteur,
          affecteA: formData.id_user,
        });

      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails du conducteur :",
          error
        );
      }
    }
  };
  fetchDriverData();
}, [isEditMode, id_conducteur]);

// Fonction Pour Récupéré Les Utilisateurs
useEffect(() => {
    const fetchAffecteAOptions = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/options/user/${userID}`);
        const data = await response.json();
    
        if (Array.isArray(data)) {
          setAffecteAOptions(data.map((user: User) => ({
            label: `${user.nom_user} ${user.prenom_user}`,
            value: user.id_user,
          })));
        } else {
          console.error("La réponse de l'API n'est pas un tableau :", data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des options du sélecteur", error);
      }
    };
    fetchAffecteAOptions();    
  }, [userID]);
  
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((formData) => ({
    ...formData,
    [name]: value,
  }));
};

  // Fonction pour mettre à jour l'état lorsque vous sélectionnez une option dans une liste déroulante
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handelDatechange = (selectedDate: Date | null, fieldName: string) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      setFormData({
        ...formData,
        [fieldName]: formattedDate,
      });
    } else {
      // Si la date est null, vous pouvez la gérer comme vous le souhaitez, par exemple en laissant le champ vide
      setFormData({
        ...formData,
        [fieldName]: '', // Vous pouvez également définir une autre valeur par défaut si nécessaire
      });
    }
  };
  
  
// Formulaire Pour Ajouter Un Conducteur
const handleAddDriver = async (event : any) => {
  // Validation des champs requis
  setErrors([]);
    
  // Validation des champs requis
  if (
    formData.code_emp === "" ||
    formData.first_name === "" ||
    formData.middle_name === "" ||
    formData.affecteA === ""
  ) {
    setErrors(["Veuillez remplir tous les champs obligatoires (*) "]);
    return;
  } 
  try {  
    const requestBody: RequestBody = {
      code_emp: formData.code_emp,
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      phone: formData.phone || null,      
      email: formData.email || null,
      adresse: formData.adresse || null,
      datenaiss: formData.datenaiss || null,
      nationnalite: formData.nationnalite || null,
      pi: formData.pi || null,
      num_pi: formData.num_pi || null,
      datedeliv_pi: formData.datedeliv_pi || null,
      lieudeliv_pi: formData.lieudeliv_pi || null,
      category_permis: formData.category_permis || null,
      num_permis: formData.num_permis || null,
      datedeliv_permis: formData.datedeliv_permis || null,   
      dateexpir_permis: formData.dateexpir_permis || null,  
      id_user:formData.affecteA,
    };
    
    const response = await fetch(`${backendUrl}/api/addDriver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {

      console.log("Error creating Driver");

      toast.warn("Can't creating Driver", {
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
      return;
    }
    if (response.ok) {
   
      toast.success("Driver create successfully !", {
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
      navigate("/Drivers");
      return;
    }

  } catch (error) {

    toast.warn("Can't create Driver", { 
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

       
  const formatWithoutTime = (dateString: any) => {
    const rawDate = new Date(dateString);
    const formattedDate = new Date(Date.UTC(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate()));
    return formattedDate.toISOString().split('T')[0];
  };

// Formulaire Pour Modifier Un Conducteur
const handleUpdateDriver = async () => {
      // Validation des champs requis
  setErrors([]);
    
  // Validation des champs requis
  if (
    formData.code_emp === "" ||
    formData.first_name === "" || 
    formData.middle_name === "" || 
    formData.affecteA === "" 
  ) {
    setErrors(["Veuillez remplir tous les champs obligatoires (*) "]);
    return;
  }
  try {
    const requestBody: RequestBody = {
      code_emp: formData.code_emp,
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      phone: formData.phone,
      email: formData.email,
      adresse: formData.adresse, 
      datenaiss: formatWithoutTime(formData.datenaiss),
      nationnalite: formData.nationnalite,
      pi: formData.pi,
      num_pi: formData.num_pi,
      datedeliv_pi: formatWithoutTime(formData.datedeliv_pi),
      lieudeliv_pi: formData.lieudeliv_pi,
      category_permis: formData.category_permis,
      num_permis: formData.num_permis,
      datedeliv_permis: formatWithoutTime(formData.datedeliv_permis),
      dateexpir_permis: formatWithoutTime(formData.dateexpir_permis),
      id_user:formData.affecteA,
    };
      const response = await fetch(`${backendUrl}/api/updatedriver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_conducteur: id_conducteur, 
        ...requestBody,
      }),
    });
    
    if (!response.ok) {

      toast.warn("Can't updating Driver", {
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


      return;
    }
    if (response.ok) {
      
      toast.success("Driver updated successfully !", {
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
      navigate("/Drivers");
      return;
    }

  } catch (error) {
    toast.warn("Can't updating Driver", {
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

  return (
    <>
      <div className="header-title">
        <h4 className="mb-3" style={{ color: "grey", fontWeight: "bold" }}>
          <i className="las la-edit" style={{ fontSize: "1.4em" }}></i> 
          {isEditMode ? "modifier Driver" : "Add Driver"}
        </h4>
      </div>
      <form>
        <div className="row">
          <div className="col-sm-3">
            <Nav
              className="flex-column nav-pills text-center"
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              <Nav.Item>
                {" "}
                <Nav.Link
                  eventKey="driverData"
                  className={activeTab === "driverData" ? "active" : ""}
                  onClick={() => handleTabClick("driverData")}
                  >
                  {translate('Driver data')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="drivingLicence"
                  className={activeTab === "drivingLicence" ? "active" : ""}
                  onClick={() => handleTabClick("drivingLicence")}
                  >
                   {translate('Driving licence')}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div className="col-sm-9" >
          <div className="tab-content mt-0" >
            {/* ==========  Driver Data ================ */}
              <div className={`tab-pane fade ${activeTab === "driverData" ? "active show" : ""}`}  style={{ backgroundColor: 'transparent' }}>
              <h4>{translate('Driver data')}</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Code')}*</label>
                      <div className="input-group">
                      <div className="input-group-prepend">
                          <span className="input-group-text">
                          <i className="las la-key"></i>
                      </span>
                        </div>
                      <input
                        className="form-control input-sm"
                        type="text"
                        placeholder="Enter a code"
                        name="code_emp"
                        id="code_emp"
                        value={formData.code_emp}
                        onChange={handleInputChange}
                      />
                    </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Last name')} *</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="las la-user"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your last name"
                          name="first_name"
                          id="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('First name')} *</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="las la-user"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your First name"
                          name="middle_name"
                          id="middle_name"
                          value={formData.middle_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('User')} *</label>
                      <div className="input-group">
                      <div className="input-group-prepend">
                          <span className="input-group-text">
                          <i className="las la-user"></i>
                          </span>
                        </div>
                      <select
                        className="form-control input-sm"
                        name="affecteA"
                        id="affecteA"
                        value={formData.affecteA}
                        onChange={handleSelectChange}
                        >
                        <option value="0">Utilisateur</option>
                          {affecteAOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                      </select>
                      <div className="help-block with-errors"></div>
                    </div>
                  </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Phone')}</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="las la-phone"></i>
                          </span>
                        </div>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Enter your phone number"
                          name="phone"
                          id="phone"
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Email')}</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="las la-envelope"></i>
                          </span>
                        </div>
                        <input
                          type="email"  
                          className="form-control"
                          placeholder="exemple@gmail.com"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Adresse')}</label>
                      <div className="input-group">
                      <div className="input-group-prepend">
                          <span className="input-group-text">
                          <i className="las la-map-marker"></i>                           
                          </span>
                        </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your adresse"
                        name="adresse"
                        id="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="help-block with-errors"></div>
                    </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Date of birth')}</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="las la-calendar"></i>
                          </span>
                        </div>                        
                        <DatePicker
                          className="form-control"
                          onChange={(date : any) => handelDatechange(date, 'datenaiss')}
                          selected={formData.datenaiss ? parseISO(formData.datenaiss) : null} 
                          dateFormat="yyyy-MM-dd"
                          placeholderText="YYYY-MM-DD"
                          name="datenaiss"
                          id="datenaiss"
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={200} 
                        />
                      </div>
                      <div className="help-block with-errors"></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Nationality')}</label>
                      <div className="input-group">
                      <div className="input-group-prepend">
                          <span className="input-group-text">
                          <i className="las la-flag"></i>
                          </span>
                        </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your nationality"
                        name="nationnalite"
                        id="nationnalite"
                        value={formData.nationnalite}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('ID card')}</label>
                      <div className="input-group">
                      <div className="input-group-prepend">
                          <span className="input-group-text">
                          <i className="las la-id-card"></i>
                          </span>
                        </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your iD card"
                        name="pi"
                        id="pi"
                        value={formData.pi}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="help-block with-errors"></div>
                    </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Identification number')}</label>
                      <div className="input-group">
                      <div className="input-group-prepend">
                          <span className="input-group-text">
                          <i className="las la-hashtag"></i>
                          </span>
                        </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your identification number"
                        name="num_pi"
                        id="num_pi"
                        value={formData.num_pi}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="help-block with-errors"></div>
                    </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Date of issue of identity document')}</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="las la-calendar"></i>
                          </span>
                        </div>
                        <DatePicker
                          className="form-control"
                          onChange={(date : any) => handelDatechange(date, 'datedeliv_pi')}
                          selected={formData.datedeliv_pi ? parseISO(formData.datedeliv_pi) : null}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="YYYY-MM-DD"
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={200} // ou toute autre valeur suffisamment grande
                        />
                      </div>
                      <div className="help-block with-errors"></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Place of issue of identity document')}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your place of issue of identity document"
                        name="lieudeliv_pi"
                        id="lieudeliv_pi"
                        value={formData.lieudeliv_pi}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="help-block with-errors"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ===========  Drivers Licence Parameters ============ */}
              <div className={`tab-pane fade ${activeTab === "drivingLicence" ? "active show" : ""}`} id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab"  style={{ backgroundColor: 'transparent' }}>
                <h4>{translate('Drivers licence parameters')}</h4> 
                <div className="row"> 
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Licence categorie')}</label>
                      <input
                        className="form-control input-sm"
                        type="text"
                        placeholder="Enter your licence categories"
                        name="category_permis"
                        id="category_permis"
                        value={formData.category_permis}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label> </label>{translate('Licence number')}
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your licence categories"
                        name="num_permis"
                        id="num_permis"
                        value={formData.num_permis}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="help-block with-errors"></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Date of issue of driving licence')}</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="las la-calendar"></i>
                          </span>
                        </div>
                        <DatePicker
                          className="form-control"
                          onChange={(date : any) => handelDatechange(date, 'datedeliv_permis')} 
                          selected={formData.datedeliv_permis ? parseISO(formData.datedeliv_permis) : null}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="YYYY-MM-DD"
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={200} // ou toute autre valeur suffisamment grande
                        />
                      </div>
                      <div className="help-block with-errors"></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>{translate('Expiry date')}</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="las la-calendar"></i>
                          </span>
                        </div>
                        <DatePicker
                          className="form-control"
                          onChange={(date : any) => handelDatechange(date, 'dateexpir_permis')}
                          selected={formData.dateexpir_permis ? parseISO(formData.dateexpir_permis) : null}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="YYYY-MM-DD"
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={200} // ou toute autre valeur suffisamment grande
                        />
                      </div>
                      <div className="help-block with-errors"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3 row">
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
        </div>
            <div className="panel-footer">
              <Link
                to="/drivers"
                className="btn btn-outline-danger mt-1 mr-1 float-left"
              >
                <i className="fa fa-times"></i>
                {translate('Cancel')} 
              </Link>
              <button
              id="saveuser"
              type="button"
              className={`btn ${isEditMode ? "btn btn-outline-success mt-1 mr-2 float-right" : "btn btn-outline-success mt-1 mr-2 float-right"}`}
              onClick={isEditMode ? handleUpdateDriver : handleAddDriver}
            >
              <i className={`fa ${isEditMode ? "fa-edit" : "fa-save"}`} />
              {isEditMode ? "Modifier" : "Enregistré"}
            </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddFormDrivers;