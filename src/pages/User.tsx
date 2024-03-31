import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useTranslate } from "../components/LanguageProvider";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Bounce, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface UserOption {
  label: string;
  value: string; // ou le type approprié pour votre identifiant utilisateur
}
interface User {
  id_user: string;
  nom_user: string;
  prenom_user: string;
  nom_role: string;
  id_role: string;

  // ... autres champs
}

interface RequestBody {
  first_name: string;
  middle_name: string;
  phone: string;
  email: string;
  username: string;
  passwd: string;
  userM: string | null;
  roleUser: string;
  wilaya: string;
  validite: string;
  manager?: string; // Ajoutez cette ligne
}

const User: React.FC = () => {
  const [userData, setUserData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    username: "",
    motDePasse: "",
    wilaya: "",
    affecteA: "",
    roles: "",
    valideJusqua: "",
  });
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");
  const [affecteAOptions, setAffecteAOptions] = useState<UserOption[]>([]);
  const [rolesOptions, setRolesOptions] = useState<UserOption[]>([]);
  const [userExists, setUserExists] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userUpdateConfirmed, setUserUpdateConfirmed] = useState(false);
  const { translate } = useTranslate();
  const [showPassword, setShowPassword] = useState(false);

  const { userurlID } = useParams();
  const isEditMode = !!userurlID;

  useEffect(() => {
    const fetchUserData = async () => {
      if (isEditMode) {
        try {
          const response = await fetch(
            `${backendUrl}/api/userform/${userurlID}`
          );
          const userData = await response.json();

          // Remplir le formulaire avec les données de l'utilisateur
          setUserData({
            nom: userData.nom_user,
            prenom: userData.prenom_user,
            telephone: userData.phone_user,
            email: userData.email_user,
            username: userData.username_user,
            motDePasse: "", // Vous pouvez choisir de ne pas remplir le mot de passe en mode édition
            wilaya: userData.wilaya,
            affecteA: userData.affecteA,
            roles: userData.id_role,
            valideJusqua: userData.validite,
          });
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des détails de l'utilisateur :",
            error
          );
        }
      }
    };

    fetchUserData();
  }, [isEditMode, userurlID]);

  useEffect(() => {
    const fetchAffecteAOptions = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/options/user/${userID}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setAffecteAOptions(
            data.map((user: User) => ({
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
    const fetchRolesOptions = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/roles/user/${userID}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setRolesOptions(
            data.map((role: User) => ({
              label: role.nom_role,
              value: role.id_role,
            }))
          );
        } else {
          console.error(
            "La réponse de l'API des rôles n'est pas un tableau :",
            data
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des rôles du sélecteur",
          error
        );
      }
    };

    fetchAffecteAOptions();
    fetchRolesOptions();
  }, [userID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleUsernametChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newUsername = e.target.value;
    setUserData({
      ...userData,
      username: newUsername,
    });

    try {
      if (newUsername !== "") {
        const response = await fetch(`${backendUrl}/api/verifierUtilisateur`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ thisusername: newUsername }),
        });

        if (!response.ok) {
          console.error("Erreur lors de la requête API:", response.statusText);
          return;
        }

        const data = await response.json();

        setUserExists(data.exist);
      } else {
        // Si le champ de nom d'utilisateur est vide, ne montrez aucun message
        setUserExists(false);
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
    }
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setUserData({
      ...userData,
      wilaya: value,
    });
  };
  const handleCancel = () => {
    // Annuler l'ajout et revenir à la page des utilisateurs
    navigate("/users");
  };
  const handleModalClose = () => {
    // Fermer la modal de succès
    setShowSuccessModal(false);
    navigate("/users");
    // Rediriger ou effectuer d'autres actions après la fermeture de la modal
    if (userUpdateConfirmed) {
      // Effectuez des actions spécifiques à la confirmation de la mise à jour
    } else {
      // Effectuez des actions spécifiques à l'ajout
      navigate("/users");
    }
  };

  const handleAddUser = async () => {
    // Validation des champs requis
    setErrors([]);

    // Validation des champs requis
    if (
      userData.nom === "" ||
      userData.prenom === "" ||
      userData.username === "" ||
      userData.motDePasse === "" ||
      userData.wilaya === "" ||
      userData.affecteA === "" ||
      userData.roles === ""
    ) {
      setErrors(["Veuillez remplir tous les champs obligatoires"]);
      return;
    }

    // Validation de l'existence du nom d'utilisateur
    if (userExists) {
      setErrors(["Le nom d'utilisateur existe déjà"]);
      return;
    }
    if (userData.motDePasse !== confirmationMotDePasse) {
      setErrors(["Les mots de passe ne correspondent pas"]);
      return;
    }

    try {
      const requestBody: RequestBody = {
        first_name: userData.nom,
        middle_name: userData.prenom,
        passwd: userData.motDePasse,
        email: userData.email,
        username: userData.username,
        wilaya: userData.wilaya,
        phone: userData.telephone,
        userM: userData.affecteA,
        roleUser: userData.roles,
        validite: userData.valideJusqua,
      };

      const response = await fetch(`${backendUrl}/api/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        // Afficher la modal de succès
        toast.success(
          isEditMode
            ? translate("Utilisateur modifié avec succès")
            : translate("Utilisateur ajouté avec succès"),
          {
            position: "bottom-right",
            autoClose: 2400,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      } else {
        console.error("Échec de la requête API", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel de l'API", error);
    }
    try {
      const timestamp = new Date(Date.now() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const details = `Add new user: ${userData.nom}`; // Details for the log

      await fetch(`${backendUrl}/api/log-user-action/${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add",
          page: "Users",
          operation: "ajout",
          timestamp,
          details,
        }),
      });
    } catch (error) {
      console.error("Error logging user action:", error);
    }
  };

  // Fonction pour mettre à jour un utilisateur
  const handleUpdateUser = async () => {
    // Validation des champs requis
    setErrors([]);

    // Validation des champs requis
    if (
      userData.nom === "" ||
      userData.prenom === "" ||
      userData.username === "" ||
      userData.motDePasse === "" ||
      userData.wilaya === "" ||
      userData.affecteA === "" ||
      userData.roles === ""
    ) {
      setErrors(["Veuillez remplir tous les champs obligatoires"]);
      return;
    }

    try {
      const requestBody: RequestBody = {
        first_name: userData.nom,
        middle_name: userData.prenom,
        passwd: userData.motDePasse,
        email: userData.email,
        username: userData.username,
        wilaya: userData.wilaya,
        phone: userData.telephone,
        userM: userData.affecteA,
        roleUser: userData.roles,
        validite: userData.valideJusqua,
      };

      // Ajoutez ici la logique spécifique pour l'envoi de la requête de mise à jour
      const response = await fetch(`${backendUrl}/api/updateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userurlID, // Assurez-vous que vous avez l'ID utilisateur correct
          ...requestBody,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          isEditMode
            ? "Utilisateur modifié avec succès"
            : "Utilisateur ajouté avec succès",
          {
            position: "bottom-right",
            autoClose: 2400,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      } else {
        console.error(
          "Échec de la requête API pour la mise à jour",
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'appel de l'API pour la mise à jour",
        error
      );
    }
    try {
      const timestamp = new Date(Date.now() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const details = `update user: ${userData.nom}`; // Details for the log

      await fetch(`${backendUrl}/api/log-user-action/${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "Update",
          page: "Users",
          operation: "Modifier",
          timestamp,
          details,
        }),
      });
    } catch (error) {
      console.error("Error logging user action:", error);
    }

    setShowConfirmationModal(true);
  };
  // open modal for user action 
  const handleOpenConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  // confirm button for user action add and modify
  const handleConfirmUpdate = async () => {
    setShowConfirmationModal(false);
    setUserUpdateConfirmed(true);

    // Effectuer l'action correspondante (ajout ou modification de l'utilisateur)
    if (isEditMode) {
      await handleUpdateUser();
    } else {
      await handleAddUser();
    }

    // Rediriger après l'action
    navigate("/users");
  };

  return (
    <div className="container mt-5">
      <div className="mb-3 row">
        <div className="col-sm-12">
          <div className="border d-flex align-items-center mb-4">
            <i className="las la-edit" style={{ fontSize: " 2.5em" }}></i>
            <h2 className="me-5">{isEditMode ? "modify User" : "Add User"}</h2>
          </div>
        </div>
      </div>
      <form>
        <div className="mb-3 row">
          <label htmlFor="nom" className="col-sm-2 col-form-label">
            {translate("Family Name")} * :
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="nom"
              name="nom"
              value={userData.nom}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="prenom" className="col-sm-2 col-form-label">
            {translate("first name")} * :
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="prenom"
              name="prenom"
              value={userData.prenom}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="phone" className="col-sm-2 col-form-label">
            {translate("Phone")} * :
          </label>
          <div className="col-sm-10">
            <input
              type="tel"
              className="form-control"
              id="telephone"
              name="telephone"
              value={userData.telephone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="email" className="col-sm-2 col-form-label">
            {translate("Email")} *:
          </label>
          <div className="col-sm-10">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="username" className="col-sm-2 col-form-label">
            {translate("User name")} * :
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleUsernametChange}
              required
            />
            {userExists && (
              <p id="textindiqusername" style={{ color: "red" }}>
                {translate("Nom d'utilisateur déjà existant !")}
              </p>
            )}
            {!userExists && userData.username !== "" && (
              <p id="textindiqusername" style={{ color: "green" }}>
                {translate("Nom d'utilisateur accepté")}
              </p>
            )}
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="motDePasse" className="col-sm-2 col-form-label">
            {translate("Mot de passe")} * :
          </label>
          <div className="col-sm-10 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="motDePasse"
              name="motDePasse"
              value={userData.motDePasse}
              onChange={handleInputChange}
              required
            />
            <span
              className={`password-toggle-icon ${
                showPassword ? "visible" : ""
              }`}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOff /> : <IoEye />}
            </span>
          </div>
        </div>
        <div className="mb-3 row">
          <label
            htmlFor="confirmationMotDePasse"
            className="col-sm-2 col-form-label"
          >
            {translate("Confirmer le mot de passe *")}
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              className={`form-control ${
                userData.motDePasse !== confirmationMotDePasse
                  ? "is-invalid"
                  : ""
              }`}
              id="confirmationMotDePasse"
              name="confirmationMotDePasse"
              value={confirmationMotDePasse}
              onChange={(e) => setConfirmationMotDePasse(e.target.value)}
              required
            />

            {userData.motDePasse !== confirmationMotDePasse && (
              <p className="invalid-feedback">
                {translate("Les mots de passe ne correspondent pas")}
              </p>
            )}
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="ville" className="col-sm-2 col-form-label">
            {translate("Ville")} :
          </label>
          <div className="col-sm-10">
            <select
              className="form-select"
              id="wilaya"
              name="wilaya"
              value={userData.wilaya}
              onChange={handleWilayaChange}
            >
              <option value="">{translate("Sélectionnez une wilaya")}</option>{" "}
              {/* Ajoutez cette ligne */}
              <option value="Adrar">Adrar</option>
              <option value="Chlef">Chlef</option>
              <option value="Laghouat">Laghouat</option>
              <option value="Oum El Bouaghi">Oum El Bouaghi</option>
              <option value="Batna">Batna</option>
              <option value="Béjaïa">Béjaïa</option>
              <option value="Biskra">Biskra</option>
              <option value="Béchar">Béchar</option>
              <option value="Blida">Blida</option>
              <option value="Bouira">Bouira</option>
              <option value="Tamanrasset">Tamanrasset</option>
              <option value="Tébessa">Tébessa</option>
              <option value="Tlemcen">Tlemcen</option>
              <option value="Tiaret">Tiaret</option>
              <option value="Tizi Ouzou">Tizi Ouzou</option>
              <option value="Alger">Alger</option>
              <option value="Djelfa">Djelfa</option>
              <option value="Jijel">Jijel</option>
              <option value="Sétif">Sétif</option>
              <option value="Saïda">Saïda</option>
              <option value="Skikda">Skikda</option>
              <option value="Sidi Bel Abbès">Sidi Bel Abbès</option>
              <option value="Annaba">Annaba</option>
              <option value="Guelma">Guelma</option>
              <option value="Constantine">Constantine</option>
              <option value="Médéa">Médéa</option>
              <option value="Mostaganem">Mostaganem</option>
              <option value="M'Sila">M'Sila</option>
              <option value="Mascara">Mascara</option>
              <option value="Ouargla">Ouargla</option>
              <option value="Oran">Oran</option>
              <option value="El Bayadh">El Bayadh</option>
              <option value="Illizi">Illizi</option>
              <option value="Bordj Bou Arréridj">Bordj Bou Arréridj</option>
              <option value="Boumerdès">Boumerdès</option>
              <option value="El Tarf">El Tarf</option>
              <option value="Tindouf">Tindouf</option>
              <option value="Tissemsilt">Tissemsilt</option>
              <option value="El Oued">El Oued</option>
              <option value="Khenchela">Khenchela</option>
              <option value="Souk Ahras">Souk Ahras</option>
              <option value="Tipaza">Tipaza</option>
              <option value="Mila">Mila</option>
              <option value="Aïn Defla">Aïn Defla</option>
              <option value="Naâma">Naâma</option>
              <option value="Aïn Témouchent">Aïn Témouchent</option>
              <option value="Ghardaïa">Ghardaïa</option>
              <option value="Relizane">Relizane</option>
            </select>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="affecteA" className="col-sm-2 col-form-label">
            {translate("Affecter à")} * :
          </label>
          <div className="col-sm-10">
            <select
              className="form-select"
              id="affecteA"
              name="affecteA"
              value={userData.affecteA}
              onChange={handleSelectChange}
              required
            >
              <option value="0"> {translate("User")}</option>
              {affecteAOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="profil" className="col-sm-2 col-form-label">
            {translate("Profil")} * :
          </label>
          <div className="col-sm-10">
            <select
              className="form-select"
              id="roles"
              name="roles"
              value={userData.roles}
              onChange={handleSelectChange}
              required
            >
              <option value="0"> {translate("Select a role")}</option>
              {rolesOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="valideJusqua" className="col-sm-2 col-form-label">
            {translate("Valid until")}
          </label>
          <div className="col-sm-10">
            <input
              type="date"
              className="form-control"
              id="valideJusqua"
              name="valideJusqua"
              value={userData.valideJusqua}
              onChange={handleInputChange}
            />
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

        <div className="mb-3 row">
          <div className="col-sm-12 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleCancel}
            >
              <i className="fa fa-times" />
              {translate("Cancel")}
            </button>

            <button
            id="saveuser"
            type="button"
            className={`btn ${isEditMode ? "btn-warning" : "btn-success"}`}
            onClick={handleOpenConfirmationModal} // Ouvrir la modal de confirmation au lieu d'appeler directement handleAddUser ou handleUpdateUser
          >
              <i className={`fa ${isEditMode ? "fa-edit" : "fa-user"}`} />
              {isEditMode ? translate("modify User") : translate("Add User")}
            </button>
          </div>

          <Modal
          show={showConfirmationModal}
          onHide={() => setShowConfirmationModal(false)} // Fermer la modal de confirmation si l'utilisateur clique sur le bouton "Cancel" ou en dehors de la modal
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{translate("Confirmation of modification.")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {translate("Are you sure you want to modify this user?")}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
              {translate("Cancel")}
            </Button>
            <Button variant="primary" onClick={handleConfirmUpdate}> 
              {translate("Confirm")}
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
      </form>
    </div>
  );
};

export default User;
