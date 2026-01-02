/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Nav, Image } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useTranslate } from "../../../hooks/LanguageProvider";
import Cookies from "universal-cookie";
import Logout from "../../Logout";
import { useTheme } from "../../../hooks/ThemeContext";
import usePermissions from "../../../hooks/usePermissions";
import { useUser } from "../../../context/UserContext";
import { useAuth } from "../../../context/AuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface SidebarProps {
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleSidebar }) => {
  const { translate } = useTranslate();
  const [isOpen, setIsOpen] = useState("");
  const [activeLogo, setActiveLogo] = useState("header-logo-hide");
  const [activeMenuText, setActiveMenuText] = useState("iq-menu-span-hide");
  const [menuButtonSidebar, setMenuButtonSidebar] = useState(
    "iq-menu-bt-sidebar-hide"
  );
  const [sidebar, setSidebar] = useState("sidebar-close");
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  //const [pathImg, setPathImg] = useState<string | undefined>(undefined);
  const id_user = localStorage.getItem("GeopUserID");
  const { pathImg } = useUser();

  const navigate = useNavigate();
  const { logout } = useAuth();


  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.matchMedia("(max-width: 1299px)").matches
  );


  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1299px)");

    const handleMediaQueryChange = (
      event: MediaQueryListEvent | MediaQueryList
    ) => {
      setIsSmallScreen(event.matches);
    };

    // Add the listener
    mediaQuery.addListener(handleMediaQueryChange);

    // Clean the listener when unmounting the component
    if (isSmallScreen) {
      //  handleSetIsOpen()
    }
    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const roleId = localStorage.getItem("id_role");
  const { userPermissions, loading } = usePermissions(roleId);
  const checkPermission = (idPermission: number): boolean => {
    return userPermissions.some(
      (permission) => permission.id_permission === idPermission
    );
  };

  const handleSubmenuClick = (submenuId: string): void => {
    if (openSubmenus.includes(submenuId)) {
      // si déjà ouvert -> on ferme tout
      setOpenSubmenus([]);
    } else {
      // sinon -> on garde seulement ce menu ouvert
      setOpenSubmenus([submenuId]);
    }
  };

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

  const handleLogout = async () => {
    try {
      await logout(); // ⬅️ logout vient du contexte (useAuth)
      navigate("/login"); // ⬅️ navigation après déconnexion
    } catch (error) {
      console.error("Erreur pendant la déconnexion :", error);
    }
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
  { id: 1, label: "Dashboard", icon: "las la-home", to: "/", permissionId: 36 },

  { id: 2, label: "Role", icon: "las la-check-circle", to: "/role", permissionId: 38 },

  {
    id: 3,
    label: "Vehicles",
    icon: "las la-car",
    permissionId: 37,
    subItems: [
      { id: 4, label: "List vehicles", icon: "las la-list-alt", to: "/vehicles", permissionId: 37 },
      { id: 5, label: "Vehicle checks", icon: "las la-check-double", to: "/vehicles-checks", permissionId: 37 },
      { id: 6, label: "Vehicle cost", icon: "las la-hand-holding-usd", to: "/vehicle-cost", permissionId: 37 },
      { id: 7, label: "Vehicle sinister", icon: "las la-car-crash", to: "/vehicle-sinister", permissionId: 37 },
    ],
  },

  {
    id: 8,
    label: "Drivers",
    icon: "las la-user-nurse",
    permissionId: 38,
    subItems: [
      { id: 9, label: "List drivers", icon: "las la-list-alt", to: "/drivers", permissionId: 38 },
      { id: 10, label: "Contracts", icon: "las la-file-contract", to: "/contrat", permissionId: 38 },
      { id: 11, label: "Training", icon: "las la-user-nurse", to: "/training", permissionId: 38 },
    ],
  },

  {
    id: 12,
    label: "Parks",
    icon: "las la-parking",
    permissionId: 34,
    subItems: [
      { id: 13, label: "List parks", icon: "las la-list-alt", to: "/parks", permissionId: 34 },
      { id: 14, label: "New park", icon: "las la-pen-nib", to: "/park/add", permissionId: 34 },
    ],
  },

  {
    id: 15,
    label: "Missions",
    icon: "las la-map-marked-alt",
    permissionId: 39,
    subItems: [
      { id: 16, label: "Mission Order", icon: "las la-tasks", to: "/mission-order", permissionId: 39 },
      { id: 17, label: "Mission Report", icon: "las la-file-alt", to: "/mission-report", permissionId: 39 },
    ],
  },

  { id: 18, label: "Deadline", icon: "lar la-life-ring", to: "/deadline", permissionId: 51 },

  {
    id: 19,
    label: "HSE",
    icon: "las la-shield-alt",
    permissionId: 40,
    subItems: [
      { id: 20, label: "Warnings", icon: "las la-exclamation-triangle", to: "/warnings", permissionId: 40 },
      { id: 21, label: "Violations", icon: "las la-ban", to: "/violation", permissionId: 40 },
      { id: 22, label: "Fire extinguisher management", icon: "las la-fire-extinguisher", to: "/fire-ext", permissionId: 40 },
      { id: 23, label: "Emergency box management", icon: "las la-briefcase-medical", to: "/pharmacy-box", permissionId: 40 },
    ],
  },

  {
    id: 24,
    label: "GMAO",
    icon: "las la-cogs",
    permissionId: 41,
    subItems: [
      { id: 25, label: "Reception", icon: "las la-clipboard-check", to: "/reception", permissionId: 41 },
      { id: 26, label: "Garage", icon: "las la-warehouse", to: "/garage", permissionId: 41 },
      { id: 27, label: "Planned interviews", icon: "las la-calendar-alt", to: "/planning-interviews", permissionId: 41 },
      { id: 28, label: "Servicing", icon: "las la-tools", to: "/servicing", permissionId: 41 },
      { id: 29, label: "Tire Change", icon: "las la-car", to: "/pneu", permissionId: 41 },
      { id: 30, label: "Parts Replacement", icon: "las la-suitcase", to: "/piece", permissionId: 41 },
    ],
  },

  {
    id: 31,
    label: "Fuel",
    icon: "las la-gas-pump",
    permissionId: 42,
    subItems: [
      { id: 32, label: "Fuel consumption", icon: "las la-gas-pump", to: "/fuel_management", permissionId: 42 },
      { id: 33, label: "Card management", icon: "las fa-id-card", to: "/card_management", permissionId: 42 },
      { id: 34, label: "Tank management", icon: "las fa-truck-moving", to: "/tank_management", permissionId: 42 },
      { id: 35, label: "Cash management", icon: "las fa-money-bill-wave", to: "/cash_management", permissionId: 42 },
    ],
  },

  { id: 36, label: "Administrative", icon: "las la-suitcase", to: "/administratif", permissionId: 53 },

  {
    id: 37,
    label: "Stock",
    icon: "las la-store",
    permissionId: 42,
    subItems: [
      { id: 38, label: "Tire", icon: "las la-cogs", to: "/pneu_stock", permissionId: 42 },
      { id: 39, label: "Items", icon: "las la-boxes", to: "/piece_stock", permissionId: 42 },
      { id: 40, label: "Demande pièces", icon: "las la-box-open", to: "/Demandes-pieces", permissionId: 42 },
    ],
  },

  { id: 41, label: "Notifications", icon: "las la-bell", to: "/notifications", permissionId: 52 },

  { id: 42, label: "Reference", icon: "las la-check-circle", to: "/reference", permissionId: 38 },

  { id: 43, label: "Settings", icon: "las la-cog", to: "/Settings", permissionId: 10 },

  { id: 44, label: "Help", icon: "lar la-life-ring", to: "/Help", permissionId: 11 },
];


  const handleMouseEnter = () => {
    setIsOpen("open");
    setSidebar("sidebar-open");
    setActiveLogo("header-logo-show");
    setActiveMenuText(""); // Afficher le texte du menu
    setMenuButtonSidebar("iq-menu-bt-sidebar-show");
  };

  const handleMouseLeave = () => {
    setIsOpen("");
    setSidebar("sidebar-close");
    setActiveLogo("header-logo-hide");
    setActiveMenuText("iq-menu-span-hide"); // Cacher le texte du menu
    setMenuButtonSidebar("iq-menu-bt-sidebar-hide");
  };

  return (
    <div
      style={{ zIndex: 10015 }}
      className={`iq-sidebar  sidebar-default  ${sidebar}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="iq-sidebar-logo d-flex align-items-center justify-content-between">
        <Nav.Link to="/" className={`header-logo ${activeLogo}`} as={NavLink}>
          <Image
            className={`img-fluid rounded-normal light-logo`}
            style={{
              width: "136px",
              height: "auto",
              maxHeight: "50px", // Ajuste selon tes besoins
              objectFit: "contain",
            }}
            src={pathImg}
          ></Image>
        </Nav.Link>
        <div
          className={`iq-menu-bt-sidebar ml-0 ${menuButtonSidebar}`}
          onClick={() => {
            handleSetIsOpen();
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
              {menuItems.map((menuItem) =>
                checkPermission(menuItem.permissionId) ? (
                  menuItem.divider ? (
                    <li key={menuItem.id} className=""></li>
                  ) : (
                    <li key={menuItem.id}>
                      {menuItem.to ? (
                        <Nav.Link
                          to={menuItem.to}
                          className="svg-icon"
                          as={NavLink}
                          onClick={() => {
                            setOpenSubmenus([]); // ferme tous les autres
                            handleSetIsOpen();
                            onToggleSidebar();
                          }}
                        >
                          <i className={menuItem.icon} />
                          <span className={`ml-3 ${activeMenuText}`}>
                            {translate(menuItem.label)}
                          </span>
                        </Nav.Link>
                      ) : (
                        <Nav.Link
                          onClick={() => handleSubmenuClick(menuItem.label)}
                        >
                          <i className={menuItem.icon} />
                          <span className={`ml-3 ${activeMenuText}`}>
                            {translate(menuItem.label)}
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
                            {" "}
                            <polyline points="10 15 15 20 20 15"></polyline>{" "}
                            <path d="M4 4h7a4 4 0 0 1 4 4v12"></path>{" "}
                          </svg>
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
                                  onClick={() => {
                                    handleSetIsOpen();
                                    onToggleSidebar();
                                  }}
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
            </ul>

       

        
          
          </nav>

          <div
            className="position-relative sidebar-bottom"
            style={{ padding: "0!important", margin: 0 }}
          >
            <nav className="iq-sidebar-menu">
              <ul className="iq-menu" style={{ padding: 0 }}>
                <li className="divider" style={{ margin: "0 0 5px" }}></li>
                <Logout
                  onLogout={handleLogout}
                  activeMenu={activeMenuText}
                  title={translate("Logout")}
                  margin="ml-3"
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