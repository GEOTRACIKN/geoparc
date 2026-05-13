import React, { useEffect, useState } from "react";
import { Button, Col, Form, Offcanvas, Row } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";
import { useTranslate } from "../../hooks/LanguageProvider";
import {
  Responsible,
  ResponsiblePayload,
} from "../../types/requestResponsibility.types";
import {
  createResponsibleApi,
  updateResponsibleApi,
} from "../../services/requestResponsibility.service";

interface Props {
  show: boolean;
  responsible: Responsible | null;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm: ResponsiblePayload = {
  mat: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  is_active: 1,
};

export default function ResponsibleDetailsDrawer({
  show,
  responsible,
  onClose,
  onSaved,
}: Props) {
  const { translate } = useTranslate();

  const [form, setForm] = useState<ResponsiblePayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(responsible?.id_responsable);

  useEffect(() => {
    if (responsible) {
      setForm({
        id_responsable: responsible.id_responsable,
        mat: responsible.mat || "",
        first_name: responsible.first_name || "",
        last_name: responsible.last_name || "",
        email: responsible.email || "",
        phone: responsible.phone || "",
        is_active: responsible.is_active ?? 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [responsible, show]);

  const handleChange = (
    name: keyof ResponsiblePayload,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload: ResponsiblePayload = {
        id_responsable: form.id_responsable,
        mat: form.mat || null,
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        email: form.email || null,
        phone: form.phone || null,
        is_active: 1,
      };

      if (isEditMode) {
        await updateResponsibleApi(payload);
        toast.success("Responsible updated successfully", {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      } else {
        await createResponsibleApi(payload);
        toast.success("Responsible created successfully", {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
      }

      onSaved();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Save failed", {
        position: "bottom-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" className="w-50">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {isEditMode
            ? translate("Responsible details")
            : translate("Add responsible")}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{translate("Code")}</Form.Label>
                <Form.Control
                  value={form.mat || ""}
                  onChange={(e) => handleChange("mat", e.target.value)}
                  placeholder="Code"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{translate("Phone")}</Form.Label>
                <Form.Control
                  value={form.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Phone"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{translate("First name")}</Form.Label>
                <Form.Control
                  value={form.first_name || ""}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder="First name"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{translate("Last name")}</Form.Label>
                <Form.Control
                  value={form.last_name || ""}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder="Last name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>{translate("Email")}</Form.Label>
            <Form.Control
              type="email"
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Email"
            />
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" className="mr-2" onClick={onClose}>
              {translate("Cancel")}
            </Button>

            <Button variant="success" disabled={saving} onClick={handleSave}>
              {saving ? translate("Saving...") : translate("Save")}
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
}