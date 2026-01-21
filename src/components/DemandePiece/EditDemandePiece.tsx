import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import { FiUser, FiHash, FiLayers, FiPackage, FiDollarSign, FiMessageCircle } from "react-icons/fi";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const geopuserID = localStorage.getItem("GeopUserID");

interface Props {
  show: boolean;
  onHide: () => void;
  id_demande_piece: number | null;
  onSuccess?: () => void;
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

const EditDemandePiece: React.FC<Props> = ({ show, onHide, id_demande_piece, onSuccess }) => {
  const [client, setClient] = useState("");
  const [numeroBon, setNumeroBon] = useState("");
  const [categorie, setCategorie] = useState("");
  const [type, setType] = useState("");
  const [prix, setPrix] = useState<number | null>(null);
  const [quantite, setQuantite] = useState<number | null>(1);
  const [commentaire, setCommentaire] = useState("");
  const [statut, setStatut] = useState("En attente");
  const [categorieOptions, setCategorieOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setCategorieOptions(Object.keys(categoriesTypes)); }, []);

  useEffect(() => {
    if (!show) return;
    if (!id_demande_piece) {
      setClient(""); setNumeroBon(""); setCategorie(""); setType("");
      setPrix(null); setQuantite(1); setCommentaire(""); setStatut("En attente");
      return;
    }
    const fetchOne = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/geop/showdemandepiece/${id_demande_piece}`);
        if (!res.ok) throw new Error("Erreur récupération");
        const d = await res.json();
        const record = Array.isArray(d) ? d[0] : d;
        setClient(record.client ?? "");
        setNumeroBon(record.num_bon ?? "");
        setCategorie(record.categorie ?? "");
        setType(record.type ?? "");
        setPrix(record.prix ?? null);
        setQuantite(record.quantite ?? 1);
        setCommentaire(record.commentaire ?? "");
        setStatut(record.statut ?? "En attente");
      } catch (err) {
        console.error("Erreur fetch demande:", err);
        toast.error("Erreur chargement demande", { position: "bottom-right", transition: Bounce });
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [show, id_demande_piece]);

  useEffect(() => {
    setTypeOptions(categorie && categoriesTypes[categorie] ? categoriesTypes[categorie] : []);
  }, [categorie]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload: any = {
        id_demande_piece: id_demande_piece ?? undefined,
        client,
        num_bon: numeroBon,
        categorie,
        type,
        prix,
        quantite,
        commentaire,
        statut,
        id_user: geopuserID ? Number(geopuserID) : null
      };

      const url = `${backendUrl}/api/geop/${id_demande_piece ? "updatedemandepiece" : "createdemandepiece"}`;
      const method = id_demande_piece ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erreur" }));
        throw new Error(err.error || "Erreur sauvegarde");
      }

      toast.success(id_demande_piece ? "Demande mise à jour" : "Demande créée", { position: "bottom-right", transition: Bounce });
      onSuccess?.();
      onHide();
    } catch (err) {
      console.error("Erreur save:", err);
      toast.error("Erreur lors de l'enregistrement", { position: "bottom-right", transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{id_demande_piece ? "Modifier la demande" : "Nouvelle demande (Bon de livraison)"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Client</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiUser />
                </InputGroup.Text>
                <Form.Control type="text" value={client} onChange={e => setClient(e.target.value)} />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Label>Numéro de bon</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiHash />
                </InputGroup.Text>
                <Form.Control type="text" value={numeroBon} onChange={e => setNumeroBon(e.target.value)} />
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Catégorie</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <i className="bi bi-diagram-3"></i>
                </InputGroup.Text>
                <Form.Control as="input" list="categorieOptions" value={categorie} onChange={e => setCategorie(e.target.value)} placeholder="Choisir ou taper une catégorie" />
                <datalist id="categorieOptions">{categorieOptions.map((c, i) => <option key={i} value={c} />)}</datalist>
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Label>Type</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiLayers />
                </InputGroup.Text>
                <Form.Control as="input" list="typeOptions" value={type} onChange={e => setType(e.target.value)} placeholder="Choisir ou taper" />
                <datalist id="typeOptions">{typeOptions.map((t, i) => <option key={i} value={t} />)}</datalist>
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Quantité</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiPackage />
                </InputGroup.Text>
                <Form.Control type="number" value={quantite ?? ""} onChange={e => setQuantite(Number(e.target.value) || 0)} />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Label>Prix</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiDollarSign />
                </InputGroup.Text>
                <Form.Control type="number" value={prix ?? ""} onChange={e => setPrix(Number(e.target.value) || 0)} />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Label>Statut</Form.Label>
              <Form.Select value={statut} onChange={e => setStatut(e.target.value)}>
                <option>En attente</option>
                <option>approuvé</option>
                <option>refusé</option>
              </Form.Select>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Label>Commentaire</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiMessageCircle />
                </InputGroup.Text>
                <Form.Control as="textarea" rows={3} value={commentaire} onChange={e => setCommentaire(e.target.value)} />
              </InputGroup>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Annuler</Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>{loading ? "Enregistrement..." : "Sauvegarder"}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDemandePiece;
