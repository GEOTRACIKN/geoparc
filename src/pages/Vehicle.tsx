import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Form, Button } from "react-bootstrap";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import  FieldInput  from "../components/Vehicle/FieldInput";

interface VehicleInterface {
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

export function Vehicle() {
  const { id_conducteur } = useParams<{ id_conducteur?: string }>();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const isEditing = Boolean(id_conducteur);
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const id_user = localStorage.getItem("GeopUserID");
  const [Vehicle, setVehicle] = useState<VehicleInterface | null>({
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


// Définition des types pour chaque champ
interface Field {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'tel' | 'email';
  placeholder?: string;
  options?: string[];
  icon: string;
  required?: boolean;
}





const fieldsTab1: Field[] = [
    { id: 'nom_conducteur', label: "Nom du conducteur", type: 'text', placeholder: "Entrez le nom du conducteur", icon: "fas fa-user", required: true },
    { id: 'prenom_conducteur', label: "Prénom du conducteur", type: 'text', placeholder: "Entrez le prénom du conducteur", icon: "fas fa-user", required: true },
    { id: 'code_conducteur', label: "Code d'identification", type: 'number', placeholder: "Entrez le code d'identification", icon: "fas fa-id-card", required: true },
    { id: 'role_conducteur', label: "Fonction du conducteur", type: 'text', placeholder: "Entrez la fonction du conducteur", icon: "fas fa-briefcase", required: false },
    { id: 'date_naissance_conducteur', label: "Date de naissance", type: 'date', placeholder: "Sélectionnez la date de naissance", icon: "fas fa-calendar-day", required: false },
    { id: 'adresse_conducteur', label: "Adresse du conducteur", type: 'text', placeholder: "Entrez l'adresse du conducteur", icon: "fas fa-home", required: false },
    { id: 'ville_conducteur', label: "Ville du conducteur", type: 'text', placeholder: "Entrez la ville", icon: "fas fa-city", required: false },
    { id: 'telephone_conducteur', label: "Téléphone du conducteur", type: 'tel', placeholder: "Entrez le téléphone", icon: "fas fa-phone", required: false },
    { id: 'email_conducteur', label: "Email du conducteur", type: 'email', placeholder: "Entrez l'email", icon: "fas fa-envelope", required: false },
    { id: 'nationalite_conducteur', label: "Nationalité", type: 'text', placeholder: "Entrez la nationalité", icon: "fas fa-globe", required: false }
  ];
  
  const fieldsTab2: Field[] = [
    { id: 'piece_identite_conducteur', label: "Type de la pièce", type: 'select', options: ["Biométrie", "Normal"], icon: "fas fa-id-card", required: false },
    { id: 'numero_piece_identite_conducteur', label: "Numéro de la pièce", type: 'number', placeholder: "Entrez le numéro de la pièce", icon: "fas fa-id-card", required: false },
    { id: 'date_delivrance_pi_conducteur', label: "Date de délivrance", type: 'date', placeholder: "Sélectionnez la date de délivrance", icon: "fas fa-calendar-day", required: false },
    { id: 'lieu_delivrance_pi_conducteur', label: "Lieu de délivrance", type: 'text', placeholder: "Entrez le lieu de délivrance", icon: "fas fa-map-marker-alt", required: false }
  ];
  
  const fieldsTab3: Field[] = [
    { id: 'premis_conducteur', label: "Type de permis", type: 'select', options: ["A1", "A", "B", "B(E)", "C1", "C1(E)", "C", "C(E)", "D", "D(E)", "F"], icon: "fas fa-id-card", required: false },
    { id: 'numero_permis_conducteur', label: "Numéro de permis", type: 'text', placeholder: "Entrez le numéro de permis", icon: "fas fa-barcode", required: false },
    { id: 'lieu_delivrance_permis_conducteur', label: "Lieu de délivrance", type: 'text', placeholder: "Entrez le lieu de délivrance", icon: "fas fa-map-marker-alt", required: false },
    { id: 'date_delivrance_permis_conducteur', label: "Date de délivrance", type: 'date', placeholder: "Sélectionnez la date de délivrance", icon: "fas fa-calendar-day", required: false },
    { id: 'date_expir_permis_conducteur', label: "Date d'expiration", type: 'date', placeholder: "Sélectionnez la date d'expiration", icon: "fas fa-calendar-day", required: false }
  ];

  const fieldsConfig: { [tabName: string]: Field[] } = {
    tab_1: fieldsTab1,
    tab_2: fieldsTab2,
    tab_3: fieldsTab3,
  };
  

  const cancelClicked = () => {
    navigate("/Vehicles");
  };

  useEffect(() => {
    const getVehicle = async () => {
      try {
        // Récupération des informations du conducteur
        const res = await fetch(
          `${backendUrl}/api/geop/Vehicle/find/${id_conducteur}`,
          {
            mode: "cors",
          }
        );

        if (!res.ok) {
          console.error("Erreur lors de la récupération du conducteur");
          setError("Erreur lors de la récupération du conducteur");
          return;
        }

        const data: VehicleInterface = await res.json();
        setVehicle(data);

        setUpdatedCodeConducteur(Vehicle?.code_conducteur || "")


      } catch (error) {
        console.error("Erreur lors de la récupération du conducteur", error);
        setError("Erreur lors de la récupération du conducteur");
      } finally {
        setLoading(false);
      }
    };
    if (isEditing) { getVehicle(); }
    else { setLoading(false); }



  }, [id_conducteur]);

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



  const updateVehicle = async (Vehicle: VehicleInterface) => {

    const isEmailValid = validateEmail(Vehicle.email_conducteur ?? "");
    const isPhoneValid = validatePhone(Vehicle.telephone_conducteur ?? "");
    const isNomConducteurValid = validateString(Vehicle.nom_conducteur ?? "");
    const isPreNomConducteurValid = validateString(Vehicle.prenom_conducteur ?? "");
    const isCodeConducteurValid = validateString(Vehicle.code_conducteur ?? "");

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

      const rescheck = await fetch(`${backendUrl}/api/geop/Vehicle/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          code_conducteur: Vehicle.code_conducteur,
          updated_code_conducteur: Vehicle.code_conducteur,
          updated: Vehicle.code_conducteur === updatedCodeConducteur ? 0 : 1,
        }),
      });

      if (rescheck.ok) {
        const jsonResponse = await rescheck.json();

        if (jsonResponse.Vehicle_count !== 0) {
          toast.warn("Vehicle code already exists", {
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


        let VehicleData = Object.fromEntries(
          Object.entries(Vehicle).filter(([_, value]) => value !== null)
        );

        const dateFields = [
          'date_naissance_conducteur',
          'date_delivrance_permis_conducteur',
          'date_delivrance_pi_conducteur',
          'date_expir_permis_conducteur'
        ];

        VehicleData = Object.fromEntries(
          Object.entries(Vehicle)
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
        const res = await fetch(`${backendUrl}/api/geop/Vehicle/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify(VehicleData),
        });

        if (!res.ok) {
          toast.warn("Can't update Vehicle", {
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

          console.error("Error updating Vehicle");
          setButtonClicked(false);
          return;
        }

        toast.success("Vehicle updated successfully", {
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
        navigate("/Vehicles");
      } else {
        toast.warn("Can't update Vehicle", {
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
      toast.warn("Can't update Vehicle", {
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

  const createVehicle = async (Vehicle: VehicleInterface) => {
    const isEmailValid = validateEmail(Vehicle.email_conducteur ?? "");
    const isPhoneValid = validatePhone(Vehicle.telephone_conducteur ?? "");
    const isNomConducteurValid = validateString(Vehicle.nom_conducteur ?? "");
    const isPreNomConducteurValid = validateString(Vehicle.prenom_conducteur ?? "");
    const isCodeConducteurValid = validateString(Vehicle.code_conducteur ?? "");





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

        // Check if the Vehicle code already exists
        const rescheck = await fetch(`${backendUrl}/api/geop/Vehicle/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            code_conducteur: Vehicle.code_conducteur,
            updated_code_conducteur: Vehicle.code_conducteur,
            update: 0, // For create operation
          }),
        });

        if (rescheck.ok) {
          const jsonResponse = await rescheck.json();

          if (jsonResponse.Vehicle_count != 0) {
            toast.warn("Vehicle code already exists", {
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

          let VehicleData = Object.fromEntries(
            Object.entries(Vehicle).filter(([_, value]) => value !== null)
          );



          const dateFields = [
            'date_naissance_conducteur',
            'date_delivrance_permis_conducteur',
            'date_delivrance_pi_conducteur',
            'date_expir_permis_conducteur'
          ];

          VehicleData = Object.fromEntries(
            Object.entries(Vehicle)
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


          // If validations pass, create the Vehicle
          const res = await fetch(`${backendUrl}/api/geop/Vehicle/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(VehicleData),
          });

          if (!res.ok) {
            toast.warn("Can't create Vehicle", {
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

            console.error("Error creating Vehicle");
            setButtonClicked(false);
            return;
          }

          toast.success("Vehicle created successfully", {
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
          navigate("/Vehicles");
        } else {
          toast.warn("Can't create Vehicle", {
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
        console.error("Can't create Vehicle", error);

        toast.warn("Can't create Vehicle", {
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

    if (Vehicle) {
      setVehicle({
        ...Vehicle,
        [name]: value,
      });
    }


    console.log(Vehicle)

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
            {isEditing ? "Edit vehicle" : "Add vehicle"}
          </h4>
        </div>

        <div className="col-md-12">
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <PropagateLoader color={"#123abc"} loading={loading} size={20} />
            </div>
          ) : (
            <Tabs defaultActiveKey="tab_1" id="vehicle-tabs" className="mb-3">
              {Object.entries(fieldsConfig).map(([tabKey, fields]) => (
                <Tab eventKey={tabKey} title={`Onglet ${tabKey.split('_')[1]}`} key={tabKey}>
                  <div className="row">
                    {fields.map((field) => (
                      <div className="col-md-6" key={field.id}>
                        <FieldInput
                          field={field}
                          value={Vehicle ? Vehicle[field.id as keyof VehicleInterface] : ""}
                          onChange={handleChange}
                        />
                      </div>
                    ))}
                  </div>
                </Tab>
              ))}
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
              Vehicle &&
                (isEditing
                  ? updateVehicle(Vehicle)
                  : createVehicle(Vehicle))
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

