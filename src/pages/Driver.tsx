import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Form, Button } from "react-bootstrap";
import { useTranslate } from "../components/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import { PropagateLoader } from "react-spinners";

interface DriverInterface {
  id_conducteur?: number | null;
  nom_conducteur: string | null;
  prenom_conducteur: string | null;
  date_naissance_conducteur: string | null; // Utilisez `string` pour la date, ou `Date` si vous convertissez en objet Date
  premis_conducteur: string | null;
  nationalite_conducteur: string | null;
  adresse_conducteur: string | null;
  email_conducteur: string | null;
  telephone_conducteur: string | null;
  piece_identite_conducteur: string | null;
  numero_piece_identite_conducteur: string | null;
  date_delivrance_pi_conducteur: string | null; // Utilisez `string` pour la date/heure
  lieu_delivrance_pi_conducteur: string | null;
  numero_permis_conducteur: string | null;
  date_delivrance_permis_conducteur: string | null; // Utilisez `string` pour la date/heure
  lieu_delivrance_permis_conducteur: string | null;
  id_sousParc: number | null;
  situation_conducteur: string | null;
  prenom_pere_conducteur: string | null;
  nom_mere_conducteur: string | null;
  prenom_mere_conducteur: string | null;
  role_conducteur: string | null;
  service_conducteur: string | null;
  sexe_conducteur: string | null;
  date_expir_permis_conducteur: string | null; // Utilisez `string` pour la date/heure
  total_salaire_conducteur: string | null;
  code_conducteur: string | null;
  id_user: string | null;
  service: number | null;
  type_permis: string | null;
  groupe_sanguin: string | null;
}

export function Driver() {
  const { id_conducteur } = useParams<{ id_conducteur?: string }>();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const isEditing = Boolean(id_conducteur);
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const id_user = localStorage.getItem("GeopUserID");
  const [driver, setDriver] = useState<DriverInterface | null>({
    id_conducteur: isEditing && id_conducteur ? Number(id_conducteur) : null,
    nom_conducteur: null,
    prenom_conducteur: null,
    date_naissance_conducteur: null,
    premis_conducteur: null,
    nationalite_conducteur: null,
    adresse_conducteur: null,
    email_conducteur: null,
    telephone_conducteur: null,
    piece_identite_conducteur: null,
    numero_piece_identite_conducteur: null,
    date_delivrance_pi_conducteur: null,
    lieu_delivrance_pi_conducteur: null,
    numero_permis_conducteur: null,
    date_delivrance_permis_conducteur: null,
    lieu_delivrance_permis_conducteur: null,
    id_sousParc: null,
    situation_conducteur: null,
    prenom_pere_conducteur: null,
    nom_mere_conducteur: null,
    prenom_mere_conducteur: null,
    role_conducteur: null,
    service_conducteur: null,
    sexe_conducteur: null,
    date_expir_permis_conducteur: null,
    total_salaire_conducteur: null,
    code_conducteur: null,
    id_user: isEditing ? null : id_user,
    service: null,
    groupe_sanguin: null,
    type_permis: null,
  });

  const [loading, setLoading] = useState<boolean | null>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedCodeConducteur, setUpdatedCodeConducteur] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);


  const cancelClicked = () => {
    navigate("/drivers");
  };

  useEffect(() => {
    const getDriver = async () => {
      try {
        // Récupération des informations du conducteur
        const res = await fetch(
          `${backendUrl}/api/geop/driver/find/${id_conducteur}`,
          {
            mode: "cors",
          }
        );

        if (!res.ok) {
          console.error("Erreur lors de la récupération du conducteur");
          setError("Erreur lors de la récupération du conducteur");
          return;
        }

        const data: DriverInterface = await res.json();
        setDriver(data);

        setUpdatedCodeConducteur(driver?.code_conducteur || "")


      } catch (error) {
        console.error("Erreur lors de la récupération du conducteur", error);
        setError("Erreur lors de la récupération du conducteur");
      } finally {
        setLoading(false);
      }
    };
    if (isEditing) { getDriver(); }
    else { setLoading(false); }



  }, []);

  // Fonction de validation des emails
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Fonction de validation des numéros de téléphone
  const validatePhone = (phone: string): boolean => {
    const re = /^[0-9]{10}$/; // Exemple pour des numéros de téléphone à 10 chiffres
    return re.test(phone);
  };


  const validateString = (str: string): boolean => {
    return str.trim().length > 0; // Example: checks if the string is not empty
  };



  const updateDriver = async (driver: DriverInterface) => {

    const isEmailValid = validateEmail(driver.email_conducteur ?? "");
    const isPhoneValid = validatePhone(driver.telephone_conducteur ?? "");
    const isNomConducteurValid = validateString(driver.nom_conducteur ?? "");
    const isPreNomConducteurValid = validateString(driver.prenom_conducteur ?? "");
    const isCodeConducteurValid = validateString(driver.code_conducteur ?? "");

    // Validation échouée
    if (!isEmailValid || !isPhoneValid || !isNomConducteurValid || !isPreNomConducteurValid || !isCodeConducteurValid) {
      const emailElement = document.getElementById(
        "email_conducteur"
      ) as HTMLInputElement;
      if (emailElement) {
        emailElement.style.borderColor = isEmailValid ? "#ced4da" : "red";
      }

      const phoneElement = document.getElementById(
        "telephone_conducteur"
      ) as HTMLInputElement;
      if (phoneElement) {
        phoneElement.style.borderColor = isPhoneValid ? "#ced4da" : "red";
      }

      const nomElement = document.getElementById("nom_conducteur") as HTMLInputElement;
      if (nomElement) {
        nomElement.style.borderColor = isNomConducteurValid ? "#ced4da" : "red";
      }
    
      const prenomElement = document.getElementById("prenom_conducteur") as HTMLInputElement;
      if (prenomElement) {
        prenomElement.style.borderColor = isPreNomConducteurValid ? "#ced4da" : "red";
      }
    
      const codeElement = document.getElementById("code_conducteur") as HTMLInputElement;
      if (codeElement) {
        codeElement.style.borderColor = isCodeConducteurValid ? "#ced4da" : "red";
      }

      toast.warn("Please fill in all required fields", {
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

      setButtonClicked(false);
      return;
    }

    try {

      const rescheck = await fetch(`${backendUrl}/api/geop/driver/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          code_conducteur: driver.code_conducteur,
          updated_code_conducteur: driver.code_conducteur,
          updated: driver.code_conducteur === updatedCodeConducteur ? 0 : 1,
        }),
      });

      if (rescheck.ok) {
        const jsonResponse = await rescheck.json();

        if (jsonResponse.driver_count !== 0) {
          toast.warn("Driver code already exists", {
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

          setButtonClicked(false);
          return;
        }


        let driverData = Object.fromEntries(
          Object.entries(driver).filter(([_, value]) => value !== null)
        );

        const dateFields = [
          'date_naissance_conducteur',
          'date_delivrance_permis_conducteur',
          'date_delivrance_pi_conducteur',
          'date_expir_permis_conducteur'
        ];

        driverData = Object.fromEntries(
          Object.entries(driver)
            .filter(([_, value]) => value !== null)
            .map(([key, value]) => {
              // Check if the key is one of the specific date fields
              if (dateFields.includes(key)) {
                let date: Date;

                // If the value is already a Date object
                if (value instanceof Date) {
                  date = value;
                } else if (typeof value === 'string' && value.includes('T')) {
                  // Convert ISO string to Date object
                  date = new Date(value);
                } else {
                  return [key, value];
                }

                // Format the date as "YYYY-MM-DD HH:mm:ss"
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                return [key, formattedDate];
              }
              return [key, value];
            })
        );

        // Si les validations passent, mettre à jour le conducteur
        const res = await fetch(`${backendUrl}/api/geop/driver/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify(driverData),
        });

        if (!res.ok) {
          toast.warn("Can't update driver", {
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

          console.error("Error updating driver");
          setButtonClicked(false);
          return;
        }

        toast.success("Driver updated successfully", {
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

        setButtonClicked(false);
        navigate("/drivers");
      } else {
        toast.warn("Can't update driver", {
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

        setButtonClicked(false);
      }
    } catch (error) {
      toast.warn("Can't update driver", {
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

      setButtonClicked(false);
    }
  };

  const createDriver = async (driver: DriverInterface) => {
    const isEmailValid = validateEmail(driver.email_conducteur ?? "");
    const isPhoneValid = validatePhone(driver.telephone_conducteur ?? "");
    const isNomConducteurValid = validateString(driver.nom_conducteur ?? "");
    const isPreNomConducteurValid = validateString(driver.prenom_conducteur ?? "");
    const isCodeConducteurValid = validateString(driver.code_conducteur ?? "");





    // Validation échouée
    if (!isEmailValid || !isPhoneValid || !isNomConducteurValid || !isPreNomConducteurValid || !isCodeConducteurValid) {
      const emailElement = document.getElementById(
        "email_conducteur"
      ) as HTMLInputElement;
      if (emailElement) {
        emailElement.style.borderColor = isEmailValid ? "#ced4da" : "red";
      }

      const phoneElement = document.getElementById(
        "telephone_conducteur"
      ) as HTMLInputElement;
      if (phoneElement) {
        phoneElement.style.borderColor = isPhoneValid ? "#ced4da" : "red";
      }

      const nomElement = document.getElementById("nom_conducteur") as HTMLInputElement;
      if (nomElement) {
        nomElement.style.borderColor = isNomConducteurValid ? "#ced4da" : "red";
      }
    
      const prenomElement = document.getElementById("prenom_conducteur") as HTMLInputElement;
      if (prenomElement) {
        prenomElement.style.borderColor = isPreNomConducteurValid ? "#ced4da" : "red";
      }
    
      const codeElement = document.getElementById("code_conducteur") as HTMLInputElement;
      if (codeElement) {
        codeElement.style.borderColor = isCodeConducteurValid ? "#ced4da" : "red";
      }

      toast.warn("Please fill in all required fields", {
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

      setButtonClicked(false);
      return;
    } else {
      try {

        // Check if the driver code already exists
        const rescheck = await fetch(`${backendUrl}/api/geop/driver/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            code_conducteur: driver.code_conducteur,
            updated_code_conducteur: driver.code_conducteur,
            update: 0, // For create operation
          }),
        });

        if (rescheck.ok) {
          const jsonResponse = await rescheck.json();

          if (jsonResponse.driver_count != 0) {
            toast.warn("Driver code already exists", {
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

            setButtonClicked(false);
            return;
          }

          let driverData = Object.fromEntries(
            Object.entries(driver).filter(([_, value]) => value !== null)
          );



          const dateFields = [
            'date_naissance_conducteur',
            'date_delivrance_permis_conducteur',
            'date_delivrance_pi_conducteur',
            'date_expir_permis_conducteur'
          ];

          driverData = Object.fromEntries(
            Object.entries(driver)
              .filter(([_, value]) => value !== null)
              .map(([key, value]) => {
                // Check if the key is one of the specific date fields
                if (dateFields.includes(key)) {
                  let date: Date;

                  // If the value is already a Date object
                  if (value instanceof Date) {
                    date = value;
                  } else if (typeof value === 'string' && value.includes('T')) {
                    // Convert ISO string to Date object
                    date = new Date(value);
                  } else {
                    return [key, value];
                  }

                  // Format the date as "YYYY-MM-DD HH:mm:ss"
                  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                  return [key, formattedDate];
                }
                return [key, value];
              })
          );


          // If validations pass, create the driver
          const res = await fetch(`${backendUrl}/api/geop/driver/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(driverData),
          });

          if (!res.ok) {
            toast.warn("Can't create driver", {
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

            console.error("Error creating driver");
            setButtonClicked(false);
            return;
          }

          toast.success("Driver created successfully", {
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

          setButtonClicked(false);
          navigate("/drivers");
        } else {
          toast.warn("Can't create driver", {
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

          setButtonClicked(false);
        }
      } catch (error) {
        console.error("Can't create driver", error);

        toast.warn("Can't create driver", {
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

        setButtonClicked(false);
      }
    }
  };



  // Utilisez l'interface ChangeEvent pour le gestionnaire d'événements
  const handleChange = (name: any, value: any) => {
    console.log("name: " + name);
    console.log("value: " + value);



    if (driver) {
      setDriver({
        ...driver,
        [name]: value,
      });
    }


    console.log(driver)

  };



  return (
    <>
      <style>
        {`
          .form-group {
            margin-bottom: 1rem;
          }
          
          .form-group .form-control {
            width: 100%;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
          }
          
          .footer {
            margin-top: 1rem;
          }
        `}
      </style>

      <div className="row">
        <div className="col-md-6 col-sm-12">
          <h4>
            <i className="las la-user-nurse"></i>
            {isEditing ? "Modifier un conducteur" : "Ajouter un conducteur"}
          </h4>
        </div>

        <div className="col-md-12">
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <PropagateLoader color={"#123abc"} loading={loading} size={20} />
            </div>
          ) : (
            <Tabs
              defaultActiveKey="tab_1"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="tab_1" title="Informations Générales">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="form-group" controlId="formNom">
                      <Form.Label>
                        <i className="fas fa-user"></i> Nom du conducteur (*)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="nom_conducteur"
                        id="nom_conducteur"
                        placeholder="Entrez le nom du conducteur"
                        value={driver?.nom_conducteur || ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formPrenom">
                      <Form.Label>
                        <i className="fas fa-user"></i> Prénom du conducteur (*)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="prenom_conducteur"
                        id="prenom_conducteur"
                        value={driver?.prenom_conducteur || ''}
                        placeholder="Entrez le prénom du conducteur"
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formCodec">
                      <Form.Label>
                        <i className="fas fa-id-card"></i> Code d'identification (*)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="code_conducteur"
                        id="code_conducteur"
                        value={driver?.code_conducteur || ''}
                        placeholder="Entrez le code d'identification"
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formFonction">
                      <Form.Label>
                        <i className="fas fa-briefcase"></i> Fonction du conducteur
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="role_conducteur"
                        value={driver?.role_conducteur || ''}
                        placeholder="Entrez la fonction du conducteur"
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group
                      className="form-group"
                      controlId="formDateNaissance"
                    >
                      <Form.Label>
                        <i className="fas fa-calendar-day"></i> Date de naissance
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date_naissance_conducteur"
                        placeholder="Sélectionnez la date de naissance"
                        value={driver?.date_naissance_conducteur || ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="form-group" controlId="formAdresse">
                      <Form.Label>
                        <i className="fas fa-home"></i> Adresse du conducteur
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="adresse_conducteur"
                        placeholder="Entrez l'adresse du conducteur"
                        value={driver?.adresse_conducteur || ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formTel">
                      <Form.Label>
                        <i className="fas fa-phone"></i> Numéro de téléphone
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="telephone_conducteur"
                        id="telephone_conducteur"
                        placeholder="Entrez le numéro de téléphone"
                        value={driver?.telephone_conducteur || ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formGroupeS">
                      <Form.Label>
                        <i className="fas fa-heart"></i> Groupe sanguin
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="groupe_sanguin"
                        value={driver?.groupe_sanguin || ''}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      >
                        <option value="0">Sélectionnez le groupe sanguin</option>
                        <option>A+</option>
                        <option>A-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>O+</option>
                        <option>O-</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formEmail">
                      <Form.Label>
                        <i className="fas fa-envelope"></i> Adresse email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        id="email_conducteur"
                        name="email_conducteur"
                        placeholder="Entrez l'adresse email"
                        value={driver?.email_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formService">
                      <Form.Label>
                        <i className="fas fa-cogs"></i> Service attribué
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="service_conducteur"
                        placeholder="Entrez le service attribué"
                        value={driver?.service_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="tab_2" title="Pièce d'identité">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="form-group" controlId="formTypeP">
                      <Form.Label>
                        <i className="fas fa-id-card"></i> Type de la pièce
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="piece_identite_conducteur"
                        placeholder="Entrez le type de la pièce"
                        value={driver?.piece_identite_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formNumP">
                      <Form.Label>
                        <i className="fas fa-id-card"></i> Numéro de la pièce
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="piece_identite_conducteur"
                        placeholder="Entrez le numéro de la pièce"
                        value={driver?.piece_identite_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group
                      className="form-group"
                      controlId="formDateDelivrance"
                    >
                      <Form.Label>
                        <i className="fas fa-calendar-day"></i> Date de délivrance
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date_delivrance_pi_conducteur"
                        placeholder="Sélectionnez la date de délivrance"
                        value={driver?.date_delivrance_pi_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formLieuD">
                      <Form.Label>
                        <i className="fas fa-map-marker-alt"></i> Lieu de
                        délivrance
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="lieu_delivrance_pi_conducteur"
                        placeholder="Entrez le lieu de délivrance"
                        value={driver?.lieu_delivrance_pi_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="tab_3" title="Permis de conduire">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="form-group" controlId="formTypePermis">
                      <Form.Label>
                        <i className="fas fa-id-card"></i> Type de permis
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="premis_conducteur"
                        placeholder="Type de permis"
                        value={driver?.premis_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      >
                        <option value="">Sélectionnez le type de permis</option>
                        <option value="A1">A1</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="B(E)">B(E)</option>
                        <option value="C1">C1</option>
                        <option value="C1(E)">C1(E)</option>
                        <option value="C">C</option>
                        <option value="C(E)">C(E)</option>
                        <option value="D">D</option>
                        <option value="D(E)">D(E)</option>
                        <option value="F">F</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="form-group" controlId="formNumPermis">
                      <Form.Label>
                        <i className="fas  fa-barcode"></i> Numéro de permis
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="numero_permis_conducteur"
                        placeholder="Entrez le numéro de permis"
                        value={driver?.numero_permis_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formLieuDP">
                      <Form.Label>
                        <i className="fas fa-map-marker-alt"></i> Lieu de
                        délivrance
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="lieu_delivrance_permis_conducteur"
                        placeholder="Entrez le lieu de délivrance"
                        value={driver?.lieu_delivrance_permis_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group
                      className="form-group"
                      controlId="formDateDelivranceP"
                    >
                      <Form.Label>
                        <i className="fas fa-calendar-day"></i> Date de délivrance
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date_delivrance_permis_conducteur"
                        placeholder="Sélectionnez la date de délivrance"
                        value={driver?.date_delivrance_permis_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formDateExp">
                      <Form.Label>
                        <i className="fas fa-calendar-day"></i> Date d'expiration
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date_expir_permis_conducteur"
                        placeholder="Sélectionnez la date d'expiration"
                        value={driver?.date_expir_permis_conducteur || ""}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>
              </Tab>
            </Tabs>
          )}
        </div>

        <div className="col-md-12 footer">
          <button
            onClick={() => {
              cancelClicked();
            }}
            type="button"
            className="btn btn-default"
          >
            {translate("Cancel")}
          </button>
          <Button
            variant="primary"
            type="submit"

            onClick={() => {
              setButtonClicked(true);
              driver &&
                (isEditing
                  ? updateDriver(driver)
                  : createDriver(driver))
            }}

            disabled={buttonClicked}

          >
            {isEditing ? <i className="fas fa-edit"></i> : <i className="fas fa-plus"></i>}
            {isEditing ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </div>
    </>
  );
}

