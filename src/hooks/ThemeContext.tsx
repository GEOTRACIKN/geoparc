// ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
;
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {


  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("theme_mode");
    return savedTheme === "1" ? true : false;
  });

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-theme" : "light-theme";
  }, [isDarkMode]);


  const handleThemeChange = async (themeMode: any) => {


    try {
      const userID = localStorage.getItem("GeopUserID");
      const response = await fetch(`${backendUrl}/api/profile/${userID}/update-dark-mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme_mode: themeMode ? '1' : '0',
        })
      });
      if (!response.ok) {
        throw new Error(`Error HTTP! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      toast.success("Theme changed successfully", {
        position: "bottom-right",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      toast.warn("Error changing theme", {
        position: "bottom-right",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const applyThemeMode = (enabled: boolean, persistToBackend = false) => {
    setIsDarkMode(enabled);
    localStorage.setItem("theme_mode", enabled ? "1" : "0");
    document.body.className = enabled ? "dark-theme" : "light-theme";

    if (persistToBackend) {
      handleThemeChange(enabled);
    }
  };

  const toggleTheme = () => {
    applyThemeMode(!isDarkMode, true);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setThemeMode: applyThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
};
