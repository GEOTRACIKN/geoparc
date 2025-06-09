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
  const [activeLogo, setActiveLogo] = useState("header-logo-hide");
  const [activeMenuText, setActiveMenuText] = useState("iq-menu-span-hide");
  const [menuButtonSidebar, setMenuButtonSidebar] = useState("iq-menu-bt-sidebar-hide");
  const [sidebar, setSidebar] = useState("sidebar-close");
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
      id: 36,
      label: "Dashboard",
      icon: "las la-home",
      to: "/",
      permissionId: 36, // ID de permission à ajuster
    },
    {
      id: 38,
      label: "Role",
      icon: "las la-check-circle",
      to: "/role",
      permissionId: 38, // ID de permission à ajuster
    },
    {
      id: 37,
      label: "Vehicles",
      icon: "las la-car",
      permissionId: 37, // ID de permission à ajuster
      subItems: [
        {
          id: 37,
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
        {
          id: 10,
          label: "Training",
          icon: "las la-user-nurse",
          to: "/training",
          permissionId: 38,
        },
      ],
    },
    {
      id: 34,
      label: "Parks",
      icon: "las la-parking",
      permissionId: 34, // ID de permission à ajuster
      subItems: [
        {
          id: 34,
          label: "List parks",
          icon: "las la-list-alt",
          to: "/parks",
          permissionId: 34,
        },
        {
          id: 34,
          label: "New park",
          icon: "las la-pen-nib",
          to: "/park/add",
          permissionId: 34,
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
      id:51,
      label: "Deadline",
      icon: "lar la-life-ring",
      to: "/deadline",
      permissionId:51, 
    },
    {
      id: 40,
      label: "HSE",
      icon: "las la-shield-alt",
      permissionId: 40, // ID de permission à ajuster
      subItems: [
        // {
        //   id: 40,
        //   label: "HSE dashboard",
        //   icon: "fas fa-shield-alt",
        //   to: "/hse-dashboard",
        //   permissionId: 40,
        // },
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
          to: "/violation",
          permissionId: 40,
        },
        {
          id: 21,
          label: "Fire extinguisher management",
          icon: "las la-fire-extinguisher",
          to: "/fire-ext",
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
  permissionId: 41,
  subItems: [
    {
      id: 41,
      label: "Reception",
      icon: "las la-clipboard-check", // Réception / vérification
      to: "/reception",
      permissionId: 41,
    },
    {
      id: 25,
      label: "Garage",
      icon: "las la-warehouse", // Représente un garage ou entrepôt
      to: "/garage",
      permissionId: 41,
    },
    {
      id: 26,
      label: "Planned interviews",
      icon: "las la-calendar-alt", // Pour la planification
      to: "/planning-interviews",
      permissionId: 41,
    },
    {
      id: 27,
      label: "Servicing",
      icon: "las la-tools", // Outils d’entretien
      to: "/servicing",
      permissionId: 41,
    },
    {
      id: 28,
      label: "Tire Change",
      icon: "las la-car", // Peut représenter un changement de pneu (alternatif : "las la-tire" s'il existe dans ton set)
      to: "/pneu",
      permissionId: 41,
    },
    {
      id: 28,
      label: "Parts Replacement",
      icon: "las la-wrench", // Peut représenter un changement de pneu (alternatif : "las la-tire" s'il existe dans ton set)
      to: "/piece",
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
      id: 42, // ID principal du menu Store
      label: "Stock",
      icon: "las la-store",
      permissionId: 42, // Doit exister dans ta table des permissions
      subItems: [
        {
          id: 42,
          label: "Tire",
          icon: "las la-boxes",
          to: "/pneu_stock",
          permissionId: 42, // Permission spécifique à la vue "Stock"
        },
        {
          id: 42,
          label: "Items",
          icon: "las la-cogs",
          to: "/piece_stock",
          permissionId: 42, 
        },
      ],
    },
    {
      id: 52,
      label: "Notifications",
      icon: "las la-bell",
      to: "/notifications",
      permissionId: 52, 
    },
    {
      id: 33,
      label: "Settings",
      icon: "las la-cog",
      to: "/Settings",
      permissionId: 10, 
    },
    {
      id: 34,
      label: "Help",
      icon: "lar la-life-ring",
      to: "/Help",
      permissionId: 11, 
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
  const handleMouseEnter = () => {
    setIsOpen("open");
    setSidebar("sidebar-open");
    setActiveLogo("header-logo-show");
    setActiveMenuText("");  // Afficher le texte du menu
    setMenuButtonSidebar("iq-menu-bt-sidebar-show");
  };
  
  const handleMouseLeave = () => {
    setIsOpen("");
    setSidebar("sidebar-close");
    setActiveLogo("header-logo-hide");
    setActiveMenuText("iq-menu-span-hide");  // Cacher le texte du menu
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
