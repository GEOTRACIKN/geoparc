import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface VehicleDetails {
  id_verif: number;
  truck_step_right: number; // Définir le type comme number
  truck_step_left: number; // Définir le type comme number
  triangles_wedges: number; // Définir le type comme number
  battery: number; // Définir le type comme number
  // Ajouter d'autres propriétés ici selon vos besoins
}

export function DetailVehicleCheck() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { id_verif } = useParams();
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/vehiclecheck/${id_verif}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails du véhicule');
        }
        const data: VehicleDetails = await response.json();

        // Transformer les données seulement si 'data' est défini
        if (data) {
          const transformedDetails: VehicleDetails = {
            ...data,
            truck_step_right: data.truck_step_right === 1 ? 1 : 2, // Assurez-vous que le type correspond à 'number'
            truck_step_left: data.truck_step_left === 1 ? 1 : 2, // Assurez-vous que le type correspond à 'number'
            triangles_wedges: data.triangles_wedges === 1 ? 1 : 2, // Assurez-vous que le type correspond à 'number'
            battery: data.battery === 1 ? 1 : 2, // Assurez-vous que le type correspond à 'number'
          };
          setVehicleDetails(transformedDetails);
        } else {
          throw new Error('Données du véhicule invalides');
        }
      } catch (error) {
        console.error('Erreur:', error);
        // Gérer les erreurs ici (affichage d'un message d'erreur, etc.)
      }
    };

    if (id_verif) {
      fetchVehicleDetails();
    }
  }, [id_verif]);

  if (!vehicleDetails) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div>
      <h1>Détail du Véhicule {id_verif}</h1>
      <p>Truck Step Right: {vehicleDetails.truck_step_right === 1 ? 'checké' : 'non checké'}</p>
      <p>Truck Step Left: {vehicleDetails.truck_step_left === 1 ? 'checké' : 'non checké'}</p>
      <p>Triangles Wedges: {vehicleDetails.triangles_wedges === 1 ? 'checké' : 'non checké'}</p>
      <p>Battery: {vehicleDetails.battery === 1 ? 'checké' : 'non checké'}</p>
      {/* Ajoutez d'autres champs ici selon vos besoins */}
    </div>
  );
}
