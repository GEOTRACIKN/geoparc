import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslate } from "../../hooks/LanguageProvider";
import { Bounce, toast } from "react-toastify";
import Select from "react-select";

interface ModalEditPieceProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
    id_piece: number | null;
  pieceData?: any;
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

const ModalEditPiece: React.FC<ModalEditPieceProps> = ({ show, onHide, onSuccess, pieceData }) => {
  const { translate } = useTranslate();
  const geopuserID = localStorage.getItem("GeopUserID");

  const [formData, setFormData] = useState({ ...pieceData });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stockPieces, setStockPieces] = useState<StockPiece[]>([]);

  useEffect(() => {
    setFormData({ ...pieceData });

    if (geopuserID) {
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
  }, [pieceData, geopuserID, translate]);

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
        setStockPieces(data);
      } catch (error) {
        console.error("Error fetching stock pieces:", error);
        setStockPieces([]);
      }
    };
    fetchStockPieces();
  }, [formData.source_piece, geopuserID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleClose = () => {
    onHide();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/geop/updatepiece/${pieceData.id_piece}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error updating piece");

      toast.success(translate("Updated successfully!"), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });

      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating piece:", error);
      toast.error(translate("Error updating. Please try again"), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{translate("Edit Piece")}</Modal.Title>
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
          onChange={(opt) => setFormData((prev: any) => ({ ...prev, id_vehicule_piece: opt?.value.toString() || "" }))}
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
              value={formData.duree_piece}
              onChange={handleChange}
              onKeyDown={(e) => {
                const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
              }}
            />
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
                setFormData((prev: any) => ({
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
                setFormData((prev: any) => ({
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
            {translate("Cancel")}
          </Button>
          <Button variant="primary" type="submit">
            {translate("Update")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEditPiece;
