import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import axios, { AxiosError } from 'axios';
import Select from "react-select";

// Définir le type pour un véhicule
interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}


interface EditPneuModalProps {
    show: boolean;
    onHide: () => void;
    id_pneu: number | null; // ID du pneu à modifier
    onSuccess?: () => void;
}
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditPneuModal: React.FC<EditPneuModalProps> = ({
    show,
    onHide,
    id_pneu,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        id_pneu: "",
        num_facture_pneu: "",
        km_pneu:"",
        date_achat_pneu: "",
        etat_pneu:"",
        position_pneu:"",
        cout_pneu: "",
        type_pneu: "",
        fournisseur_pneu:"",
        temps_amort:"",
        id_vehicule: "",
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const geopuserID = localStorage.getItem("GeopUserID");
    const { translate } = useTranslate();
    // Charger les données du pneu existant
    useEffect(() => {
        if (!id_pneu) {
            console.error("ID du pneu invalide");
            return;
        }

        const fetchPneu = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/geop/showpneu/${id_pneu}`);
                const data = response.data;

                if (!data || !data.id_pneu) {
                    toast.error("Données du pneu introuvables.");
                    return;
                }

               
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                }));

            } catch (error: unknown) {
                console.error("Erreur lors de la récupération des données du pneu:", error);
                if (error instanceof AxiosError) {
                    console.error("Réponse du serveur:", error.response?.data);
                    console.error("Statut:", error.response?.status);
                } else if (error instanceof Error) {
                    console.error("Erreur de requête:", error.message);
                } else {
                    console.error("Erreur inconnue:", error);
                }
            }
        };

        fetchPneu();
    }, [id_pneu, backendUrl]);


    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                if (!geopuserID) {
                    console.warn("Aucun ID utilisateur fourni");
                    return;
                }

                const response = await fetch(
                    `${backendUrl}/api/geop/vehicule/${geopuserID}`
                );

                if (!response.ok) {
                    throw new Error(`Échec de la récupération des véhicules. Statut: ${response.status}`);
                }

                const data = await response.json();
                setVehicles(data.vehicles || []);
            } catch (error) {
                console.error("Erreur lors de la récupération des véhicules:", error);
                toast.error("Erreur lors de la récupération des véhicules.", {
                    position: "bottom-right",
                    autoClose: 2400,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
            }
        };

        fetchVehicles();
    }, [geopuserID, backendUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleClose = () => {
        setFormData({
            id_pneu: "",
        num_facture_pneu: "",
        km_pneu:"",
        date_achat_pneu: "",
        etat_pneu:"",
        position_pneu:"",
        cout_pneu: "",
        type_pneu: "",
        fournisseur_pneu:"",
        temps_amort:"",

        id_vehicule: "",
        });
        onHide();
    };

    const validateForm = () => {
        if (
            !formData.num_facture_pneu ||
            !formData.id_vehicule
        ) {
            toast.error(translate("Veuillez remplir tous les champs"), {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
            return false;
        }

        const selectedVehicle = vehicles.find(
            (vehicule) => String(vehicule.id_vehicule) === String(formData.id_vehicule)
        );

        if (!selectedVehicle) {
            toast.error("Veuillez sélectionner un véhicule valide.", {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(
                `${backendUrl}/api/geop/updatepneu/${id_pneu}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour du pneu.");
            }

            const result = await response.json();

            toast.success(translate("Mise à jour réussie!"), {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });

            if (onSuccess) {
                onSuccess();
            }

            onHide();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du pneu:", error);
            toast.error(translate("Erreur lors de la mise à jour. Veuillez réessayer."), {
                position: "bottom-right",
                autoClose: 2400,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    const getVehicleKm = async (id_vehicule: string | number) => {
        const res = await fetch(`${backendUrl}/api/geop/vehicule_km/${id_vehicule}`);
        if (!res.ok) throw new Error("Erreur récupération km");
        return await res.json();
    };


    return (
        <Modal show={show} onHide={onHide} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{translate("Modifier le Pneu")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="num_facture_pneu">
                        <Form.Label>{translate("N° Facture")}</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.num_facture_pneu}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="id_vehicule">
                    <Form.Label>{translate("Vehicle")}{translate(" *")}</Form.Label>
                    <Select
                        options={vehicles.map(vehicle => ({
                                                value: vehicle.id_vehicule, // ID du véhicule
                                                label: vehicle.immatriculation_vehicule // Immatriculation
                                            })) as unknown as { value: number; label: string }[]} // 🔥 Correction du typage

                        placeholder={translate("Select Vehicle")}
                        isLoading={vehicles.length === 0} // Affiche un loader si les données ne sont pas encore chargées
                        noOptionsMessage={() => translate("No vehicles available")}
                        isSearchable // Active la recherche

                        // 🔥 Correction de la sélection automatique avec conversion en string
                        value={vehicles
                            .map(vehicle => ({
                                value: vehicle.id_vehicule,
                                label: vehicle.immatriculation_vehicule
                            }))
                            .find(option => String(option.value) === String(formData.id_vehicule)) || null
                        }

                        onChange={async (selectedOption) => {
                            const id = selectedOption ? String(selectedOption.value) : "";
                        
                            if (id) {
                                try {
                                    const data = await getVehicleKm(id);
                                    setFormData(prev => ({
                                        ...prev,
                                        id_vehicule: id,
                                        km_pneu: data.kilometrage_vehicule || "",
                                    }));
                                } catch (error) {
                                    console.error("Erreur lors de la récupération du km:", error);
                                    toast.error("Erreur récupération kilométrage", {
                                        position: "bottom-right",
                                        autoClose: 2400,
                                        transition: Bounce,
                                    });
                                }
                            } else {
                                setFormData(prev => ({
                                    ...prev,
                                    id_vehicule: "",
                                    km_pneu: "",
                                }));
                            }
                        }}
                        
                    />
                </Form.Group>

                <Form.Group controlId="km_pneu">
                                       <Form.Label>{translate("Km")}</Form.Label>
                                       <Form.Control
                                           type="text"
                                           value={formData.km_pneu}
                                           onChange={handleChange}
                                           readOnly
                                       />
                                   </Form.Group>
               
                                   <Form.Group controlId="date_achat_pneu">
                                       <Form.Label>{translate("Purchase Date")}</Form.Label>
                                       <Form.Control
                                           type="datetime-local"
                                           value={
                                               formData.date_achat_pneu
                                                   ? new Date(formData.date_achat_pneu).toISOString().slice(0, 16)
                                                   : ""
                                               }
                                           onChange={handleChange}
                                       />
                                   </Form.Group>
               
                                   <Form.Group controlId="etat_pneu">
                                    <Form.Label>{translate("Pneu à installer/désinstaller")}</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={formData.etat_pneu}
                                        onChange={handleChange}
                                    >
                                        <option value="installer">{translate("Installer")}</option>
                                        <option value="desinstaller">{translate("Désinstaller")}</option>
                                    </Form.Control>
                                </Form.Group>

                                   <Form.Group controlId="position_pneu">
                                       <Form.Label>{translate("Position")}</Form.Label>
                                       <Form.Control
                                           type="text"
                                           value={formData.position_pneu}
                                           onChange={handleChange}
                                       />
                                   </Form.Group>
                                   <Form.Group controlId="fournisseur_pneu">
                                       <Form.Label>{translate("Fournisseur")}</Form.Label>
                                       <Form.Control
                                           type="text"
                                           value={formData.fournisseur_pneu}
                                           onChange={handleChange}
                                       />
                                   </Form.Group>
                                   <Form.Group controlId="temps_amort ">
                                       <Form.Label>{translate("Durée")}</Form.Label>
                                       <Form.Control
                                           type="text"
                                           value={formData.temps_amort }
                                           onChange={handleChange}
                                       />
                                   </Form.Group>
               
                                   <Form.Group controlId="cout_pneu">
                                       <Form.Label>{translate("Cost")}</Form.Label>
                                       <Form.Control
                                           type="text"
                                           value={formData.cout_pneu}
                                           onChange={handleChange}
                                           onKeyDown={(e) => {
                                               const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                               if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                   e.preventDefault();
                                               }
                                           }}
                                           min="0"
                                       />
                                   </Form.Group>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {translate("Fermer")}
                    </Button>
                    <Button variant="primary" type="submit">
                        {translate("Mettre à jour")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditPneuModal;
