import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import { FiUser, FiHash, FiLayers, FiPackage, FiDollarSign, FiMessageCircle } from "react-icons/fi";
import "bootstrap-icons/font/bootstrap-icons.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface AddDemandePieceProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const categoriesTypes: { [key: string]: string[] } = {
  Pneumatique: ["Pneu route", "Pneu tout-terrain", "Chambre à air", "Jante"],
  Filtrage: ["Filtre à air", "Filtre à huile", "Filtre à carburant", "Filtre habitacle"],
  Lubrification: ["Huile moteur", "Graisse", "Additif carburant"],
  Electrique: ["Batterie", "Alternateur", "Ampoule", "Fusible"],
  Freinage: ["Plaquette", "Disque", "Étrier", "Maître-cylindre"],
  Transmission: ["Embrayage", "Boîte de vitesses", "Cardan", "Joint homocinétique"],
  Refroidissement: ["Radiateur", "Thermostat", "Pompe à eau", "Durite"],
  Carrosserie: ["Pare-chocs", "Capot", "Porte", "Rétroviseur"],
  Suspension: ["Amortisseur", "Ressort", "Triangle", "Silentbloc"],
  Accessoires: ["Essuie-glace", "Clignotant", "Rétroviseur intérieur", "Tapis"]
};

const AddDemandePiece: React.FC<AddDemandePieceProps> = ({ show, onHide, onSuccess }) => {
  const [client, setClient] = useState("");
  const [numeroBon, setNumeroBon] = useState("");
  const [categorie, setCategorie] = useState("");
  const [type, setType] = useState("");
  const [prix, setPrix] = useState<number | null>(null);
  const [quantite, setQuantite] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState("");
  const [categorieOptions, setCategorieOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategorieOptions(Object.keys(categoriesTypes));
  }, []);

  useEffect(() => {
    const foundTypes = categorie && categoriesTypes[categorie] ? categoriesTypes[categorie] : [];
    setTypeOptions(foundTypes);
  }, [categorie]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/geop/createdemandepiece`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_bon: numeroBon,
          client,
          categorie,
          type,
          quantite,
          prix,
          commentaire,
          statut: "En attente",
          id_user: 0
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur lors de la création de la demande");
      toast.success("Demande créée !", { autoClose: 2000, transition: Bounce });
      onSuccess();
      onHide();
    } catch (error) {
      console.error("❌ FRONT ERROR:", error);
      toast.error("Erreur lors de la création de la demande", { autoClose: 2000, transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nouvelle Demande de pièce</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* CLIENT + NUM BON */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Client</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiUser /></InputGroup.Text>
                <Form.Control type="text" value={client} onChange={e => setClient(e.target.value)} placeholder="Nom du client" />
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Numéro de bon</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiHash /></InputGroup.Text>
                <Form.Control type="text" value={numeroBon} onChange={e => setNumeroBon(e.target.value)} placeholder="Numéro du bon" />
              </InputGroup>
            </Col>
          </Row>

          {/* CATEGORIE + TYPE */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Catégorie</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <i className="bi bi-diagram-3"></i>
                </InputGroup.Text>
                <Form.Control as="input" list="categorieOptions" value={categorie} onChange={e => setCategorie(e.target.value)} placeholder="Choisir ou taper une catégorie" />
                <datalist id="categorieOptions">{categorieOptions.map((c, idx) => <option key={idx} value={c} />)}</datalist>
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Type</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiLayers /></InputGroup.Text>
                <Form.Control as="input" list="typeOptions" value={type} onChange={e => setType(e.target.value)} placeholder="Choisir ou taper un type" />
                <datalist id="typeOptions">{typeOptions.map((t, idx) => <option key={idx} value={t} />)}</datalist>
              </InputGroup>
            </Col>
          </Row>

          {/* PRIX + QUANTITE */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Prix</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiDollarSign /></InputGroup.Text>
                <Form.Control type="number" value={prix ?? ""} onChange={e => setPrix(e.target.value ? parseFloat(e.target.value) : null)} placeholder="Prix" />
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Quantité</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiPackage /></InputGroup.Text>
                <Form.Control type="number" value={quantite ?? ""} onChange={e => setQuantite(e.target.value ? parseInt(e.target.value) : null)} placeholder="Quantité" />
              </InputGroup>
            </Col>
          </Row>

          {/* COMMENTAIRE */}
          <Row>
            <Col>
              <Form.Label>Commentaire</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiMessageCircle /></InputGroup.Text>
                <Form.Control as="textarea" value={commentaire} onChange={e => setCommentaire(e.target.value)} placeholder="Ajouter un commentaire" rows={3} />
              </InputGroup>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Annuler</Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>{loading ? "Enregistrement..." : "Créer"}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDemandePiece;
