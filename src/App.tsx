import {  Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {  useEffect } from "react";
import "./assets/css/backend-plugin.min.css";
import "./assets/vendor/remixicon/fonts/remixicon.css";
import "./assets/vendor/line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "./assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import 'react-toastify/dist/ReactToastify.css';


import { Vehicles } from "./pages/Vehicles";
import { VehiclesForms } from "./pages/Vehicles_forms";
import { Vehicleschecks } from "./pages/Vehicles_checks";
import { Vehiclecheck } from "./pages/Vehicle_check";
import { LanguageProvider } from './components/LanguageProvider';
import DashboardLayout from "./components/DashboardLayout";
import { ToastContainer } from "react-toastify";
import { Dashboard } from "./pages/Dashboard";
import {VehicleCost} from "./pages/Vehicle_cost"
import {VehicleSinister} from "./pages/Vehicle_sinister"
import { Role } from "./pages/Role";
import { Permission } from "./pages/Permission";
import { Drivers } from "./pages/Drivers";
import { Contrat } from "./pages/Contrat";
import { Warnings } from "./pages/Warnings";
import { Violations } from "./pages/Violations";
import { Fuel_consumption } from "./pages/Fuel_consumption";
import { Card_management } from "./pages/Card_management";
import { Tank_management } from "./pages/Tank_management";
import { Cash_management } from "./pages/Cash_management";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function App() {


  const navigate = useNavigate();



  const location = useLocation(); 

  // Extraction du paramètre apikey de l'URL
  const getApiKeyFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('apikey');
  };

  const apiKey = getApiKeyFromURL();


  const handleLogin = async () => {
    try {

      const response = await axios.get(`${backendUrl}/api/logingeop?api_Key=${apiKey}`, {

      });

      localStorage.setItem("authToken", response.data.token);
      const GeoploginTime = new Date().getTime(); // Store current time
      localStorage.setItem("GeoploginTime", GeoploginTime.toString());
      localStorage.setItem("GeopUserID", response.data.id_user);
      localStorage.setItem("Geopusername", response.data.username);
      localStorage.setItem("api_key", response.data.api_key); 


      // Fetch permissions for the user
      const permissionsResponse = await axios.get(
        `${backendUrl}/api/permission/all/${response.data.id_user}`
      );
      localStorage.setItem(
        "userPermissions",
        JSON.stringify(permissionsResponse.data)
      );

      //navigate("/");
    } catch (error) {
      console.error("Login error", error);
    } finally {

      // Set loading to false on login completion (success or failure)
    }
  };

   handleLogin()   

  useEffect(() => {
    console.log()
    handleLogin()   
  }, []);


  return (
    <LanguageProvider>
      <div className="wrapper" style={{ transition: 'width 0.3s', backgroundColor: '#fff', height: '100vh', padding: '0px' }}>
        <Routes>

          <Route path="/" element={<DashboardLayout>{<Dashboard />}</DashboardLayout>} />
          <Route path="/vehicles" element={<DashboardLayout>{<Vehicles />}</DashboardLayout>} />
          <Route path="/vehicles-forms" element={<DashboardLayout>{<VehiclesForms />}</DashboardLayout>} />
          <Route path="/Vehicles_checks" element={<DashboardLayout>{<Vehicleschecks />}</DashboardLayout>} />
          <Route path="/Vehicle_check" element={<DashboardLayout>{<Vehiclecheck />}</DashboardLayout>} />
          <Route path="/Vehicle_cost" element={<DashboardLayout>{<VehicleCost />}</DashboardLayout>} />
          <Route path="/Vehicle_sinister" element={<DashboardLayout>{<VehicleSinister />}</DashboardLayout>} />
          <Route path="/role" element={<DashboardLayout>{<Role />}</DashboardLayout>} />
          <Route path="/role" element={<DashboardLayout>{<Permission />}</DashboardLayout>} />
          <Route path="/drivers" element={<DashboardLayout>{<Drivers />}</DashboardLayout>} />
          <Route path="/contrat" element={<DashboardLayout>{<Contrat />}</DashboardLayout>} />
          <Route path="/warnings" element={<DashboardLayout>{<Warnings />}</DashboardLayout>} />
          <Route path="/violations" element={<DashboardLayout>{<Violations />}</DashboardLayout>} />
          <Route path="/fuel_consumption" element={<DashboardLayout>{<Fuel_consumption />}</DashboardLayout>} />
          <Route path="/card_management" element={<DashboardLayout>{<Card_management />}</DashboardLayout>} />
          <Route path="/tank_management" element={<DashboardLayout>{<Tank_management />}</DashboardLayout>} />
          <Route path="/cash_management" element={<DashboardLayout>{<Cash_management />}</DashboardLayout>} />
     
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