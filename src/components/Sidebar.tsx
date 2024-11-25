import React, { useEffect, useState } from "react";
import { Nav, Image } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import "./Sidebar.css";
import { useTranslate } from "./LanguageProvider";
import Cookies from "universal-cookie";
import Logout from "./Logout";
import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface SidebarProps {
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleSidebar }) => {
  const { translate } = useTranslate();
  const [isOpen, setIsOpen] = useState("");
  const [activeCollapsed, setactiveCollapsed] = useState("collapsed");
  const [activeLogo, setactiveLogo] = useState("header-logo-show");
  const [activeMenuText, setactiveMenuText] = useState("");
  const [menuBtsidebar, setMenuBtsidebar] = useState("iq-menu-bt-sidebar-show");
  const [sidebar, setSidebar] = useState("sidebar-open");
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const savedToken = localStorage.getItem("authToken");
  //   if (savedToken) {
  //     //  navigate(location.pathname); // Rediriger l'utilisateur vers la page d'accueil s'il est déjà connecté
  //   }
  // }, [location.pathname]);

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
    localStorage.removeItem("GeopUserID");
    const cookies = new Cookies();
    cookies.remove("jwtToken");
    localStorage.removeItem("userPermissions");
    navigate("/login");
  };
  return (
    <div
      style={{ zIndex: 10015 }}
      className={`iq-sidebar  sidebar-default  ${sidebar}`}
    >
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
                <li>
                  <Nav.Link to="/" className="svg-icon" as={NavLink}>
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
                      {" "}
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>{" "}
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>{" "}
                    </svg>
                    <span className={`ml-2 ${activeMenuText}`}>
                      {translate("Dashboard")}
                    </span>
                  </Nav.Link>
                </li>

                <li>
                  <Nav.Link
                    to="/vehicles"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("Vehicles");
                    }}
                    as={NavLink}
                  >
                    <i className="las la-car"></i>
                    <span className={`ml-2 ${activeMenuText}`}>
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
                    <li>
                      <Nav.Link
                        to="/vehicles"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <i className="las la-list-alt"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("List vehicles")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/vehicles-checks"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <i className="las la-check-double"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Vehicle checks")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/vehicle-cost"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <i className="las la-hand-holding-usd"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Vehicle cost")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/vehicle-sinister"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <i className="las la-car-crash"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Vehicle sinister")}
                        </span>
                      </Nav.Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Nav.Link
                    to="/drivers"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("Drivers");
                    }}
                    as={NavLink}
                  >
                    <i className="las la-user-nurse"></i>
                    <span className={`ml-2 ${activeMenuText}`}>
                      {translate("Drivers")}
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
                    id="vehicles"
                    className={`iq-submenu ${openSubmenus.includes("Drivers")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <li>
                      <Nav.Link to="/drivers" className="svg-icon" as={NavLink}>
                        <i className="las la-list-alt"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("List drivers")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link to="/contrat" className="svg-icon" as={NavLink}>
                        <i className="las la-file-contract"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Contracts")}
                        </span>
                      </Nav.Link>
                    </li>
                  </ul>
                </li>


                <li>
                <Nav.Link
                  to="/mission"
                  className={activeCollapsed}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmenuClick("Mission");
                  }}
                  as={NavLink}
                >
                  <i className="las la-map-marked-alt"></i> {/* New Icon for Missions */}
                  <span className={`ml-2 ${activeMenuText}`}>
                    {translate("Missions")}
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="10 15 15 20 20 15"></polyline>
                    <path d="M4 4h7a4 4 0 0 1 4 4v12"></path>
                  </svg>
                </Nav.Link>

                  <ul
                    id="vehicles"
                    className={`iq-submenu ${openSubmenus.includes("Mission")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <li>
                      <Nav.Link to="/mission-order" className="svg-icon" as={NavLink}>
                        <i className="las la-tasks"></i> {/* Icon for Mission Order */}
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Missions Order")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link to="/mission-report" className="svg-icon" as={NavLink}>
                        <i className="las la-file-alt"></i> {/* Icon for Mission Report */}
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Missions Report")}
                        </span>
                      </Nav.Link>
                    </li>
                    
                  </ul>
                </li>



                {/* HSE section */}
                <li>
                  <Nav.Link
                    to="/hse-dashboard"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("hse");
                    }}
                    as={NavLink}
                  >
                    <i className="las la-shield-alt"></i>
                    <span className={`ml-2 ${activeMenuText}`}>
                      {translate("hse")}
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
                    id="vehicles"
                    className={`iq-submenu ${openSubmenus.includes("hse")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <li>
                      <Nav.Link
                        to="/hse-dashboard"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <span style={{ position: 'relative', display: 'inline-block', width: '24px', height: '24px' }}>
                          <i className="fas fa-shield-alt" style={{ fontSize: '24px', position: 'relative', zIndex: 1 }}></i>
                          <i
                            className="fas fa-plus"
                            style={{
                              fontSize: '12px',
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 2,
                              color: '#ffffff',
                            }}
                          ></i>
                          <i
                            className="fas fa-leaf"
                            style={{
                              fontSize: '12px',
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              zIndex: 3,
                              color: '#228B22',
                            }}
                          ></i>
                        </span>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("HSE dashboard")}
                        </span>
                      </Nav.Link>
                    </li>

                    <li>
                      <Nav.Link
                        to="/warnings"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <i className="las la-exclamation-triangle"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Warnings")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/violations"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <i className="las la-ban"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Violations")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/extinguisher"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <i className="las la-fire-extinguisher"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Management of fire extinguishers")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/pharmacy"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <i className="las la-briefcase-medical"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Emergency box management")}
                        </span>
                      </Nav.Link>
                    </li>
                  </ul>
                </li>
                {/* GMAO Atelier section */}
                <li>
                  <Nav.Link
                    to="/"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("GMAO");
                    }}
                    as={NavLink}
                  >
                    <i className="las la-cogs"></i>
                    <span className={`ml-2 ${activeMenuText}`}>
                      {translate("GMAO")}
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
                    id="vehicles"
                    className={`iq-submenu ${openSubmenus.includes("GMAO")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <li>
                      <Nav.Link
                        to="/reception"
                        className="svg-icon"
                        as={NavLink}
                      >

                        <span className={` ${activeMenuText}`}>
                          {translate("Reception")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/garage"
                        className="svg-icon"
                        as={NavLink}
                        // style={{ color: '#A9A9A9', pointerEvents: 'none', opacity: 0.6 }}

                      >
                        <span className={` ${activeMenuText}`}>
                          {translate("Garage")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/planning-interviews"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <span className={` ${activeMenuText}`}>
                          {translate("Planned interviews")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/servicing"
                        className="svg-icon"
                        as={NavLink}
                        //style={{ color: '#A9A9A9', pointerEvents: 'none', opacity: 0.6 }}

                      >
                        <span className={` ${activeMenuText}`}>
                          {translate("Servicing")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/"
                        className="svg-icon"
                        as={NavLink}
                        style={{ color: '#A9A9A9', pointerEvents: 'none', opacity: 0.6 }}

                      >

                        <span className={` ${activeMenuText}`}>
                          {translate("Changements de pneu")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/"
                        className="svg-icon"
                        as={NavLink}
                        style={{ color: '#A9A9A9', pointerEvents: 'none', opacity: 0.6 }}

                      >

                        <span className={` ${activeMenuText}`}>
                          {translate("Changements de peice")}
                        </span>
                      </Nav.Link>
                    </li>
                  </ul>
                </li>

                {/* fuels section */}
                <li>
                  <Nav.Link
                    to="/fuel"
                    className={activeCollapsed}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmenuClick("fuel");
                    }}
                    as={NavLink}
                  >
                    <i className="las la-gas-pump"></i>
                    <span className={`ml-2 ${activeMenuText}`}>
                      {translate("fuel")}
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
                    className={`iq-submenu ${openSubmenus.includes("fuel")
                      ? "submenu-enter-active"
                      : "submenu-enter"
                      }`}
                    data-parent="#iq-sidebar-toggle"
                  >
                    <li>
                      <Nav.Link
                        to="/fuel-consumption"
                        className="svg-icon"
                        as={NavLink}
                        style={{ color: '#A9A9A9', pointerEvents: 'none', opacity: 0.6 }}
                      >
                        <i className="las la-gas-pump"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Fuel consumption")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/card-management"
                        className="svg-icon"
                        as={NavLink}
                        style={{ color: '#A9A9A9', pointerEvents: 'none', opacity: 0.6 }}
                      >
                        <i className="las fa-id-card"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Card management")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/tank-management"
                        className="svg-icon"
                        as={NavLink}
                        style={{ color: '#A9A9A9', pointerEvents: 'none', opacity: 0.6 }}
                      >
                        <i className="las fa-truck-moving"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("Tank management")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/cash-management"
                        className="svg-icon"
                        as={NavLink}
                        style={{ color: '#A9A9A9', pointerEvents: 'none', opacity: 0.6 }}
                      >
                        <i className="las fa-money-bill-wave"></i>
                        <span className={`ml-2 ${activeMenuText}`}>
                          {translate("cash management")}
                        </span>
                      </Nav.Link>
                    </li>
                  </ul>
                </li>

                <li className="divider"></li>
                <li>
                  <Nav.Link to="/Settings" className="svg-icon" as={NavLink}>
                    <i className="las la-cog"></i>
                    <span className={`ml-2 ${activeMenuText}`}>
                      {translate("Settings")}
                    </span>
                  </Nav.Link>
                </li>
                <li>
                  <Nav.Link to="/Help" className="svg-icon" as={NavLink}>
                    <i className="lar la-life-ring"></i>
                    <span className={`ml-2 ${activeMenuText}`}>
                      {translate("Help")}
                    </span>
                  </Nav.Link>
                </li>
                <Logout
                  onLogout={handleLogout}
                  activeMenu={activeMenuText}
                  title={translate("Logout")}
                  margin={"ml-2"}
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
