import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Définition du type Permission
export  interface Permission {
  id_rel: number;
  id_role: number;
  id_permission: number;
  nom_permission: string;
  can_create: number;
  can_read: number;
  can_update: number;
  can_delete: number;
}

// Hook personnalisé pour récupérer les permissions
const usePermissions = (roleId: string | null) => {
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roleId) {
      setLoading(false);
      return;
    } // Ne fait rien si roleId est null

    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Permission[]>(`${backendUrl}/api/geop/permission/all/${roleId}`);
        setUserPermissions(response.data);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError("Error fetching permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [roleId]); // Re-fetch si roleId change

  return { userPermissions, loading, error };
};

export default usePermissions;
