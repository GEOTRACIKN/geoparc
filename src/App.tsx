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
import { LanguageProvider } from './hooks/LanguageProvider';
import DashboardLayout from "./components/DashboardLayout";
import { ToastContainer } from "react-toastify";
import { Dashboard } from "./pages/Dashboard";
import {VehicleCost} from "./pages/Vehicle_cost"
import {VehicleSinister} from "./pages/Vehicle_sinister"
import  Role from "./pages/Role";
import { Permission } from "./pages/Permission";
import { Permissions } from "./pages/Permissions";
import { Drivers } from "./pages/Drivers";
import { Contrat } from "./pages/Contrat";
import { Training } from "./pages/Training";



import { Warnings } from "./pages/Warnings";
import { Violation} from "./pages/Violation";
import { Fuel_consumption } from "./pages/Fuel_consumption";
import { Card_management } from "./pages/Card_management";
import { Tank_management } from "./pages/Tank_management";
import { Cash_management } from "./pages/Cash_management";
import { DetailVehicleCheck } from "./pages/Detail_vehicle_check";
import { Reception } from "./pages/Reception";
import { Garage } from "./pages/Garage";
import { Servicing } from "./pages/Servicing";


import { InterviewSchedule } from "./pages/Planning_interviews";


import { MissionOrder } from "./pages/MissionOrder";
import { MissionOrderManage } from "./pages/MissionOrderManage";

import { MissionReport } from "./pages/MissionReport";
import { MissionReportManage } from "./pages/MissionReportManage";

import { Fire } from "./pages/Fire";



import axios from "axios";
import { Driver } from "./pages/Driver";
import { Extinguisher } from "./pages/Extinguisher";
import { Pharmacy } from "./pages/Pharmacy";
import DashboardKPI from "./pages/DashboardKPI";

import LoginForm from "./pages/Login-geoparc";
import LoginLayout from "./components/LoginLayout";
import { ThemeProvider } from "./hooks/ThemeContext";
import NotFound from "./pages/NotFound";
import { Parks } from "./pages/parks";
import Park from "./pages/park";

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
      console.log(response)
      localStorage.setItem("authToken", response.data.token);
      const GeoploginTime = new Date().getTime(); // Store current time
      localStorage.setItem("GeoploginTime", GeoploginTime.toString());
      localStorage.setItem("GeopUserID", response.data.id_user);
      localStorage.setItem("Geopusername", response.data.username);
      localStorage.setItem("api_key", response.data.api_key); 
      localStorage.setItem("id_role", response.data.id_role); 
      localStorage.setItem("theme_mode", response.data.profile_settings.theme_mode);
      localStorage.setItem("language", response.data.profile_settings.language);
      localStorage.setItem("timezone", response.data.profile_settings.timezone);


      // Fetch permissions for the user
      const permissionsResponse = await axios.get(
        `${backendUrl}/api/geop/permission/all/${response.data.id_role}`
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
    <ThemeProvider>
    <LanguageProvider> 
      <div className="wrapper" style={{ transition: 'width 0.3s', backgroundColor: '#fff', height: '100vh', padding: '0px' }}>
        <Routes>

          <Route path="/" element={<DashboardLayout>{<Dashboard />}</DashboardLayout>} />
          <Route path="/vehicles" element={<DashboardLayout>{<Vehicles />}</DashboardLayout>} />
          <Route path="/vehicles-forms" element={<DashboardLayout>{<VehiclesForms />}</DashboardLayout>} />
          <Route path="/vehicles-checks" element={<DashboardLayout>{<Vehicleschecks />}</DashboardLayout>} />
          <Route path="/vehicle-check" element={<DashboardLayout>{<Vehiclecheck />}</DashboardLayout>} />
          <Route path="/vehicle-cost" element={<DashboardLayout>{<VehicleCost />}</DashboardLayout>} />
          <Route path="/vehicle-sinister" element={<DashboardLayout>{<VehicleSinister />}</DashboardLayout>} />
          <Route path="/role" element={<DashboardLayout>{<Role />}</DashboardLayout>} />
          <Route path="/role" element={<DashboardLayout>{<Permission />}</DashboardLayout>} />
          <Route path="/drivers" element={<DashboardLayout>{<Drivers />}</DashboardLayout>} />
          <Route path="/driver/add" element={<DashboardLayout>{<Driver />}</DashboardLayout>} />
          <Route path="/driver/edit/:id_conducteur" element={<DashboardLayout>{<Driver />}</DashboardLayout>} />
          <Route path="/contrat" element={<DashboardLayout>{<Contrat />}</DashboardLayout>} />
          <Route path="/training" element={<DashboardLayout>{<Training />}</DashboardLayout>} />


          <Route path="/warnings" element={<DashboardLayout>{<Warnings />}</DashboardLayout>} />
          <Route path="/violation" element={<DashboardLayout>{<Violation />}</DashboardLayout>} />
          <Route path="/fuel-consumption" element={<DashboardLayout>{<Fuel_consumption />}</DashboardLayout>} />
          <Route path="/card-management" element={<DashboardLayout>{<Card_management />}</DashboardLayout>} />
          <Route path="/tank-management" element={<DashboardLayout>{<Tank_management />}</DashboardLayout>} />
          <Route path="/cash-management" element={<DashboardLayout>{<Cash_management />}</DashboardLayout>} />
          <Route path="/detail-vehicle-check/:id_verif" element={<DashboardLayout>{<DetailVehicleCheck />}</DashboardLayout>} />
          <Route path="/reception" element={<DashboardLayout>{<Reception />}</DashboardLayout>} />
          <Route path="/extinguisher" element={<DashboardLayout>{<Extinguisher />}</DashboardLayout>} />
          <Route path="/garage" element={<DashboardLayout>{<Garage />}</DashboardLayout>} />
          <Route path="/hse-dashboard" element={<DashboardLayout>{<DashboardKPI />}</DashboardLayout>} />
          <Route path="/planning-interviews" element={<DashboardLayout>{<InterviewSchedule />}</DashboardLayout>} />
          <Route path="/login-geoparc" element={<LoginLayout>{<LoginForm onLogin={handleLogin} />}</LoginLayout>} /> 
          <Route path="/servicing" element={<DashboardLayout>{<Servicing />}</DashboardLayout>} />
          <Route path="/role" element={<DashboardLayout>{<Role />}</DashboardLayout>} />
          <Route path="/role/permissions/:id_user/:id_role" element={<DashboardLayout>{<Permissions />}</DashboardLayout>} />
          <Route path="/parks" element={<DashboardLayout>{<Parks />}</DashboardLayout>} />
          <Route path="/park/edit/:id_poi" element={<DashboardLayout>{<Park/>}</DashboardLayout>} />
          <Route path="/park/add" element={ <DashboardLayout>{< Park />}</DashboardLayout>} /> 
          <Route path="/mission-order" element={<DashboardLayout>{<MissionOrder />}</DashboardLayout>} />
          <Route path="/mission-order-manage/add" element={<DashboardLayout>{<MissionOrderManage />}</DashboardLayout>} />
          <Route path="/mission-order-manage/edit/:id_mission" element={<DashboardLayout>{<MissionOrderManage />}</DashboardLayout>} />
          <Route path="/mission-report" element={<DashboardLayout>{<MissionReport />}</DashboardLayout>} />
          <Route path="/mission-report-manage/add" element={<DashboardLayout>{<MissionReportManage />}</DashboardLayout>} />
          <Route path="/mission-report-manage/edit/:id_misrap" element={<DashboardLayout>{<MissionReportManage />}</DashboardLayout>} />
          <Route path="*" element={<NotFound />} />  
          <Route path="/pharmacy" element={<DashboardLayout>{<Pharmacy />}</DashboardLayout>} />
          <Route path="/fire-ext" element={<DashboardLayout>{<Fire />}</DashboardLayout>} />




          
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
    </ThemeProvider>
  );
}
 
export default App;