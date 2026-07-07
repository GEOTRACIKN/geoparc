/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Nav, Image } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useTranslate } from "../../../hooks/LanguageProvider";
import Logout from "../../Logout";
import usePermissions from "../../../hooks/usePermissions";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../hooks/ThemeContext";
import { menuItems } from "../../../config/menu/menu.data";
import {
  loadSidebarAppearancePreference,
  persistSidebarAppearanceLocally,
  readStoredSidebarAppearance,
  SIDEBAR_APPEARANCE_CHANGE_EVENT,
  SidebarAppearancePreference,
} from "../../../utilities/sidebarPreference";

interface SidebarProps {
  isSidebarPinned: boolean;
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarPinned, onToggleSidebar }) => {
  const { translate } = useTranslate();
  const [isHovering, setIsHovering] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.matchMedia("(max-width: 1299px)").matches
  );
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const [appearance, setAppearance] = useState<SidebarAppearancePreference>(readStoredSidebarAppearance);
  const { isDarkMode } = useTheme();

  const navigate = useNavigate();
  const { logout } = useAuth();
  const isSidebarExpanded = isSidebarPinned || (!isSmallScreen && isHovering);
  const isOpen = isSidebarExpanded ? "open" : "";
  const activeLogo = isSidebarExpanded ? "header-logo-show" : "header-logo-hide";
  const activeMenuText = isSidebarExpanded ? "" : "iq-menu-span-hide";
  const sidebar = isSidebarExpanded ? "sidebar-open" : "sidebar-close";
  const effectiveSidebarColor = isDarkMode ? "dark" : "light";
  const sidebarAppearanceClass = `sidebar-color-${effectiveSidebarColor} sidebar-icons-${appearance.iconMode}`;


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
    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    const idUser = Number(localStorage.getItem("GeopUserID") ?? 0);

    if (idUser) {
      loadSidebarAppearancePreference(idUser)
        .then((savedAppearance) => {
          setAppearance(savedAppearance);
          persistSidebarAppearanceLocally(savedAppearance);
        })
        .catch((error) => {
          console.warn("Unable to load sidebar appearance:", error);
        });
    }

    const handleSidebarAppearanceChange = (event: Event) => {
      setAppearance((event as CustomEvent<SidebarAppearancePreference>).detail);
    };

    window.addEventListener(SIDEBAR_APPEARANCE_CHANGE_EVENT, handleSidebarAppearanceChange);

    return () => {
      window.removeEventListener(SIDEBAR_APPEARANCE_CHANGE_EVENT, handleSidebarAppearanceChange);
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






  const handleMouseEnter = () => {
    if (isSmallScreen || isSidebarPinned) return;
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (isSmallScreen || isSidebarPinned) return;
    setIsHovering(false);
  };

  const handleMenuNavigation = () => {
    setOpenSubmenus([]);
    if (isSmallScreen && isSidebarPinned) {
      onToggleSidebar();
    }
  };

  return (
    <div
      style={{ zIndex: 10015 }}
      className={`iq-sidebar sidebar-default ${sidebar} ${sidebarAppearanceClass}`}
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
            src={isDarkMode ? "asset/images/logo_dark.png" : "asset/images/logo.png"}
            alt="GeoTrackin"
          ></Image>
        </Nav.Link>
        <button
          type="button"
          className="iq-menu-bt-sidebar sidebar-menu-toggle"
          title={translate("Menu")}
          onClick={() => {
            onToggleSidebar();
          }}
        >
          <i className="las la-bars wrapper-menu sidebar-menu-icon"></i>
        </button>
      </div>
      <div
        className={`data-scrollbar `}
        data-scroll="1"
        data-scrollbar="true"
        style={{ overflowX: "hidden", overflowY: "auto", outline: "none" }}
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
                            handleMenuNavigation();
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
                                    handleMenuNavigation();
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
                <li>
                  <Nav.Link
                    to="/profile"
                    className="svg-icon"
                    as={NavLink}
                    onClick={handleMenuNavigation}
                  >
                    <i className="las la-user-circle" />
                    <span className={`ml-3 ${activeMenuText}`}>
                      {translate("Profile")}
                    </span>
                  </Nav.Link>
                </li>
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
