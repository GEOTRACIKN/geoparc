import React, { useEffect, useState } from "react";
import { Nav, Image } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import "./Sidebar.css";
import { useTranslate } from "../hooks/LanguageProvider";
import Cookies from "universal-cookie";
import Logout from "./Logout";
import axios from "axios";
import { useTheme } from "../hooks/ThemeContext";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface SidebarProps {
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleSidebar }) => {
  const { translate } = useTranslate();

  const [activeCollapsed, setactiveCollapsed] = useState("collapsed");

  const [menuBtsidebar, setMenuBtsidebar] = useState("iq-menu-bt-sidebar-show");


  const [isOpen, setIsOpen] = useState("");
  const [activeLogo, setActiveLogo] = useState("header-logo-show");
  const [activeMenuText, setActiveMenuText] = useState("");
  const [menuButtonSidebar, setMenuButtonSidebar] = useState("iq-menu-bt-sidebar-show");
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



  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("GeopUserID");
    const cookies = new Cookies();
    cookies.remove("jwtToken");
    localStorage.removeItem("userPermissions");
    navigate("/login");
  };

  interface MenuItem {
    id: number;
    label: string;
    icon: string;
    to?: string;
    permissionId: number;
    subItems?: MenuItem[];
    divider?: boolean;
  }


  const menuItems: MenuItem[] = [
    {
      id: 1,
      label: "Dashboard",
      icon: "las la-home",
      to: "/",
      permissionId: 1, // ID de permission à ajuster
    },
    {
      id: 2,
      label: "Role",
      icon: "las la-check-circle",
      to: "/role",
      permissionId: 2, // ID de permission à ajuster
    },
    {
      id: 3,
      label: "Vehicles",
      icon: "las la-car",
      permissionId: 37, // ID de permission à ajuster
      subItems: [
        {
          id: 4,
          label: "List vehicles",
          icon: "las la-list-alt",
          to: "/vehicles",
          permissionId: 37,
        },
        {
          id: 5,
          label: "Vehicle checks",
          icon: "las la-check-double",
          to: "/vehicles-checks",
          permissionId: 37,
        },
        {
          id: 6,
          label: "Vehicle cost",
          icon: "las la-hand-holding-usd",
          to: "/vehicle-cost",
          permissionId: 37,
        },
        {
          id: 7,
          label: "Vehicle sinister",
          icon: "las la-car-crash",
          to: "/vehicle-sinister",
          permissionId: 37,
        },
      ],
    },
    {
      id: 38,
      label: "Drivers",
      icon: "las la-user-nurse",
      permissionId: 38, // ID de permission à ajuster
      subItems: [
        {
          id: 9,
          label: "List drivers",
          icon: "las la-list-alt",
          to: "/drivers",
          permissionId: 38,
        },
        {
          id: 10,
          label: "Contracts",
          icon: "las la-file-contract",
          to: "/contrat",
          permissionId: 38,
        },
      ],
    },
    {
      id: 48,
      label: "Parks",
      icon: "las la-parking",
      permissionId: 48, // ID de permission à ajuster
      subItems: [
        {
          id: 48,
          label: "List parks",
          icon: "las la-list-alt",
          to: "/parks",
          permissionId: 48,
        },
        {
          id: 48,
          label: "New park",
          icon: "las la-pen-nib",
          to: "/park/add",
          permissionId: 48,
        },
      ],
    },
    {
      id: 	39,
      label: "Missions",
      icon: "las la-map-marked-alt",
      permissionId:39, // ID de permission à ajuster
      subItems: [
        {
          id:39,
          label: "Mission Order",
          icon: "las la-tasks",
          to: "/mission-order",
          permissionId:39,
        },
        {
          id: 16,
          label: "Mission Report",
          icon: "las la-file-alt",
          to: "/mission-report",
          permissionId:39,
        },
      ],
    },
    {
      id: 40,
      label: "HSE",
      icon: "las la-shield-alt",
      permissionId: 40, // ID de permission à ajuster
      subItems: [
        {
          id: 40,
          label: "HSE dashboard",
          icon: "fas fa-shield-alt",
          to: "/hse-dashboard",
          permissionId: 40,
        },
        {
          id: 40,
          label: "Warnings",
          icon: "las la-exclamation-triangle",
          to: "/warnings",
          permissionId: 40,
        },
        {
          id: 20,
          label: "Violations",
          icon: "las la-ban",
          to: "/violations",
          permissionId: 40,
        },
        {
          id: 21,
          label: "Management of fire extinguishers",
          icon: "las la-fire-extinguisher",
          to: "/extinguisher",
          permissionId: 40,
        },
        {
          id: 22,
          label: "Emergency box management",
          icon: "las la-briefcase-medical",
          to: "/pharmacy-box",
          permissionId: 40,
        },
      ],
    },
    {
      id: 41,
      label: "GMAO",
      icon: "las la-cogs",
      permissionId: 8, // ID de permission à ajuster
      subItems: [
        {
          id: 41,
          label: "Reception",
          icon: "",
          to: "/reception",
          permissionId: 41,
        },
        {
          id: 25,
          label: "Garage",
          icon: "",
          to: "/garage",
          permissionId: 41,
        },
        {
          id: 26,
          label: "Planned interviews",
          icon: "",
          to: "/planning-interviews",
          permissionId: 41,
        },
        {
          id: 27,
          label: "Servicing",
          icon: "",
          to: "/servicing",
          permissionId: 41,
        },
      ],
    },
    {
      id: 42,
      label: "Fuel",
      icon: "las la-gas-pump",
      permissionId: 42, // ID de permission à ajuster
      subItems: [
        {
          id: 29,
          label: "Fuel consumption",
          icon: "las la-gas-pump",
          to: "/fuel-consumption",
          permissionId: 42,
        },
        {
          id: 42,
          label: "Card management",
          icon: "las fa-id-card",
          to: "/card-management",
          permissionId: 42,
        },
        {
          id: 42,
          label: "Tank management",
          icon: "las fa-truck-moving",
          to: "/tank-management",
          permissionId: 42,
        },
        {
          id: 32,
          label: "Cash management",
          icon: "las fa-money-bill-wave",
          to: "/cash-management",
          permissionId: 42,
        },
      ],
    },
    {
      id: 33,
      label: "Settings",
      icon: "las la-cog",
      to: "/Settings",
      permissionId: 10, // ID de permission à ajuster
    },
    {
      id: 34,
      label: "Help",
      icon: "lar la-life-ring",
      to: "/Help",
      permissionId: 11, // ID de permission à ajuster
    },
  ];

  const handleSetIsOpen = () => {
    isOpen == "open" ? setIsOpen("") : setIsOpen("open");

    sidebar == "sidebar-close"
      ? setSidebar("sidebar-open")
      : setSidebar("sidebar-close");

    activeLogo == "header-logo-show"
      ? setActiveLogo("header-logo-hide")
      : setActiveLogo("header-logo-show");
    activeMenuText == "iq-menu-span-hide"
      ? setActiveMenuText("")
      : setActiveMenuText("iq-menu-span-hide");
    menuButtonSidebar == "iq-menu-bt-sidebar-show"
      ? setMenuButtonSidebar("iq-menu-bt-sidebar-hide")
      : setMenuButtonSidebar("iq-menu-bt-sidebar-show");
  };


  const { isDarkMode, toggleTheme } = useTheme();


  return (
    <div
      style={{ zIndex: 10015 }}
      className={`iq-sidebar  sidebar-default  ${sidebar}`}
    >
      <div className="iq-sidebar-logo d-flex align-items-center justify-content-between">
        <Nav.Link to="/" className={`header-logo ${activeLogo}`} as={NavLink}>
          <Image
            className={`img-fluid rounded-normal light-logo`}
            style={{ height: "22px", width: "136px" }}
            src={isDarkMode ? "asset/images/logo_dark.png" : "asset/images/logo.png"}
          ></Image>
        </Nav.Link>
        <div
          className={`iq-menu-bt-sidebar ml-0 ${menuButtonSidebar}`}
          onClick={() => {
            handleSetIsOpen();
            // Use a specific function if needed
            // Add here the code for changing the sidebar if needed
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

              <ul id="iq-sidebar-toggle" className="iq-menu">
                {menuItems.map((menuItem) =>
                  checkPermission(menuItem.permissionId) ? (
                    menuItem.divider ? (
                      <li key={menuItem.id} className=""></li>
                    ) : (
                      <li key={menuItem.id}>
                        {menuItem.to ? (
                          <Nav.Link to={menuItem.to} className="svg-icon" as={NavLink}>
                            <i className={menuItem.icon} />
                            <span className={`ml-4 ${activeMenuText}`}>{translate(menuItem.label)}</span>
                          </Nav.Link>
                        ) : (
                          <Nav.Link

                            onClick={() => handleSubmenuClick(menuItem.label)}
                          >
                            <i className={menuItem.icon} />
                            <span className={`ml-4 ${activeMenuText}`}>
                              {translate(menuItem.label)}
                            </span>
                            <svg style={{ minWidth: "fit-content" }} className="svg-icon iq-arrow-right arrow-active" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" > <polyline points="10 15 15 20 20 15"></polyline> <path d="M4 4h7a4 4 0 0 1 4 4v12"></path>{" "} </svg>
                          </Nav.Link>
                        )}

                        {menuItem.subItems && (
                          <ul
                            className={`iq-submenu ${openSubmenus.includes(menuItem.label)
                              ? "submenu-enter-active"
                              : "submenu-enter"
                              }`}
                          >
                            {menuItem.subItems.map(
                              (subItem) =>
                                checkPermission(subItem.permissionId) && (
                                  <Nav.Link
                                    key={subItem.id}
                                    to={subItem.to || "/"}
                                    className="svg-icon"
                                    as={NavLink}
                                    onClick={() => { handleSetIsOpen(); onToggleSidebar(); }}
                                  >
                                    <i className={subItem.icon} />
                                    <span>{translate(subItem.label)}</span>
                                  </Nav.Link>
                                )
                            )}
                          </ul>
                        )}
                      </li>
                    )
                  ) : null
                )}
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
                    <li>
                    <Nav.Link to="/training" className="svg-icon" as={NavLink}>
                      <i className="las la-road"></i>
                      <span className={`ml-2 ${activeMenuText}`}>
                        {translate("Driver Training")}
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
                        to="/fire"
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
                          {translate("Emergency Box")}
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

            <div className="position-relative sidebar-bottom" style={{ padding: "0!important", margin: 0 }}>
              <nav className="iq-sidebar-menu">
                <ul className="iq-menu" style={{ padding: 0 }}>
                  <li className="divider" style={{ margin: "0 0 5px" }}></li>
                  <Logout
                    onLogout={handleLogout}
                    activeMenu={activeMenuText}
                    title={translate("Logout")}
                    margin="ml-4"
                  />
                </ul>
              </nav>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
