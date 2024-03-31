import React, { useEffect, useState } from "react";
import { Nav, Image } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

import "./Sidebar.css";
import { useTranslate } from "./LanguageProvider";
import Cookies from "universal-cookie";
import Logout from "./Logout";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface SidebarProps {
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleSidebar }) => {
  const { translate } = useTranslate();

  const [isOpen, setIsOpen] = useState("");
  const [activeSubmenu, setactiveSubmenu] = useState("");
  const [activeCollapsed, setactiveCollapsed] = useState("collapsed");
  const [activeLogo, setactiveLogo] = useState("header-logo-show");
  const [activeMenuText, setactiveMenuText] = useState("");
  const [menuBtsidebar, setMenuBtsidebar] = useState("iq-menu-bt-sidebar-show");
  const [sidebar, setSidebar] = useState("sidebar-open");
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");



  interface Permission {
    id_rel: number;
    id_role: number;
    id_permission: number;
    nom_permision: string;
    can_create: number;
    can_read: number;
    can_update: number;
    can_delete: number;
  }

  let userPermissions: Permission[] = [];

  try {
    const permissionsString = localStorage.getItem("userPermissions");
    if (permissionsString) {
      userPermissions = JSON.parse(permissionsString);
    }
  } catch (e) {
    console.error("Erreur de parsing JSON", e);
  }

  const checkPermission = (idPermission: number): boolean => {

    return userPermissions.some(
      (permission) => permission.id_permission === idPermission
    );
  };

  const handleSubmenuClick = (submenuId: string): void => {
    const isOpen: boolean = openSubmenus.includes(submenuId);

    if (isOpen) {
      setOpenSubmenus(openSubmenus.filter((id) => id !== submenuId));
    } else {
      setOpenSubmenus([...openSubmenus, submenuId]);
    }
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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userID");
    const cookies = new Cookies();
    cookies.remove("jwtToken");
    localStorage.removeItem("userPermissions");
    navigate("/login");
  };

  return (
    <div className={`iq-sidebar  sidebar-default  ${sidebar}`}>
      <div className="iq-sidebar-logo d-flex align-items-center justify-content-between">
        <Nav.Link to="/" className={`header-logo ${activeLogo}`} as={NavLink}>
          <Image
            className="img-fluid rounded-normal light-logo"
            style={{ height: "22px", width: "136px" }}
            src="asset/images/logo.png"
          ></Image>
        </Nav.Link>
        <div
          className={`iq-menu-bt-sidebar ml-0 ${menuBtsidebar}`}
          onClick={() => {
            handlesetIsOpen();
            // Utilisez une fonction spécifique si nécessaire
            // Ajoutez ici le code pour le changement de la barre latérale si nécessaire
            onToggleSidebar();
          }}
        >
          <i className={`las la-bars wrapper-menu ${isOpen}`}></i>
        </div>
      </div>
      <div
        className={`data-scrollbar `}
        data-scroll="1"
        data-scrollbar="true"
        style={{ overflow: "hidden", outline: "none" }}
      >
        <div className="scroll-content">
          <nav className="iq-sidebar-menu">
            <ul id="iq-sidebar-toggle" className="iq-menu">
              {checkPermission(1) && (
                <li>
                  <Nav.Link to="/" className="svg-icon" as={NavLink}>
                    <svg style={{ minWidth: "fit-content" }} className="svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" > <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>{" "} <polyline points="9 22 9 12 15 12 15 22"></polyline>{" "} </svg>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Dashboard")}
                    </span>
                  </Nav.Link>
                </li>
              )}


              {checkPermission(2) && (
                <li>
                  <Nav.Link to="/role" className="svg-icon" as={NavLink}>
                    <i className="las la-check-circle"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Roles & permissions")}
                    </span>
                  </Nav.Link>
                </li>
              )}


              {checkPermission(3) && (
                <li>
                  <Nav.Link to="/Map" className="svg-icon" as={NavLink}>
                    <i className="las la-map"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Map")}
                    </span>
                  </Nav.Link>
                </li>
              )}


              {checkPermission(4) && (
                <li>
                  <Nav.Link to="/Fleet" className="svg-icon" as={NavLink}>
                    <svg style={{ minWidth: "fit-content" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" > <path d="M3 21V17M9 21V13M15 21V15M21 21V11M8.43934 5.56066C8.71079 5.83211 9.08579 6 9.5 6C9.91421 6 10.2892 5.83211 10.5607 5.56066M8.43934 5.56066C8.16789 5.28921 8 4.91421 8 4.5C8 3.67157 8.67157 3 9.5 3C10.3284 3 11 3.67157 11 4.5C11 4.91421 10.8321 5.28921 10.5607 5.56066M8.43934 5.56066L5.56066 8.43934M5.56066 8.43934C5.28921 8.16789 4.91421 8 4.5 8C3.67157 8 3 8.67157 3 9.5C3 10.3284 3.67157 11 4.5 11C5.32843 11 6 10.3284 6 9.5C6 9.08579 5.83211 8.71079 5.56066 8.43934ZM10.5607 5.56066L13.4393 8.43934M13.4393 8.43934C13.1679 8.71079 13 9.08579 13 9.5C13 10.3284 13.6716 11 14.5 11C15.3284 11 16 10.3284 16 9.5C16 9.08579 15.8321 8.71079 15.5607 8.43934M13.4393 8.43934C13.7108 8.16789 14.0858 8 14.5 8C14.9142 8 15.2892 8.16789 15.5607 8.43934M15.5607 8.43934L18.4393 5.56066M18.4393 5.56066C18.7108 5.83211 19.0858 6 19.5 6C20.3284 6 21 5.32843 21 4.5C21 3.67157 20.3284 3 19.5 3C18.6716 3 18 3.67157 18 4.5C18 4.91421 18.1679 5.28921 18.4393 5.56066Z"></path> </svg>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Fleet")}
                    </span>
                  </Nav.Link>
                </li>
              )}


              {checkPermission(23) && (
                <li>
                  <Nav.Link
                    to="/Dashcam"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("Dashcam");
                    }}
                    as={NavLink}
                  >
                    <svg style={{ minWidth: "fit-content" }} width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" display="inline-block" > <rect x="2.751" y="6.329" width="18.497" height="14.921" rx="3.25" stroke="#546988" stroke-width="1.5" ></rect>{" "} <circle cx="18.39" cy="18.303" r="0.777" fill="#B2C7D7" ></circle>{" "} <path fill-rule="evenodd" clip-rule="evenodd" d="M11.879 17.285a3.606 3.606 0 100-7.21 3.606 3.606 0 000 7.21zm0 1.272a4.877 4.877 0 100-9.754 4.877 4.877 0 000 9.754z" fill="#546988" ></path>{" "} <circle cx="11.879" cy="13.68" r="2.352" fill="#B2C7D7" ></circle>{" "} <path fill-rule="evenodd" clip-rule="evenodd" d="M11.25 7.017V3.305h1.5v3.712h-1.5z" fill="#546988" ></path>{" "} <path d="M8.298 2.78h7.404" stroke="#546988" stroke-width="1.5" stroke-linecap="round" ></path>{" "} </svg>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Dashcam")}
                    </span>
                    <svg style={{ minWidth: "fit-content" }} className="svg-icon iq-arrow-right arrow-active" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" > <polyline points="10 15 15 20 20 15"></polyline> <path d="M4 4h7a4 4 0 0 1 4 4v12"></path>{" "} </svg>
                  </Nav.Link>
                  <ul
                    id="Dashcam"
                    className={`iq-submenu ${openSubmenus.includes("Dashcam")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <Nav.Link to="/Dashcam" className="svg-icon" as={NavLink}>
                      {" "}
                      <i className="las la-minus"></i>
                      <span>{translate("Dashcam")}</span>
                    </Nav.Link>
                    <Nav.Link to="/snapshots" className="svg-icon" as={NavLink}>
                      {" "}
                      <i className="las la-minus"></i>
                      <span>{translate("Snapshots")}</span>
                    </Nav.Link>
                  </ul>
                </li>
              )}
              <li className="divider"></li>

              {checkPermission(8) && (
                <li>
                  <Nav.Link
                    to="/Reports"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("Reports");
                    }}
                    as={NavLink}
                  >
                    <i className="las la-chart-bar"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Reports")}
                    </span>
                    <svg
                      style={{ minWidth: "fit-content" }}
                      className="svg-icon iq-arrow-right arrow-active"
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="10 15 15 20 20 15"></polyline>
                      <path d="M4 4h7a4 4 0 0 1 4 4v12"></path>{" "}
                    </svg>
                  </Nav.Link>
                  <ul 
                    id="Reports"
                    className={`iq-submenu ${openSubmenus.includes("Reports")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <Nav.Link to="/reports" className="svg-icon" as={NavLink}>
                      <i className="las la-minus"></i>
                      <span>{translate("List reports")}</span>
                    </Nav.Link>
                    <Nav.Link  to="/new-report"  className="svg-icon" as={NavLink} >
                      <i className="las la-minus"></i>
                      <span>{translate("New report")}</span> 
                    </Nav.Link>
                  </ul>
                  <li className="divider"></li>
                </li>
              )}

              {checkPermission(6) && (
                <li>
                  <Nav.Link
                    to="/Vehicles"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("Vehicles");
                    }}
                    as={NavLink}
                  >
                    <i className="las la-car"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Vehicles")}
                    </span>
                    <svg
                      style={{ minWidth: "fit-content" }}
                      className="svg-icon iq-arrow-right arrow-active"
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                   
                      <polyline points="10 15 15 20 20 15"></polyline>
                      <path d="M4 4h7a4 4 0 0 1 4 4v12"></path>{" "}
                    </svg>
                  </Nav.Link>
                  <ul
                    id="Vehicles"
                    className={`iq-submenu ${openSubmenus.includes("Vehicles")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <Nav.Link to="/Vehicles" className="svg-icon" as={NavLink}>
        
                      <i className="las la-minus"></i>
                      <span>{translate("List vehicles")}</span> 
                    </Nav.Link>
                    <Nav.Link
                      to="/groupevehicles"
                      className="svg-icon"
                      as={NavLink}
                    >
              
                      <i className="las la-minus"></i>
                      <span>{translate("Vehicle group")} </span>
                    </Nav.Link>
                  </ul>
                </li>
              )}

              {checkPermission(6) && (
                <li>
                  <Nav.Link to="/Drivers" className="svg-icon" as={NavLink}>
                    <i className="las la-user-nurse"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Drivers")}
                    </span>
                  </Nav.Link>
                </li>
              )}

              {checkPermission(13) && (
                <li>
                  <Nav.Link to="/Ibutton" className="svg-icon" as={NavLink}>
                    <i className="las la-tags"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("iButton Fleets")}
                    </span>
                  </Nav.Link>
                </li>
              )}
              {checkPermission(7) && (
                <li>
                  <Nav.Link to="/cartes-sim" className="svg-icon" as={NavLink}>
                    <i className="las la-sim-card"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("SIM cards")}
                    </span>
                  </Nav.Link>
                </li>
              )}

              {checkPermission(17) && (
                <li>
                  <Nav.Link
                    to="/Devices"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("Devices");
                    }}
                    as={NavLink}
                  >
                    <i className="las la-compass"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("GPS devices")}
                    </span>
                    <svg
                      style={{ minWidth: "fit-content" }}
                      className="svg-icon iq-arrow-right arrow-active"
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    >
                      {" "}
                      <polyline points="10 15 15 20 20 15"></polyline>
                      <path d="M4 4h7a4 4 0 0 1 4 4v12"></path>{" "}
                    </svg>
                  </Nav.Link>
                  <ul
                    id="Devices"
                    className={`iq-submenu ${openSubmenus.includes("Devices")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <Nav.Link to="/Devices" className="svg-icon" as={NavLink}>
                      <i className="las la-minus"></i>
                      <span>{translate("List devices")}</span>
                    </Nav.Link>
                    <Nav.Link
                      to="/groupe-device"
                      className="svg-icon"
                      as={NavLink}
                    >
                      <i className="las la-minus"></i>
                      <span>{translate("Devices Group")}</span>
                    </Nav.Link>
                  </ul>
                </li>
              )}

              {checkPermission(25) && (
                <li>
                  <Nav.Link to="/Users" className="svg-icon" as={NavLink}>
                    <svg
                      style={{ minWidth: "fit-content" }}
                      className="svg-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>{" "}
                      <circle cx="9" cy="7" r="4"></circle>{" "}
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>{" "}
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>{" "}
                    </svg>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Users")}
                    </span>
                  </Nav.Link>
                </li>
              )}

              {checkPermission(20) && (
                <li>
                  <Nav.Link
                    to="/userlogs"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("userlogs");
                    }}
                    as={NavLink}
                  >
                    <i className="las la-user-clock"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("User Activity")}
                    </span>
                    <svg
                      style={{ minWidth: "fit-content" }}
                      className="svg-icon iq-arrow-right arrow-active"
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      {" "}
                      <polyline points="10 15 15 20 20 15"></polyline>
                      <path d="M4 4h7a4 4 0 0 1 4 4v12"></path>{" "}
                    </svg>
                  </Nav.Link>
                  <ul
                    id="userlogs"
                    className={`iq-submenu ${openSubmenus.includes("userlogs")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <Nav.Link
                      to="/history-user"
                      className="svg-icon"
                      as={NavLink}
                    >
                      {" "}
                      <i className="las la-minus"></i>
                      <span>{translate("History")}</span>
                    </Nav.Link>
                    <Nav.Link to="/Connexion" className="svg-icon" as={NavLink}>
                      {" "}
                      <i className="las la-minus"></i>
                      <span>{translate("Log connexion")}</span>
                    </Nav.Link>
                  </ul>
                </li>
              )}

              {checkPermission(27) && (
                <li>
                  <Nav.Link to="/IDEPARC" className="svg-icon" as={NavLink}>
                    <i className="las la-parking"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Access IDEPARC")}
                    </span>
                  </Nav.Link>
                </li>
              )}

              {checkPermission(28) && (
                <li>
                  <Nav.Link
                    to="/archive-assignments"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("archive-assignments");
                    }}
                    as={NavLink}
                  >
                    <i className="las la-share"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Archive Assignments")}
                    </span>
                    <svg
                      style={{ minWidth: "fit-content" }}
                      className="svg-icon iq-arrow-right arrow-active"
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    > <polyline points="10 15 15 20 20 15"></polyline> <path d="M4 4h7a4 4 0 0 1 4 4v12"></path>{" "}</svg>
                  </Nav.Link>
                  <ul
                    id="archive-assignments"
                    className={`iq-submenu ${openSubmenus.includes("archive-assignments")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <Nav.Link
                      to="/history-tag"
                      className="svg-icon"
                      as={NavLink}
                    >

                      <i className="las la-minus"></i>
                      <span>{translate("Driver / Tag")}</span>
                    </Nav.Link>
                    <Nav.Link
                      to="/history-vehucle"
                      className="svg-icon"
                      as={NavLink}
                    >

                      <i className="las la-minus"></i>
                      <span>{translate("Vehicle / Device ")}</span>
                    </Nav.Link>
                  </ul>
                </li>
              )}

              {checkPermission(5) && (
                <li>
                  <Nav.Link
                    to="/logpositions"
                    className="svg-icon"
                    as={NavLink}
                  >
                    <i className="las la-history"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Archive des positions")}
                    </span>
                  </Nav.Link>
                </li>
              )}

            </ul>
          </nav>
          <div
            className="position-relative sidebar-bottom"
            style={{ padding: "0!important", margin: 0 }}
          >
            <nav className="iq-sidebar-menu">
              <ul
                id="iq-sidebar-toggle"
                className="iq-menu"
                style={{ padding: 0 }}
              >
                <li className="divider"></li>
                <li>
                  <Nav.Link to="/Settings" className="svg-icon" as={NavLink}>
                    <i className="las la-cog"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Settings")}
                    </span>
                  </Nav.Link>
                </li>
                <li>
                  <Nav.Link to="/Help" className="svg-icon" as={NavLink}>
                    <i className="lar la-life-ring"></i>
                    <span className={`ml-4 ${activeMenuText}`}>
                      {translate("Help")}
                    </span>
                  </Nav.Link>
                </li>
                <Logout
                  onLogout={handleLogout}
                  activeMenu={activeMenuText}
                  title={translate("Logout")}
                  margin={"ml-4"}
                />
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
