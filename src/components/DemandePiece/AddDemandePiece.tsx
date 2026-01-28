import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form, Row, Col, InputGroup, Table } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import {FiUser,FiHash,FiLayers,FiPackage,FiDollarSign,FiMessageCircle,FiPlus,FiCheck } from "react-icons/fi";

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
  Accessoires: ["Essuie-glace", "Clignotant", "Rétroviseur intérieur", "Tapis"],
};

type LigneBon = {
  categorie: string;
  type_piece: string;
  reference: string;
  serie: string | null;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
  commentaire?: string | null;
};

const AddDemandePiece: React.FC<AddDemandePieceProps> = ({ show, onHide, onSuccess }) => {
  const [client, setClient] = useState("");
  const [numeroBon, setNumeroBon] = useState("");

  const [categorie, setCategorie] = useState("");
  const [typePiece, setTypePiece] = useState("");
  const [reference, setReference] = useState("");
  const [serie, setSerie] = useState("");

  const [prixUnitaire, setPrixUnitaire] = useState<number | null>(null);
  const [quantite, setQuantite] = useState<number | null>(null);

  const [commentaire, setCommentaire] = useState("");

  const [lignesBon, setLignesBon] = useState<LigneBon[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [categorieOptions, setCategorieOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;

    setClient("");
    setNumeroBon("");

    setCategorie("");
    setTypePiece("");
    setReference("");
    setSerie("");
    setPrixUnitaire(null);
    setQuantite(null);
    setCommentaire("");

    setLignesBon([]);
    setEditIndex(null);
  }, [show]);

  useEffect(() => {
    setCategorieOptions(Object.keys(categoriesTypes));
  }, []);

  useEffect(() => {
    const opts = categorie ? categoriesTypes[categorie] || [] : [];
    setTypeOptions(opts);

    if (typePiece && opts.length > 0 && !opts.includes(typePiece)) {
      setTypePiece("");
    }
  }, [categorie, typePiece]);

  const totalLignePreview = useMemo(() => {
    const q = Number(quantite);
    const pu = Number(prixUnitaire);
    if (!Number.isFinite(q) || q <= 0) return 0;
    if (!Number.isFinite(pu) || pu < 0) return 0;
    return q * pu;
  }, [quantite, prixUnitaire]);

  const totalBon = useMemo(() => {
    return lignesBon.reduce((sum, l) => sum + Number(l.prix_total || 0), 0);
  }, [lignesBon]);

  const resetLineForm = () => {
    setEditIndex(null);
    setCategorie("");
    setTypePiece("");
    setReference("");
    setSerie("");
    setQuantite(null);
    setPrixUnitaire(null);
    setCommentaire("");
  };

  const handleAddOrUpdateLine = () => {
    if (!categorie || !typePiece || !reference.trim()) {
      toast.error("Veuillez remplir Catégorie, Type et Référence", { transition: Bounce });
      return;
    }

    const q = Number(quantite);
    const pu = Number(prixUnitaire);

    if (!Number.isFinite(q) || q <= 0) {
      toast.error("Quantité invalide", { transition: Bounce });
      return;
    }

    if (!Number.isFinite(pu) || pu < 0) {
      toast.error("Prix unitaire invalide", { transition: Bounce });
      return;
    }

    const newLine: LigneBon = {
      categorie,
      type_piece: typePiece,
      reference: reference.trim(),
      serie: serie.trim() ? serie.trim() : null,
      quantite: q,
      prix_unitaire: pu,
      prix_total: q * pu,
      commentaire: commentaire ? commentaire : null,
    };

    setLignesBon((prev) => {
      if (editIndex === null) return [...prev, newLine];
      return prev.map((l, i) => (i === editIndex ? newLine : l));
    });

    resetLineForm();
  };

  const handleSave = async () => {
    if (!client.trim() || !numeroBon.trim() || lignesBon.length === 0) {
      toast.error("Bon incomplet", { transition: Bounce });
      return;
    }

    const username = localStorage.getItem("Geopusername");
    if (!username) {
      toast.error("Utilisateur non détecté", { transition: Bounce });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${backendUrl}/api/geop/demandepiece/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          client: client.trim(),
          num_bon: numeroBon.trim(),
          lignes: lignesBon, // ✅ contient prix_unitaire + prix_total
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data?.message || "Erreur lors de la création du bon", { transition: Bounce });
        return;
      }

      toast.success("Bon de livraison créé avec succès !", { transition: Bounce });
      setLignesBon([]);
      resetLineForm();
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
      <Modal.Header closeButton>
        <Modal.Title>Nouveau bon de livraison</Modal.Title>
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
                <Form.Control value={client} onChange={(e) => setClient(e.target.value)} />
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Numéro de bon</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiHash />
                </InputGroup.Text>
                <Form.Control value={numeroBon} onChange={(e) => setNumeroBon(e.target.value)} />
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
                <Form.Control list="categorieOptions" value={categorie} onChange={(e) => setCategorie(e.target.value)} />
                <datalist id="categorieOptions">
                  {categorieOptions.map((c, i) => (
                    <option key={i} value={c} />
                  ))}
                </datalist>
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Type</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiLayers />
                </InputGroup.Text>
                <Form.Control list="typeOptions" value={typePiece} onChange={(e) => setTypePiece(e.target.value)} />
                <datalist id="typeOptions">
                  {typeOptions.map((t, i) => (
                    <option key={i} value={t} />
                  ))}
                </datalist>
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Référence</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <i className="bi bi-upc-scan"></i>
                </InputGroup.Text>
                <Form.Control value={reference} onChange={(e) => setReference(e.target.value)} />
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>N° Série (optionnel)</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <i className="bi bi-hash"></i>
                </InputGroup.Text>
                <Form.Control value={serie} onChange={(e) => setSerie(e.target.value)} />
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Prix unitaire</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiDollarSign />
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  value={prixUnitaire ?? ""}
                  onChange={(e) => setPrixUnitaire(e.target.value ? Number(e.target.value) : null)}
                />
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Quantité</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiPackage />
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  value={quantite ?? ""}
                  onChange={(e) => setQuantite(e.target.value ? Number(e.target.value) : null)}
                />
              </InputGroup>
            </Col>
          </Row>

          <div className="text-end mb-3" style={{ fontSize: 13 }}>
            <b>Total ligne (auto) :</b> {Number(totalLignePreview || 0).toFixed(2)}
          </div>

          <Row className="mb-3">
            <Col>
              <Form.Label>Commentaire</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiMessageCircle />
                </InputGroup.Text>
                <Form.Control as="textarea" rows={2} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} />
              </InputGroup>
            </Col>
          </Row>

          <Button variant="outline-primary" onClick={handleAddOrUpdateLine}>
            <FiPlus /> {editIndex === null ? "Ajouter la pièce" : "Mettre à jour la pièce"}
          </Button>

          {lignesBon.length > 0 && (
            <>
              <hr />
              <Table bordered size="sm">
                <thead style={{ background: "#f97316", color: "#fff" }}>
                  <tr>
                    <th>Catégorie</th>
                    <th>Type</th>
                    <th className="text-center">Référence</th>
                    <th className="text-center">Qté</th>
                    <th className="text-center">Prix U</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lignesBon.map((l, i) => (
                    <tr key={i}>
                      <td>{l.categorie}</td>
                      <td>{l.type_piece}</td>
                      <td className="text-center">{l.reference}</td>
                      <td className="text-center">{l.quantite}</td>
                      <td className="text-center">{Number(l.prix_unitaire || 0).toFixed(2)}</td>
                      <td className="text-center">{Number(l.prix_total || 0).toFixed(2)}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() => {
                              setCategorie(l.categorie);
                              setTypePiece(l.type_piece);
                              setReference(l.reference || "");
                              setSerie(l.serie || "");
                              setQuantite(Number(l.quantite));
                              setPrixUnitaire(Number(l.prix_unitaire));
                              setCommentaire(l.commentaire || "");
                              setEditIndex(i);
                            }}
                          >
                            Modifier
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => {
                              setLignesBon((prev) => prev.filter((_, idx) => idx !== i));
                              setEditIndex((cur) => {
                                if (cur === null) return null;
                                if (cur === i) return null;
                                return i < cur ? cur - 1 : cur;
                              });
                            }}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-end mt-2">
                <strong>Total du bon : {totalBon.toFixed(2)}</strong>
              </div>
            </>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading || lignesBon.length === 0}>
          <FiCheck /> {loading ? "Validation..." : "Valider le bon"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDemandePiece;
