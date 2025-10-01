/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Button, Image, Dropdown, Navbar as NavbarBs, NavLink, Badge, Card, InputGroup, ListGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useTranslate } from '../hooks/LanguageProvider';
import Cookies from 'universal-cookie';
import Logout from './Logout';
import { useTheme } from '../hooks/ThemeContext';
import { Bounce, toast } from 'react-toastify';
import axios from 'axios';


const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface NavbarProps {
  changNavbar: boolean;
  onToggleSidebarInNavbar: () => void;
}

interface Notification {
  id_notification: number;
  id_groupe_alarme: number;
  name_groupe_alarme: string;
  name_alarme: string;
  id_user: number;
  id_item: number;
  id_type: number;
  message: string;
  severity: number;
  timestamp: string;
  state: number;
  attached: number;
  date_start: string;
  immatriculation_vehicule: string;
  training_prenom_conducteur: string;
  feu_immatriculation_vehicule: string;
  prenom_conducteur: string;
  training_nom_conducteur: string;
  nom_conducteur: string;
  id_alarm: number;
}

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


const Navbar: React.FC<NavbarProps> = ({ onToggleSidebarInNavbar, changNavbar }) => {

  const userName = localStorage.getItem("Geopusername");
  const [isOpen, setIsOpen] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeLogo, setActiveLogo] = useState("header-logo-show");
  const [activeMenuText, setActiveMenuText] = useState("");
  const [menuButtonSidebar, setMenuButtonSidebar] = useState("iq-menu-bt-sidebar-show");
  const [sidebar, setSidebar] = useState("sidebar-open");
  const [showMenu, setShowMenu] = useState("");
  const { lang, setLang } = useTranslate();
  const navigate = useNavigate();
  const { translate } = useTranslate();
  const handleLanguageChange = (newLang: any) => { setLang(newLang); };
  const userID = localStorage.getItem("GeopUserID");
  const APIkey = localStorage.getItem("api_key");
  const theme = localStorage.getItem("theme_mode");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const strLang = {
    en: translate('English'),
    fr: translate('French'),
    ar: translate('Arabic'),
    es: translate('Espagnol'),
  };


  const notificationType = [
    translate('Driving license'),
    translate('Vehicle insurance'),
    translate('Next maintenance due'),
    translate('Training certificate expiration'),
    translate('Fire extinguisher verification'),
    translate('Vehicle technical inspection'),
    translate('Vehicle sticker verification'),
    translate('Draining verification'),
  ];


  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      // 🔐 Call the backend to clear the httpOnly JWT cookie
      await axios.post(`${backendUrl}/api/logoutgeop`, {}, {
        withCredentials: true, // ✅ Required to include the cookie in the request
      });

      // 🧹 Clear localStorage (optional, depends on what you store locally)
      localStorage.removeItem("user");
      localStorage.clear(); // Optional: clears all keys from localStorage

      // 🔁 Redirect the user to the login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "logoutEvent") {
        // The logout has occurred, log out the user
        handleLogout();
      }
    };

    // Add a local storage event listener
    window.addEventListener("storage", handleStorageChange);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    let inactivityTimeout: NodeJS.Timeout;

    const handleActivity = () => {
      clearTimeout(inactivityTimeout); // Reset the timeout on user activity
      inactivityTimeout = setTimeout(() => {
        // Auto logout after 15 minutes of inactivity
        handleLogout();
      }, 14400000); // 15 minutes in milliseconds
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


  const [dropdownOpenNotification, setDropdownOpenNotification] = useState(false);
  const [dropdownOpenProfile, setDropdownOpenProfile] = useState(false);



  const handleToggleProfile = (DropdownOpen: any) => {
    setDropdownOpenProfile(DropdownOpen);
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

  const toggleMenu = () => {
    setShowMenu(showMenu === "" ? "show" : "");
  };


  const getAlarms = async (id_user: string, state: number) => {
    try {
      // Prepare the request body
      const bodyData = JSON.stringify({
        id_user: parseInt(id_user),
        state
      });

      // Make the fetch request
      const response = await fetch(
        `${backendUrl}/api/geop/notification/read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyData,
          mode: "cors",
        }
      );

      // Check if the response status is OK (status code 200)
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }

      // Parse the JSON response
      const alarmResponse = await response.json();

      // Set the notifications state
      setNotifications(alarmResponse);

      // toast.success("Nouvelles échéances détecté....", {
      //        position: "bottom-right",
      //        autoClose: 2400,
      //        hideProgressBar: false,
      //        closeOnClick: true,
      //        pauseOnHover: true,
      //        draggable: true,
      //        progress: undefined,
      //        theme: "light",
      //        transition: Bounce,
      //      });

    } catch (error) {

      console.error("Error fetching alarms:", error);

      setNotifications([]);
      // Display a user-friendly message or handle the error in your UI logic
      // toast.error("An error occurred while fetching alarms. Please try again later.");
    }
  };


  useEffect(() => {
    if (userID) {
      getAlarms(userID, 1);

      const interval = setInterval(() => {
        getAlarms(userID, 1);
      }, 10000); // 10,000ms = 10 seconds

      return () => clearInterval(interval);
    }
  }, [userID]);

  const handleToggleNotification = () => {
    setDropdownOpenNotification(!dropdownOpenNotification);
  };

  interface Page {
    id: number;
    title: string;
    content: string;
    route: string;
  }

  const pages: Page[] = [
    { id: 1, title: translate("Dashboard"), content: translate("Main dashboard displaying an overview of your fleet management."), route: "/" },
    { id: 2, title: translate("Map"), content: translate("Interactive map showing the location of all vehicles and devices."), route: "/map" },
    { id: 3, title: translate("Vehicles"), content: translate("List of all vehicles in the fleet, including details and management options."), route: "/vehicles" },
    { id: 4, title: translate("Add Vehicle"), content: translate("Form to add a new vehicle to the fleet."), route: "/Vehicle/add" },
    { id: 5, title: translate("Edit Vehicle"), content: translate("Form to edit an existing vehicle's details."), route: "/vehicles" },
    { id: 6, title: translate("Devices"), content: translate("List of all devices in the fleet, including their status and details."), route: "/Devices" },
    { id: 7, title: translate("Add Device"), content: translate("Form to add a new device."), route: "/Device/add" },
    { id: 8, title: translate("Edit Device"), content: translate("Form to edit an existing device's details."), route: "/Devices" },
    { id: 9, title: translate("Drivers"), content: translate("List of all drivers, including their profiles and management options."), route: "/drivers" },
    { id: 10, title: translate("Driver Profile"), content: translate("Detailed profile of a specific driver."), route: "/driver" },
    { id: 11, title: translate("Driver Details"), content: translate("Detailed information about a specific driver."), route: "/drivers" },
    { id: 12, title: translate("Fleet"), content: translate("Overview of the entire fleet, including vehicle and driver statistics."), route: "/Fleet" },
    { id: 14, title: translate("SIM Cards"), content: translate("Manage SIM cards used in devices."), route: "/cartes-sim" },
    { id: 15, title: translate("Users"), content: translate("List of users who have access to the system, including their roles and permissions."), route: "/users" },
    { id: 16, title: translate("User Profile"), content: translate("Profile page for a specific user."), route: "/User" },
    { id: 17, title: translate("Ibutton"), content: translate("Manage Ibutton devices."), route: "/Ibutton" },
    { id: 18, title: translate("Reports"), content: translate("Generate and view various reports related to fleet performance and other metrics."), route: "/reports" },
    { id: 19, title: translate("POI Reports"), content: translate("Reports on points of interest."), route: "/poi-reports" },
    { id: 20, title: translate("New POI Report"), content: translate("Form to create a new point of interest report."), route: "/new-poi-report" },
    { id: 21, title: translate("Fleet Reports"), content: translate("Reports related to fleet operations and performance."), route: "/fleet-reports" },
    { id: 22, title: translate("New Fleet Report"), content: translate("Form to create a new fleet report."), route: "/new-fleet-report" },
    { id: 23, title: translate("Snapshots"), content: translate("View and manage snapshots of fleet data."), route: "/snapshots" },
    { id: 24, title: translate("Report Details"), content: translate("Detailed view of a specific report."), route: "/reports" },
    { id: 25, title: translate("New Report"), content: translate("Form to create a new report."), route: "/new-report" },
    { id: 26, title: translate("Tag History"), content: translate("History of tags and their usage."), route: "/history-tag" },
    { id: 27, title: translate("Vehicle History"), content: translate("History and logs related to vehicles."), route: "/history-vehucle" },
    { id: 28, title: translate("User History"), content: translate("History and logs related to users."), route: "/history-user" },
    { id: 29, title: translate("Help"), content: translate("Help and support resources for using the platform."), route: "/help" },
    { id: 30, title: translate("Log Positions"), content: translate("View logs of positions for devices and vehicles."), route: "/logpositions" },
    { id: 31, title: translate("Connection"), content: translate("Page for connecting to the platform."), route: "/Connection" },
    { id: 32, title: translate("Driver Tag"), content: translate("Manage driver tags and associated data."), route: "/driver-tag" },
    { id: 33, title: translate("Settings"), content: translate("Platform settings and configuration options."), route: "/Settings" },
    { id: 34, title: translate("User Profile by ID"), content: translate("Detailed profile of a specific user identified by userurlID."), route: "/User" },
    { id: 35, title: translate("Vehicle Groups"), content: translate("Manage groups of vehicles."), route: "/groupevehicles" },
    { id: 36, title: translate("Device Groups"), content: translate("Manage groups of devices."), route: "/groupe-device" },
    { id: 37, title: translate("Roles"), content: translate("Manage user roles and permissions."), route: "/role" },
    { id: 38, title: translate("Role Permissions"), content: translate("Manage permissions for a specific role and user."), route: "/role" },
    { id: 39, title: translate("Profile"), content: translate("User profile page."), route: "/profile" },
    { id: 40, title: translate("Support Tickets"), content: translate("Manage support tickets from customers."), route: "/support-customers" },
    { id: 41, title: translate("Alarms"), content: translate("Manage and view alarms."), route: "/alarms" },
    { id: 42, title: translate("Add Alarm"), content: translate("Form to add a new alarm."), route: "/alarm/add" },
    { id: 43, title: translate("Edit Alarm"), content: translate("Form to edit an existing alarm."), route: "/alarms" },
    { id: 44, title: translate("Group Alarms"), content: translate("Manage groups of alarms."), route: "/group-alarms" },
    { id: 45, title: translate("Points of Interest"), content: translate("Manage points of interest (POIs)."), route: "/pois" },
    { id: 46, title: translate("Edit POI"), content: translate("Form to edit an existing point of interest."), route: "/pois" },
    { id: 47, title: translate("Add POI"), content: translate("Form to add a new point of interest."), route: "/poi/add" },
    { id: 48, title: translate("Notifications"), content: translate("View and manage notifications."), route: "/notifications" },
    // { id: 49, title: translate("Chat"), content: translate("Real-time chat functionality for communication."), route: "/chat" },
    // { id: 50, title: translate("Login"), content: translate("Login page for accessing the platform."), route: "/login" },
  ];

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPages, setFilteredPages] = useState<Page[]>(pages);
  const [isSearchVisible, setSearchVisible] = useState(true);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term)
    setSearchVisible(true);
    setFilteredPages(
      pages.filter(
        page =>
          page.title.toLowerCase().includes(term) ||
          page.content.toLowerCase().includes(term)
      )
    );
  };

  const handleItemClick = () => {
    // Hide the search div when an item is clicked
    setSearchVisible(false);
  };



  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(theme == '1' ? true : false);


  // Use useEffect to save the theme in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme_mode");
    if (savedTheme === "1") {
      setIsDarkTheme(true);
      document.body.classList.add("dark-theme");
    } else {
      setIsDarkTheme(false);
      document.body.classList.add("light-theme");
    }
  }, []);

  // Save the selected theme in localStorage
  useEffect(() => {
    localStorage.setItem("theme_mode", isDarkTheme ? "1" : "0");
  }, [isDarkTheme]);

  let userPermissions: Permission[] = [];

  try {
    const permissionsString = localStorage.getItem("userPermissions");
    if (permissionsString) {
      userPermissions = JSON.parse(permissionsString);
    }
  } catch (e) {
    console.error("JSON parsing error", e);
  }

  const checkPermission = (idPermission: number): boolean => {

    return userPermissions.some(
      (permission) => permission.id_permission === idPermission
    );
  };


  const generateDescription = (alarme: Notification) => {
    const highlight = (value: any) => (
      <span style={{ color: "#3b82f6" }} className="text-blue-500 font-semibold">{value}</span>
    );

    switch (alarme.id_type) {
      case 1: // Driving license
        return (
          <>
            {translate("The driving license of")}{" "}
            {highlight(alarme.nom_conducteur)}{" "}
            {highlight(alarme.prenom_conducteur)} {translate("will expire on")}{" "}
            {highlight(alarme.timestamp.split("T")[0].split("T")[0])}
          </>
        );

      case 2: // Vehicle insurance
        return (
          <>
            {translate("The insurance for")} {highlight(alarme.id_item)}
            {highlight(alarme.immatriculation_vehicule)}{" "}
            {translate("will expire on")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 3: // Maintenance
        return (
          <>
            {translate("The next maintenance for vehicle")}{" "}
            {highlight(alarme.immatriculation_vehicule)}{" "}
            {translate("is due by")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 4: // Training
        return (
          <>
            {translate("The training certificate of")}{" "}
            {highlight(alarme.training_nom_conducteur)}{" "}
            {highlight(alarme.training_prenom_conducteur)}{" "}
            {translate("will expire on")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 5: // Fire extinguisher verification
        return (
          <>
            {translate("The fire extinguisher verification for vehicle")}{" "}
            {highlight(alarme.feu_immatriculation_vehicule)}{" "}
            {translate("is due by")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 6: // Technical control
        return (
          <>
            {translate("The technical inspection for vehicle")}{" "}
            {highlight(alarme.immatriculation_vehicule)}{" "}
            {translate("must be done before")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 7: // Sticker
        return (
          <>
            {translate("The vehicle sticker verification for")}{" "}
            {highlight(alarme.immatriculation_vehicule)}{" "}
            {translate("should be done by")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      case 8: // Draining
        return (
          <>
            {translate("The draining verification for vehicle")}{" "}
            {highlight(alarme.immatriculation_vehicule)}{" "}
            {translate("is scheduled for")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );

      default:
        return (
          <>
            {translate("The deadline for")} {highlight(alarme.id_item)} (
            {highlight(alarme.immatriculation_vehicule)}){" "}
            {translate("is set for")} {highlight(alarme.timestamp.split("T")[0])}
          </>
        );
    }
  };

  return (
    <div className={`iq-top-navbar  ${changNavbar ? "navbar-push" : "navbar-pool"}`} >
      <div className="iq-navbar-custom">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
            <i className={` wrapper-menu `}
              onClick={() => {
                handleSetIsOpen();
                onToggleSidebarInNavbar();
              }}
            > </i>

            <Nav.Link to="/" className={`header-logo`} as={NavLink}>
              <Image
                className="img-fluid rounded-normal light-logo"
                style={{ height: "22px", width: "136px", paddingLeft: 15 }}
                src={isDarkMode ? "asset/images/logo_dark.png" : "asset/images/logo.png"}
                alt="Logo" />


            </Nav.Link>


            <div className="search-container  hide-on-mobile">
              <InputGroup className="">
                <InputGroup.Text id="search-icon">
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder={translate("Search here") + "..."}
                />
              </InputGroup>
              {isSearchVisible && searchTerm && filteredPages.length > 0 && (
                <ListGroup
                  className="results-container"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    // width: "100%",
                    maxHeight: "400px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    zIndex: 10,
                    overflowY: "auto"
                  }}
                >
                  {filteredPages.map(page => (
                    <ListGroup.Item
                      key={page.id}
                      className="result-item"
                      onClick={handleItemClick}
                    >
                      <strong><Link to={page.route}>{page.title}</Link></strong>: {page.content}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </div>

          <div className="d-flex align-items-center">
            <button onClick={toggleMenu} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-label="Toggle navigation" aria-expanded="true">
              <i className="ri-menu-3-line"></i>
            </button>
            <div className={`navbar-collapse collapse ${showMenu}`} id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto navbar-list align-items-center">

                {checkPermission(27) && (<li className="nav-item nav-icon dropdown" style={{ margin: "12px 5px" }} title={translate("Click here to access GEOPARC")}>
                  {userID === "1" && (
                    <a href={`https://geoparc.geotrackin.com?apikey=${APIkey}`} className="gp">
                      <i className="las la-sign-in-alt" style={{ fontSize: "29px" }}></i>
                      <span style={{ fontSize: "16px" }}> GEOPARC</span>
                    </a>
                  )}
                </li>)}

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



                <li className="nav-item nav-icon dropdown" style={{ margin: "0 5px" }}>
                  <div className="dropdown" onClick={toggleTheme} style={{ cursor: "pointer" }}>
                    {/* Display the icon based on the theme */}
                    {isDarkTheme ? (
                      <i className="las la-moon" style={{ fontSize: "22px" }}></i> // Moon icon for dark theme
                    ) : (
                      <i className="las la-sun" style={{ fontSize: "22px" }}></i> // Sun icon for light theme
                    )}
                  </div>
                </li>

                <li className="nav-item nav-icon dropdown show" style={{ margin: "0 5px" }}>
                  <Dropdown onToggle={handleToggleNotification}>
                    <Dropdown.Toggle as="span" id="dropdownMenuButton5" className="search-toggle" href="#">
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
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        {notifications && notifications.length > 0 && (
                          <span className="notification-badge">{notifications.length}</span>
                        )}
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end" className="iq-sub-dropdown dropdown-menu" show={dropdownOpenNotification} aria-labelledby="dropdownMenuButton5">
                      <Card className="shadow-none m-0">
                        <Card.Body className="p-0">
                          <div className="custom-title p-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <h5 className="mb-0">{translate("Notifications")}</h5>
                              <Badge className="badge-card">{notifications && notifications.length}</Badge>
                            </div>
                          </div>
                          <div className="px-3 pt-0 pb-0 sub-card">
                            {notifications && notifications.length > 0 ? (
                              notifications.slice(0, 7).map((notification) => (
                                <Link
                                  to={`/deadline/${notification.id_alarm}/0?notif=${notification.id_notification}&t=${Date.now()}`}
                                  className="iq-sub-card"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="View alarm"
                                  key={notification.id_notification}
                                  onClick={() => {
                                    fetch(`${backendUrl}/api/geop/notification/update`, {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({ id_notification: notification.id_notification }),
                                    })
                                      .then((response) => response.json())
                                      .then((data) => {
                                        if (userID) getAlarms(userID, 1);
                                        console.log("Notifications mises à jour :", data);
                                      })
                                      .catch((error) => {
                                        console.error("Erreur lors de la mise à jour :", error);
                                      });

                                    setTimeout(() => {
                                      setDropdownOpenNotification(false);
                                      // 🔑 recharge complète de la page
                                      window.location.reload();
                                    }, 10);
                                  }}
                                >
                                  <div className="media align-items-center custom-card py-3 border-bottom" style={{ paddingBottom: "0.5rem !important" }}>
                                    <div>
                                      <img className="avatar-30 rounded-small" src="../asset/images/icon-report/3.png" alt="01" />
                                    </div>
                                    <div className="media-body ml-3">
                                      <div className="d-flex align-items-center justify-content-between">
                                        <h6 className="mb-0">{notificationType[Number(notification.id_type - 1)]}</h6>
                                        <small>
                                          <b>{new Date(notification.timestamp).toLocaleTimeString()}</b>
                                        </small>
                                      </div>
                                      <small className="mb-0">{generateDescription(notification)}</small>
                                    </div>
                                  </div>
                                </Link>

                              ))
                            ) : (
                              <p className="text-center p-2">{translate("No notifications available.")}</p>
                            )}
                          </div>
                          <button
                            className="right-ic btn btn-primary btn-block position-relative p-2"
                            onClick={() => (window.location.href = "/notifications")}
                          >
                            {translate("See all notifications")}{" "}
                            <i className='las la-arrow-right'></i>
                          </button>
                        </Card.Body>
                      </Card>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>

                <li className="nav-item nav-icon dropdown" style={{ margin: "0 5px" }}>
                  <Dropdown onToggle={handleToggleProfile} show={dropdownOpenProfile}>
                    <Dropdown.Toggle as="span" id="dropdownMenuButton4" className="search-toggle" href="#">
                      {/* <img src="asset/images/user/1.png" alt="user" style={{ }} className="img-fluid rounded" /> */}
                      <i className='las la-user' style={{ fontSize: "25px" }}></i>
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
