import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./assets/css/backend-plugin.min.css";
import "./assets/vendor/remixicon/fonts/remixicon.css";
import "./assets/vendor/line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "./assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";


import { Vehicles } from "./pages/Vehicles";
import { VehiclesForms } from "./pages/Vehicles_forms";
import { Vehicleschecks } from "./pages/Vehicles_checks";
import { Vehiclecheck } from "./pages/Vehicle_check";
import { LanguageProvider } from "./hooks/LanguageProvider";
import DashboardLayout from "./components/layout/DashboardLayout";
import { ToastContainer } from "react-toastify";
import { Dashboard } from "./pages/Dashboard";
import { VehicleCost } from "./pages/Vehicle_cost";
import { VehicleSinister } from "./pages/Vehicle_sinister";
import Role from "./pages/Role";
import { Permission } from "./pages/Permission";
import { Permissions } from "./pages/Permissions";
import { Drivers } from "./pages/Drivers";
import { Contrat } from "./pages/Contrat";
import { Training } from "./pages/Training";
import { Warnings } from "./pages/Warnings";
import { Violation } from "./pages/Violation";
import { Fuel_consumption } from "./pages/Fuel_consumption";
import { Card_management } from "./pages/Card_management";
import { Tank_management } from "./pages/Tank_management";
import { Cash_management } from "./pages/Cash_management";
import { DetailVehicleCheck } from "./pages/Detail_vehicle_check";
import { Reception } from "./pages/Reception";
import { Garage } from "./pages/Garage";
import { Servicing } from "./pages/Servicing";
import { Pneu } from "./pages/Pneu";
import { Piece } from "./pages/Piece";

import { CardManagement } from "./pages/CardManagement";
import { TankManagement } from "./pages/TankManagement";
import { CashManagement } from "./pages/CashManagement";
import { FuelManagement } from "./pages/FuelManagement";

import { PneuStock } from "./pages/PneuStock";
import { PieceStock } from "./pages/PieceStock";

import { Reference } from "./pages/Reference";
import { InterviewSchedule } from "./pages/Planning_interviews";

import { MissionOrder } from "./pages/MissionOrder";
import { MissionOrderManage } from "./pages/MissionOrderManage";
import { MissionReport } from "./pages/MissionReport";
import { MissionReportManage } from "./pages/MissionReportManage";

import { Fire } from "./pages/Fire";

import axios from "axios";
import { Driver } from "./pages/Driver";
import { Pharmacy } from "./pages/Pharmacy";
import DashboardKPI from "./pages/DashboardKPI";

import LoginForm from "./pages/Login-geoparc";
import LoginLayout from "./components/LoginLayout";
import { ThemeProvider } from "./hooks/ThemeContext";
import NotFound from "./pages/NotFound";
import { Parks } from "./pages/parks";
import Park from "./pages/park";
import { Vehicle } from "./pages/Vehicle";
import { Deadline } from "./pages/Deadline";
import { Notifications } from "./pages/Notification";
import AdministratifPage from "./pages/AdministratifPage";
import DemandePiece from "./pages/DemandePiece";
import BonReception from "./pages/BonReception";
import Avoir from "./pages/Avoir";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { TransportRequestManage } from "./pages/TransportRequest";
import TransportRequestList from "./pages/TransportRequestList";
import { RequestResponsibility } from "./pages/RequestResponsibility";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [bootLoading, setBootLoading] = useState(true);

  const clearGeoparcSession = () => {
    const keysToRemove = [
      "GeoploginTime",
      "GeopUserID",
      "Geopusername",
      "GeopRoleID",
      "geop_userPermissions",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  const getApiKeyFromUrl = () => {
    const params = new URLSearchParams(window.location.search);

    return (
      params.get("api_key") ||
      params.get("apiKey") ||
      params.get("key") ||
      ""
    ).trim();
  };

  const cleanUrlAfterLogin = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleLogin = async (apiKeyOverride?: string) => {
    const currentApiKey = (
      apiKeyOverride ||
      localStorage.getItem("api_key") ||
      ""
    ).trim();

    if (!currentApiKey) {
      clearGeoparcSession();
      throw new Error("API key GeoParc manquante");
    }

    try {
      const response = await axios.get(
        `${backendUrl}/api/logingeop?apiKey=${encodeURIComponent(currentApiKey)}`,
        { withCredentials: true }
      );

      const data = response.data;

      if (!data?.id_user) {
        clearGeoparcSession();
        throw new Error("Réponse login GeoParc invalide : id_user manquant");
      }

      clearGeoparcSession();

      localStorage.setItem("GeoploginTime", String(Date.now()));
      localStorage.setItem("GeopUserID", String(data.id_user));
      localStorage.setItem("Geopusername", String(data.username ?? ""));
      localStorage.setItem("GeopRoleID", String(data.id_role ?? ""));

      // Clé existante dans ton projet.
      // Elle est remplacée uniquement quand GeoParc reçoit une nouvelle api_key.
      localStorage.setItem("api_key", String(data.api_key || currentApiKey));

      const permissionsResponse = await axios.get(
        `${backendUrl}/api/geop/permission/all/${data.id_role}`,
        { withCredentials: true }
      );

      localStorage.setItem(
        "geop_userPermissions",
        JSON.stringify(permissionsResponse.data)
      );

      return data;
    } catch (error) {
      clearGeoparcSession();
      console.error("Login GeoParc error", error);
      throw error;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (location.pathname === "/login-geoparc") {
          setBootLoading(false);
          return;
        }

        const apiKeyFromUrl = getApiKeyFromUrl();

        if (apiKeyFromUrl) {
          clearGeoparcSession();

          // La nouvelle api_key envoyée par GeoTrackin remplace l’ancienne.
          localStorage.setItem("api_key", apiKeyFromUrl);

          await handleLogin(apiKeyFromUrl);

          cleanUrlAfterLogin();
          return;
        }

        await handleLogin();
      } catch (error) {
        console.error("GeoParc boot error", error);
        navigate("/login-geoparc", { replace: true });
      } finally {
        setBootLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (bootLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          flexDirection: "column",
        }}
      >
        <img
          src="https://geoparc.geotrackin.com/react/public/asset/images/logo.png?t=1768313723979"
          alt="GeoTrackin"
          style={{
            width: 180,
            marginBottom: 20,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />

        <div style={{ fontWeight: 600, color: "#444" }}>
          Chargement de GeoParc…
        </div>

        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.5; transform: scale(0.98); }
              50% { opacity: 1; transform: scale(1); }
              100% { opacity: 0.5; transform: scale(0.98); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <AuthProvider>
      <UserProvider>
        <ThemeProvider>
          <LanguageProvider>
            <div
              className="wrapper"
              style={{
                transition: "width 0.3s",
                backgroundColor: "#fff",
                height: "100vh",
                padding: "0px",
              }}
            >
              <Routes>
                <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
                <Route path="/vehicles" element={<DashboardLayout><Vehicles /></DashboardLayout>} />
                <Route path="/vehicles-forms" element={<DashboardLayout><VehiclesForms /></DashboardLayout>} />
                <Route path="/vehicles-checks" element={<DashboardLayout><Vehicleschecks /></DashboardLayout>} />
                <Route path="/vehicle-check" element={<DashboardLayout><Vehiclecheck /></DashboardLayout>} />
                <Route path="/vehicle-cost" element={<DashboardLayout><VehicleCost /></DashboardLayout>} />
                <Route path="/vehicle-sinister" element={<DashboardLayout><VehicleSinister /></DashboardLayout>} />
                <Route path="/role" element={<DashboardLayout><Role /></DashboardLayout>} />
                <Route path="/drivers" element={<DashboardLayout><Drivers /></DashboardLayout>} />
                <Route path="/driver/add" element={<DashboardLayout><Driver /></DashboardLayout>} />
                <Route path="/driver/edit/:id_conducteur" element={<DashboardLayout><Driver /></DashboardLayout>} />
                <Route path="/contrat" element={<DashboardLayout><Contrat /></DashboardLayout>} />
                <Route path="/training" element={<DashboardLayout><Training /></DashboardLayout>} />
                <Route path="/deadline" element={<DashboardLayout><Deadline /></DashboardLayout>} />
                <Route path="/deadline/:id_type" element={<DashboardLayout><Deadline /></DashboardLayout>} />
                <Route path="/deadline/:id_alarm/:id_type" element={<DashboardLayout><Deadline /></DashboardLayout>} />
                <Route path="/warnings" element={<DashboardLayout><Warnings /></DashboardLayout>} />
                <Route path="/violation" element={<DashboardLayout><Violation /></DashboardLayout>} />
                <Route path="/fuel-consumption" element={<DashboardLayout><Fuel_consumption /></DashboardLayout>} />
                <Route path="/card-management" element={<DashboardLayout><Card_management /></DashboardLayout>} />
                <Route path="/tank-management" element={<DashboardLayout><Tank_management /></DashboardLayout>} />
                <Route path="/cash-management" element={<DashboardLayout><Cash_management /></DashboardLayout>} />
                <Route path="/detail-vehicle-check/:id_verif" element={<DashboardLayout><DetailVehicleCheck /></DashboardLayout>} />
                <Route path="/reception" element={<DashboardLayout><Reception /></DashboardLayout>} />
                <Route path="/fire-ext" element={<DashboardLayout><Fire /></DashboardLayout>} />
                <Route path="/garage" element={<DashboardLayout><Garage /></DashboardLayout>} />
                <Route path="/servicing" element={<DashboardLayout><Servicing /></DashboardLayout>} />
                <Route path="/pneu" element={<DashboardLayout><Pneu /></DashboardLayout>} />
                <Route path="/piece" element={<DashboardLayout><Piece /></DashboardLayout>} />
                <Route path="/card_management" element={<DashboardLayout><CardManagement /></DashboardLayout>} />
                <Route path="/tank_management" element={<DashboardLayout><TankManagement /></DashboardLayout>} />
                <Route path="/cash_management" element={<DashboardLayout><CashManagement /></DashboardLayout>} />
                <Route path="/fuel_management" element={<DashboardLayout><FuelManagement /></DashboardLayout>} />
                <Route path="/pneu_stock" element={<DashboardLayout><PneuStock /></DashboardLayout>} />
                <Route path="/piece_stock" element={<DashboardLayout><PieceStock /></DashboardLayout>} />
                <Route path="/Demandes_pieces" element={<DashboardLayout><DemandePiece /></DashboardLayout>} />
                <Route path="/Bon_Reception" element={<DashboardLayout><BonReception /></DashboardLayout>} />
                <Route path="/Avoir" element={<DashboardLayout><Avoir /></DashboardLayout>} />
                <Route path="/reference" element={<DashboardLayout><Reference /></DashboardLayout>} />
                <Route path="/hse-dashboard" element={<DashboardLayout><DashboardKPI /></DashboardLayout>} />
                <Route path="/planning-interviews" element={<DashboardLayout><InterviewSchedule /></DashboardLayout>} />

                <Route
                  path="/login-geoparc"
                  element={
                    <LoginLayout>
                      <LoginForm onLogin={handleLogin} />
                    </LoginLayout>
                  }
                />

                <Route path="/role/permissions/:id_user/:id_role" element={<DashboardLayout><Permissions /></DashboardLayout>} />
                <Route path="/parks" element={<DashboardLayout><Parks /></DashboardLayout>} />
                <Route path="/park/edit/:id_poi" element={<DashboardLayout><Park /></DashboardLayout>} />
                <Route path="/park/add" element={<DashboardLayout><Park /></DashboardLayout>} />
                <Route path="/mission-order" element={<DashboardLayout><MissionOrder /></DashboardLayout>} />
                <Route path="/mission-order-manage/add" element={<DashboardLayout><MissionOrderManage /></DashboardLayout>} />

                <Route path="/transport-request" element={<DashboardLayout><TransportRequestManage /></DashboardLayout>} />
                <Route path="/transport-request-list" element={<DashboardLayout><TransportRequestList /></DashboardLayout>} />
                <Route path="/request-responsibility" element={<DashboardLayout><RequestResponsibility /></DashboardLayout>} />

                <Route path="/mission-order-manage/edit/:id_mission" element={<DashboardLayout><MissionOrderManage /></DashboardLayout>} />
                <Route path="/mission-report" element={<DashboardLayout><MissionReport /></DashboardLayout>} />
                <Route path="/mission-report-manage/add" element={<DashboardLayout><MissionReportManage /></DashboardLayout>} />
                <Route path="/mission-report-manage/edit/:id_misrap" element={<DashboardLayout><MissionReportManage /></DashboardLayout>} />
                <Route path="/notifications" element={<DashboardLayout><Notifications /></DashboardLayout>} />
                <Route path="/pharmacy-box" element={<DashboardLayout><Pharmacy /></DashboardLayout>} />
                <Route path="/vehicle/add" element={<DashboardLayout><Vehicle /></DashboardLayout>} />
                <Route path="/vehicle/edit/:id_vehicule" element={<DashboardLayout><Vehicle /></DashboardLayout>} />
                <Route path="/administratif" element={<DashboardLayout><AdministratifPage /></DashboardLayout>} />

                <Route path="*" element={<NotFound />} />
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
      </UserProvider>
    </AuthProvider>
  );
}

export default App;