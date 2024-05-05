import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Dropdown, Navbar as NavbarBs } from "react-bootstrap";
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


  const userID: string = localStorage.getItem("userID") ?? "";
  const userName = localStorage.getItem("username");
  const [isOpen, setIsOpen] = useState("");
  const [activeSubmenu, setactiveSubmenu] = useState("");
  const [activeCollapsed, setactiveCollapsed] = useState("collapsed");
  const [activeLogo, setactiveLogo] = useState("header-logo-show");
  const [activeMenuText, setactiveMenuText] = useState("");
  const [menuBtsidebar, setMenuBtsidebar] = useState("iq-menu-bt-sidebar-show");
  const [sidebar, setSidebar] = useState("sidebar-open");
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);


  const { lang, setLang } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
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


  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggle = (isOpen: any) => {
    setDropdownOpen(isOpen);
  };

  const noClick = (event: any) => {
    event.preventDefault();
    // Your custom logic here, e.g., navigate using React Router or perform other actions
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

  return (
    <div className={`iq-top-navbar ${changNavbar ? "navbar-push" : "navbar-pool"}`} >
      <div className="iq-navbar-custom">
        <NavbarBs expand="lg" className="bg-body-tertiary">
          <Container fluid>
            {/* <div
          className={`iq-menu-bt-sidebar ml-0 ${menuBtsidebar}`}
          onClick={() => {
            handlesetIsOpen();
          
            onToggleSidebarinNavbar();
          }}
        >
          <i className={`las la-bars wrapper-menu ${isOpen}`}></i>
        </div> */}
            <NavbarBs.Toggle aria-controls="navbarScroll" />

            <NavbarBs.Collapse id="navbarScroll">

              <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
                {/* <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                </Form> */}
                <NetworkStatusIcon />

              </Nav>
              {/* <NetworkStatusIcon /> */}


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
                  <img src="asset/images/small/flag-en.png" alt="img-flag" className="img-fluid image-flag mr-2" /> English
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleLanguageChange('fr')}>
                  <img src="asset/images/small/flag-fr.png" alt="img-flag" className="img-fluid image-flag mr-2" /> French
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleLanguageChange('ar')}>
                  <img src="asset/images/small/flag-ar.png" alt="img-flag" className="img-fluid image-flag mr-2" /> Arabic
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleLanguageChange('es')}>
                  <img src="asset/images/small/flag-es.png" alt="img-flag" className="img-fluid image-flag mr-2" /> Espagnol
                </NavDropdown.Item>
              </NavDropdown>

              <Dropdown onToggle={handleToggle} show={dropdownOpen}>
                <Dropdown.Toggle
                  as="span"
                  id="dropdownMenuButton4"
                  className="search-toggle"
                  href="#"
                //onClick={noClick}
                >
                  <img src="asset/images/user/1.png" alt="user" style={{ width: "50px" }} className="img-fluid rounded" />
                </Dropdown.Toggle>

                <Dropdown.Menu style={{width: "auto"}}  className='dropdownProfile'> 
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
                          <Button
                            variant="outline-secondary"
                            className="mr-2"
                            onClick={() => navigate(`/profile`)}
                            style={{
                              minWidth: "max-content",
                              border: "1px solid #ddd",
                              borderRadius: "5px",
                            }}
                          >
                            <i className="las la-user"></i>{" "}
                            {translate("Profile")}
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


            </NavbarBs.Collapse>
          </Container>
        </NavbarBs>
      </div>
    </div>
  );
}

export default Navbar;
