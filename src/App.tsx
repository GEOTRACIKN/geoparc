import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./assets/css/backend-plugin.min.css";
import "./assets/vendor/remixicon/fonts/remixicon.css";
import "./assets/vendor/line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "./assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";

import { Dashcam } from "./pages/Dashcam";
import { Fleet } from "./pages/Fleet";
import { Simcards } from "./pages/Simcards";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import  Map  from "./pages/Map";
import { Drivers } from "./pages/Drivers";
import { Vehicles } from "./pages/Vehicles";
import { Settings } from "./pages/Settings";

import DashboardLayout from "./components/DashboardLayout";
import LoginLayout from "./components/LoginLayout";
import LoginForm from "./pages/Login";
import { LanguageProvider } from './components/LanguageProvider';
import Driver from "./pages/Driver";
import User from"./pages/User";
import {GroupeVehicles} from "./pages/GroupVehicule";
import Ibutton from "./pages/Ibutton";
import  HistoriqueTag  from "./pages/History-tag";
import { Devices } from "./pages/Devices";
import { GroupeDevice } from "./pages/GroupeDevice";
import Help from "./pages/Help";
import Vehicle from "./pages/Vehicle";
import Device from "./pages/Device";
import NewReport  from "./pages/NewReport";
import { Reports } from "./pages/Reports";
import { SnapshotPage } from "./pages/SnapshotPage";
import  Report  from "./pages/Report";
import { LogPositions } from "./pages/LogPositions";
import { DriverTag } from "./pages/driver-tag";
import Role from "./pages/Role";
import Profile from "./pages/Profile";
import Permission from "./pages/Permission";
import Connexion from "./pages/Connexion";
import Userhistory from "./pages/history-user";
import { ToastContainer } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';  
import HistoryVehucle from "./pages/history-vehucle";
  
 
function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (newToken: string) => {
    localStorage.setItem("authToken", newToken); // Stocker le token dans localStorage
    setToken(newToken);
    setIsLoggedIn(true);
    navigate("/");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      navigate(location.pathname); // Rediriger l'utilisateur vers la page actuelle après la connexion
    }
  }, [location.pathname]);
  

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Supprimer le token du localStorage
    setToken(null);
    setIsLoggedIn(false);
  }

  return (
    <LanguageProvider>
      <div className="wrapper" style={{ transition: 'width 0.3s', backgroundColor: '#fff', height: '100vh', padding: '0px' }}>
        <Routes>
          <Route path="/" element={isLoggedIn ? (<DashboardLayout> <Dashboard /> </DashboardLayout> ) : ( <Navigate to="/login" /> )}/>
          <Route path="/map" element={isLoggedIn ? <DashboardLayout>{<Map />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/vehicles" element={isLoggedIn ? <DashboardLayout>{<Vehicles />}</DashboardLayout>:<Navigate to="/login" />} />
          <Route path="/Vehicle/add" element={isLoggedIn ? <DashboardLayout>{<Vehicle />}</DashboardLayout>:<Navigate to="/login" />} />
          <Route path="/Vehicle/edit/:id_vehicule" element={isLoggedIn ? <DashboardLayout>{<Vehicle />}</DashboardLayout>:<Navigate to="/login" />} />
          <Route path="/Devices" element={isLoggedIn ? <DashboardLayout>{<Devices />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/Device/add" element={isLoggedIn ? <DashboardLayout>{<Device />}</DashboardLayout>:<Navigate to="/login" />} />
          <Route path="/Device/edit/:id_device" element={isLoggedIn ? <DashboardLayout>{<Device />}</DashboardLayout>:<Navigate to="/login" />} />
          <Route path="/drivers" element={isLoggedIn ? <DashboardLayout>{<Drivers />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/driver" element={isLoggedIn ? <DashboardLayout>{<Driver />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/driver/:id_conducteur" element={isLoggedIn ? <DashboardLayout>{<Driver />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/Fleet" element={isLoggedIn ? <DashboardLayout>{<Fleet />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/dashcam" element={isLoggedIn ? <DashboardLayout>{<Dashcam />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/cartes-sim" element={isLoggedIn ? <DashboardLayout>{<Simcards />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/users" element={isLoggedIn ? <DashboardLayout>{<Users />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/User" element={isLoggedIn ? <DashboardLayout>{<User />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/Ibutton" element={isLoggedIn ? <DashboardLayout>{<Ibutton />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/reports" element={isLoggedIn ? <DashboardLayout>{<Reports />}</DashboardLayout> : <Navigate to="/login" />} /> 
          <Route path="/snapshots" element={isLoggedIn ? <DashboardLayout>{<SnapshotPage />}</DashboardLayout> : <Navigate to="/login" />} /> 
          <Route path="/report/:id_report/:turn/:type_report" element={isLoggedIn ? <DashboardLayout>{<Report />}</DashboardLayout> : <Navigate to="/login" />} /> 
          <Route path="/new-report" element={isLoggedIn ? <DashboardLayout>{<NewReport />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/history-tag" element={isLoggedIn ? <DashboardLayout>{<HistoriqueTag />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/history-vehucle" element={isLoggedIn ? <DashboardLayout>{<HistoryVehucle />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/history-user" element={isLoggedIn ? <DashboardLayout>{<Userhistory />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/Devices" element={isLoggedIn ? <DashboardLayout>{<Devices />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/help" element={isLoggedIn ? <DashboardLayout>{<Help />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/logpositions" element={isLoggedIn ? <DashboardLayout>{<LogPositions />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/Connexion" element={isLoggedIn ? <DashboardLayout>{<Connexion />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/driver-tag" element={isLoggedIn ? <DashboardLayout>{<DriverTag />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/Settings" element={isLoggedIn ? <DashboardLayout>{<Settings />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/User/:userurlID" element={isLoggedIn ? <DashboardLayout>{<User />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/groupevehicles" element={isLoggedIn ? <DashboardLayout>{<GroupeVehicles />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/groupe-device" element={isLoggedIn ? <DashboardLayout>{<GroupeDevice />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/role" element={isLoggedIn ? <DashboardLayout>{<Role />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/role/permission/:id_user/:id_role" element={isLoggedIn ? <DashboardLayout>{<Permission />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <DashboardLayout>{<Profile />}</DashboardLayout> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginLayout>{<LoginForm onLogin={handleLogin} />}</LoginLayout>} />
        </Routes>
      </div> 
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss 
        draggable
        pauseOnHover
        theme="light"
      /> 
    </LanguageProvider>
  );
}

export default App;