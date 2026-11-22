import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { buildProfileImageUrl } from "../utilities/profileImage";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

type UserContextType = {
  pathImg: string;
  refreshImage: () => Promise<void>;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
  pathImg: "",
  refreshImage: async () => {},
  isLoading: false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [pathImg, setPathImg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const isRefreshingRef = useRef(false);
  
  const getCurrentUserId = () => localStorage.getItem("GeopUserID");

  const refreshImage = useCallback(async () => {
    if (isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;

    try {
      setIsLoading(true);
      const currentUserId = getCurrentUserId();
      
      setPathImg(""); // Reset immédiat
      
      if (!currentUserId) return;

      const response = await fetch(`${backendUrl}/api/profile/${currentUserId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Échec de la récupération du profil");
      
      const data = await response.json();
      const profile = data[0];
      
      if (!profile) throw new Error("Aucune donnée de profil");

      setPathImg(buildProfileImageUrl(profile.img));
    } catch (error) {
      console.error("Erreur :", error);
      setPathImg("");
    } finally {
      isRefreshingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  // Rafraîchir quand l'user change
  useEffect(() => {
    refreshImage();
  }, [refreshImage]);

  // Synchronisation entre onglets
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "GeopUserID") refreshImage();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshImage]);

  return (
    <UserContext.Provider value={{ pathImg, refreshImage, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
