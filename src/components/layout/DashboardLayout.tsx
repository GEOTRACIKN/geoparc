// src/components/DashboardLayout.tsx

import React, { ReactNode, useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';;

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contentPageStat, setContentPageStat] = useState("content-page-push");
  const [isLoading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    
    isSidebarOpen ? setContentPageStat("content-page-pool") : setContentPageStat("content-page-push");

  };


  useEffect(() => {
    const handleLoad = () => {
      setLoading(false);
    };

    // Ajoutez un écouteur d'événements pour détecter quand toutes les ressources sont chargées
    window.addEventListener('load', handleLoad);

    // Retirez l'écouteur d'événements lorsque le composant est démonté
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []); // Assurez-vous de mettre la dépendance vide pour que cela se produise une seule fois lors du montage


  return (
    <>
       {/* {isLoading && (
        <div id="loading" style={{ display: 'block' }}>
          <div id="loading-center"</div>
        </div>
      )} */}

      <Sidebar  onToggleSidebar={toggleSidebar} />
      <Navbar  changNavbar={isSidebarOpen} onToggleSidebarInNavbar={toggleSidebar } />  
      <div className={`content-page ${contentPageStat}`}>
        <div className="container-fluid">
          <div className="col-lg-12">{children}</div>
        </div>
      </div>
    </>
  );
}; 

export default DashboardLayout; 
