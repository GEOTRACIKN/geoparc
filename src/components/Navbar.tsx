import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Image, Dropdown, Navbar as NavbarBs, NavLink, Badge, Card } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useTranslate } from './LanguageProvider';
import Cookies from 'universal-cookie';
import Logout from './Logout';
import NetworkStatusIcon from './NetworkStatusIcon';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface NavbarProps {
  changNavbar: boolean;
  onToggleSidebarinNavbar: () => void;
}

interface SidebarProps {

}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebarinNavbar, changNavbar }) => {

  const userName = localStorage.getItem("username");
  const [isOpen, setIsOpen] = useState("");
  const [activeLogo, setactiveLogo] = useState("header-logo-show");
  const [activeMenuText, setactiveMenuText] = useState("");
  const [menuBtsidebar, setMenuBtsidebar] = useState("iq-menu-bt-sidebar-show");
  const [sidebar, setSidebar] = useState("sidebar-open");

  const [shownenu, setShownenu] = useState("");



  const { lang, setLang } = useTranslate();
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const handleLanguageChange = (newLang: any) => {
    setLang(newLang);
  };

  const strLang = {
    en: 'English',
    fr: 'French',
    ar: 'Arabic',
    es: 'Espagnol',
  };



  const handleLogout = () => {

    localStorage.removeItem("authToken"); // Supprimer le token du localStorage
    localStorage.removeItem("userID"); // Supprimer le token du localStorage
    const cookies = new Cookies();
    // cookies.remove('jwtToken');
    navigate("/login"); // Rediriger l'utilisateur vers la page de connexion
  };
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "logoutEvent") {
        // La déconnexion s'est produite, déconnectez l'utilisateur
        handleLogout();
      }
    };

    // Ajouter un écouteur d'événement de stockage local
    window.addEventListener("storage", handleStorageChange);

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  useEffect(() => {
    let inactivityTimeout: NodeJS.Timeout;

    const handleActivity = () => {
      clearTimeout(inactivityTimeout); // Reset the timeout on user activity
      inactivityTimeout = setTimeout(() => {
        // Auto logout after 2 minutes of inactivity
        handleLogout();
      }, 900000); // 2 minutes in milliseconds
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'logoutEvent') {
        handleLogout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearTimeout(inactivityTimeout);
    };
  }, []);


  const [dropdownOpenNofification, setDropdownOpenNofification] = useState(false);
  const [dropdownOpenProfile, setDropdownOpenProfile] = useState(false);
 
  const handleToggleNofification = (DropdownOpen: any) => {
    setDropdownOpenNofification(DropdownOpen);
  }; 


  const handleToggleProfile = (DropdownOpen: any) => {
    setDropdownOpenProfile(DropdownOpen);
  };


  const handlesetIsOpen = () => {
    isOpen == "open" ? setIsOpen("") : setIsOpen("open");

    sidebar == "sidebar-close"
      ? setSidebar("sidebar-open")
      : setSidebar("sidebar-close");

    activeLogo == "header-logo-show"
      ? setactiveLogo("header-logo-hide")
      : setactiveLogo("header-logo-show");
    activeMenuText == "iq-menu-span-hide"
      ? setactiveMenuText("")
      : setactiveMenuText("iq-menu-span-hide");
    menuBtsidebar == "iq-menu-bt-sidebar-show"
      ? setMenuBtsidebar("iq-menu-bt-sidebar-hide")
      : setMenuBtsidebar("iq-menu-bt-sidebar-show");
  };

  const toggleMenu = () => {
    setShownenu(shownenu === "" ? "show" : "");
  };

  return (
    <div className={`iq-top-navbar  ${changNavbar ? "navbar-push" : "navbar-pool"}`} >
      <div className="iq-navbar-custom">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
            <i className={` wrapper-menu `}
              onClick={() => {
                handlesetIsOpen();
                onToggleSidebarinNavbar();
              }}
            >  </i>
            <Nav.Link to="/" className={`header-logo`} as={NavLink}>
              <Image className="img-fluid rounded-normal light-logo" style={{ height: "22px", width: "136px", paddingLeft: 15 }} src="asset/images/logo.png" ></Image>
            </Nav.Link>
          </div>

          <div className="d-flex align-items-center">

            <button onClick={toggleMenu} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-label="Toggle navigation" aria-expanded="true">
              <i className="ri-menu-3-line"></i>
            </button>

            <div className={`navbar-collapse collapse ${shownenu}`} id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto navbar-list align-items-center">

                <li className="nav-item nav-icon dropdown" style={{ margin: "0 5px" }}>
                  <NavDropdown
                    title={
                      <span>
                        <img src={`asset/images/small/flag-${lang}.png`} alt={lang} />
                        <span> {strLang[lang]}</span>
                      </span>
                    }
                    id="navbarScrollingDropdown"
                  >
                    <NavDropdown.Item onClick={() => handleLanguageChange('en')}>
                      <img src="asset/images/small/flag-en.png" alt="img-flag" className="img-fluid image-flag mr-2" /> {translate("English")}
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleLanguageChange('fr')}>
                      <img src="asset/images/small/flag-fr.png" alt="img-flag" className="img-fluid image-flag mr-2" /> {translate("French")}
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleLanguageChange('ar')}>
                      <img src="asset/images/small/flag-ar.png" alt="img-flag" className="img-fluid image-flag mr-2" /> {translate("Arabic")}
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleLanguageChange('es')}>
                      <img src="asset/images/small/flag-es.png" alt="img-flag" className="img-fluid image-flag mr-2" /> {translate("Spanish")}
                    </NavDropdown.Item>
                  </NavDropdown>
                </li>

                <li className="nav-item nav-icon dropdown show" style={{ margin: "0 5px" }}>
                  <Dropdown onToggle={handleToggleNofification} >  
                    <Dropdown.Toggle as="span" id="dropdownMenuButton5" className="search-toggle" href="#">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-bell"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </span>
                    </Dropdown.Toggle> 
 
                    <Dropdown.Menu className="iq-sub-dropdown dropdown-menu" show={dropdownOpenNofification} aria-labelledby="dropdownMenuButton5">
                      <Card className="shadow-none m-0">
                        <Card.Body className="p-0">
                          <div className="cust-title p-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <h5 className="mb-0">Notifications</h5>
                              <Badge className="badge-card">3</Badge>
                            </div>
                          </div>
                          <div className="px-3 pt-0 pb-0 sub-card">
                            <a href="#" className="iq-sub-card">
                              <div className="media align-items-center cust-card py-3 border-bottom">
                                <div>
                                  <img className="avatar-50 rounded-small" src="../asset/images/icon-report/3.png" alt="01" />
                                </div>
                                <div className="media-body ml-3">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <h6 className="mb-0">Emma Watson</h6>
                                    <small className="text-dark"><b>12 : 47 pm</b></small>
                                  </div>
                                  <small className="mb-0">Lorem ipsum dolor sit amet</small>
                                </div>
                              </div>
                            </a>
                            <a href="#" className="iq-sub-card">
                              <div className="media align-items-center cust-card py-3 border-bottom">
                                <div>
                                  <img className="avatar-50 rounded-small" src="../asset/images/icon-report/3.png" alt="01" />
                                </div>
                                <div className="media-body ml-3">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <h6 className="mb-0">Emma Watson</h6>
                                    <small className="text-dark"><b>12 : 47 pm</b></small>
                                  </div>
                                  <small className="mb-0">Lorem ipsum dolor sit amet</small>
                                </div>
                              </div>
                            </a>
                          </div>
                          <button className="right-ic btn btn-primary btn-block position-relative p-2" onClick={() => window.location.href = "/notifications"}>View All</button>
                        </Card.Body>
                      </Card>
                    </Dropdown.Menu> 
                  </Dropdown>
                </li>

                <li className="nav-item nav-icon dropdown" style={{ margin: "0 5px" }}>
                  <Dropdown onToggle={handleToggleProfile} show={dropdownOpenProfile}>
                    <Dropdown.Toggle as="span" id="dropdownMenuButton4" className="search-toggle" href="#">
                      <img src="asset/images/user/1.png" alt="user" style={{ width: "50px" }} className="img-fluid rounded" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ width: "auto", inset: "auto auto auto auto" }} className='dropdownProfile'>
                      <div className="card shadow-none border-0 m-0">
                        <div className="card-body p-0 text-center">
                          <div className="media-body profile-detail text-center">
                            <img src="asset/images/page-img/profile-bg.jpg" alt="profile-bg" className="rounded-top img-fluid mb-4" />
                            <img src="asset/images/user/blank.png" alt="profile-img" className="rounded profile-img img-fluid avatar-70" />
                          </div>
                          <div className="p-3">
                            <h5 className="mb-1">{userName}</h5>
                            <p className="mb-0"></p>
                            <div className="d-flex align-items-center justify-content-center mt-3">
                              <Button variant="outline-secondary" className="mr-2" onClick={() => navigate(`/profile`)} style={{ minWidth: "max-content", border: "1px solid #ddd", borderRadius: "5px" }}>
                                <i className="las la-user"></i> {translate("Profile")}
                              </Button>
                              <span style={{ minWidth: "max-content", border: "1px solid #ddd", borderRadius: "5px" }}>
                                <Logout onLogout={handleLogout} activeMenu={""} title={translate("Logout")} margin={'ml-1'} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </ul>
            </div>

          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
