import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { toast, Bounce } from "react-toastify";
import { FiHash, FiUser, FiCalendar, FiCheck, FiPlus, FiDollarSign } from "react-icons/fi";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

type BonReceptionItem = { numBon: string; id_warehouse?: number };
type RefItem = { reference: string };
type RefInfo = { quantite_piece?: number; cout_achat_piece?: number };

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const AddAvoir: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const [dateMaj, setDateMaj] = useState("");
  const [numBon, setNumBon] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [reference, setReference] = useState("");

  const [prix, setPrix] = useState<number | "">("");
  const [operation, setOperation] = useState<"Addition" | "Soustraction">("Addition");
  const [quantite, setQuantite] = useState<number | "">("");

  const [bons, setBons] = useState<BonReceptionItem[]>([]);
  const [refs, setRefs] = useState<RefItem[]>([]);
  const [loading, setLoading] = useState(false);

  const isOpenRef = useRef(false);

  const canSave = useMemo(() => {
    return (
      !!dateMaj &&
      !!numBon &&
      !!reference &&
      !!operation &&
      quantite !== "" &&
      Number(quantite) > 0 &&
      prix !== "" &&
      Number(prix) >= 0
    );
  }, [dateMaj, numBon, reference, operation, quantite, prix]);

  const resetForm = () => {
    setDateMaj("");
    setNumBon("");
    setWarehouseName("");
    setReference("");
    setPrix("");
    setOperation("Addition");
    setQuantite("");
    setRefs([]);
  };

  useEffect(() => {
    isOpenRef.current = show;
    if (!show) return;

    resetForm();

    const controller = new AbortController();

    fetch(`${backendUrl}/api/geop/bonreception/list-all`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (!isOpenRef.current) return;
        setBons(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        toast.error("Erreur chargement bons", { transition: Bounce });
      });

    return () => controller.abort();
  }, [show]);

  useEffect(() => {
    if (!show) return;

    if (!numBon) {
      setRefs([]);
      setReference("");
      setWarehouseName("");
      return;
    }

    const controller = new AbortController();

    fetch(`${backendUrl}/api/geop/avoir/${encodeURIComponent(numBon)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (!isOpenRef.current) return;
        setRefs(Array.isArray(data) ? data : []);
        setReference("");
        setPrix("");
        setQuantite("");
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        toast.error("Erreur chargement références du bon", { transition: Bounce });
      });

    fetch(`${backendUrl}/api/geop/bonreception/show/${encodeURIComponent(numBon)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (!isOpenRef.current) return;
        setWarehouseName(d?.nomWarehouse || "");
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setWarehouseName("");
      });

    return () => controller.abort();
  }, [numBon, show]);

  useEffect(() => {
    if (!show) return;
    if (!reference) return;

    fetch(`${backendUrl}/api/geop/avoir/ref/${encodeURIComponent(reference)}`)
      .then((r) => r.json())
      .then((info: RefInfo) => {
        if (info?.cout_achat_piece != null) setPrix(Number(info.cout_achat_piece));
      })
      .catch(() => {});
  }, [reference, show]);

  const handleSave = async () => {
    if (!canSave) {
      toast.error("Veuillez remplir tous les champs", { transition: Bounce });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${backendUrl}/api/geop/avoir/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numBon,
          dateRetour: dateMaj,
          reference_piece: reference,
          quantiteMaj: Number(quantite),
          operation,
          cout_article: Number(prix),
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Avoir enregistré", { transition: Bounce });
      onSuccess();
      onHide();
      resetForm();
    } catch {
      toast.error("Erreur enregistrement avoir", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nouveau bon d&apos;avoir / complémentaire</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Date de Màj</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiCalendar />
                </InputGroup.Text>
                <Form.Control type="date" value={dateMaj} onChange={(e) => setDateMaj(e.target.value)} />
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>N° Bon</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiHash />
                </InputGroup.Text>
                <Form.Select value={numBon} onChange={(e) => setNumBon(e.target.value)}>
                  <option value="">N° Bon</option>
                  {bons.map((b, i) => (
                    <option key={i} value={b.numBon}>
                      {b.numBon}
                    </option>
                  ))}
                </Form.Select>
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
                <Form.Control value={warehouseName} disabled placeholder="Auto" />
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Référence pièce</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiHash />
                </InputGroup.Text>
                <Form.Select value={reference} onChange={(e) => setReference(e.target.value)} disabled={!numBon}>
                  <option value="">Référence</option>
                  {refs.map((r, i) => (
                    <option key={i} value={r.reference}>
                      {r.reference}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
              {!numBon && (
                <div className="text-muted mt-1" style={{ fontSize: 12 }}>
                  Choisissez d&apos;abord un N° Bon.
                </div>
              )}
            </Col>
          </Row>

          <hr />

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Coût Màj</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiDollarSign />
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Prix"
                />
              </InputGroup>
            </Col>

            <Col md={6}>
              <Form.Label>Opération</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiPlus />
                </InputGroup.Text>
                <Form.Select value={operation} onChange={(e) => setOperation(e.target.value as any)}>
                  <option value="Addition">Addition</option>
                  <option value="Soustraction">Soustraction</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Label>Quantité Màj</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ color: "#f97316" }}>
                  <FiCheck />
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Quantité"
                />
              </InputGroup>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!canSave || loading}>
          <FiCheck /> {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAvoir;
