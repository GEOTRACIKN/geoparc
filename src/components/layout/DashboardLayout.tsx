// src/components/DashboardLayout.tsx

import React, { ReactNode, useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';
import {
  loadSidebarPinnedPreference,
  dispatchSidebarPinnedChange,
  persistSidebarPinnedLocally,
  readStoredSidebarPinned,
  saveSidebarPinnedPreference,
  SIDEBAR_PINNED_CHANGE_EVENT,
} from '../../utilities/sidebarPreference';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

  const [isSidebarPinned, setIsSidebarPinned] = useState(readStoredSidebarPinned);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.matchMedia("(max-width: 1299px)").matches
  );
  const [isLoading, setLoading] = useState(true);

  const toggleSidebar = () => {
    if (isSmallScreen) {
      setIsMobileSidebarOpen((current) => !current);
      return;
    }

    setIsSidebarPinned((current) => {
      const next = !current;
      const idUser = Number(localStorage.getItem("GeopUserID") ?? 0);

      persistSidebarPinnedLocally(next);
      dispatchSidebarPinnedChange(next);
      saveSidebarPinnedPreference(idUser, next).catch((error) => {
        console.warn("Unable to save sidebar preference:", error);
      });

      return next;
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1299px)");

    const handleMediaQueryChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsSmallScreen(event.matches);

      if (!event.matches) {
        setIsMobileSidebarOpen(false);
      }
    };

    handleMediaQueryChange(mediaQuery);
    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    const idUser = Number(localStorage.getItem("GeopUserID") ?? 0);
    let cancelled = false;

    if (!idUser) return;

    loadSidebarPinnedPreference(idUser)
      .then((pinned) => {
        if (cancelled) return;

        setIsSidebarPinned(pinned);
        persistSidebarPinnedLocally(pinned);
      })
      .catch((error) => {
        console.warn("Unable to load sidebar preference:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleSidebarPinnedChange = (event: Event) => {
      const { pinned } = (event as CustomEvent<{ pinned: boolean }>).detail;
      setIsSidebarPinned(pinned);
    };

    window.addEventListener(SIDEBAR_PINNED_CHANGE_EVENT, handleSidebarPinnedChange);

    return () => {
      window.removeEventListener(SIDEBAR_PINNED_CHANGE_EVENT, handleSidebarPinnedChange);
    };
  }, []);

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

      {isSmallScreen && isMobileSidebarOpen && (
        <button
          type="button"
          className="sidebar-mobile-backdrop"
          aria-label="Close sidebar"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <Sidebar isSidebarPinned={isSmallScreen ? isMobileSidebarOpen : isSidebarPinned} onToggleSidebar={toggleSidebar} />
      <Navbar changNavbar={!isSmallScreen && isSidebarPinned} onToggleSidebarInNavbar={toggleSidebar} />
      <div
        className={`content-page ${!isSmallScreen && isSidebarPinned ? "content-page-push" : "content-page-pool"}`}
      >
        <div className="container-fluid">
          <div className="col-lg-12">{children}</div>
        </div>
      </div>
    </>
  );
}; 

export default DashboardLayout; 
