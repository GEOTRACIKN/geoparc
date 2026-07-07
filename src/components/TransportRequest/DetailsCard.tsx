import React from "react";
import { Card, Form } from "react-bootstrap";
import Select, { SingleValue } from "react-select";
import { useTheme } from "../../hooks/ThemeContext";
import { TransportRequestResponsibleOption } from "../../types/transportRequest.types";

type Props = {
  translate: (key: string) => string;
  objectRequest: string;
  requesterPhone: string;
  selectedResponsibleId: number | null;
  responsibles: TransportRequestResponsibleOption[];
  isLoadingResponsibles: boolean;
  onTextChange: (
    name: "object_request" | "requester_phone" | "requester_email",
    value: string
  ) => void;
  onResponsibleChange: (id_responsable: number | null) => void;
};

type SelectOption = {
  label: string;
  value: number;
};

export default function TransportRequestDetailsCard({
  translate,
  objectRequest,
  requesterPhone,
  selectedResponsibleId,
  responsibles,
  isLoadingResponsibles,
  onTextChange,
  onResponsibleChange,
}: Props) {
  const { isDarkMode } = useTheme();

  const getResponsibleLabel = (responsible: TransportRequestResponsibleOption) => {
    const fullName = [responsible.first_name, responsible.last_name]
      .filter(Boolean)
      .join(" ");
    const name = fullName || responsible.mat_responsable || responsible.email_responsable;
    const email = responsible.email_responsable ? ` - ${responsible.email_responsable}` : "";

    return `${name || translate("Responsible")}${email}`;
  };

  const responsibleOptions: SelectOption[] = responsibles.map((responsible) => ({
    label: getResponsibleLabel(responsible),
    value: responsible.id_responsable,
  }));

  const selectedResponsible =
    responsibleOptions.find((option) => option.value === selectedResponsibleId) ||
    null;

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: 52,
      backgroundColor: isDarkMode ? "#34393b" : "#ffffff",
      borderColor: state.isFocused ? "#ff8a00" : isDarkMode ? "#5b6470" : "#d7dee8",
      boxShadow: "none",
      color: isDarkMode ? "#f8fafc" : "#1f2937",
    }),
    input: (base: any) => ({
      ...base,
      color: isDarkMode ? "#f8fafc" : "#1f2937",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDarkMode ? "#f8fafc" : "#1f2937",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: isDarkMode ? "#9aa4b2" : "#6b7280",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDarkMode ? "#2b3033" : "#ffffff",
      color: isDarkMode ? "#f8fafc" : "#1f2937",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused
        ? isDarkMode
          ? "#3f474d"
          : "#fff4e8"
        : isDarkMode
          ? "#2b3033"
          : "#ffffff",
      color: isDarkMode ? "#f8fafc" : "#1f2937",
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <Card className="mobile-request-card">
      <Card.Body>
        <div className="section-title">
          <span className="section-icon">
            <i className="fas fa-clipboard"></i>
          </span>
          {translate("Details")}
        </div>

        <Form.Group className="form-group">
          <Form.Label>{translate("Object")} *</Form.Label>
          <Form.Control
            type="text"
            placeholder={translate("Enter request object")}
            value={objectRequest}
            onChange={(e) => onTextChange("object_request", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>{translate("Requester")}</Form.Label>
          <Select<SelectOption, false>
            inputId="requester-select"
            isClearable
            isDisabled={isLoadingResponsibles}
            isLoading={isLoadingResponsibles}
            isSearchable
            menuPortalTarget={document.body}
            noOptionsMessage={() => translate("No responsible found")}
            options={responsibleOptions}
            placeholder={translate("Choose requester")}
            value={selectedResponsible}
            onChange={(option: SingleValue<SelectOption>) =>
              onResponsibleChange(option?.value || null)
            }
            styles={selectStyles}
          />
        </Form.Group>

        <Form.Group className="form-group mb-0">
          <Form.Label>{translate("Phone Number")} *</Form.Label>
          <Form.Control
            type="text"
            placeholder={translate("Enter phone number")}
            value={requesterPhone}
            onChange={(e) => onTextChange("requester_phone", e.target.value)}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
}
