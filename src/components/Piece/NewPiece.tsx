import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

interface ModalNewPieceProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

interface Vehicle {
    id_vehicule: number;
    immatriculation_vehicule: string;
}

interface StockPiece {
  id_piece_stock: number;
  designation_ps: string;
  reference_ps: string;
  constructeur_ps: string;
  modele_ps: string;
  marque_ps: string;
}


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ModalNewPiece: React.FC<ModalNewPieceProps> = ({ show, onHide, onSuccess }) => {
    const [formData, setFormData] = useState({
      id_piece:"",
        type_operation_piece: "",
        id_vehicule_piece: "",
        source_piece: "",
        piece_id_piece: "",
        position_piece: "",
        technicien_piece: "",
        num_facture_piece: "",
        fournisseur_piece: "",
        date_piece: "",
        duree_piece: "",
        cout_piece: "",
        details_piece: "",
        id_piece_stock:"",
        id_user_piece: ""
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
        const [stockPieces, setStockPieces] = useState<StockPiece[]>([]); // État pour les pneus en stock
    
    const { translate } = useTranslate();
    const geopuserID = localStorage.getItem("GeopUserID");

    useEffect(() => {
        if (geopuserID) {
            setFormData(prev => ({ ...prev, id_user_piece: geopuserID }));

            fetch(`${backendUrl}/api/geop/vehicule/${geopuserID}`)
                .then(res => res.json())
                .then(data => setVehicles(data.vehicles || []))
                .catch(err => {
                    console.error("Error fetching vehicles:", err);
                    toast.error(translate("Error fetching vehicles."), {
                        position: "bottom-right",
                        autoClose: 2400,
                        transition: Bounce,
                    });
                });
        }
    }, [geopuserID, translate]);

    useEffect(() => {
    const fetchStockPieces = async () => {
        if (!geopuserID || formData.source_piece !== "internal") return;
        
        try {
            const response = await fetch(`${backendUrl}/api/geop/piece_stock/available/${geopuserID}`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setStockPieces(data); // Assure-toi que setStockPieces est défini avec useState
        
        } catch (error) {
            console.error("Error fetching stock pieces:", error);
            setStockPieces([]);
        }
    };

    fetchStockPieces();
}, [formData.source_piece]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleClose = () => {
        setFormData({
           id_piece:"",
            type_operation_piece: "",
            id_vehicule_piece: "",
            source_piece: "",
            piece_id_piece: "",
            position_piece: "",
            technicien_piece: "",
            num_facture_piece: "",
            fournisseur_piece: "",
            date_piece: "",
            duree_piece: "",
            cout_piece: "",
            details_piece: "",
            id_piece_stock:"",
            id_user_piece: geopuserID || ""
        });
        onHide();
    };

    const validateForm = () => {
        if (!formData.id_vehicule_piece || !formData.type_operation_piece) {
            toast.error(translate("Please fill out all required fields"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch(`${backendUrl}/api/geop/addnewpiece/${geopuserID}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Error adding piece");

            toast.success(translate("Added successfully!"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });

            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            console.error("Error adding piece:", error);
            toast.error(translate("Error adding. Please try again"), {
                position: "bottom-right",
                autoClose: 2400,
                transition: Bounce,
            });
        }
    };

    return (
<Modal show={show} onHide={handleClose} size="lg" backdrop="static">
  <Modal.Header closeButton>
    <Modal.Title>{translate("New")}</Modal.Title>
  </Modal.Header>

  <Form onSubmit={handleSubmit}>
 <Modal.Body>
  {/* Line 1: Operation Type & Vehicle */}
  <div className="row">
    <div className="col-md-6">
      <Form.Group controlId="type_operation_piece" className="mb-3">
        <Form.Label>{translate("Operation Type")} *</Form.Label>
        <Form.Control
          as="select"
          value={formData.type_operation_piece}
          onChange={handleChange}
        >
          <option value="">{translate("Select Operation")}</option>
          <option value="add">{translate("Add")}</option>
          <option value="replace">{translate("Replace")}</option>
        </Form.Control>
      </Form.Group>
    </div>
    <div className="col-md-6">
      <Form.Group controlId="id_vehicule_piece" className="mb-3">
        <Form.Label>{translate("Vehicle")}</Form.Label>
        <Select
          options={vehicles.map(v => ({ value: v.id_vehicule, label: v.immatriculation_vehicule }))}
          value={vehicles
            .map(v => ({ value: v.id_vehicule, label: v.immatriculation_vehicule }))
            .find(opt => String(opt.value) === String(formData.id_vehicule_piece)) || null}
          onChange={(opt) => setFormData(prev => ({ ...prev, id_vehicule_piece: opt?.value.toString() || "" }))}
          placeholder={translate("Select Vehicle")}
          isSearchable
        />
      </Form.Group>
    </div>
  </div>

  {/* Line 2: Source & Position */}
  <div className="row">
    <div className="col-md-6">
      <Form.Group controlId="source_piece" className="mb-3">
        <Form.Label>{translate("Source")}</Form.Label>
        <Form.Control
          as="select"
          value={formData.source_piece}
          onChange={handleChange}
        >
          <option value="">{translate("Select Source")}</option>
          <option value="external">{translate("External")}</option>
          <option value="internal">{translate("Internal")}</option>
        </Form.Control>
      </Form.Group>
    </div>
    <div className="col-md-6">
      <Form.Group controlId="position_piece" className="mb-3">
        <Form.Label>{translate("Position")}</Form.Label>
        <Form.Control
          type="text"
          value={formData.position_piece}
          onChange={handleChange}
        />
      </Form.Group>
    </div>
  </div>

  {/* Block for source = external */}
  {formData.source_piece === "external" && (
    <>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <Form.Group controlId="num_facture_piece" className="mb-3">
            <Form.Label>{translate("Invoice Number")}</Form.Label>
            <Form.Control
              type="text"
              value={formData.num_facture_piece}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group controlId="fournisseur_piece" className="mb-3">
            <Form.Label>{translate("Supplier")}</Form.Label>
            <Form.Control
              type="text"
              value={formData.fournisseur_piece}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Form.Group controlId="duree_piece" className="mb-3">
            <Form.Label>{translate("Duration")}</Form.Label>
            <Form.Control
            type="text"
            placeholder="Ex: 01:30"
            value={formData.duree_piece}
            onChange={handleChange}
            onKeyDown={(e) => {
              const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', ':'];
              if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
            }}
          />
          <Form.Text className="text-muted">Format : HH:MM (ex: 01:30)</Form.Text>

          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group controlId="cout_piece" className="mb-3">
            <Form.Label>{translate("Cost (DZD)")}</Form.Label>
            <Form.Control
              type="text"
              value={formData.cout_piece}
              onChange={handleChange}
              onKeyDown={(e) => {
                const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
              }}
            />
          </Form.Group>
        </div>
      </div>
    </>
  )}

  {/* Block for source = internal */}
  {formData.source_piece === "internal" && (
    <>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <Form.Group controlId="technicien_piece" className="mb-3">
            <Form.Label>{translate("Technician")}</Form.Label>
            <Form.Control
              type="text"
              value={formData.technicien_piece || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  technicien_piece: e.target.value,
                }))
              }
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group controlId="id_piece_stock" className="mb-3">
            <Form.Label>{translate("Internal Stock Piece")}</Form.Label>
            <Select
              options={stockPieces.map((p) => ({
                value: p.id_piece_stock,
                label: `${p.designation_ps} - ${p.reference_ps} - ${p.constructeur_ps} ${p.modele_ps} (${p.marque_ps})`
              }))}
              value={stockPieces
                .map((p) => ({
                  value: p.id_piece_stock,
                  label: `${p.designation_ps} - ${p.reference_ps} - ${p.constructeur_ps} ${p.modele_ps} (${p.marque_ps})`
                }))
                .find(opt => String(opt.value) === String(formData.id_piece_stock)) || null}
              onChange={(opt) =>
                setFormData((prev) => ({
                  ...prev,
                  id_piece_stock: opt?.value?.toString() || "",
                }))
              }
              placeholder={translate("Select Internal Stock Piece")}
              isSearchable
            />
          </Form.Group>
        </div>
      </div>
    </>
  )}

  {/* Common block: Date & Details */}
  <hr />
  <div className="row">
    <div className="col-md-6">
      <Form.Group controlId="date_piece" className="mb-3">
        <Form.Label>{translate("Date")}</Form.Label>
        <Form.Control
          type="datetime-local"
          value={formData.date_piece}
            min="2000-01-01T00:00"
          onChange={handleChange}
        />
      </Form.Group>
    </div>
    <div className="col-md-6">
      <Form.Group controlId="details_piece" className="mb-3">
        <Form.Label>{translate("Details")}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.details_piece}
          onChange={handleChange}
        />
      </Form.Group>
    </div>
  </div>
</Modal.Body>


  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
    <Button variant="primary" type="submit">
      Add
    </Button>
  </Modal.Footer>
</Form>

</Modal>


    );
};

export default ModalNewPiece;