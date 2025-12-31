import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, InputGroup, Table } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import {FiUser,FiHash,FiLayers,FiPackage,FiDollarSign,FiMessageCircle,FiPlus,FiCheck} from "react-icons/fi";
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


const AddDemandePiece: React.FC<AddDemandePieceProps> = ({
  show,
  onHide,
  onSuccess
}) => {
  // BON
  const [client, setClient] = useState("");
  const [numeroBon, setNumeroBon] = useState("");

  // PIÈCE
  const [categorie, setCategorie] = useState("");
  const [type, setType] = useState("");
  const [prix, setPrix] = useState<number | null>(null);
  const [quantite, setQuantite] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState("");

  // LISTE DES LIGNES
  const [lignesBon, setLignesBon] = useState<any[]>([]);

  const [categorieOptions, setCategorieOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategorieOptions(Object.keys(categoriesTypes));
  }, []);

  useEffect(() => {
    setTypeOptions(categorie ? categoriesTypes[categorie] || [] : []);
  }, [categorie]);

  // AJOUTER UNE LIGNE AU BON
  const handleAddLine = () => {
    if (!categorie || !type || !quantite || !prix) {
      toast.error("Veuillez remplir tous les champs de la pièce", { transition: Bounce });
      return;
    }

    setLignesBon(prev => [
      ...prev,
      { categorie, type, quantite, prix, commentaire }
    ]);

    setCategorie(""); setType(""); setQuantite(null); setPrix(null); setCommentaire("");
  };

  // VALIDATION DU BON 
  const handleSave = async () => {
    if (!client || !numeroBon || lignesBon.length === 0) {
      toast.error("Bon incomplet", { transition: Bounce });
      return;
    }

    try {
      setLoading(true);

      // ENVOYER UN SEUL OBJET AVEC LES PIÈCES
      const response = await fetch(`${backendUrl}/api/geop/demandepiece/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client,
          num_bon: numeroBon,
          id_user: 0,
          pieces: lignesBon 
        })
      });

      if (!response.ok) throw new Error("Erreur lors de la création du bon");

      toast.success("Bon de livraison créé avec succès !", { transition: Bounce });

      setLignesBon([]);
      onSuccess();
      onHide();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création du bon", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton><Modal.Title>Nouveau bon de livraison</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form>
          {/* CLIENT + NUM BON */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Client</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiUser /></InputGroup.Text>
                <Form.Control value={client} onChange={e => setClient(e.target.value)} />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Label>Numéro de bon</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiHash /></InputGroup.Text>
                <Form.Control value={numeroBon} onChange={e => setNumeroBon(e.target.value)} />
              </InputGroup>
            </Col>
          </Row>

          {/* PIÈCE */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Catégorie</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><i className="bi bi-diagram-3"></i></InputGroup.Text>
                <Form.Control list="categorieOptions" value={categorie} onChange={e => setCategorie(e.target.value)} />
                <datalist id="categorieOptions">{categorieOptions.map((c,i)=><option key={i} value={c}/>)}</datalist>
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Label>Type</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiLayers /></InputGroup.Text>
                <Form.Control list="typeOptions" value={type} onChange={e => setType(e.target.value)} />
                <datalist id="typeOptions">{typeOptions.map((t,i)=><option key={i} value={t}/>)}</datalist>
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Prix</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiDollarSign /></InputGroup.Text>
                <Form.Control type="number" value={prix ?? ""} onChange={e=>setPrix(e.target.value?Number(e.target.value):null)} />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Label>Quantité</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiPackage /></InputGroup.Text>
                <Form.Control type="number" value={quantite ?? ""} onChange={e=>setQuantite(e.target.value?Number(e.target.value):null)} />
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Commentaire</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}><FiMessageCircle /></InputGroup.Text>
                <Form.Control as="textarea" rows={2} value={commentaire} onChange={e => setCommentaire(e.target.value)} />
              </InputGroup>
            </Col>
          </Row>

          <Button variant="outline-primary" onClick={handleAddLine}><FiPlus /> Ajouter la pièce</Button>

          {lignesBon.length>0 && <>
            <hr />
            <Table bordered size="sm">
              <thead style={{background:"#f97316",color:"#fff"}}>
                <tr><th>Catégorie</th><th>Type</th><th>Qté</th><th>Prix</th></tr>
              </thead>
              <tbody>
                {lignesBon.map((l,i)=>(
                  <tr key={i}><td>{l.categorie}</td><td>{l.type}</td><td className="text-center">{l.quantite}</td><td className="text-center">{l.prix}</td></tr>
                ))}
              </tbody>
            </Table>
          </>}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Annuler</Button>
        <Button variant="primary" onClick={handleSave} disabled={loading || lignesBon.length===0}>
          <FiCheck /> {loading ? "Validation..." : "Valider le bon"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDemandePiece;
