import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners"; // Import the loader component
import "../assets/css/bootstrap/bootstrap.css";
import "../assets/css/bootstrap/bootstrap-grid.css";
import "../assets/css/bootstrap/bootstrap-reboot.css";
import "../assets/css/backend-plugin.min.css";
import "../assets/vendor/remixicon/fonts/remixicon.css";
import "../assets/vendor/line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "../assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import { NavDropdown } from "react-bootstrap";
import { useTranslate } from "../hooks/LanguageProvider";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Modal, Button, Form } from "react-bootstrap";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface LoginFormProps {
  onLogin: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [alertMessage, setAlertMessage] = useState("");
  const { translate } = useTranslate();
  const { lang, setLang } = useTranslate();
  const location = useLocation();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedProblem, setSelectedProblem] = useState("forgotPassword");
  const [otherMessage, setOtherMessage] = useState("");

  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation

  const strLang = {
    en: "English",
    fr: "French",
    ar: "Arabic",
    es: "Espagnol",
  };

  const handleLanguageChange = (newLang: any) => {
    setLang(newLang);
  };

  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && loginButtonRef.current) {
        loginButtonRef.current.click();
      }
    };

    document.body.addEventListener("keypress", handleKeyPress);

    return () => {
      document.body.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  function generateRandomString(length:number) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }
  // Fonction pour ajouter des caractères supplémentaires au mot de passe
function addExtraCharactersToPassword(password:String) {
  // Ajoutez ici les caractères supplémentaires
  const extraCharacters = generateRandomString(7); // Par exemple, ajoutez 10 caractères aléatoires
  return extraCharacters + password;
}

  const handleLogin = async () => {
     // Ajoutez des caractères supplémentaires au mot de passe
     const securedPassword = addExtraCharactersToPassword(password);

    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/login`, {
        
        username,
        password:securedPassword,
      });

      onLogin(response.data);
      localStorage.setItem("authToken", response.data.token);
   
      const loginTime = new Date().getTime(); // Store current time
      localStorage.setItem("loginTime", loginTime.toString());
      localStorage.setItem("GeopUserID", response.data.id_user);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("api_key", response.data.api_key); 
      localStorage.setItem("id_role", response.data.id_role); 

      
      // Fetch permissions for the user
      const permissionsResponse = await axios.get(
        `${backendUrl}/api/permission/all/${response.data.id_role}`
      );
      localStorage.setItem(
        "userPermissions",
        JSON.stringify(permissionsResponse.data)
      );

      navigate("/");
    } catch (error) {
      if ((error as any).response && (error as any).response.status === 401) {
        setAlertMessage(translate("incorrectCredentials")); // Translate the message
      } else if (
        (error as any).response &&
        (error as any).response.status === 500
      ) {
        setAlertMessage(translate("connectionProblem")); // Translate the message
      } else if (
        (error as any).response &&
        (error as any).response.status === 402
      ) {
        setAlertMessage(translate("userNotFound")); // Translate the message
      }
      console.error("Login error", error);
    } finally {
      setLoading(false); // Set loading to false on login completion (success or failure)
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUserID = localStorage.getItem("GeopUserID");
    if (savedToken && savedUserID === "1") {
      navigate("/"); // Rediriger directement vers la page principale si l'userID est égal à 1
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      navigate(location.pathname); // Rediriger l'utilisateur vers la page d'accueil s'il est déjà connecté
    }
  }, [location.pathname]);

  // Refs for form fields
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const userNameRef = useRef(null);
  const companyRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const handleSubmit = async () => {
    try {
      const firstName =
        (firstNameRef.current as HTMLInputElement | null)?.value ?? "";
      const lastName =
        (lastNameRef.current as HTMLInputElement | null)?.value ?? "";
      const userName =
        (userNameRef.current as HTMLInputElement | null)?.value ?? "";
      const company =
        (companyRef.current as HTMLInputElement | null)?.value ?? "";
      const email = (emailRef.current as HTMLInputElement | null)?.value ?? "";
      const phone = (phoneRef.current as HTMLInputElement | null)?.value ?? "";

      // Vérification supplémentaire des valeurs requises
      if (
        !firstName ||
        !lastName ||
        !userName ||
        !company ||
        !email ||
        !phone ||
        !selectedProblem
      ) {
        console.error("Missing form values");
        return;
      }

      const response = await axios.post(`${backendUrl}/api/submit-form`, {
        firstName,
        lastName,
        userName,
        company,
        email,
        phone,
        problem: selectedProblem,
        otherMessage,
      });

      // Handle success response if needed
     
      handleClose(); // Fermer le modal après une soumission réussie
    } catch (error) {
      // Handle error response if needed
      console.error("Form submission error", error);
    }
  };

  return (
    <div className="wrapper">
      <section className="login-content">
        <div className="row">
          <div className="col-sm-6" style={{ margin: 0, padding: 0 }}>
            <img
              src="asset/images/geotrackin.jpg"
              className="float-left img-fluid d-none d-sm-block"
              alt="algerie geotrackin"
            />
          </div>
          <div className="col-sm-6" style={{ padding: "25px 30px" }}>
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-6">
                  <img
                    src="asset/images/logo.png"
                    alt="Idenet IVMS"
                    className="img-fluid small-logo float-left"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      marginTop: "40px",
                    }}
                  />
                </div>
                <div
                  className="col-lg-6 d-flex justify-content-end order-0 order-lg-1"
                  style={{ padding: "25px 30px" }}
                >
                  <NavDropdown
                    title={
                      <span>
                        <img
                          src={`asset/images/small/flag-${lang}.png`}
                          alt={lang}
                        />
                        <span> {strLang[lang]}</span>
                      </span>
                    }
                    id="navbarScrollingDropdown"
                  >
                    <NavDropdown.Item
                      onClick={() => handleLanguageChange("en")}
                    >
                      {" "}
                      <img
                        src="asset/images/small/flag-en.png"
                        alt="img-flag"
                        className="img-fluid image-flag mr-2"
                      />{" "}
                      English
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => handleLanguageChange("fr")}
                    >
                      {" "}
                      <img
                        src="asset/images/small/flag-fr.png"
                        alt="img-flag"
                        className="img-fluid image-flag mr-2"
                      />{" "}
                      French{" "}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => handleLanguageChange("ar")}
                    >
                      {" "}
                      <img
                        src="asset/images/small/flag-ar.png"
                        alt="img-flag"
                        className="img-fluid image-flag mr-2"
                      />{" "}
                      Arabic
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => handleLanguageChange("es")}
                    >
                      {" "}
                      <img
                        src="asset/images/small/flag-es.png"
                        alt="img-flag"
                        className="img-fluid image-flag mr-2"
                      />{" "}
                      Espagnol
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              </div>

              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "75vh" }}
              >
                <div className="container">
                  <div className="col-lg-8 mx-auto">
                    <div className="p-3">
                      <h2 className="mb-2">
                        {translate("Customer space")} , {translate("Login")}!
                      </h2>
                      <p>{translate("Please enter your details to login")}!</p>

                      <form className="smart-form client-form client-form-size">
                        <div id="resText"></div>
                        <div className="row">
                          <div className="col-lg-12">
                            <label>{translate("Username")}</label>
                            <div className="floating-label form-group">
                              <input
                                className="floating-input form-control"
                                type="text"
                                placeholder="Enter your username"
                                name="username"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <label>{translate("Password")}</label>
                            <div
                              className="floating-label form-group"
                              style={{ position: "relative" }}
                            >
                              <input
                                className="floating-input form-control"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <span
                                className={`password-toggle-icon ${
                                  showPassword ? "visible" : ""
                                }`}
                                style={{
                                  position: "absolute",
                                  right: "10px",
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

                          <div className="col-lg-6">
                            {/* Votre checkbox ici */}
                          </div>

                          <div className="text-center">
                            <button
                              type="button"
                              className="btn btn-primary mb-4 mx-auto d-block"
                              onClick={handleLogin}
                              ref={loginButtonRef}
                            >
                              {translate("Login")}
                            </button>
                          </div>
                          {loading && (
                            <div className="text-center">
                              <BeatLoader
                                color={"#123abc"}
                                loading={loading}
                                size={12}
                              />
                            </div>
                          )}
                        </div>
                        <div className="col-lg-8">
                          <a
                            className="float-right"
                            style={{
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={handleShow}
                          >
                            {translate("Forgot your password")}?
                          </a>
                        </div>
                        <br />
                        <br />
                        {alertMessage && (
                          <div
                            style={{
                              padding: "15px",
                              marginBottom: "20px",
                              border: "1px solid transparent",
                              borderRadius: "4px",
                              color: "#721c24",
                              backgroundColor: "#f8d7da",
                              borderColor: "#f5c6cb",
                              alignItems: "center",
                              textAlign: "center",
                            }}
                            role="alert"
                          >
                            {alertMessage}
                          </div>
                        )}
                        <p
                          className="description-text"
                          style={{ marginBottom: 0, textAlign: "center" }}
                        >
                          {translate("By clicking")}
                          <span className="text-grey1 fw6">
                            {" "}
                            {translate("Login")}{" "}
                          </span>
                          ,{translate("you are agreeing to our")}
                          <a
                            className="text-grey1 text-underline-none fw6"
                            href="/termsofuse"
                            target="_blank"
                          >
                            {translate("Terms of use")}
                          </a>{" "}
                          &amp;{" "}
                          <a
                            className="text-grey1 text-underline-none fw6"
                            href="/privacypolicy"
                            target="_blank"
                          >
                            {translate("Privacy Policy")}
                          </a>
                          .
                        </p>
                      </form>
                    </div>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>
                          {translate("Forgot Password")}
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          <Form.Group controlId="firstName">
                            <Form.Label>{translate("first name")}</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={translate("first name")}
                              ref={firstNameRef}
                            />
                          </Form.Group>
                          <Form.Group controlId="lastName">
                            <Form.Label>{translate("Family Name")}</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={translate("Family Name")}
                              ref={lastNameRef}
                            />
                          </Form.Group>
                          <Form.Group controlId="userName">
                            <Form.Label>{translate("Username")}</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={translate("Username")}
                              ref={userNameRef}
                            />
                          </Form.Group>
                          <Form.Group controlId="Company">
                            <Form.Label>{translate("Utilisateur")}</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={translate("Utilisateur")}
                              ref={companyRef}
                            />
                          </Form.Group>
                          <Form.Group controlId="email">
                            <Form.Label>{translate("Email")}</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder={translate("Email")}
                              ref={emailRef}
                            />
                          </Form.Group>
                          <Form.Group controlId="phone">
                            <Form.Label>{translate("Phone")}</Form.Label>
                            <Form.Control
                              type="phone"
                              placeholder={translate("Phone")}
                              ref={phoneRef}
                            />
                          </Form.Group>
                          <Form.Group>
                            <br />
                            <Form.Label>
                              {translate("What seems to be the problem?")}
                            </Form.Label>
                            <Form.Check
                              type="radio"
                              id="forgotPassword"
                              name="problem"
                              label={translate("Forgot Password")}
                              checked={
                                selectedProblem === translate("Forgot Password")
                              }
                              onChange={() =>
                                setSelectedProblem(translate("Forgot Password"))
                              }
                            />
                            <Form.Check
                              type="radio"
                              id="connectionProblem"
                              name="problem"
                              label={translate("Connection Problem")}
                              checked={
                                selectedProblem ===
                                translate("Connection Problem")
                              }
                              onChange={() =>
                                setSelectedProblem(
                                  translate("Connection Problem")
                                )
                              }
                            />
                            <Form.Check
                              type="radio"
                              id="other"
                              name="problem"
                              label={translate("Other")}
                              checked={selectedProblem === "other"}
                              onChange={() => setSelectedProblem("other")}
                            />
                            {selectedProblem === "other" && (
                              <Form.Group controlId="otherMessage">
                                <Form.Label>
                                  {translate("Please describe the issue:")}
                                </Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  value={otherMessage}
                                  onChange={(e) =>
                                    setOtherMessage(e.target.value)
                                  }
                                />
                              </Form.Group>
                            )}
                          </Form.Group>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          {translate("Close")}
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                          {translate("Submit")}
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginForm;
