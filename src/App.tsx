import {  Route, Routes, useNavigate} from "react-router-dom";
import {  useEffect } from "react";


import { Vehicles } from "./pages/Vehicles";
import { LanguageProvider } from './components/LanguageProvider';
import DashboardLayout from "./components/DashboardLayout";
import { ToastContainer } from "react-toastify";



function App() {


  const navigate = useNavigate();


  const handleLogin = (newToken: string) => {

    navigate("/");
  };

  useEffect(() => {

  }, []);




  return (
    <LanguageProvider>
      <div className="wrapper" style={{ transition: 'width 0.3s', backgroundColor: '#fff', height: '100vh', padding: '0px' }}>
        <Routes>

          <Route path="/vehicles" element={<DashboardLayout>{<Vehicles />}</DashboardLayout>} />

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