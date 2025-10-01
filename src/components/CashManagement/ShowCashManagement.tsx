import React, { useState, useEffect } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";

interface ShowCashManagementProps {
    show: boolean;
    onHide: () => void;
    recordId?: number;
}

interface CashPaymentRecord {
    id_fb: number;
    num_fact_fb: string;
    immatriculation_vehicule: string;
    conducteur_fb: string;
    km_fb: string;
    new_km_fb: string;
    km_amort_fb: string;
    duree_amort_fb: string;
    qte_fb: string;
    cout_fb: string;
    paytype_fb: string;
    date_fb: string;
    station_fb: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ShowCashManagement: React.FC<ShowCashManagementProps> = ({ 
    show, 
    onHide, 
    recordId 
}) => {
    const [record, setRecord] = useState<CashPaymentRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { translate } = useTranslate();

    useEffect(() => {
        const fetchRecord = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${backendUrl}/api/geop/cashpayment/${recordId}`);
                if (!response.ok) throw new Error("Failed to fetch record");
                
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

    const getPaymentTypeBadge = (type: string) => {
        switch(type) {
            case 'cash':
                return <Badge bg="success">{translate("Cash")}</Badge>;
            case 'card':
                return <Badge bg="info">{translate("Card")}</Badge>;
            case 'check':
                return <Badge bg="warning" text="dark">{translate("Check")}</Badge>;
            case 'transfer':
                return <Badge bg="primary">{translate("Transfer")}</Badge>;
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
                    {translate("Cash Payment Record Details")}
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
                                <p>{formatDate(record.date_fb)}</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Payment Type")}</h6>
                                <div>{getPaymentTypeBadge(record.paytype_fb)}</div>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Quantity")}</h6>
                                <p>{record.qte_fb} L</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Current Km")}</h6>
                                <p>{record.km_fb} km</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Driver")}</h6>
                                <p>{record.conducteur_fb || "-"}</p>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <h6>{translate("New Km")}</h6>
                                <p>{record.new_km_fb} km</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Cost")}</h6>
                                <p>{record.cout_fb} DZD</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Invoice Number")}</h6>
                                <p>{record.num_fact_fb || "-"}</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Gas Station")}</h6>
                                <p>{record.station_fb || "-"}</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Amortization Km")}</h6>
                                <p>{record.km_amort_fb || "-"}</p>
                            </div>

                            <div className="mb-3">
                                <h6>{translate("Amortization Duration")}</h6>
                                <p>{record.duree_amort_fb || "-"}</p>
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

export default ShowCashManagement;