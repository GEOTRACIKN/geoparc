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
                    className={`iq-submenu ${
                      openSubmenus.includes("Vehicles")
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
                        <span className={`ml-4 ${activeMenuText}`}>
                          {translate("List vehicles")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/Vehicle_checks"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <i className="las la-check-double"></i>
                        <span className={`ml-4 ${activeMenuText}`}>
                          {translate("Vehicle checks")}
                        </span>
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        to="/Vehicle_cost"
                        className="svg-icon"
                        as={NavLink}
                      >
                        <i className="las la-hand-holding-usd"></i>
                        <span className={`ml-4 ${activeMenuText}`}>
                          {translate("Vehicle cost")}
                        </span>
                      </Nav.Link>
                    </li>
                  </ul>
                </li>

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
