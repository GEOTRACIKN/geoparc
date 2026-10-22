/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useEffect, useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  Button,
  Image,
  Dropdown,
  NavLink,
  Badge,
  Card,
  InputGroup,
  ListGroup,
} from "react-bootstrap";

import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import {
  useTranslate,
} from "../../../hooks/LanguageProvider";

import Logout from "../../Logout";

import {
  useTheme,
} from "../../../hooks/ThemeContext";

import axios from "axios";

import {
  useUser,
} from "../../../context/UserContext";

import {
  getNotificationRoute,
} from "../../../utilities/notificationRoute";

import {
  getNotificationType,
} from "../../../config/notificationTypes";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL;

const SESSION_TIMEOUT_MS =
  4 * 60 * 60 * 1000;

/* ============================================================
   PROPS
   ============================================================ */

interface NavbarProps {
  changNavbar: boolean;
  onToggleSidebarInNavbar: () => void;
}

/* ============================================================
   NOTIFICATION
   ============================================================ */

interface Notification {
  id_notification: number;

  id_groupe_alarme?: number | null;

  name_groupe_alarme?: string | null;

  name_alarme?: string | null;

  id_user: number;

  id_item?: number | null;

  id_type: number;

  message?: string | null;

  severity?: number | null;

  timestamp: string;

  state?: number | null;

  attached?: number | null;

  date_start?: string | null;

  immatriculation_vehicule?: string | null;

  training_prenom_conducteur?: string | null;

  feu_immatriculation_vehicule?: string | null;

  prenom_conducteur?: string | null;

  training_nom_conducteur?: string | null;

  nom_conducteur?: string | null;

  id_alarm?: number | null;

  id_alarme?: number | null;
}

/* ============================================================
   PERMISSION
   ============================================================ */

interface Permission {
  id_rel: number;
  id_role: number;
  id_permission: number;
  nom_permission: string;
  can_create: number;
  can_read: number;
  can_update: number;
  can_delete: number;
}

/* ============================================================
   PAGE SEARCH
   ============================================================ */

interface Page {
  id: number;
  title: string;
  content: string;
  route: string;
}

/* ============================================================
   NAVBAR
   ============================================================ */

const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebarInNavbar,
  changNavbar,
}) => {
  const userName =
    localStorage.getItem(
      "Geopusername"
    );

  const [
    isOpen,
    setIsOpen,
  ] = useState("");

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    activeLogo,
    setActiveLogo,
  ] = useState(
    "header-logo-show"
  );

  const [
    activeMenuText,
    setActiveMenuText,
  ] = useState("");

  const [
    menuButtonSidebar,
    setMenuButtonSidebar,
  ] = useState(
    "iq-menu-bt-sidebar-show"
  );

  const [
    sidebar,
    setSidebar,
  ] = useState(
    "sidebar-open"
  );

  const [
    showMenu,
    setShowMenu,
  ] = useState("");

  const [
    dropdownOpenNotification,
    setDropdownOpenNotification,
  ] = useState(false);

  const [
    dropdownOpenProfile,
    setDropdownOpenProfile,
  ] = useState(false);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState<string>("");

  const [
    isSearchVisible,
    setSearchVisible,
  ] = useState(true);

  const {
    lang,
    setLang,
  } = useTranslate();

  const {
    translate,
  } = useTranslate();

  const {
    pathImg,
  } = useUser();

  const {
    isDarkMode,
    toggleTheme,
  } = useTheme();

  const navigate =
    useNavigate();

  const userID =
    localStorage.getItem(
      "GeopUserID"
    );

  const APIkey =
    localStorage.getItem(
      "api_key"
    );

  /* ============================================================
     LANGUE
     ============================================================ */

  const handleLanguageChange = (
    newLang: any
  ) => {
    setLang(newLang);
  };

  const strLang: Record<
    string,
    string
  > = {
    en: translate(
      "English"
    ),

    fr: translate(
      "French"
    ),

    ar: translate(
      "Arabic"
    ),

    es: translate(
      "Espagnol"
    ),
  };

  /* ============================================================
     LOGOUT
     ============================================================ */

  const handleLogout =
    async () => {
      try {
        await axios.post(
          `${backendUrl}/api/logoutgeop`,
          {},
          {
            withCredentials:
              true,
          }
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.clear();

        navigate(
          "/login"
        );
      } catch (error) {
        console.error(
          "Logout failed:",
          error
        );
      }
    };

  /* ============================================================
     STORAGE LOGOUT
     ============================================================ */

  useEffect(() => {
    const handleStorageChange =
      (
        event: StorageEvent
      ) => {
        if (
          event.key ===
          "logoutEvent"
        ) {
          handleLogout();
        }
      };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
     AUTO LOGOUT
     ============================================================ */

  useEffect(() => {
    let inactivityTimeout:
      NodeJS.Timeout;

    const handleActivity =
      () => {
        clearTimeout(
          inactivityTimeout
        );

        inactivityTimeout =
          setTimeout(
            () => {
              handleLogout();
            },
            SESSION_TIMEOUT_MS
          );
      };

    const handleStorageChange =
      (
        event: StorageEvent
      ) => {
        if (
          event.key ===
          "logoutEvent"
        ) {
          handleLogout();
        }
      };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "mousemove",
      handleActivity
    );

    window.addEventListener(
      "keydown",
      handleActivity
    );

    handleActivity();

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "mousemove",
        handleActivity
      );

      window.removeEventListener(
        "keydown",
        handleActivity
      );

      clearTimeout(
        inactivityTimeout
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
     PROFILE
     ============================================================ */

  const handleToggleProfile = (
    open: boolean
  ) => {
    setDropdownOpenProfile(
      open
    );
  };

  /* ============================================================
     SIDEBAR
     ============================================================ */

  const handleSetIsOpen =
    () => {
      isOpen === "open"
        ? setIsOpen("")
        : setIsOpen(
            "open"
          );

      sidebar ===
      "sidebar-close"
        ? setSidebar(
            "sidebar-open"
          )
        : setSidebar(
            "sidebar-close"
          );

      activeLogo ===
      "header-logo-show"
        ? setActiveLogo(
            "header-logo-hide"
          )
        : setActiveLogo(
            "header-logo-show"
          );

      activeMenuText ===
      "iq-menu-span-hide"
        ? setActiveMenuText("")
        : setActiveMenuText(
            "iq-menu-span-hide"
          );

      menuButtonSidebar ===
      "iq-menu-bt-sidebar-show"
        ? setMenuButtonSidebar(
            "iq-menu-bt-sidebar-hide"
          )
        : setMenuButtonSidebar(
            "iq-menu-bt-sidebar-show"
          );
    };

  const toggleMenu =
    () => {
      setShowMenu(
        showMenu === ""
          ? "show"
          : ""
      );
    };

  /* ============================================================
     TEMPS RELATIF NOTIFICATIONS
     ============================================================ */

  const formatRelativeTime = (
    value?: string | null
  ): string => {
    if (!value) {
      return "";
    }

    const notificationDate =
      new Date(value);

    if (
      Number.isNaN(
        notificationDate.getTime()
      )
    ) {
      return "";
    }

    const now =
      new Date();

    let difference =
      now.getTime() -
      notificationDate.getTime();

    // Protection si l'heure serveur est légèrement en avance
    if (difference < 0) {
      difference = 0;
    }

    const seconds =
      Math.floor(
        difference / 1000
      );

    const minutes =
      Math.floor(
        seconds / 60
      );

    const hours =
      Math.floor(
        minutes / 60
      );

    const days =
      Math.floor(
        hours / 24
      );

    const months =
      Math.floor(
        days / 30
      );

    const years =
      Math.floor(
        days / 365
      );

    if (seconds < 10) {
      return "à l'instant";
    }

    if (seconds < 60) {
      return `il y a ${seconds} seconde${
        seconds > 1 ? "s" : ""
      }`;
    }

    if (minutes < 60) {
      return `il y a ${minutes} minute${
        minutes > 1 ? "s" : ""
      }`;
    }

    if (hours < 24) {
      return `il y a ${hours} heure${
        hours > 1 ? "s" : ""
      }`;
    }

    if (days === 1) {
      return "il y a un jour";
    }

    if (days < 30) {
      return `il y a ${days} jours`;
    }

    if (months === 1) {
      return "il y a un mois";
    }

    if (days < 365) {
      return `il y a ${months} mois`;
    }

    if (years === 1) {
      return "il y a un an";
    }

    return `il y a ${years} ans`;
  };

  /* ============================================================
     CHARGEMENT NOTIFICATIONS
     ============================================================ */

  const getAlarms =
    async (
      id_user: string,
      state: number
    ) => {
      try {
        const bodyData =
          JSON.stringify({
            id_user:
              parseInt(
                id_user,
                10
              ),

            state,
          });

        const response =
          await fetch(
            `${backendUrl}/api/geop/notification/read`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                bodyData,

              mode:
                "cors",

              credentials:
                "include",
            }
          );

        if (
          !response.ok
        ) {
          throw new Error(
            `Request failed with status ${response.status}: ${response.statusText}`
          );
        }

        const alarmResponse =
          await response.json();

        if (
          Array.isArray(
            alarmResponse
          )
        ) {
          setNotifications(
            alarmResponse
          );
        } else {
          setNotifications(
            []
          );
        }
      } catch (error) {
        console.error(
          "Error fetching alarms:",
          error
        );

        setNotifications(
          []
        );
      }
    };

  /* ============================================================
     REFRESH NOTIFICATIONS
     ============================================================ */

  useEffect(() => {
    if (!userID) {
      return;
    }

    getAlarms(
      userID,
      1
    );

    const interval =
      setInterval(
        () => {
          getAlarms(
            userID,
            1
          );
        },
        10000
      );

    return () => {
      clearInterval(
        interval
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  /* ============================================================
     TOGGLE CLOCHE
     ============================================================ */

  const handleToggleNotification = (
    open: boolean
  ) => {
    setDropdownOpenNotification(
      open
    );
  };

  /* ============================================================
     CLIC NOTIFICATION
     ============================================================ */

  const handleNotificationClick =
    async (
      notification:
        Notification
    ) => {
      /*
       * Route selon id_type.
       */
      const route =
        getNotificationRoute(
          notification
        );

      /*
       * Fermer dropdown.
       */
      setDropdownOpenNotification(
        false
      );

      /*
       * Marquer notification comme lue.
       */
      try {
        const response =
          await fetch(
            `${backendUrl}/api/geop/notification/update`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body:
                JSON.stringify(
                  {
                    id_notification:
                      notification.id_notification,

                    id_user:
                      userID,
                  }
                ),
            }
          );

        if (
          !response.ok
        ) {
          console.warn(
            "Erreur update notification :",
            response.status
          );
        }

        if (userID) {
          getAlarms(
            userID,
            1
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour notification :",
          error
        );
      }

      /*
       * Naviguer même si update échoue.
       */
      navigate(route);
    };

  /* ============================================================
     PAGES SEARCH
     ============================================================ */

  const pages:
    Page[] = [
    {
      id: 1,
      title:
        translate(
          "Dashboard"
        ),
      content:
        translate(
          "Main dashboard displaying an overview of your fleet management."
        ),
      route: "/",
    },

    {
      id: 2,
      title:
        translate(
          "Map"
        ),
      content:
        translate(
          "Interactive map showing the location of all vehicles and devices."
        ),
      route:
        "/map",
    },

    {
      id: 3,
      title:
        translate(
          "Vehicles"
        ),
      content:
        translate(
          "List of all vehicles in the fleet, including details and management options."
        ),
      route:
        "/vehicles",
    },

    {
      id: 4,
      title:
        translate(
          "Add Vehicle"
        ),
      content:
        translate(
          "Form to add a new vehicle to the fleet."
        ),
      route:
        "/Vehicle/add",
    },

    {
      id: 5,
      title:
        translate(
          "Edit Vehicle"
        ),
      content:
        translate(
          "Form to edit an existing vehicle's details."
        ),
      route:
        "/vehicles",
    },

    {
      id: 6,
      title:
        translate(
          "Devices"
        ),
      content:
        translate(
          "List of all devices in the fleet, including their status and details."
        ),
      route:
        "/Devices",
    },

    {
      id: 7,
      title:
        translate(
          "Add Device"
        ),
      content:
        translate(
          "Form to add a new device."
        ),
      route:
        "/Device/add",
    },

    {
      id: 8,
      title:
        translate(
          "Edit Device"
        ),
      content:
        translate(
          "Form to edit an existing device's details."
        ),
      route:
        "/Devices",
    },

    {
      id: 9,
      title:
        translate(
          "Drivers"
        ),
      content:
        translate(
          "List of all drivers, including their profiles and management options."
        ),
      route:
        "/drivers",
    },

    {
      id: 10,
      title:
        translate(
          "Driver Profile"
        ),
      content:
        translate(
          "Detailed profile of a specific driver."
        ),
      route:
        "/driver",
    },

    {
      id: 11,
      title:
        translate(
          "Driver Details"
        ),
      content:
        translate(
          "Detailed information about a specific driver."
        ),
      route:
        "/drivers",
    },

    {
      id: 12,
      title:
        translate(
          "Fleet"
        ),
      content:
        translate(
          "Overview of the entire fleet, including vehicle and driver statistics."
        ),
      route:
        "/Fleet",
    },

    {
      id: 14,
      title:
        translate(
          "SIM Cards"
        ),
      content:
        translate(
          "Manage SIM cards used in devices."
        ),
      route:
        "/cartes-sim",
    },

    {
      id: 15,
      title:
        translate(
          "Users"
        ),
      content:
        translate(
          "List of users who have access to the system, including their roles and permissions."
        ),
      route:
        "/users",
    },

    {
      id: 16,
      title:
        translate(
          "User Profile"
        ),
      content:
        translate(
          "Profile page for a specific user."
        ),
      route:
        "/User",
    },

    {
      id: 17,
      title:
        translate(
          "Ibutton"
        ),
      content:
        translate(
          "Manage Ibutton devices."
        ),
      route:
        "/Ibutton",
    },

    {
      id: 18,
      title:
        translate(
          "Reports"
        ),
      content:
        translate(
          "Generate and view various reports related to fleet performance and other metrics."
        ),
      route:
        "/reports",
    },

    {
      id: 19,
      title:
        translate(
          "POI Reports"
        ),
      content:
        translate(
          "Reports on points of interest."
        ),
      route:
        "/poi-reports",
    },

    {
      id: 20,
      title:
        translate(
          "New POI Report"
        ),
      content:
        translate(
          "Form to create a new point of interest report."
        ),
      route:
        "/new-poi-report",
    },

    {
      id: 21,
      title:
        translate(
          "Fleet Reports"
        ),
      content:
        translate(
          "Reports related to fleet operations and performance."
        ),
      route:
        "/fleet-reports",
    },

    {
      id: 22,
      title:
        translate(
          "New Fleet Report"
        ),
      content:
        translate(
          "Form to create a new fleet report."
        ),
      route:
        "/new-fleet-report",
    },

    {
      id: 23,
      title:
        translate(
          "Snapshots"
        ),
      content:
        translate(
          "View and manage snapshots of fleet data."
        ),
      route:
        "/snapshots",
    },

    {
      id: 24,
      title:
        translate(
          "Report Details"
        ),
      content:
        translate(
          "Detailed view of a specific report."
        ),
      route:
        "/reports",
    },

    {
      id: 25,
      title:
        translate(
          "New Report"
        ),
      content:
        translate(
          "Form to create a new report."
        ),
      route:
        "/new-report",
    },

    {
      id: 26,
      title:
        translate(
          "Tag History"
        ),
      content:
        translate(
          "History of tags and their usage."
        ),
      route:
        "/history-tag",
    },

    {
      id: 27,
      title:
        translate(
          "Vehicle History"
        ),
      content:
        translate(
          "History and logs related to vehicles."
        ),
      route:
        "/history-vehucle",
    },

    {
      id: 28,
      title:
        translate(
          "User History"
        ),
      content:
        translate(
          "History and logs related to users."
        ),
      route:
        "/history-user",
    },

    {
      id: 29,
      title:
        translate(
          "Help"
        ),
      content:
        translate(
          "Help and support resources for using the platform."
        ),
      route:
        "/help",
    },

    {
      id: 30,
      title:
        translate(
          "Log Positions"
        ),
      content:
        translate(
          "View logs of positions for devices and vehicles."
        ),
      route:
        "/logpositions",
    },

    {
      id: 31,
      title:
        translate(
          "Connection"
        ),
      content:
        translate(
          "Page for connecting to the platform."
        ),
      route:
        "/Connection",
    },

    {
      id: 32,
      title:
        translate(
          "Driver Tag"
        ),
      content:
        translate(
          "Manage driver tags and associated data."
        ),
      route:
        "/driver-tag",
    },

    {
      id: 33,
      title:
        translate(
          "Settings"
        ),
      content:
        translate(
          "Platform settings and configuration options."
        ),
      route:
        "/Settings",
    },

    {
      id: 34,
      title:
        translate(
          "User Profile by ID"
        ),
      content:
        translate(
          "Detailed profile of a specific user identified by userurlID."
        ),
      route:
        "/User",
    },

    {
      id: 35,
      title:
        translate(
          "Vehicle Groups"
        ),
      content:
        translate(
          "Manage groups of vehicles."
        ),
      route:
        "/groupevehicles",
    },

    {
      id: 36,
      title:
        translate(
          "Device Groups"
        ),
      content:
        translate(
          "Manage groups of devices."
        ),
      route:
        "/groupe-device",
    },

    {
      id: 37,
      title:
        translate(
          "Roles"
        ),
      content:
        translate(
          "Manage user roles and permissions."
        ),
      route:
        "/role",
    },

    {
      id: 38,
      title:
        translate(
          "Role Permissions"
        ),
      content:
        translate(
          "Manage permissions for a specific role and user."
        ),
      route:
        "/role",
    },

    {
      id: 39,
      title:
        translate(
          "Profile"
        ),
      content:
        translate(
          "User profile page."
        ),
      route:
        "/profile",
    },

    {
      id: 40,
      title:
        translate(
          "Support Tickets"
        ),
      content:
        translate(
          "Manage support tickets from customers."
        ),
      route:
        "/support-customers",
    },

    {
      id: 41,
      title:
        translate(
          "Alarms"
        ),
      content:
        translate(
          "Manage and view alarms."
        ),
      route:
        "/alarms",
    },

    {
      id: 42,
      title:
        translate(
          "Add Alarm"
        ),
      content:
        translate(
          "Form to add a new alarm."
        ),
      route:
        "/alarm/add",
    },

    {
      id: 43,
      title:
        translate(
          "Edit Alarm"
        ),
      content:
        translate(
          "Form to edit an existing alarm."
        ),
      route:
        "/alarms",
    },

    {
      id: 44,
      title:
        translate(
          "Group Alarms"
        ),
      content:
        translate(
          "Manage groups of alarms."
        ),
      route:
        "/group-alarms",
    },

    {
      id: 45,
      title:
        translate(
          "Points of Interest"
        ),
      content:
        translate(
          "Manage points of interest (POIs)."
        ),
      route:
        "/pois",
    },

    {
      id: 46,
      title:
        translate(
          "Edit POI"
        ),
      content:
        translate(
          "Form to edit an existing point of interest."
        ),
      route:
        "/pois",
    },

    {
      id: 47,
      title:
        translate(
          "Add POI"
        ),
      content:
        translate(
          "Form to add a new point of interest."
        ),
      route:
        "/poi/add",
    },

    {
      id: 48,
      title:
        translate(
          "Notifications"
        ),
      content:
        translate(
          "View and manage notifications."
        ),
      route:
        "/notifications",
    },
  ];

  const [
    filteredPages,
    setFilteredPages,
  ] = useState<Page[]>(
    pages
  );

  /* ============================================================
     SEARCH
     ============================================================ */

  const handleSearch = (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {
    const term =
      event.target.value.toLowerCase();

    setSearchTerm(
      term
    );

    setSearchVisible(
      true
    );

    setFilteredPages(
      pages.filter(
        (
          page
        ) =>
          page.title
            .toLowerCase()
            .includes(
              term
            ) ||
          page.content
            .toLowerCase()
            .includes(
              term
            )
      )
    );
  };

  const handleItemClick =
    () => {
      setSearchVisible(
        false
      );
    };

  /* ============================================================
     PERMISSIONS
     ============================================================ */

  let userPermissions:
    Permission[] = [];

  try {
    const permissionsString =
      localStorage.getItem(
        "geop_userPermissions"
      );

    if (
      permissionsString
    ) {
      userPermissions =
        JSON.parse(
          permissionsString
        );
    }
  } catch (e) {
    console.error(
      "JSON parsing error",
      e
    );
  }

  const checkPermission = (
    idPermission: number
  ): boolean => {
    return userPermissions.some(
      (
        permission
      ) =>
        permission.id_permission ===
        idPermission
    );
  };

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div
      className={`iq-top-navbar ${
        changNavbar
          ? "navbar-push"
          : "navbar-pool"
      }`}
    >
      <div className="iq-navbar-custom">
        <button
          type="button"
          className="navbar-sidebar-fix-toggle"
          title={
            changNavbar
              ? translate(
                  "Unpin sidebar"
                )
              : translate(
                  "Pin sidebar"
                )
          }
          onClick={
            onToggleSidebarInNavbar
          }
        >
          <i
            className={`las ${
              changNavbar
                ? "la-angle-double-left"
                : "la-angle-double-right"
            } navbar-sidebar-fix-icon`}
          />
        </button>

        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
            <i
              className="las la-bars wrapper-menu"
              onClick={() => {
                handleSetIsOpen();

                onToggleSidebarInNavbar();
              }}
            />

            <Nav.Link
              to="/"
              className="header-logo"
              as={
                NavLink
              }
            >
              <Image
                className="img-fluid rounded-normal light-logo"
                style={{
                  height:
                    "22px",

                  width:
                    "136px",

                  paddingLeft:
                    15,
                }}
                src={
                  isDarkMode
                    ? "asset/images/logo_dark.png"
                    : "asset/images/logo.png"
                }
                alt="Logo"
              />
            </Nav.Link>

            {/* ================================================
                SEARCH
                ================================================ */}

            <div className="search-container navbar-search-container hide-on-mobile">
              <InputGroup className="navbar-search-group">
                <InputGroup.Text
                  id="search-icon"
                  className="navbar-search-icon"
                >
                  <i className="fas fa-search" />
                </InputGroup.Text>

                <Form.Control
                  className="navbar-search-input"
                  type="text"
                  value={
                    searchTerm
                  }
                  onChange={
                    handleSearch
                  }
                  placeholder={
                    translate(
                      "Search here"
                    ) +
                    "..."
                  }
                />
              </InputGroup>

              {isSearchVisible &&
                searchTerm &&
                filteredPages.length >
                  0 && (
                  <ListGroup
                    className="results-container"
                    style={{
                      position:
                        "absolute",

                      top:
                        "100%",

                      left: 0,

                      maxHeight:
                        "400px",

                      border:
                        "1px solid #ddd",

                      borderRadius:
                        "4px",

                      backgroundColor:
                        "#fff",

                      boxShadow:
                        "0 2px 4px rgba(0,0,0,0.1)",

                      zIndex:
                        10,

                      overflowY:
                        "auto",
                    }}
                  >
                    {filteredPages.map(
                      (
                        page
                      ) => (
                        <ListGroup.Item
                          key={
                            page.id
                          }
                          className="result-item"
                          onClick={
                            handleItemClick
                          }
                        >
                          <strong>
                            <Link
                              to={
                                page.route
                              }
                            >
                              {
                                page.title
                              }
                            </Link>
                          </strong>
                          :{" "}
                          {
                            page.content
                          }
                        </ListGroup.Item>
                      )
                    )}
                  </ListGroup>
                )}
            </div>
          </div>

          <div className="d-flex align-items-center">
            <button
              onClick={
                toggleMenu
              }
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-label="Toggle navigation"
              aria-expanded="true"
            >
              <i className="ri-menu-3-line" />
            </button>

            <div
              className={`navbar-collapse collapse ${showMenu}`}
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ml-auto navbar-list align-items-center">

                {/* ================================================
                    GEOPARC
                    ================================================ */}

                {checkPermission(
                  27
                ) && (
                  <li
                    className="nav-item nav-icon dropdown"
                    style={{
                      margin:
                        "12px 5px",
                    }}
                    title={translate(
                      "Click here to access GEOPARC"
                    )}
                  >
                    {userID ===
                      "1" && (
                      <a
                        href={`https://geoparc.geotrackin.com?apikey=${APIkey}`}
                        className="gp"
                      >
                        <i
                          className="las la-sign-in-alt"
                          style={{
                            fontSize:
                              "29px",
                          }}
                        />

                        <span
                          style={{
                            fontSize:
                              "16px",
                          }}
                        >
                          {" "}
                          GEOPARC
                        </span>
                      </a>
                    )}
                  </li>
                )}

                {/* ================================================
                    LANGUE
                    ================================================ */}

                <li
                  className="nav-item nav-icon dropdown"
                  style={{
                    margin:
                      "0 5px",
                  }}
                >
                  <NavDropdown
                    title={
                      <span>
                        <img
                          src={`asset/images/small/flag-${lang}.png`}
                          alt={
                            lang
                          }
                        />

                        <span>
                          {" "}
                          {
                            strLang[
                              lang
                            ]
                          }
                        </span>
                      </span>
                    }
                    id="navbarScrollingDropdown"
                  >
                    <NavDropdown.Item
                      onClick={() =>
                        handleLanguageChange(
                          "en"
                        )
                      }
                    >
                      <img
                        src="asset/images/small/flag-en.png"
                        alt="img-flag"
                        className="img-fluid image-flag mr-2"
                      />{" "}
                      {translate(
                        "English"
                      )}
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      onClick={() =>
                        handleLanguageChange(
                          "fr"
                        )
                      }
                    >
                      <img
                        src="asset/images/small/flag-fr.png"
                        alt="img-flag"
                        className="img-fluid image-flag mr-2"
                      />{" "}
                      {translate(
                        "French"
                      )}
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      onClick={() =>
                        handleLanguageChange(
                          "ar"
                        )
                      }
                    >
                      <img
                        src="asset/images/small/flag-ar.png"
                        alt="img-flag"
                        className="img-fluid image-flag mr-2"
                      />{" "}
                      {translate(
                        "Arabic"
                      )}
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      onClick={() =>
                        handleLanguageChange(
                          "es"
                        )
                      }
                    >
                      <img
                        src="asset/images/small/flag-es.png"
                        alt="img-flag"
                        className="img-fluid image-flag mr-2"
                      />{" "}
                      {translate(
                        "Spanish"
                      )}
                    </NavDropdown.Item>
                  </NavDropdown>
                </li>

                {/* ================================================
                    THEME
                    ================================================ */}

                <li
                  className="nav-item nav-icon dropdown"
                  style={{
                    margin:
                      "0 5px",
                  }}
                >
                  <div
                    className="dropdown"
                    onClick={
                      toggleTheme
                    }
                    style={{
                      cursor:
                        "pointer",
                    }}
                  >
                    {isDarkMode ? (
                      <i
                        className="las la-moon"
                        style={{
                          fontSize:
                            "22px",
                        }}
                      />
                    ) : (
                      <i
                        className="las la-sun"
                        style={{
                          fontSize:
                            "22px",
                        }}
                      />
                    )}
                  </div>
                </li>

                {/* ================================================
                    CLOCHE NOTIFICATIONS
                    ================================================ */}

                <li
                  className="nav-item nav-icon dropdown show"
                  style={{
                    margin:
                      "0 5px",
                  }}
                >
                  <Dropdown
                    onToggle={
                      handleToggleNotification
                    }
                    show={
                      dropdownOpenNotification
                    }
                  >
                    <Dropdown.Toggle
                      as="span"
                      id="dropdownMenuButton5"
                      className="search-toggle"
                      href="#"
                    >
                      <div className="notification-icon">
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
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />

                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>

                        {notifications.length >
                          0 && (
                          <span className="notification-badge">
                            {
                              notifications.length
                            }
                          </span>
                        )}
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      align="end"
                      className="iq-sub-dropdown dropdown-menu"
                      show={
                        dropdownOpenNotification
                      }
                      aria-labelledby="dropdownMenuButton5"
                    >
                      <Card className="shadow-none m-0">
                        <Card.Body className="p-0">

                          {/* HEADER */}

                          <div className="custom-title p-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <h5 className="mb-0">
                                {translate(
                                  "Notifications"
                                )}
                              </h5>

                              <Badge className="badge-card">
                                {
                                  notifications.length
                                }
                              </Badge>
                            </div>
                          </div>

                          {/* ========================================
                              LISTE
                              ======================================== */}

                          <div
                            className="px-3 pt-0 pb-0 sub-card"
                            style={{
                              maxHeight:
                                "420px",

                              overflowY:
                                "auto",
                            }}
                          >
                            {notifications.length >
                            0 ? (
                              notifications
                                .slice(
                                  0,
                                  7
                                )
                                .map(
                                  (
                                    notification
                                  ) => {
                                    /*
                                     * SOURCE UNIQUE :
                                     * notificationTypes.ts
                                     */
                                    const config =
                                      getNotificationType(
                                        notification.id_type
                                      );

                                    return (
                                      <div
                                        key={
                                          notification.id_notification
                                        }
                                        className="iq-sub-card"
                                        role="button"
                                        tabIndex={
                                          0
                                        }
                                        style={{
                                          cursor:
                                            "pointer",
                                        }}
                                        onClick={() =>
                                          handleNotificationClick(
                                            notification
                                          )
                                        }
                                        onKeyDown={(
                                          event
                                        ) => {
                                          if (
                                            event.key ===
                                              "Enter" ||
                                            event.key ===
                                              " "
                                          ) {
                                            handleNotificationClick(
                                              notification
                                            );
                                          }
                                        }}
                                      >
                                        <div className="media align-items-center custom-card py-3 border-bottom">
                                          <div>
                                            <img
                                              className="avatar-30 rounded-small"
                                              src="../asset/images/icon-report/3.png"
                                              alt="notification"
                                            />
                                          </div>

                                          <div className="media-body ml-3">

                                            {/* GROUPE + HEURE */}

                                            <div className="d-flex align-items-center justify-content-between">
                                              <h6 className="mb-0">
                                                {
                                                  config.group
                                                }
                                              </h6>

                                              <small
                                                style={{
                                                  whiteSpace:
                                                    "nowrap",

                                                  marginLeft:
                                                    "10px",

                                                  fontWeight:
                                                    600,
                                                }}
                                              >
                                                {formatRelativeTime(
                                                  notification.timestamp
                                                )}
                                              </small>
                                            </div>

                                            {/* LABEL */}

                                            <small className="mb-0">
                                              {
                                                config.label
                                              }
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                )
                            ) : (
                              <p className="text-center p-2">
                                {translate(
                                  "No notifications available."
                                )}
                              </p>
                            )}
                          </div>

                          {/* ========================================
                              VOIR TOUTES
                              ======================================== */}

                          <button
                            type="button"
                            className="right-ic btn btn-primary btn-block position-relative p-2"
                            onClick={() => {
                              setDropdownOpenNotification(
                                false
                              );

                              navigate(
                                "/notifications"
                              );
                            }}
                          >
                            {translate(
                              "See all notifications"
                            )}{" "}

                            <i className="las la-arrow-right" />
                          </button>
                        </Card.Body>
                      </Card>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>

                {/* ================================================
                    PROFILE
                    ================================================ */}

                <li
                  className="nav-item nav-icon dropdown"
                  style={{
                    margin:
                      "0 5px",
                  }}
                >
                  <Dropdown
                    onToggle={
                      handleToggleProfile
                    }
                    show={
                      dropdownOpenProfile
                    }
                  >
                    <Dropdown.Toggle
                      as="span"
                      id="dropdownMenuButton4"
                      className="search-toggle"
                      href="#"
                    >
                      <i
                        className="las la-user"
                        style={{
                          fontSize:
                            "25px",
                        }}
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={{
                        width:
                          "auto",

                        inset:
                          "auto auto auto auto",
                      }}
                      className="dropdownProfile"
                    >
                      <div className="card shadow-none border-0 m-0">
                        <div className="card-body p-0 text-center">
                          <div className="media-body profile-detail text-center">
                            <img
                              src="asset/images/page-img/profile-bg.jpg"
                              alt="profile-bg"
                              className="rounded-top img-fluid mb-4"
                            />

                            <img
                              src={
                                pathImg ||
                                "asset/images/user/blank.png"
                              }
                              alt="profile-img"
                              className="rounded profile-img img-fluid avatar-70"
                            />
                          </div>

                          <div className="p-3">
                            <h5 className="mb-1">
                              {
                                userName
                              }
                            </h5>

                            <p className="mb-0" />

                            <div className="d-flex align-items-center justify-content-center mt-3">
                              <Button
                                variant="outline-secondary"
                                className="mr-2"
                                onClick={() =>
                                  navigate(
                                    "/profile"
                                  )
                                }
                                style={{
                                  minWidth:
                                    "max-content",

                                  border:
                                    "1px solid #ddd",

                                  borderRadius:
                                    "5px",
                                }}
                              >
                                <i className="las la-user" />{" "}
                                {translate(
                                  "Profile"
                                )}
                              </Button>

                              <span
                                style={{
                                  minWidth:
                                    "max-content",

                                  border:
                                    "1px solid #ddd",

                                  borderRadius:
                                    "5px",
                                }}
                              >
                                <Logout
                                  onLogout={
                                    handleLogout
                                  }
                                  activeMenu=""
                                  title={translate(
                                    "Logout"
                                  )}
                                  margin="ml-1"
                                />
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
};

export default Navbar;