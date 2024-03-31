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
import { useTranslate } from "../components/LanguageProvider";
import { IoEye, IoEyeOff } from "react-icons/io5";
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




  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/login`, {
        username,
        password,
      });

      onLogin(response.data);
      localStorage.setItem("authToken", response.data.token);
      console.log(response.data.username);
      const loginTime = new Date().getTime(); // Store current time 
      localStorage.setItem("loginTime", loginTime.toString());
      localStorage.setItem("userID", response.data.id_user);
      localStorage.setItem("username", response.data.username); 
 
      

       // Fetch permissions for the user
       const permissionsResponse = await axios.get(`${backendUrl}/api/permission/all/${response.data.id_user}`);
       localStorage.setItem("userPermissions", JSON.stringify(permissionsResponse.data));
      
      navigate("/");
    } catch (error) {
      if ((error as any).response && (error as any).response.status === 401) {
        setAlertMessage("Incorrect username or password");
      } else if (
        (error as any).response &&
        (error as any).response.status === 500
      ) {
        setAlertMessage("Error searching for the user");
      } else if (
        (error as any).response &&
        (error as any).response.status === 402
      ) {
        setAlertMessage("User not found");
      }
      console.error("Login error", error);
    } finally {
      setLoading(false); // Set loading to false on login completion (success or failure)
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUserID = localStorage.getItem("userID");
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
                style={{ height: "60vh" }}
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
                            href="auth-recoverpw.html"
                            className="float-right"
                            style={{ textDecoration: "underline" }}
                          >
                            {translate("Forgot your password")}?
                          </a>
                        </div>
                        <br />
                        <br />
                        {alertMessage && (
                          <div className="alert alert-danger" role="alert">
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