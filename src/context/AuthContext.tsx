// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { createNetworkClient, NetQuality } from "../utilities/NetworkClient";

interface ProfileSettings {
  theme_mode: string;
  language: string;
  timezone: string;
}

interface AuthUser {
  id_user: number;
  username: string;
  id_role: number;
  profile_settings: ProfileSettings;
  api_key: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const NET_TOAST_ID = "network-status"; // un seul toast réseau

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /** ===== Client réseau centralisé ===== */
  const net = useMemo(
    () =>
      createNetworkClient({
        probeUrl: `${BACKEND_URL}/health`,
        timeoutMs: 8000,
        retries: 2,
        onQualityChange: (q: NetQuality, prev: NetQuality) => {
          if (q === prev) return;

          if (q === "offline") {
            if (toast.isActive(NET_TOAST_ID)) {
              toast.update(NET_TOAST_ID, {
                render: "Hors ligne : certaines actions sont indisponibles.",
                type: "error",
                autoClose: false,
                closeOnClick: false,
              });
            } else {
              toast.error("Hors ligne : certaines actions sont indisponibles.", {
                toastId: NET_TOAST_ID,
                position: "bottom-right",
                autoClose: false,
                closeOnClick: false,
              });
            }
          } else if (q === "poor") {
            if (toast.isActive(NET_TOAST_ID)) {
              toast.update(NET_TOAST_ID, {
                render: "Connexion faible : performances réduites.",
                type: "warning",
                autoClose: 3000,
              });
            } else {
              toast.warning("Connexion faible : performances réduites.", {
                toastId: NET_TOAST_ID,
                position: "bottom-right",
                autoClose: 3000,
              });
            }
          } else {
            // good
            if (toast.isActive(NET_TOAST_ID)) {
              toast.update(NET_TOAST_ID, {
                render: "Connexion rétablie",
                type: "success",
                autoClose: 2000,
              });
            } else {
              toast.success("Connexion rétablie", {
                position: "bottom-right",
                autoClose: 2000,
              });
            }
          }
        },
      }),
    []
  );

  useEffect(() => {
    net.start();
    return () => net.stop();
  }, [net]);

  /** ===== LocalStorage helpers ===== */
  const storeUserInLocalStorage = (u: AuthUser) => {
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("username", u.username);
    if (u.api_key) localStorage.setItem("api_key", u.api_key);
    localStorage.setItem("id_role", String(u.id_role));
    localStorage.setItem("theme_mode", u.profile_settings.theme_mode);
    localStorage.setItem("language", u.profile_settings.language);
    localStorage.setItem("timezone", u.profile_settings.timezone);
    localStorage.setItem("userid", String(u.id_user));
  };

  const clearUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("api_key");
    localStorage.removeItem("id_role");
    localStorage.removeItem("theme_mode");
    localStorage.removeItem("language");
    localStorage.removeItem("timezone");
    localStorage.removeItem("userid");
  };

  /** ===== Bootstrapping de session + refresh périodique ===== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (net.quality === "offline") {
          setLoading(false);
          return;
        }

        const res = await net.fetchJson<AuthUser>(`${BACKEND_URL}/api/me`, {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (res.status === 401) {
          clearUserFromLocalStorage();
          setUser(null);
          setLoading(false);
          return;
        }

        if (!res.ok || !res.data) {
          setLoading(false);
          return; // Ne pas déconnecter
        }

        const u = res.data as AuthUser;
        setUser(u);
        storeUserInLocalStorage(u);
        setLoading(false);

      } catch (error) {
        console.error("/api/me error", error);
        setLoading(false);
        return; // Ne pas déconnecter
      }
    };


    // premier check
    fetchUser();

    // revalidation toutes les 30s
    const interval = setInterval(fetchUser, 30_000);
    return () => clearInterval(interval);
  }, [net]);

  /** ===== Après /login : récupérer la session ===== */
  const login = async () => {
    if (net.quality === "offline") return;

    const res = await net.fetchJson<AuthUser>(`${BACKEND_URL}/api/me`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!res.ok || !res.data || Object.keys(res.data as any).length === 0) return;

    const u = res.data as AuthUser;
    setUser(u);
    storeUserInLocalStorage(u);
  };

  /** ===== Logout ===== */
  const logout = async () => {
    try {
      if (net.quality !== "offline") {
        await axios.post(`${BACKEND_URL}/api/logout`, {}, { withCredentials: true });
      }
      setUser(null);
      clearUserFromLocalStorage();
    } catch (error) {
      console.error("❌ Error during logout:", error);
      setUser(null);
      clearUserFromLocalStorage();
    }
  };

  /** ===== Sync multi-onglets via localStorage ===== */
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "logout") {
        setUser(null);
        clearUserFromLocalStorage();
        window.location.href = "/login";
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
