import React, { useState, useEffect } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";

interface ShowCardManagementProps {
    show: boolean;
    onHide: () => void;
    recordId?: number;  // Modification ici pour accepter null
    }

interface FuelCardRecord {
    id_fc: number;
    facture_fc: string;
    immatriculation_vehicule: string;
    carb_fc: string;
    cout_fc: string;
    qte_fc: string;
    date_fc: string;
    carte_fc: string;
    station_fc: string;
    amort_fc: string;
    km_fc: string;
    new_km_fc: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ShowCardManagement: React.FC<ShowCardManagementProps> = ({ 
    show, 
    onHide, 
    recordId 
}) => {
    const [record, setRecord] = useState<FuelCardRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    const { translate } = useTranslate();

    useEffect(() => {
        const fetchRecord = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${backendUrl}/api/geop/fuelcard/${recordId}`);
                if (!response.ok) throw new Error("Failed to fetch record");
                 if (recordId == null) { // Couvre null ET undefined
            console.debug('No record selected');
            return;
        }
                
                const data = await response.json();
                setRecord(data);
            } catch (error) {
                console.error("Error fetching record:", error);
                toast.error(translate("Error fetching record."), {
                    position: "bottom-right",
                    autoClose: 2400,
                    transition: Bounce,
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (recordId) fetchRecord();
    }, [recordId, translate]);

    const getFuelTypeBadge = (type: string) => {
        switch(type) {
            case 'diesel':
                return <Badge bg="secondary">{translate("Diesel")}</Badge>;
            case 'essence':
                return <Badge bg="warning" text="dark">{translate("Gasoline")}</Badge>;
            case 'gpl':
                return <Badge bg="info">{translate("LPG")}</Badge>;
            case 'electrique':
                return <Badge bg="primary">{translate("Electric")}</Badge>;
            default:
                return <Badge bg="light" text="dark">{type}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {translate("Fuel Card Record Details")}
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {isLoading ? (
                    <div className="text-center my-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : record ? (
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h6>{translate("Vehicle")}</h6>
                                <p className="fs-5">{record.immatriculation_vehicule}</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Date")}</h6>
                                <p>{formatDate(record.date_fc)}</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Fuel Type")}</h6>
                                <div>{getFuelTypeBadge(record.carb_fc)}</div>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Quantity")}</h6>
                                <p>{record.qte_fc} L</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Current Km")}</h6>
                                <p>{record.km_fc} km</p>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <h6>{translate("New Km")}</h6>
                                <p>{record.new_km_fc} km</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Cost")}</h6>
                                <p>{record.cout_fc} DZD</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Invoice Number")}</h6>
                                <p>{record.facture_fc || "-"}</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Card Number")}</h6>
                                <p>{record.carte_fc || "-"}</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Gas Station")}</h6>
                                <p>{record.station_fc || "-"}</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Amortization")}</h6>
                                <p>{record.amort_fc || "-"}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center my-4">
                        <p>{translate("No record found")}</p>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    {translate("Close")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShowCardManagement;