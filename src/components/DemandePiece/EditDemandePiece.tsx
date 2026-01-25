import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Table, Row, Col, InputGroup } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import { FiUser, FiCheckCircle, FiLayers, FiDollarSign, FiPackage } from "react-icons/fi";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const categoriesTypes: Record<string, string[]> = {
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

type Bon = {
  num_bon: string;
  client: string;
  statut: string;
  commentaire?: string | null;
};

type Ligne = {
  categorie: string;
  type_piece: string;
  reference: string;
  serie: string | null;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
  commentaire?: string | null;
};

interface Props {
  show: boolean;
  onHide: () => void;
  num_bon: string | null;
  onSuccess?: () => void;
}

const ModalEditDemandePiece: React.FC<Props> = ({ show, onHide, num_bon, onSuccess }) => {
  const [bon, setBon] = useState<Bon | null>(null);
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show || !num_bon) return;

    const username = (localStorage.getItem("Geopusername") || "").trim();
    if (!username) {
      toast.error("Utilisateur non détecté (username)", { transition: Bounce });
      setBon(null);
      setLignes([]);
      return;
    }

    const params = new URLSearchParams();
    params.append("username", username);

    fetch(`${backendUrl}/api/geop/demandepiece/show/${num_bon}?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setBon(data?.bon || null);
        setLignes(
          Array.isArray(data?.lignes)
            ? data.lignes.map((l: any) => ({
                categorie: String(l?.categorie || ""),
                type_piece: String(l?.type_piece || ""),
                reference: String(l?.reference || ""),
                serie: l?.serie ?? null,
                quantite: Number(l?.quantite ?? 1),
                // compat : anciens bons peuvent avoir prix_unitaire NULL
                prix_unitaire: Number(l?.prix_unitaire ?? 0),
                prix_total: Number(l?.prix_total ?? 0),
                commentaire: l?.commentaire ?? null,
              }))
            : []
        );
      })
      .catch(() => toast.error("Erreur chargement", { transition: Bounce }));
  }, [show, num_bon]);

  const updateLine = (index: number, patch: Partial<Ligne>) => {
    setLignes((prev) =>
      prev.map((l, i) => {
        if (i !== index) return l;
        const next = { ...l, ...patch };

        // ✅ recalcul auto du total
        const q = Number(next.quantite ?? 0);
        const pu = Number(next.prix_unitaire ?? 0);
        next.prix_total = (Number.isFinite(q) ? q : 0) * (Number.isFinite(pu) ? pu : 0);

        return next;
      })
    );
  };

  const handleCategorieChange = (index: number, newCategorie: string) => {
    const allowed = categoriesTypes[newCategorie] || [];
    setLignes((prev) =>
      prev.map((l, i) => {
        if (i !== index) return l;
        const nextType =
          l.type_piece && allowed.length > 0 && !allowed.includes(l.type_piece) ? "" : l.type_piece;
        return { ...l, categorie: newCategorie, type_piece: nextType };
      })
    );
  };

  const addLine = () => {
    setLignes((prev) => [
      ...prev,
      {
        categorie: "",
        type_piece: "",
        reference: "",
        serie: null,
        quantite: 1,
        prix_unitaire: 0,
        prix_total: 0,
        commentaire: null,
      },
    ]);
  };

  const removeLine = (index: number) => {
    setLignes((prev) => prev.filter((_, i) => i !== index));
  };

  const totalBon = useMemo(
    () => lignes.reduce((sum, l) => sum + Number(l.prix_total || 0), 0),
    [lignes]
  );

  const handleSave = async () => {
    if (!bon || !num_bon) return;

    const username = (localStorage.getItem("Geopusername") || "").trim();
    if (!username) {
      toast.error("Utilisateur non détecté (username)", { transition: Bounce });
      return;
    }

    // validation simple (comme ton fichier d'origine)
    if (!bon.client?.trim()) {
      toast.error("Client obligatoire", { transition: Bounce });
      return;
    }
    if (!Array.isArray(lignes) || lignes.length === 0) {
      toast.error("Aucune ligne", { transition: Bounce });
      return;
    }

    // validation lignes minimale
    for (let i = 0; i < lignes.length; i++) {
      const l = lignes[i];
      if (!l.reference?.trim()) {
        toast.error(`Ligne ${i + 1}: référence obligatoire`, { transition: Bounce });
        return;
      }
      if (!Number.isFinite(Number(l.quantite)) || Number(l.quantite) <= 0) {
        toast.error(`Ligne ${i + 1}: quantité invalide`, { transition: Bounce });
        return;
      }
      if (!Number.isFinite(Number(l.prix_unitaire)) || Number(l.prix_unitaire) < 0) {
        toast.error(`Ligne ${i + 1}: prix unitaire invalide`, { transition: Bounce });
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/geop/demandepiece/update/${num_bon}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          client: bon.client,
          commentaire: bon.commentaire ?? null,
          statut: bon.statut,
          lignes,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.message || "Erreur sauvegarde", { transition: Bounce });
        return;
      }

      toast.success("Bon mis à jour", { transition: Bounce });
      onSuccess?.();
      onHide();
    } catch {
      toast.error("Erreur sauvegarde", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  if (!bon) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Modifier le bon {bon.num_bon}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Label>Client</Form.Label>
            <InputGroup>
              <InputGroup.Text style={{ color: "#f97316" }}>
                <FiUser />
              </InputGroup.Text>
              <Form.Control value={bon.client} onChange={(e) => setBon({ ...bon, client: e.target.value })} />
            </InputGroup>
          </Col>

          <Col md={6}>
            <Form.Label>Statut</Form.Label>
            <InputGroup>
              <InputGroup.Text style={{ color: "#f97316" }}>
                <FiCheckCircle />
              </InputGroup.Text>
              <Form.Select value={bon.statut} onChange={(e) => setBon({ ...bon, statut: e.target.value })}>
                <option value="En attente">En attente</option>
                <option value="Validé">Validé</option>
                <option value="Refusé">Refusé</option>
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>

        <h5 className="mb-3">Lignes</h5>

        <Table bordered hover responsive>
          <thead style={{ background: "#f97316", color: "#fff" }}>
            <tr>
              <th>Catégorie</th>
              <th>Type</th>
              <th>Référence</th>
              <th className="text-center">Quantité</th>
              <th className="text-center">Prix U</th>
              <th className="text-center">Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {lignes.map((p, i) => (
              <tr key={i}>
                <td>
                  <Form.Control
                    list={`catOptions-${i}`}
                    value={p.categorie}
                    onChange={(e) => handleCategorieChange(i, e.target.value)}
                  />
                  <datalist id={`catOptions-${i}`}>
                    {Object.keys(categoriesTypes).map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </td>

                <td>
                  <InputGroup>
                    <InputGroup.Text style={{ color: "#f97316" }}>
                      <FiLayers />
                    </InputGroup.Text>
                    <Form.Control
                      list={`typeOptions-${i}`}
                      value={p.type_piece}
                      onChange={(e) => updateLine(i, { type_piece: e.target.value })}
                      disabled={!p.categorie}
                    />
                    <datalist id={`typeOptions-${i}`}>
                      {(categoriesTypes[p.categorie] || []).map((t) => (
                        <option key={t} value={t} />
                      ))}
                    </datalist>
                  </InputGroup>
                </td>

                <td>
                  <Form.Control
                    value={p.reference}
                    onChange={(e) => updateLine(i, { reference: e.target.value })}
                  />
                </td>

                <td>
                  <InputGroup>
                    <InputGroup.Text style={{ color: "#f97316" }}>
                      <FiPackage />
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={p.quantite}
                      onChange={(e) => updateLine(i, { quantite: Number(e.target.value) })}
                    />
                  </InputGroup>
                </td>

                <td>
                  <InputGroup>
                    <InputGroup.Text style={{ color: "#f97316" }}>
                      <FiDollarSign />
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={p.prix_unitaire}
                      onChange={(e) => updateLine(i, { prix_unitaire: Number(e.target.value) })}
                    />
                  </InputGroup>
                </td>

                <td className="text-center">{Number(p.prix_total || 0).toFixed(2)}</td>

                <td className="text-center">
                  <Button variant="outline-danger" size="sm" onClick={() => removeLine(i)}>
                    ✕
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <Button variant="outline-primary" onClick={addLine}>
            + Ajouter une ligne
          </Button>

          <div>
            <strong>Total du bon : {totalBon.toFixed(2)}</strong>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditDemandePiece;
