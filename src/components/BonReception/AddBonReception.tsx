// src/components/BonReception/AddBonReception.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Row, Col, InputGroup, Table } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import {FiHash,FiUser,FiCalendar,FiPlus,FiCheck,FiTruck,FiMapPin,FiPackage,FiDollarSign,FiSearch,FiLayers,} from "react-icons/fi";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

type Warehouse = { id_warehouse: number; nomWarehouse: string };
type Fournisseur = { nom_fournisseur: string };

type BonLine = {
  emplacement: string;
  categorie: string;
  type: string;
  reference: string;
  numSerie?: string;
  quantite: number;
  prixUnit: number;
};

interface Props {
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

const AddBonReception: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [numBon, setNumBon] = useState("");
  const [warehouseId, setWarehouseId] = useState<number | "">("");
  const [warehouseName, setWarehouseName] = useState(""); 
  const [fournisseur, setFournisseur] = useState("");
  const [etabliePar, setEtabliePar] = useState("");
  const [dateReception, setDateReception] = useState("");

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);

  const [categorie, setCategorie] = useState("");
  const [type, setType] = useState("");

  const [reference, setReference] = useState("");
  const [scanTerm, setScanTerm] = useState("");

  const [numSerie, setNumSerie] = useState("");
  const [quantite, setQuantite] = useState<number | "">(1);
  const [prixUnit, setPrixUnit] = useState<number | "">("");
  const [rayA, setRayA] = useState("");
  const [rayB, setRayB] = useState("");
  const [rayC, setRayC] = useState("");

  const emplacement = useMemo(() => `${rayA}${rayB}${rayC}`.trim(), [rayA, rayB, rayC]);

  const [lines, setLines] = useState<BonLine[]>([]);
  const [loading, setLoading] = useState(false);

  const montantBon = useMemo(() => lines.reduce((sum, l) => sum + l.quantite * l.prixUnit, 0), [lines]);

  const categoryOptions = useMemo(() => Object.keys(categoriesTypes), []);
  const typeOptions = useMemo(() => (categorie ? categoriesTypes[categorie] || [] : []), [categorie]);

 
  useEffect(() => {
    if (!show) return;

  
    setNumBon("");
    setWarehouseId("");
    setWarehouseName("");
    setFournisseur("");
    setEtabliePar("");
    setDateReception("");
    setLines([]);
    setCategorie("");
    setType("");
    setReference("");
    setScanTerm("");
    setNumSerie("");
    setQuantite(1);
    setPrixUnit("");
    setRayA("");
    setRayB("");
    setRayC("");

    fetch(`${backendUrl}/api/geop/warehouse/list`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setWarehouses(Array.isArray(data) ? data : data?.warehouses || []))
      .catch(() => setWarehouses([]));

    
    fetch(`${backendUrl}/api/geop/fournisseurs/list`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setFournisseurs(Array.isArray(data) ? data : data?.fournisseurs || []))
      .catch(() => setFournisseurs([]));
  }, [show]);


  useEffect(() => {
    if (!categorie) {
      if (type) setType("");
      return;
    }
    const allowed = categoriesTypes[categorie] || [];
    if (type && !allowed.includes(type)) {
      setType("");
    }
  }, [categorie]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!show) return;
    if (!scanTerm) return;

    const controller = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/geop/bonreception/scan/${encodeURIComponent(scanTerm)}`,
          { signal: controller.signal }
        );
        if (!res.ok) return;

        const data = await res.json();
        if (data?.categorie) setCategorie(data.categorie);
        if (data?.type) setType(data.type);
        if (data?.prixUnit != null) setPrixUnit(Number(data.prixUnit));
      } catch (e: any) {
        if (e?.name === "AbortError") return;
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(t);
    };
  }, [scanTerm, show]);

  const addLine = () => {
    const qte = Number(quantite);
    const pu = prixUnit === "" ? NaN : Number(prixUnit);

    if (!categorie || !type || !reference || !emplacement) {
      toast.error("Veuillez remplir Catégorie, Type, Référence, Emplacement, Quantité, Prix", { transition: Bounce });
      return;
    }

    if (!Number.isFinite(qte) || qte <= 0) {
      toast.error("Quantité invalide", { transition: Bounce });
      return;
    }
    if (!Number.isFinite(pu) || pu < 0) {
      toast.error("Prix unitaire invalide", { transition: Bounce });
      return;
    }

    setLines((prev) => [
      ...prev,
      {
        emplacement,
        categorie,
        type,
        reference,
        numSerie: numSerie || "",
        quantite: qte,
        prixUnit: pu,
      },
    ]);

    setCategorie("");
    setType("");
    setReference("");
    setScanTerm("");
    setNumSerie("");
    setQuantite(1);
    setPrixUnit("");
    setRayA("");
    setRayB("");
    setRayC("");
  };

  const removeLine = (index: number) => setLines((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!numBon || !dateReception || lines.length === 0) {
      toast.error("Bon incomplet", { transition: Bounce });
      return;
    }

    if (warehouses.length > 0 && !warehouseId) {
      toast.error("Veuillez sélectionner un warehouse", { transition: Bounce });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        numBon,
        id_warehouse: warehouses.length > 0 ? warehouseId || null : null,
        fournisseur: fournisseur || "",
        etabliePar: etabliePar || "",
        dateReception,
        montantBon,
        nbreArticle: lines.length,
        lines,
      };

      const res = await fetch(`${backendUrl}/api/geop/bonreception/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success("Bon de réception créé", { transition: Bounce });
      setLines([]);
      onSuccess();
      onHide();
    } catch {
      toast.error("Erreur création bon", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
 
    setNumBon("");
    setWarehouseId("");
    setWarehouseName("");
    setFournisseur("");
    setEtabliePar("");
    setDateReception("");

    
    setLines([]);
    setCategorie("");
    setType("");
    setReference("");
    setScanTerm("");
    setNumSerie("");
    setQuantite(1);
    setPrixUnit("");
    setRayA("");
    setRayB("");
    setRayC("");
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Nouveau bon de réception</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>N° Bon</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiHash />
                </InputGroup.Text>
                <Form.Control value={numBon} onChange={(e) => setNumBon(e.target.value)} />
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Date de réception</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiCalendar />
                </InputGroup.Text>
                <Form.Control type="date" value={dateReception} onChange={(e) => setDateReception(e.target.value)} />
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Warehouse</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiUser />
                </InputGroup.Text>

                {warehouses.length > 0 ? (
                  <Form.Select value={warehouseId} onChange={(e) => setWarehouseId(Number(e.target.value) || "")}>
                    <option value="">Warehouse</option>
                    {warehouses.map((w) => (
                      <option key={w.id_warehouse} value={w.id_warehouse}>
                        {w.nomWarehouse}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    placeholder="Nom warehouse (temporaire)"
                    value={warehouseName}
                    onChange={(e) => setWarehouseName(e.target.value)}
                  />
                )}
              </InputGroup>

              {warehouses.length === 0 && (
                <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                  Référentiel warehouse non disponible → le bon sera enregistré sur le warehouse TEMPORAIRE côté serveur.
                </div>
              )}
            </Col>

            <Col md={6}>
              <Form.Label>Fournisseur</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiTruck />
                </InputGroup.Text>

                {fournisseurs.length > 0 ? (
                  <Form.Select value={fournisseur} onChange={(e) => setFournisseur(e.target.value)}>
                    <option value="">Fournisseur</option>
                    {fournisseurs.map((f, i) => (
                      <option key={i} value={f.nom_fournisseur}>
                        {f.nom_fournisseur}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control placeholder="Fournisseur (saisie libre)" value={fournisseur} onChange={(e) => setFournisseur(e.target.value)} />
                )}
              </InputGroup>

              {fournisseurs.length === 0 && (
                <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                  Référentiel fournisseur non disponible → saisie libre.
                </div>
              )}
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Label>Établi par</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiUser />
                </InputGroup.Text>
                <Form.Control value={etabliePar} onChange={(e) => setEtabliePar(e.target.value)} />
              </InputGroup>
            </Col>

            <Col md={6} className="d-flex align-items-end justify-content-end">
              <div className="text-end">
                <div>
                  <b>Montant bon :</b> {montantBon.toFixed(2)}
                </div>
                <div>
                  <b>Nb articles :</b> {lines.length}
                </div>
              </div>
            </Col>
          </Row>

          <hr />

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Recherche par référence (scan)</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiSearch />
                </InputGroup.Text>
                <Form.Control
                  value={reference}
                  onChange={(e) => {
                    const v = e.target.value;
                    setReference(v);
                    setScanTerm(v.trim());
                  }}
                  placeholder="Référence..."
                />
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Emplacement (A-B-C)</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiMapPin />
                </InputGroup.Text>
                <Form.Control style={{ maxWidth: 70 }} value={rayA} onChange={(e) => setRayA(e.target.value.toUpperCase().slice(0, 1))} />
                <Form.Control style={{ maxWidth: 70 }} value={rayB} onChange={(e) => setRayB(e.target.value.slice(0, 1))} />
                <Form.Control style={{ maxWidth: 70 }} value={rayC} onChange={(e) => setRayC(e.target.value.slice(0, 1))} />
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
                <Form.Select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                  <option value="">-- Sélectionner catégorie --</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Type</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiLayers />
                </InputGroup.Text>
                <Form.Select value={type} onChange={(e) => setType(e.target.value)} disabled={!categorie}>
                  <option value="">-- Sélectionner type --</option>
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>N° Série (si pneu)</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiHash />
                </InputGroup.Text>
                <Form.Control value={numSerie} onChange={(e) => setNumSerie(e.target.value)} />
              </InputGroup>
            </Col>

            <Col md={4}>
              <Form.Label>Quantité</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiPackage />
                </InputGroup.Text>
                <Form.Control type="number" value={quantite} onChange={(e) => setQuantite(e.target.value ? Number(e.target.value) : "")} />
              </InputGroup>
            </Col>

            <Col md={4}>
              <Form.Label>Prix unitaire</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiDollarSign />
                </InputGroup.Text>
                <Form.Control type="number" value={prixUnit} onChange={(e) => setPrixUnit(e.target.value ? Number(e.target.value) : "")} />
              </InputGroup>
            </Col>
          </Row>

          <Button variant="outline-primary" onClick={addLine}>
            <FiPlus /> Ajouter
          </Button>

          {lines.length > 0 && (
            <>
              <hr />
              <Table bordered size="sm" responsive>
                <thead style={{ background: "#f97316", color: "#fff" }}>
                  <tr>
                    <th>Emplacement</th>
                    <th>Catégorie</th>
                    <th>Référence</th>
                    <th>Type</th>
                    <th>N° Série</th>
                    <th className="text-center">Qté</th>
                    <th className="text-center">Prix total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={i}>
                      <td>{l.emplacement}</td>
                      <td>{l.categorie}</td>
                      <td>{l.reference}</td>
                      <td>{l.type}</td>
                      <td>{l.numSerie}</td>
                      <td className="text-center">{l.quantite}</td>
                      <td className="text-center">{(l.quantite * l.prixUnit).toFixed(2)}</td>
                      <td className="text-center">
                        <Button size="sm" variant="outline-danger" onClick={() => removeLine(i)}>
                          ✕
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleReset}>
          Réinitialiser
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading || lines.length === 0}>
          <FiCheck /> {loading ? "Validation..." : "Enregistrer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBonReception;
