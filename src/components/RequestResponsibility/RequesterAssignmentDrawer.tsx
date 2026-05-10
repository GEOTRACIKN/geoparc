import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Offcanvas,
  Row,
  Table,
} from "react-bootstrap";
import { Bounce, toast } from "react-toastify";
import { useTranslate } from "../../hooks/LanguageProvider";
import {
  Responsible,
  Requester,
  RequesterPayload,
} from "../../types/requestResponsibility.types";
import {
  assignRequesterApi,
  createRequesterAndAssignApi,
  getAvailableRequestersApi,
  unassignRequesterApi,
} from "../../services/requestResponsibility.service";

interface Props {
  show: boolean;
  responsible: Responsible | null;
  assignedRequesters: Requester[];
  onClose: () => void;
  onRefresh: () => void;
}

const emptyRequesterForm: RequesterPayload = {
  mat: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address: "",
  position_validation: 1,
};

export default function RequesterAssignmentDrawer({
  show,
  responsible,
  assignedRequesters,
  onClose,
  onRefresh,
}: Props) {
  const { translate } = useTranslate();

  const [availableRequesters, setAvailableRequesters] = useState<Requester[]>([]);
  const [availableSearch, setAvailableSearch] = useState("");
  const [requesterForm, setRequesterForm] =
    useState<RequesterPayload>(emptyRequesterForm);

  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [saving, setSaving] = useState(false);

  const responsibleName = responsible
    ? `${responsible.first_name || ""} ${responsible.last_name || ""}`.trim()
    : "";

  const loadAvailableRequesters = async (search = availableSearch) => {
    if (!responsible?.id_responsable) return;

    try {
      setLoadingAvailable(true);

      const data = await getAvailableRequestersApi({
        id_responsable: responsible.id_responsable,
        search,
        limit: 20,
      });

      setAvailableRequesters(data);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load available requesters", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setLoadingAvailable(false);
    }
  };

  useEffect(() => {
    if (show && responsible?.id_responsable) {
      setAvailableSearch("");
      setRequesterForm(emptyRequesterForm);
      loadAvailableRequesters("");
    }
  }, [show, responsible?.id_responsable]);

  const handleRequesterChange = (
    name: keyof RequesterPayload,
    value: string | number
  ) => {
    setRequesterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssign = async (requester: Requester) => {
    if (!responsible?.id_responsable) return;

    try {
      setSaving(true);

      await assignRequesterApi({
        id_responsable: responsible.id_responsable,
        id_demandeur: requester.id_demandeur,
        position_validation: 1,
      });

      toast.success("Requester assigned successfully", {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });

      onRefresh();
      loadAvailableRequesters();
    } catch (error: any) {
      toast.error(error?.message || "Assignment failed", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAndAssign = async () => {
    if (!responsible?.id_responsable) return;

    try {
      setSaving(true);

      await createRequesterAndAssignApi({
        id_responsable: responsible.id_responsable,
        mat: requesterForm.mat || null,
        first_name: requesterForm.first_name || null,
        last_name: requesterForm.last_name || null,
        email: requesterForm.email || null,
        phone: requesterForm.phone || null,
        address: requesterForm.address || null,
        position_validation: 1,
      });

      toast.success("Requester created and assigned successfully", {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });

      setRequesterForm(emptyRequesterForm);
      onRefresh();
      loadAvailableRequesters();
    } catch (error: any) {
      toast.error(error?.message || "Create requester failed", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUnassign = async (requester: Requester) => {
    if (!responsible?.id_responsable) return;

    try {
      setSaving(true);

      await unassignRequesterApi({
        id_responsable: responsible.id_responsable,
        id_demandeur: requester.id_demandeur,
      });

      toast.success("Requester unassigned successfully", {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });

      onRefresh();
      loadAvailableRequesters();
    } catch (error: any) {
      toast.error(error?.message || "Unassign failed", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" className="w-75">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {translate("Requester assignment")}
          {responsibleName && (
            <span className="text-muted ml-2">— {responsibleName}</span>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Card className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">{translate("Assigned requesters")}</h6>
              <Badge bg="secondary">{assignedRequesters.length}</Badge>
            </div>

            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>{translate("Code")}</th>
                    <th>{translate("Full name")}</th>
                    <th>{translate("Email")}</th>
                    <th>{translate("Phone")}</th>
                    <th>{translate("Address")}</th>
                    <th className="text-right">{translate("Action")}</th>
                  </tr>
                </thead>

                <tbody>
                  {assignedRequesters.length > 0 ? (
                    assignedRequesters.map((requester) => (
                      <tr key={requester.id_demandeur}>
                        <td>{requester.mat || "-"}</td>
                        <td>
                          {requester.first_name || "-"}{" "}
                          {requester.last_name || ""}
                        </td>
                        <td>{requester.email || "-"}</td>
                        <td>{requester.phone || "-"}</td>
                        <td>{requester.address || "-"}</td>
                        <td className="text-right">
                          <Button
                            size="sm"
                            variant="outline-danger"
                            disabled={saving}
                            onClick={() => handleUnassign(requester)}
                          >
                            {translate("Unassign")}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">
                        {translate("No requesters assigned")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-3">
          <Card.Body>
            <h6 className="mb-3">{translate("Assign existing requester")}</h6>

            <Row className="mb-3">
              <Col md={8}>
                <InputGroup>
                  <Form.Control
                    value={availableSearch}
                    onChange={(e) => setAvailableSearch(e.target.value)}
                    placeholder={translate("Search requester")}
                  />
                  <Button
                    variant="primary"
                    className="ml-2"
                    onClick={() => loadAvailableRequesters(availableSearch)}
                  >
                    {translate("Search")}
                  </Button>
                  <Button
                    variant="secondary"
                    className="ml-2"
                    onClick={() => {
                      setAvailableSearch("");
                      loadAvailableRequesters("");
                    }}
                  >
                    {translate("Reset")}
                  </Button>
                </InputGroup>
              </Col>
            </Row>

            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>{translate("Code")}</th>
                    <th>{translate("Full name")}</th>
                    <th>{translate("Email")}</th>
                    <th>{translate("Phone")}</th>
                    <th className="text-right">{translate("Action")}</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingAvailable ? (
                    <tr>
                      <td colSpan={5} className="text-center">
                        {translate("Loading...")}
                      </td>
                    </tr>
                  ) : availableRequesters.length > 0 ? (
                    availableRequesters.map((requester) => (
                      <tr key={requester.id_demandeur}>
                        <td>{requester.mat || "-"}</td>
                        <td>
                          {requester.first_name || "-"}{" "}
                          {requester.last_name || ""}
                        </td>
                        <td>{requester.email || "-"}</td>
                        <td>{requester.phone || "-"}</td>
                        <td className="text-right">
                          <Button
                            size="sm"
                            variant="outline-success"
                            disabled={saving}
                            onClick={() => handleAssign(requester)}
                          >
                            {translate("Assign")}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        {translate("No available requesters")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <h6 className="mb-3">{translate("Add new requester")}</h6>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{translate("Code")}</Form.Label>
                  <Form.Control
                    value={requesterForm.mat || ""}
                    onChange={(e) =>
                      handleRequesterChange("mat", e.target.value)
                    }
                    placeholder="Code"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{translate("First name")}</Form.Label>
                  <Form.Control
                    value={requesterForm.first_name || ""}
                    onChange={(e) =>
                      handleRequesterChange("first_name", e.target.value)
                    }
                    placeholder="First name"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{translate("Last name")}</Form.Label>
                  <Form.Control
                    value={requesterForm.last_name || ""}
                    onChange={(e) =>
                      handleRequesterChange("last_name", e.target.value)
                    }
                    placeholder="Last name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{translate("Email")}</Form.Label>
                  <Form.Control
                    type="email"
                    value={requesterForm.email || ""}
                    onChange={(e) =>
                      handleRequesterChange("email", e.target.value)
                    }
                    placeholder="Email"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{translate("Phone")}</Form.Label>
                  <Form.Control
                    value={requesterForm.phone || ""}
                    onChange={(e) =>
                      handleRequesterChange("phone", e.target.value)
                    }
                    placeholder="Phone"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{translate("Address")}</Form.Label>
                  <Form.Control
                    value={requesterForm.address || ""}
                    onChange={(e) =>
                      handleRequesterChange("address", e.target.value)
                    }
                    placeholder="Address"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button
                variant="success"
                disabled={saving}
                onClick={handleCreateAndAssign}
              >
                {translate("Create and assign")}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Offcanvas.Body>
    </Offcanvas>
  );
}